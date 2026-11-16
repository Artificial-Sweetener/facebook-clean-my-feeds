// SPDX-License-Identifier: GPL-3.0-only

import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import { sharedSelectors } from "../selectors/shared";
import { pageSuggestionSelectors as selectors } from "../selectors/page-suggestions";

// Complete glyphs observed on Facebook's Pages discovery surface, 2026-11-15.
const followPath =
  "M5.675.5c-.393 0-.696 0-.963.053A2.75 2.75 0 0 0 2.55 2.714c-.051.257-.053.546-.053.915-.479.395-.82.95-.947 1.585-.051.257-.053.547-.053.919-.067.053-.132.11-.194.173-.456.455-.642 1.022-.726 1.65-.08.595-.08 1.344-.08 2.242v.604c0 .899 0 1.648.08 2.243.084.628.27 1.195.726 1.65.455.455 1.022.641 1.65.726.594.08 1.344.08 2.242.08H10.8c.898 0 1.647 0 2.242-.08.628-.085 1.195-.27 1.65-.726.456-.455.641-1.022.726-1.65.08-.595.08-1.344.08-2.242v-.605c0-.898 0-1.647-.08-2.242-.085-.628-.27-1.195-.726-1.65a2.252 2.252 0 0 0-.194-.173c0-.371-.002-.662-.053-.919a2.749 2.749 0 0 0-.947-1.585c0-.37-.002-.658-.053-.915a2.75 2.75 0 0 0-2.16-2.16C11.017.5 10.715.5 10.32.5H5.675zm7.31 5.073C12.398 5.5 11.668 5.5 10.8 5.5H5.196c-.87 0-1.599 0-2.184.073a1.25 1.25 0 0 1 .992-1.048c.103-.02.243-.024.744-.024h6.5c.5 0 .642.003.744.024a1.25 1.25 0 0 1 .992 1.048zm-1.01-2.56a9.405 9.405 0 0 0-.654-.012H4.675c-.25 0-.463 0-.654.013l.001-.007a1.25 1.25 0 0 1 .982-.982c.103-.02.243-.024.744-.024h4.5c.5 0 .642.003.744.024.496.098.883.486.982.982l.002.007zM8 8a.75.75 0 0 1 .75.75v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1v-1A.75.75 0 0 1 8 8z";
const dismissPath =
  "M4.28 3.22a.75.75 0 1 0-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 1 0 1.06 1.06L10 11.06l5.72 5.72a.75.75 0 0 0 1.06-1.06L11.06 10l5.72-5.72a.75.75 0 0 0-1.06-1.06L10 8.94 4.28 3.22z";

/** Check physical ancestor visibility while permitting Facebook's accessibility-hidden decorative artwork. */
function isPaintedInside(element: Element, boundary: Element, root: Element): boolean {
  const evidence = getPostEvidence(root);
  let node: Element | null = element;
  while (node && node !== boundary) {
    if (!evidence.isPainted(node)) return false;
    node = node.parentElement;
  }
  return node === boundary;
}

/** Require one painted, non-definition path; hidden or combined artwork cannot establish an action. */
function hasActionGeometry(
  control: Element,
  root: Element,
  path: string,
  viewBox: string
): boolean {
  const evidence = getPostEvidence(root);
  const icons = evidence.select(selectors.icons, control);
  const icon = icons[0];
  if (icons.length !== 1 || !icon || icon.getAttribute("viewBox") !== viewBox) return false;
  const shapes = evidence.select(sharedSelectors.svgShapes, icon);
  const shape = shapes[0];
  if (
    shapes.length !== 1 ||
    shape?.localName !== "path" ||
    shape.closest(sharedSelectors.svgDefinition)
  )
    return false;
  if (!isPaintedInside(shape, control, root)) return false;
  return shape.getAttribute("d")?.trim().replace(/\s+/g, " ") === path;
}

