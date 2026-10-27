// SPDX-License-Identifier: GPL-3.0-only

import type { Options } from "../core/options/types";
import type { PathInfo } from "../core/rules/feed-rules";
import type { Keywords } from "../i18n";
import type { VisibilityState } from "./types";
import { sharedSelectors } from "../selectors/shared";
import { climbUpTheTree } from "../utils/dom";
import { facebookUrl, getPostEvidence } from "./post-evidence";
import { ownsPostElement } from "./ownership";
import { postAtt } from "./attributes";
import { hideBlock } from "./hide";

/** Information topics share stable destinations and independent enablement switches. */
type InfoTopic = keyof PathInfo;
/** Only markers actually changed by this feature participate in restoration. */
type InfoState = Pick<VisibilityState, "cssHideEl" | "showAtt">;
/** Retain link identity and the native debug marker without retaining detached post roots globally. */
interface OwnedInfoBox {
  link: Element;
  reason: string;
  hideAttribute: string;
  showAttribute: string;
  originalShow: string | null;
  debugApplied: boolean;
}
/** A matched component keeps the route-specific explanation separate from its DOM identity. */
interface InfoTarget {
  link: Element;
  reason: string;
}
const topics: readonly InfoTopic[] = [
  "OTHER_INFO_BOX_CLIMATE_SCIENCE",
  "OTHER_INFO_BOX_CORONAVIRUS",
  "OTHER_INFO_BOX_SUBSCRIBE",
];
const ownedBoxes = new WeakMap<Element, Map<Element, OwnedInfoBox>>();

/** Restore only this feature's unchanged debug marker while preserving later native edits. */
function restoreDebug(box: Element, record: OwnedInfoBox): void {
  if (!record.debugApplied || box.getAttribute(record.showAttribute) !== "") return;
  if (record.originalShow === null) box.removeAttribute(record.showAttribute);
  else box.setAttribute(record.showAttribute, record.originalShow);
  record.debugApplied = false;
}

/** Release a recycled component without touching unrelated presentation or its private contents. */
function restoreBox(box: Element, record: OwnedInfoBox): void {
  if (box.getAttribute(record.hideAttribute) === "") box.removeAttribute(record.hideAttribute);
  if (record.link.getAttribute(postAtt) === record.reason) record.link.removeAttribute(postAtt);
  restoreDebug(box, record);
}

/**
 * Bound the legacy five-level component layout to its own post and reject authored or foreign signals.
 * @param link Facebook information destination already matched to an enabled topic.
 * @param post Owning feed post; a climb cannot reach this root or another article's content.
 * @param previous Components this feature has already collapsed, whose own CSS must not veto revalidation.
 * @param state Current marker names, used to avoid claiming another feature's hidden block.
 * @returns Independent rendered component root, or null when the destination has no safe layout boundary.
 */
function findInfoBox(
  link: Element,
  post: Element,
  previous: ReadonlyMap<Element, OwnedInfoBox>,
  state: InfoState
): Element | null {
  const box = climbUpTheTree(link, 5);
  if (!(box instanceof Element) || box === post || !post.contains(box)) return null;
  if (
    box.matches(sharedSelectors.postOwner) ||
    box.querySelector(
      `${sharedSelectors.postOwner}, ${sharedSelectors.profileName}, ${sharedSelectors.storyMessage}, h4, h5, [role="feed"], [role="navigation"], [role="main"]`
    )
  )
    return null;
  const owned = previous.get(box);
  const marker = link.getAttribute(postAtt);
  const ownLink = owned?.link === link && (marker === null || marker === owned.reason);
  if (marker !== null && !ownLink) return null;
  if (box.hasAttribute(state.cssHideEl) && !owned) return null;
  const control = ownLink ? link.parentElement : link;
  if (!control || link.matches(sharedSelectors.authoredContent) || !ownsPostElement(control, post))
    return null;
  const evidence = getPostEvidence(post);
  if (owned && box.getAttribute(owned.hideAttribute) === "") {
    if (
      box.matches('[hidden], [aria-hidden="true"]') ||
      !box.parentElement ||
      !evidence.isRendered(box.parentElement) ||
      !getPostEvidence(box).isRendered(link)
    )
      return null;
  } else if (!evidence.isRendered(link)) return null;
  return box;
}

/**
 * Filter every owned information component using production string paths and reversible per-box markers.
 * Exact Facebook destinations, visible controls and bounded ancestry prevent authored links from hiding a post.
 * @param post Current post; null performs no work.
 * @param options Independent topic switches and debug presentation preference.
 * @param keyWords Localized explanations; link labels and private text are never read.
 * @param paths Production route prefixes; omitted topics remain unmatched.
 * @param state Runtime markers owned by this userscript lifecycle.
 */
export function scrubInfoBoxes(
  post: Element | null,
  options: Options,
  keyWords: Pick<Keywords, InfoTopic>,
  paths: Partial<PathInfo>,
  state: InfoState
): void {
  if (!post || !options || !keyWords || !paths || !state) return;
  const previous = ownedBoxes.get(post) ?? new Map<Element, OwnedInfoBox>();
  const targets = new Map<Element, InfoTarget>();
  const links = getPostEvidence(post).select("a[href]");
  for (const topic of topics) {
    const path = paths[topic];
    if (!options[topic] || !path) continue;
    for (const link of links) {
      const url = facebookUrl(link);
      if (!url || !url.pathname.startsWith(path)) continue;
      const box = findInfoBox(link, post, previous, state);
      if (box && !targets.has(box)) targets.set(box, { link, reason: keyWords[topic] });
    }
  }
  for (const [box, record] of previous) {
    const target = targets.get(box);
    if (
      !target ||
      target.link !== record.link ||
      record.hideAttribute !== state.cssHideEl ||
      record.showAttribute !== state.showAtt
    ) {
      restoreBox(box, record);
      previous.delete(box);
    }
  }
  for (const [box, target] of targets) {
    const record = previous.get(box) ?? {
      link: target.link,
      reason: target.reason,
      hideAttribute: state.cssHideEl,
      showAttribute: state.showAtt,
      originalShow: box.getAttribute(state.showAtt),
      debugApplied: false,
    };
    if (!options.VERBOSITY_DEBUG) restoreDebug(box, record);
    else if (box.getAttribute(state.showAtt) !== "")
      record.originalShow = box.getAttribute(state.showAtt);
    if (
      box.getAttribute(state.cssHideEl) !== "" ||
      target.link.getAttribute(postAtt) !== target.reason ||
      (options.VERBOSITY_DEBUG && box.getAttribute(state.showAtt) !== "")
    ) {
      hideBlock(box, target.link, target.reason, state, options, { postAtt });
    }
    record.reason = target.reason;
    record.debugApplied = !!options.VERBOSITY_DEBUG;
    previous.set(box, record);
  }
  if (previous.size) ownedBoxes.set(post, previous);
  else ownedBoxes.delete(post);
}
