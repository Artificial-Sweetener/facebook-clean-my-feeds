// SPDX-License-Identifier: GPL-3.0-only

import { forgetLabelReferences, getContentVersion, trackLabelReference } from "./content-version";

/** A cached destination remains valid only for the same literal href. */
interface LinkDestination {
  href: string | null;
  url: URL | null;
}
const destinations = new WeakMap<Element, LinkDestination>();

/** Parse actual Facebook HTTP destinations once per href, rejecting credentials and lookalike hosts. */
export function facebookUrl(link: Element): URL | null {
  const href = link.getAttribute("href");
  const previous = destinations.get(link);
  if (previous?.href === href) return previous.url;
  let url: URL | null = null;
  try {
    const parsed = href ? new URL(href, "https://www.facebook.com/") : null;
    if (
      parsed &&
      /^(https?:)$/.test(parsed.protocol) &&
      !parsed.username &&
      !parsed.password &&
      (parsed.hostname === "facebook.com" || parsed.hostname.endsWith(".facebook.com"))
    )
      url = parsed;
  } catch {
    /* Malformed destinations supply no evidence. */
  }
  destinations.set(link, { href, url });
  return url;
}

/** Lazy DOM facts shared by enabled filters for one immutable post version. */
export class PostEvidence {
  private queries = new WeakMap<Element, Map<string, Element[]>>();
  private visibility = new WeakMap<Element, boolean>();
  private painted = new WeakMap<Element, boolean>();
  private texts = new WeakMap<Element, string>();
  private names = new WeakMap<Element, string[]>();
  private contentTexts = new Map<string, string[]>();

  /** Keep every query, name and referenced label attached to its owning post scope. */
  constructor(readonly post: Element) {}

  /** Execute each selector once per scope and content version without collecting unused filter facts. */
  select(selector: string, root = this.post): Element[] {
    let queries = this.queries.get(root);
    if (!queries) {
      queries = new Map();
      this.queries.set(root, queries);
    }
    let elements = queries.get(selector);
    if (!elements) {
      elements = Array.from(root.querySelectorAll(selector));
      queries.set(selector, elements);
    }
    return elements;
  }

  /** Reuse bounded body-text extraction across enabled filters and stable recovery sweeps. */
  readText(key: string, read: () => string[]): string[] {
    let text = this.contentTexts.get(key);
    if (!text) {
      text = read();
      this.contentTexts.set(key, text);
    }
    return text;
  }

  /** Exclude accessibility-hidden metadata while sharing its physical-visibility cache with visual-only counters. */
  isVisible(element: Element): boolean {
    const previous = this.visibility.get(element);
    if (previous !== undefined) return previous;
    const visible = this.isPainted(element) && element.getAttribute("aria-hidden") !== "true";
    this.visibility.set(element, visible);
    return visible;
  }

  /** Read physical visibility once per version, retaining visually displayed counters that Facebook intentionally marks aria-hidden. */
  isPainted(element: Element): boolean {
    const previous = this.painted.get(element);
    if (previous !== undefined) return previous;
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);
    const visible =
      !element.matches("script, style, [hidden]") &&
      style?.display !== "none" &&
      style?.visibility !== "hidden";
    this.painted.set(element, visible);
    return visible;
  }

  /** Ignore concealed metadata ancestors while allowing diagnostics on a post CMF itself has collapsed. */
  isRendered(element: Element): boolean {
    let ancestor: Element | null = element;
    while (ancestor && ancestor !== this.post) {
      if (!this.isVisible(ancestor)) return false;
      ancestor = ancestor.parentElement;
    }
    return ancestor === this.post;
  }

  /**
   * Read fragmented control copy with strict node/character ceilings; oversized labels remain unmatched.
   * @param control Owned metadata control; surrounding post copy cannot contribute to its label.
   * @returns Visible label text or an empty string when the traversal budget is exhausted.
   */
  visibleText(control: Element): string {
    const previous = this.texts.get(control);
    if (previous !== undefined) return previous;
    const walker = control.ownerDocument.createTreeWalker(control, NodeFilter.SHOW_ALL);
    let node: Node | null = control;
    let text = "";
    let nodes = 0;
    while (node) {
      if (++nodes > 128 || text.length > 256) {
        text = "";
        break;
      }
      let element = node instanceof Element ? node : node.parentElement;
      let visible = true;
      while (element && control.contains(element)) {
        if (!this.isVisible(element)) {
          visible = false;
          break;
        }
        if (element === control) break;
        element = element.parentElement;
      }
      if (visible && node.nodeType === Node.TEXT_NODE) text += node.textContent || "";
      node = walker.nextNode();
    }
    if (text.length > 256) text = "";
    this.texts.set(control, text);
    return text;
  }

  /** Read non-rendered accessible label text without allowing oversized referenced subtrees to monopolize a scan. */
  labelText(label: Element): string {
    const walker = label.ownerDocument.createTreeWalker(label, NodeFilter.SHOW_ALL);
    let node: Node | null = label;
    let text = "";
    let nodes = 0;
    while (node) {
      if (++nodes > 128) return "";
      if (node.nodeType === Node.TEXT_NODE) text += node.textContent || "";
      if (text.length > 256) return "";
      node = walker.nextNode();
    }
    return text;
  }

  /** Resolve bounded ARIA dependencies, including IDs that have not appeared in the document yet. */
  referencedLabels(element: Element): (Element | null)[] {
    const ids = element.getAttribute("aria-labelledby")?.trim().split(/\s+/) || [];
    if (!ids.length || ids.length > 8) return [null];
    return ids.map((id) => {
      return this.referenceTarget(id);
    });
  }

  /** Subscribe before resolving so late insertion, replacement or text edits invalidate a cached negative result. */
  referenceTarget(id: string): Element | null {
    trackLabelReference(this.post, id);
    return (
      this.post.ownerDocument.getElementById(id) ||
      this.select("[id]").find((label) => label.id === id) ||
      null
    );
  }

  /** Preserve accessible-name precedence without borrowing ancestor copy or unbounded referenced text. */
  explicitNames(element: Element): string[] {
    const previous = this.names.get(element);
    if (previous) return previous;
    const labels = element.hasAttribute("aria-labelledby") ? this.referencedLabels(element) : [];
    const reference =
      labels.length && labels.every((label) => label && !label.contains(element))
        ? labels
            .map((label) => (label ? this.labelText(label) : ""))
            .join(" ")
            .trim()
        : "";
    const title = Array.from(element.children).find(
      (child) => child.localName === "title"
    )?.textContent;
    const name =
      reference ||
      element.getAttribute("aria-label") ||
      title ||
      element.getAttribute("title") ||
      "";
    const names = name.trim() && name.length <= 256 ? [name] : [];
    this.names.set(element, names);
    return names;
  }
}

const cached = new WeakMap<Element, { version: number; evidence: PostEvidence }>();

/** Share evidence until a local mutation or referenced external label changes; never cache detached fixtures. */
export function getPostEvidence(post: Element): PostEvidence {
  const version = getContentVersion(post);
  const previous = cached.get(post);
  if (version !== null && previous?.version === version) return previous.evidence;
  forgetLabelReferences(post);
  const evidence = new PostEvidence(post);
  if (version !== null) cached.set(post, { version, evidence });
  return evidence;
}
