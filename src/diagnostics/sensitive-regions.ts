// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotContent, SnapshotRedaction } from "../core/diagnostics/dom-snapshot";
import { diagnosticSelectors as selectors } from "../selectors/diagnostics";

/** A missing redaction reason means evidence is retained, not that it has been proven non-sensitive. */
export interface ContentDecision {
  content: SnapshotContent;
  redaction?: SnapshotRedaction;
}

/** Resolve real Facebook destinations without confusing external lookalikes with identity links. */
function facebookDestination(element: Element): URL | null {
  try {
    const url = new URL(element.getAttribute("href") || "", "https://www.facebook.com/");
    return /^https?:$/.test(url.protocol) && /(^|\.)facebook\.com$/.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
}

/**
 * Identify destination-bearing people/page/group links, not arbitrary unknown controls.
 * Content routes and site navigation remain useful evidence; an empty SVG timestamp or
 * disclosure does not become a profile just because Facebook gives it a profile-shaped URL.
 */
export function isIdentityLink(link: Element): boolean {
  const url = facebookDestination(link);
  if (!url) return false;
  const path = url.pathname;
  if (/^\/profile\.php\/?$/.test(path)) return true;
  if (/^\/groups\/[^/]+(?:\/user\/[^/]+)?\/?$/.test(path))
    return !/^\/groups\/(?:discover|feed|joins|create)\/?$/.test(path);
  if (/^\/stories\/[^/]+/.test(path)) return !/^\/stories\/create\/?$/.test(path);
  if (/^\/friends\/(?:requests|suggestions)/.test(path))
    return url.searchParams.has("profile_id") || link.querySelector("img") !== null;
  const segments = path.split("/").filter(Boolean);
  if (segments.length !== 1 || /\./.test(segments[0] || "")) return false;
  const authorHeading = link.closest("h4, h5") && link.closest(selectors.post);
  const avatar = link.querySelector("img");
  return !!link.textContent?.trim() && !!(authorHeading || avatar);
}

/** Keep exclusion reasons stable across full reports, history frames and live audit output. */
function decision(
  content: SnapshotContent,
  reason: SnapshotRedaction["reason"],
  confidence: SnapshotRedaction["confidence"] = "explicit"
): ContentDecision {
  return { content, redaction: { reason, confidence } };
}

/**
 * Locate sensitive regions by semantic markup and local content relationships, without label vocabulary.
 * Decisions are recomputed against the live ancestry so moving a control into a body cannot reuse
 * stale public provenance. Reference edges retain nodes only for this bounded capture's lifetime.
 */
export class SensitiveRegions {
  private referenceSources = new Map<Element, Set<Element>>();
  private sourceTargets = new Map<Element, Set<Element>>();
  referenceLimitReached = false;

  /**
   * Track accessible/SVG label use so a private source's out-of-line text remains private too.
   * Shared references are retained when an independent non-sensitive control uses them. Cycles
   * terminate, and changed attributes remove their old edges before the next classification.
   * @param source Live element whose current label dependencies replace its previous edges in this capture.
   */
  rememberReferences(source: Element): void {
    const queue = [source];
    const visited = new Set<Element>();
    while (queue.length) {
      const current = queue.pop();
      if (!current || visited.has(current)) continue;
      if (visited.size >= 128 || this.sourceTargets.size >= 2048) {
        this.referenceLimitReached = true;
        break;
      }
      visited.add(current);
      for (const old of this.sourceTargets.get(current) || [])
        this.referenceSources.get(old)?.delete(current);
      const ids = [
        ...(current.getAttribute("aria-labelledby")?.trim().split(/\s+/) || []),
        ...(current.getAttribute("aria-describedby")?.trim().split(/\s+/) || []),
      ];
      if (current.namespaceURI === "http://www.w3.org/2000/svg") {
        const href = current.getAttribute("href") || current.getAttribute("xlink:href");
        if (href?.startsWith("#")) ids.push(href.slice(1));
      }
      if (ids.length > 16) this.referenceLimitReached = true;
      const targets = new Set<Element>();
      for (const id of ids.slice(0, 16)) {
        const target: Element | null = current.ownerDocument.getElementById(id);
        if (!target || target.contains(current)) continue;
        targets.add(target);
        const sources = this.referenceSources.get(target) || new Set<Element>();
        sources.add(current);
        this.referenceSources.set(target, sources);
        queue.push(
          target,
          ...Array.from(target.querySelectorAll(selectors.labelReference)).slice(0, 128)
        );
      }
      if (targets.size) this.sourceTargets.set(current, targets);
      else this.sourceTargets.delete(current);
    }
  }

  /** Determine sensitive ancestry before considering indirect references; unfamiliar markup alone is never private. */
  private local(element: Element): ContentDecision {
    if (element.closest(selectors.excluded)) return decision("excluded", "executable-content");
    if (element.closest(selectors.filterCaption)) return decision("authored", "filter-caption");
    if (element.closest(selectors.editable)) return decision("authored", "editable-region");
    if (element.closest(selectors.authored)) return decision("authored", "authored-region");
    if (element.closest(selectors.personalIdentity)) return decision("identity", "identity-region");
    const profile = element.closest(selectors.profile);
    const action = element.closest(selectors.control);
    if (
      profile &&
      (!action || action === profile || !profile.contains(action) || action.matches("a"))
    )
      return decision("identity", "identity-region");
    const link = element.closest("a[href]");
    if (link && isIdentityLink(link)) return decision("identity", "identity-link", "inferred");
    if (this.isBodyText(element)) return decision("authored", "post-body", "inferred");
    return { content: "interface" };
  }

  /**
   * Treat prose outside headings/controls in a post as likely authored, even without Facebook markers.
   * Only the text-bearing element is classified: siblings and enclosing headers keep their evidence.
   * Directional prose, line breaks, media-bearing text blocks and nearby author headings provide independent signals.
   * @param element Text-bearing element considered within its nearest independently owned post.
   * @returns Whether local prose/media evidence supports a narrow inferred body redaction.
   */
  private isBodyText(element: Element): boolean {
    const post = element.closest(selectors.post);
    if (!post || element === post || element.closest(selectors.control + ", " + selectors.heading))
      return false;
    if (element.namespaceURI === "http://www.w3.org/2000/svg") return false;
    if (
      !Array.from(element.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      )
    )
      return false;
    const hasAuthor = !!post.querySelector(selectors.profile + ", h4, h5");
    if (hasAuthor) {
      let mediaRegion: Element | null = element;
      while (mediaRegion && mediaRegion !== post) {
        if (
          mediaRegion.querySelector(
            selectors.control + ", " + selectors.heading + ", " + selectors.profile
          )
        )
          break;
        if (mediaRegion.querySelector("img, video")) return true;
        mediaRegion = mediaRegion.parentElement;
      }
    }
    const prose = element.closest('[dir="auto"]');
    if (
      prose &&
      post.contains(prose) &&
      prose.querySelector("br") &&
      !prose.querySelector(selectors.control + ", " + selectors.heading) &&
      hasAuthor
    )
      return true;
    return (
      element.querySelector("br") !== null &&
      hasAuthor &&
      !element.querySelector(
        selectors.control + ", " + selectors.heading + ", " + selectors.profile
      )
    );
  }

  /**
   * Propagate sensitive context through label references, while explicit target boundaries always win.
   * Traversal is bounded independently of label length. Ambiguous/cyclic-only graphs retain evidence.
   * @param element Source element or external label target whose current context is being sampled.
   * @param active Ancestors in the current reference traversal, used to terminate cycles.
   * @param budget Shared visit allowance across branching reference paths; exhaustion is reported as a capture limitation.
   * @returns Sensitive category with its evidence strength, or interface retention when no sensitive signal applies.
   */
  classify(
    element: Element,
    active = new Set<Element>(),
    budget = { remaining: 128 }
  ): ContentDecision {
    const local = this.local(element);
    if (local.content !== "interface") return local;
    if (active.has(element)) return local;
    if (--budget.remaining < 0) {
      this.referenceLimitReached = true;
      return local;
    }
    active.add(element);
    let target: Element | null = element;
    while (target) {
      const sources = this.referenceSources.get(target);
      if (sources?.size) {
        const decisions = Array.from(sources)
          .filter((source) => source.isConnected)
          .map((source) => this.classify(source, new Set(active), budget));
        if (decisions.length && decisions.every((source) => source.content !== "interface"))
          return decision("authored", "private-reference", "inferred");
      }
      target = target.parentElement;
    }
    return local;
  }
}
