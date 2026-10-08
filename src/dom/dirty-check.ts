// SPDX-License-Identifier: GPL-3.0-only
import type { VisibilityState } from "./types";
import { postAtt, postAttTab, postAttCPID } from "./attributes";

/** Tokens distinguish content changes that arrive while a scan is in progress. */
interface DirtyEntry {
  dirtyToken: number;
  lastProcessedToken: number;
}
let dirtyTokens = new WeakMap<Node, DirtyEntry>();
let postSignatures = new WeakMap<Element, string>();
let observers = new WeakMap<Node, MutationObserver>();
const activeObservers = new Map<Node, MutationObserver>();

/**
 * Treat missing or invalid historical size markers as dirty; tolerance is in serialized characters.
 */
export function hasSizeChanged(
  oldValue: string | number | null | undefined,
  newValue: string | number,
  tolerance = 16
): boolean {
  if (oldValue === null || oldValue === undefined) {
    return true;
  }

  const oldNumber = parseInt(String(oldValue), 10);
  const newNumber = parseInt(String(newValue), 10);

  if (Number.isNaN(oldNumber) || Number.isNaN(newNumber)) {
    return true;
  }

  return Math.abs(newNumber - oldNumber) > tolerance;
}

/**
 * Allocate a weakly-held token pair without retaining detached page nodes.
 */
export function getDirtyEntry(target: Node | null): DirtyEntry | null {
  if (!target) {
    return null;
  }

  if (!dirtyTokens.has(target)) {
    dirtyTokens.set(target, { dirtyToken: 0, lastProcessedToken: -1 });
  }

  return dirtyTokens.get(target) ?? null;
}

/**
 * Capture the content version before scanning so a later mutation is not accidentally cleared.
 */
export function getDirtyToken(target: Node | null): number {
  const entry = getDirtyEntry(target);
  return entry ? entry.dirtyToken : 0;
}

/**
 * Compare exact rendered descendants so equal-length text, link, or feature changes invalidate a post.
 * Root visibility markers are excluded. Callers snapshot again after their own caption/media changes
 * to prevent those mutations being mistaken for a new Facebook post; storage remains weakly owned.
 */
export function buildPostSignature(post: Element | null): string {
  return post ? `${post.getAttribute("aria-posinset") || ""}|${post.innerHTML}` : "";
}

/**
 * Remember the latest signature; the first observation establishes a baseline without reporting change.
 */
export function hasPostChanged(post: Element | null): boolean {
  if (!post) {
    return false;
  }

  const signature = buildPostSignature(post);
  const previous = postSignatures.get(post);
  postSignatures.set(post, signature);
  if (previous === undefined) {
    return false;
  }

  return previous !== signature;
}

/**
 * Refresh identity after our own mutation so it is not mistaken for recycled Facebook content.
 */
export function trackPostSignature(post: Element | null): void {
  if (!post) {
    return;
  }
  postSignatures.set(post, buildPostSignature(post));
}

/**
 * Restore changed tracked roots before caption wrappers can exclude them from feed selectors.
 * Only roots previously scanned by a processor participate; arbitrary marked child features are untouched.
 * @param root Current feed boundary; a missing root has no tracked content to restore.
 * @param state Visibility markers belonging to the active userscript session.
 */
export function revalidateTrackedPosts(
  root: Element | null,
  state: Pick<VisibilityState, "hideAtt" | "hideWithNoCaptionAtt" | "showAtt">
): void {
  if (!root) return;
  for (const post of root.querySelectorAll(`[${postAtt}]`)) {
    const previous = postSignatures.get(post);
    if (previous === undefined || previous === buildPostSignature(post)) continue;
    resetPostState(post, state);
    postSignatures.delete(post);
  }
}

/**
 * Restore a recycled post before rescanning, including nested captions and no-caption rows.
 * @param post Reused page element whose previous classification must be discarded.
 * @param state Page-specific marker names; unrelated Facebook attributes are retained.
 */
