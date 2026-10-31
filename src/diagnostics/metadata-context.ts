// SPDX-License-Identifier: GPL-3.0-only

import { diagnosticSelectors as selectors } from "../selectors/diagnostics";
import { sanitizePathname } from "./location";
import { getContentVersion } from "../dom/content-version";

/** Bound identity seeding and label validation without flattening an arbitrary post into retained text. */
export function boundedLabel(element: Element, maximum = 180, maximumNodes = 128): string | null {
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let text = "";
  let count = 0;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (++count > maximumNodes || text.length > maximum) return null;
    text += node.textContent || "";
  }
  return text.length <= maximum ? text.trim() : null;
}

/** Reject credentials, external hosts and non-web destinations before interpreting a link as Facebook chrome. */
export function metadataDestination(element: Element): URL | null {
  try {
    const url = new URL(element.getAttribute("href") || "", "https://www.facebook.com/");
    return /^https?:$/.test(url.protocol) &&
      !url.username &&
      !url.password &&
      /(^|\.)facebook\.com$/.test(url.hostname)
      ? url
      : null;
  } catch {
    return null;
  }
}

/** Content permalinks carry metadata copy, even though unknown PHP route names are redacted in exported URLs. */
export function isProfileDestination(element: Element): boolean {
  const url = metadataDestination(element);
  if (!url) return false;
  if (/^\/(?:story|permalink|photo|video|share)\.php\/?$/.test(url.pathname)) return false;
  return (
    url.pathname === "/profile.php" ||
    sanitizePathname(url.pathname).replace(/\/$/, "") === "/[profile]"
  );
}

/** Prefer a concrete post owner over incidental ARIA-described wrappers inside its metadata controls. */
export function metadataPost(element: Element): Element | null {
  return element.closest(selectors.post) || element.closest(selectors.legacyPost);
}

/**
 * Establish public header controls from author/body separation rather than sponsorship words or current filter matches.
 * Caches live only for one capture. Private boundaries are rechecked before cached structural membership is used.
 */
export class MetadataContext {
  private bands = new WeakMap<Element, Element[]>();
  private labels = new WeakMap<Element, { version: number; text: string | null }>();

  /** Cache bounded composite metadata copy by mutation version, including character-by-character obfuscation. */
  label(element: Element): string | null {
    const post = metadataPost(element);
    const version = post ? getContentVersion(post) : null;
    const previous = this.labels.get(element);
    if (version !== null && previous?.version === version) return previous.text;
    const text = boundedLabel(element, 2048, 512);
    if (version !== null) this.labels.set(element, { version, text });
    return text;
  }

  /**
   * Stop header expansion before prose, comments, nested posts or media outside identity controls.
   * @param scope Proposed header ancestor, bounded before it can include the full post body.
   * @returns Whether private content or an exhausted traversal budget prevents expanding through this ancestor.
   */
  private containsBody(scope: Element): boolean {
    if (scope.querySelector(`${selectors.authored}, ${selectors.post}`)) return true;
    const walker = scope.ownerDocument.createTreeWalker(
      scope,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );
    let node: Node | null = scope;
    let visited = 0;
    while (node) {
      if (++visited > 512) return true;
      const element = node instanceof Element ? node : node.parentElement;
      if (element && !element.closest(selectors.identity)) {
        if (
          element.matches("img, video, audio, canvas") &&
          !element.closest('a[href], button, [role="button"]')
        )
          return true;
        if (
          node.nodeType === Node.TEXT_NODE &&
          /[\p{L}\p{N}]/u.test(node.textContent || "") &&
          !element.closest(`${selectors.control}, ${selectors.heading}`)
        )
          return true;
      }
      node = walker.nextNode();
    }
    return false;
  }

  /**
   * Locate small author-and-metadata bands; a whole post can never become a public text boundary.
   * @param post Concrete owning root, including hidden and virtualized posts.
   * @returns Capture-local header bands established by author structure and conservative legacy headings.
   */
  private headers(post: Element): Element[] {
    const cached = this.bands.get(post);
    if (cached) return cached;
    const headers: Element[] = [];
    for (const profile of Array.from(post.querySelectorAll(selectors.profile)).slice(0, 16)) {
      if (metadataPost(profile) !== post || profile.closest(selectors.authored)) continue;
      let header = profile.parentElement;
      let selected: Element | null = null;
      for (
        let depth = 0;
        header && header !== post && depth < 12;
        depth++, header = header.parentElement
      ) {
        if (this.containsBody(header)) break;
        selected = header;
      }
      if (selected) headers.push(selected);
    }
    const heading = post.querySelector("h4, h5");
    if (
      heading &&
      !heading.closest(selectors.authored) &&
      metadataPost(heading) === post &&
      heading.querySelector("a[href]")
    )
      headers.push(heading);
    this.bands.set(post, headers);
    return headers;
  }

  /**
   * Independent author actions retain novel UI wording while the adjacent actual author anchor stays private.
   * @param element Candidate action descendant inside a broad profile-name wrapper.
   * @returns Independently named action with a separate identity anchor, or null for private/ambiguous controls.
   */
  independentAction(element: Element): Element | null {
    const action = element.closest('button, [role="button"]');
    const profile = action?.closest(selectors.profile);
    if (
      !action ||
      !profile ||
      action === profile ||
      action.closest("a, [data-hovercard], [data-profileid], [data-userid]") ||
      element.closest(selectors.identity) !== profile ||
      action.querySelector("a, [data-hovercard], [data-profileid], [data-userid]")
    )
      return null;
    const post = metadataPost(action);
    if (!post) return null;
    const author = Array.from(profile.querySelectorAll("a[href]"))
      .slice(0, 16)
      .find(
        (link) =>
          !action.contains(link) && metadataPost(link) === post && isProfileDestination(link)
      );
    if (!author) return null;
    const text = this.label(action);
    const label = action.getAttribute("aria-label");
    if (
      text === null ||
      (label && text && label.normalize("NFKC").trim() !== text.normalize("NFKC").trim())
    )
      return null;
    return action;
  }

  /**
   * Return a bounded metadata control without authorizing the rest of its enclosing post or arbitrary profile labels.
   * @param element Candidate control or descendant, including obfuscated text spans.
   * @returns Owning public control, or null when structure cannot separate metadata from identity or authored content.
   */
  control(element: Element): Element | null {
    if (element.closest(`${selectors.authored}, ${selectors.excluded}`)) return null;
    const independent = this.independentAction(element);
    if (independent) return independent;
    if (element.closest(selectors.identity)) return null;
    const control = element.closest(selectors.control);
    const post = control ? metadataPost(control) : null;
    if (!control || !post || !this.headers(post).some((header) => header.contains(control)))
      return null;
    if (this.label(control) === null) return null;
    if (control.matches("a[href]")) {
      const url = metadataDestination(control);
      if (!url) return null;
      const heading = control.closest("h4, h5");
      if (
        !post.querySelector(selectors.profile) &&
        heading?.querySelector("a[href]") === control &&
        this.label(control)
      )
        return null;
      if (isProfileDestination(control)) {
        // An empty graphic metadata link is distinct from a text-bearing author link or named profile badge.
        if (url.pathname === "/profile.php" || this.label(control) || !control.querySelector("svg"))
          return null;
      }
    }
    return control;
  }
}
