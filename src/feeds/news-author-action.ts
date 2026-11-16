// SPDX-License-Identifier: GPL-3.0-only

import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { newsSelectors } from "../selectors/news";
import { isOwnedNewsMetadata, ownNewsHeaders } from "./news-identity";

/** Classify author destinations, excluding navigation, post permalinks and external lookalikes. */
function authorKind(link: Element): "follow" | "join" | null {
  const url = facebookUrl(link);
  if (!url || !/^(?:www\.|m\.)?facebook\.com$/.test(url.hostname)) return null;
  if (/^\/groups\/(?!discover\/?$|feed\/?$|search\/?$)[^/]+\/?$/.test(url.pathname)) return "join";
  if (url.pathname === "/profile.php" && url.searchParams.get("id")) return "follow";
  if (/\.php\/?$/.test(url.pathname)) return null;
  if (
    /^\/(?!(?:groups|watch|reel|reels|stories|events|friends|marketplace|saved|settings|notifications|search|help|gaming|pages)\/?$)[\w.-]+\/?$/.test(
      url.pathname
    )
  )
    return "follow";
  return null;
}

/**
 * Recognize the observed inline relationship action without reading its caption or accessible name.
 * The action must follow an author branch and a separate accessibility-hidden separator in the
 * same heading. Menus, toggles, icon controls and nested content cannot supply this evidence.
 * @param post Owning news-feed root; cached DOM facts are shared with localized fallbacks.
 * @param kind Author destination distinguishes a person/page action from a group action.
 * @returns Whether a complete rendered author/action structure exists in this post's metadata.
 */
export function hasInlineAuthorAction(post: Element, kind: "follow" | "join"): boolean {
  const evidence = getPostEvidence(post);
  return ownNewsHeaders(post).some((header) => {
    const controls = evidence
      .select(newsSelectors.authorActions, header)
      .filter((control) => isOwnedNewsMetadata(control, post));
    const control = controls[0];
    if (
      controls.length !== 1 ||
      !control ||
      !control.matches(newsSelectors.inlineAuthorAction) ||
      control.matches(newsSelectors.statefulAuthorAction) ||
      control.closest(newsSelectors.authorLinks) ||
      evidence.select(newsSelectors.actionNonCaption, control).length > 0
    )
      return false;
    const captions = evidence.select(newsSelectors.actionCaption, control);
    const caption = captions[0];
    if (captions.length !== 1 || !caption || !evidence.isRendered(caption)) return false;
    const links = evidence
      .select(newsSelectors.authorLinks, header)
      .filter((link) => isOwnedNewsMetadata(link, post));
    if (!links.length || links.some((link) => authorKind(link) !== kind)) return false;
    let branch: Element | null = control;
    while (branch && branch !== header) {
      const separator = branch.previousElementSibling;
      const actionBranch = branch;
      if (
        separator &&
        !separator.querySelector(newsSelectors.authorActions) &&
        !separator.querySelector(newsSelectors.authorLinks) &&
        evidence.select(newsSelectors.authorSeparator, separator).length === 1 &&
        links.every(
          (link) =>
            !actionBranch.contains(link) &&
            Boolean(link.compareDocumentPosition(separator) & Node.DOCUMENT_POSITION_FOLLOWING)
        )
      )
        return true;
      branch = branch.parentElement;
    }
    return false;
  });
}