export function resetPostState(
  post: Element | null,
  state: Pick<VisibilityState, "hideAtt" | "hideWithNoCaptionAtt" | "showAtt"> | null
): void {
  if (!post || !state) {
    return;
  }

  const wrapper = post.closest(`details[${postAtt}]`);
  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.insertBefore(post, wrapper);
    wrapper.remove();
  }

  const nestedWrappers = Array.from(post.querySelectorAll(`details[${postAtt}]`));
  nestedWrappers.forEach((details) => {
    const parent = details.parentNode;
    if (!parent) {
      return;
    }
    details.querySelector(":scope > summary")?.remove();
    while (details.firstChild) {
      parent.insertBefore(details.firstChild, details);
    }
    details.remove();
  });

  post.removeAttribute(postAtt);
  post.removeAttribute(state.hideAtt);
  post.removeAttribute(state.hideWithNoCaptionAtt);
  post.removeAttribute(state.showAtt);

  const nestedNoCaptionRows = Array.from(post.querySelectorAll(`[${state.hideWithNoCaptionAtt}]`));
  nestedNoCaptionRows.forEach((element) => {
    element.removeAttribute(postAtt);
    element.removeAttribute(state.hideWithNoCaptionAtt);
    element.removeAttribute(state.showAtt);
  });

  for (const caption of post.querySelectorAll(`h6[${postAttTab}]`)) caption.remove();
  for (const child of post.querySelectorAll(`[${postAttCPID}], [${state.hideAtt}]`)) {
    child.removeAttribute(postAttCPID);
    child.removeAttribute(state.hideAtt);
    child.removeAttribute(state.showAtt);
  }
}

/**
 * Advance the content token without invalidating concurrent scan snapshots.
 */
export function markElementDirty(target: Node | null): void {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return;
  }
  entry.dirtyToken += 1;
}

/**
 * Acknowledge every mutation currently recorded for this element.
 */
export function markElementClean(target: Node | null): void {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return;
  }
  entry.lastProcessedToken = entry.dirtyToken;
}

/**
 * Do not acknowledge mutations that arrived after the caller took its scan snapshot.
 */
export function markElementCleanIfUnchanged(target: Node | null, token: number): void {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return;
  }
  if (entry.dirtyToken === token) {
    entry.lastProcessedToken = entry.dirtyToken;
  }
}

/**
 * Newly encountered nodes start dirty so their first scan is never skipped.
 */
export function isElementDirty(target: Node | null): boolean {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return false;
  }
  return entry.dirtyToken !== entry.lastProcessedToken;
}

/**
 * Reuse one observer per root; every relevant subtree mutation advances its content version.
 * @param target Root whose children, attributes and text participate in filtering.
 * @returns Existing or newly connected observer, or null when observation is unavailable.
 */
export function ensureDirtyObserver(target: Node | null): MutationObserver | null {
  if (!target || typeof MutationObserver === "undefined") {
    return null;
  }

  const existing = observers.get(target);
  if (existing) {
    return existing;
  }

  const observer = new MutationObserver(() => {
    markElementDirty(target);
  });
  observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  observers.set(target, observer);
  activeObservers.set(target, observer);
  markElementDirty(target);
  return observer;
}

/**
 * Release observation when a processing root is no longer in use.
 */
export function disconnectDirtyObserver(target: Node): void {
  const observer = observers.get(target);
  if (!observer) {
    return;
  }

  observer.disconnect();
  observers.delete(target);
  activeObservers.delete(target);
}

/** Release all feed observers and version caches before a new page-processing lifecycle starts. */
export function clearDirtyTracking(): void {
  for (const observer of activeObservers.values()) observer.disconnect();
  activeObservers.clear();
  observers = new WeakMap();
  dirtyTokens = new WeakMap();
  postSignatures = new WeakMap();
}

/** Release replaced or detached Facebook roots during ordinary SPA scans, not only final teardown. */
export function pruneDirtyObservers(): void {
  for (const [target, observer] of activeObservers) {
    if (target.isConnected) continue;
    observer.disconnect();
    observers.delete(target);
    activeObservers.delete(target);
  }
}