/** Reject navigation and content routes before comparing a card's three references to one page. */
function pageIdentity(link: Element): string | null {
  const url = facebookUrl(link);
  if (!url || !/^(?:www\.|m\.)?facebook\.com$/.test(url.hostname)) return null;
  if (url.pathname === "/profile.php") {
    const id = url.searchParams.get("id");
    return id && /^\d+$/.test(id) ? `id:${id}` : null;
  }
  if (/\.php\/?$/.test(url.pathname)) return null;
  return /^\/(?!(?:groups|watch|reel|reels|stories|events|friends|marketplace|saved|settings|notifications|search|help|gaming|pages)\/?$)[\w.-]+\/?$/.test(
    url.pathname
  )
    ? url.pathname.replace(/\/$/, "")
    : null;
}

/**
 * Identify one page recommendation from its linked cover, portrait, title and distinct follow/dismiss controls.
 * @param tile Direct list child; nested lists, posts, menus and hidden evidence cannot qualify.
 * @param root Independent candidate section supplying cached queries and rendering facts.
 * @returns The page identity for deduplicating separate cards, or null for incomplete/foreign content.
 */
function pageTileIdentity(tile: Element, root: Element): string | null {
  const evidence = getPostEvidence(root);
  if (
    !evidence.isRendered(tile) ||
    !ownsPostElement(tile, root) ||
    tile.querySelector(selectors.nestedContent)
  )
    return null;
  const links = evidence.select(sharedSelectors.links, tile);
  if (links.length < 3 || links.length > 4 || links.some((link) => !evidence.isRendered(link)))
    return null;
  const identity = links[0] && pageIdentity(links[0]);
  if (!identity || links.some((link) => pageIdentity(link) !== identity)) return null;
  if (
    links.filter((link) => !evidence.select(sharedSelectors.avatarMedia, link).length).length !== 1
  )
    return null;
  const media = evidence.select(sharedSelectors.avatarMedia, tile);
  if (
    media.length !== 2 ||
    media.some(
      (image) =>
        !["img", "image"].includes(image.localName) ||
        !image.closest(sharedSelectors.links) ||
        !isPaintedInside(image, tile, root)
    ) ||
    evidence.select(selectors.portrait, tile).length < 1
  )
    return null;
  const controls = evidence.select(selectors.actions, tile);
  if (
    controls.length !== 2 ||
    controls.some(
      (control) => !evidence.isRendered(control) || control.matches(selectors.statefulAction)
    )
  )
    return null;
  return controls.some((control) => hasActionGeometry(control, root, followPath, "0 0 16 16")) &&
    controls.some(
      (control) =>
        !control.matches(selectors.disabledAction) &&
        hasActionGeometry(control, root, dismissPath, "0 0 20 20")
    )
    ? identity
    : null;
}

/**
 * Recognize the observed page-recommendation list without consulting captions or accessible names.
 * At least two distinct complete cards must share one list. Authored content, nested posts and
 * controls outside that list reject the candidate so a surrounding feed cannot be hidden.
 * Callers limit mutation to their existing feed/rail roots; this predicate does not enable new routes.
 * @param root Independently discovered feed card or rail section, or the list itself for inspection.
 * @returns Whether the section has the complete corroborated page recommendation structure.
 */
export function hasPageSuggestionShelf(root: Element): boolean {
  if (!root.matches(selectors.list) && !root.querySelector(selectors.list)) return false;
  if (
    root.closest(sharedSelectors.authoredContent) ||
    root.parentElement?.closest(sharedSelectors.postOwner) ||
    root.querySelector(
      `${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}, ${sharedSelectors.authorMetadata}`
    )
  )
    return false;
  const evidence = getPostEvidence(root);
  const lists = root.matches(selectors.list) ? [root] : evidence.select(selectors.list);
  if (lists.length !== 1) return false;
  const list = lists[0];
  if (!list || !evidence.isRendered(list)) return false;
  if (Array.from(list.children).some((child) => child.getAttribute("role") !== "listitem"))
    return false;
  if (
    evidence
      .select(`${sharedSelectors.links}, ${selectors.actions}`)
      .some((node) => !list.contains(node))
  )
    return false;
  const identities = new Set<string>();
  for (const tile of evidence.select(selectors.items, list)) {
    if (!tile.hasChildNodes()) continue;
    const identity = pageTileIdentity(tile, root);
    if (!identity) return false;
    identities.add(identity);
  }
  return identities.size >= 2;
}
