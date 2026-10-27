// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext } from "./types";
import { postAtt, postAttChildFlag } from "../dom/attributes";
import { hideFeature } from "../dom/hide";
import { climbUpTheTree } from "../utils/dom";
import { newsSelectors } from "../selectors/news";
import { isMetaAiLink } from "./news-detectors";
import { isBadgeOnlyWrapper, ownVerifiedBadges } from "./news-identity";
import { newsCollapsedSpacing, reconcileNewsPresentation } from "./news-presentation";

/**
 * Prefer the explicitly labelled page-card region; otherwise require both stories and reels links outside individual posts.
 * Fallback discovery first tries a shared region, then climbs the reels link until an ancestor also contains the stories link, stopping before the main root.
 * @param mainColumn Read-only boundary for top-card discovery; links found inside article or aria-posinset containers are excluded from fallback matching.
 * @returns The labelled region, first matching fallback region, or shared link ancestor; null means no supported card group was found.
 */
export function findTopCardsForPagesContainer(mainColumn: Element | null) {
  if (!mainColumn) {
    return null;
  }

  const labelledRegion = mainColumn.querySelector(
    'div[role="region"][aria-label="profile plus top of feed cards"]'
  );
  if (labelledRegion) {
    return labelledRegion;
  }

  const anchors = Array.from(mainColumn.querySelectorAll('a[href="/reel/"], a[href="/stories/"]'));
  if (anchors.length === 0) {
    return null;
  }

  const candidates = new Set<Element>();
  anchors.forEach((anchor) => {
    if (anchor.closest('div[role="article"], div[aria-posinset]')) {
      return;
    }
    const region = anchor.closest('div[role="region"]');
    if (region && mainColumn.contains(region)) {
      candidates.add(region);
    }
  });

  for (const region of candidates) {
    if (region.querySelector('a[href="/reel/"]') && region.querySelector('a[href="/stories/"]')) {
      return region;
    }
  }

  const reelsLink = anchors.find(
    (anchor) =>
      anchor.getAttribute("href") === "/reel/" &&
      !anchor.closest('div[role="article"], div[aria-posinset]')
  );
  const storiesLink = anchors.find(
    (anchor) =>
      anchor.getAttribute("href") === "/stories/" &&
      !anchor.closest('div[role="article"], div[aria-posinset]')
  );
  if (!reelsLink || !storiesLink) {
    return null;
  }

  let node = reelsLink.parentElement;
  while (node && node !== mainColumn) {
    if (node.contains(storiesLink)) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

/**
 * Hide the stories/reels tab strip using its four-level ancestor; only when the tab list is absent does discovery fall back to a create-story link.
 * A child marker avoids repeating the same layout cleanup and is applied only after a suitable ancestor is found.
 * @param context NF_TABLIST_STORIES_REELS_ROOMS supplies caption text; options and visibility state control how hideFeature presents the selected wrapper. Null skips discovery.
 */
export function scrubTabbies(context: FeedContext | null) {
  if (!context) return;
  const { keyWords, state } = context;
  if (!keyWords || !state) {
    return;
  }

  const tabLabel = keyWords.NF_TABLIST_STORIES_REELS_ROOMS;

  const queryTabList =
    'div[role="main"] > div > div > div > div > div > div > div > div[role="tablist"]';
  const elTabList = document.querySelector(queryTabList);
  if (elTabList) {
    if (elTabList.hasAttribute(postAttChildFlag)) {
      return;
    }
    const elParent = climbUpTheTree(elTabList, 4);
    if (elParent instanceof Element) {
      if (tabLabel) {
        hideFeature(elParent, tabLabel.replaceAll('"', ""), false, context);
      }
      elTabList.setAttribute(postAttChildFlag, "tablist");
      return;
    }
  } else {
    const queryForCreateStory =
      'div[role="main"] > div > div > div > div > div > div > div > div a[href*="/stories/create"]';
    const elCreateStory = document.querySelector(queryForCreateStory);
    if (elCreateStory && !elCreateStory.hasAttribute(postAttChildFlag)) {
      const elParent = getStoriesParent(elCreateStory);
      if (elParent instanceof Element) {
        hideFeature(elParent, keyWords.NF_TABLIST_STORIES_REELS_ROOMS, false, context);
        elCreateStory.setAttribute(postAttChildFlag, "1");
      }
    }
  }
}

/** When the four-level ancestor contains multiple story links, climb four levels from the nearest labelled region; otherwise climb seven from the input link, allowing a missing ancestor to return null. */
export function getStoriesParent(element: Element | null) {
  const elAFewBranchesUp = climbUpTheTree(element, 4);
  const moreStories =
    elAFewBranchesUp instanceof Element
      ? elAFewBranchesUp.querySelectorAll('a[href*="/stories/"]')
      : [];
  let elParent = null;
  if (moreStories.length > 1) {
    elParent = climbUpTheTree(element?.closest('div[aria-label][role="region"]') ?? null, 4);
  } else {
    elParent = climbUpTheTree(element, 7);
  }
  return elParent;
}

/** Hide one unprocessed survey wrapper using the historical Survey caption; skip owned ancestors and the child marker to avoid duplicate captions. */
export function scrubSurvey(context: FeedContext | null) {
  if (!context) return;
  const { keyWords } = context;
  const btnSurvey = Array.from(
    document.querySelectorAll(
      `${newsSelectors.surveyButton}:not([${postAtt}]):not([${postAttChildFlag}])`
    )
  ).find((button) => !button.closest(`[${postAtt}]`));
  if (btnSurvey) {
    const elContainer = climbUpTheTree(btnSurvey.closest('[style*="border-radius"]'), 3);
    if (elContainer instanceof Element) {
      hideFeature(elContainer, "Survey", false, context);
      btnSurvey.setAttribute(postAttChildFlag, keyWords.NF_SURVEY);
    }
  }
}

/** Hide page top cards once and retain a child marker for subsequent sweeps. */
export function scrubTopCardsForPages(context: FeedContext | null) {
  if (!context) return;
  const { keyWords } = context;
  const mainColumn = document.querySelector(newsSelectors.mainColumn);
  if (!mainColumn) {
    return;
  }

  const container = findTopCardsForPagesContainer(mainColumn);
  if (!container || container.hasAttribute(postAttChildFlag)) {
    return;
  }

  hideFeature(container, keyWords.NF_TOP_CARDS_PAGES, false, context);
  container.setAttribute(postAttChildFlag, keyWords.NF_TOP_CARDS_PAGES);
}

/**
 * Collapse semantically verified icons in main/dialog author headers while retaining native inline declarations.
 * Only badge-only spans collapse with their icon; author text, controls, and neighboring artwork remain visible.
 * @param context Supplies the owned badge marker; null leaves the document unchanged.
 */
export function scrubVerifiedBadges(context: FeedContext | null) {
  if (!context) return;
  const targets = new Map<Element, readonly string[]>();
  for (const root of [
    document.querySelector(newsSelectors.mainColumn),
    document.querySelector(newsSelectors.dialog),
  ]) {
    if (!root) continue;
    for (const post of root.querySelectorAll(newsSelectors.standardPost)) {
      for (const badge of ownVerifiedBadges(post)) {
        targets.set(badge, [...newsCollapsedSpacing, "width", "height"]);
        let wrapper = badge.parentElement;
        while (wrapper && wrapper.tagName === "SPAN" && isBadgeOnlyWrapper(wrapper, badge)) {
          targets.set(wrapper, newsCollapsedSpacing);
          wrapper = wrapper.parentElement;
        }
      }
    }
  }
  reconcileNewsPresentation("badge", targets, context.state.cssHideVerifiedBadge);
}

/**
 * Collect the nearest list item for Meta AI navigation links and the known Meta AI message thread, plus matching Manus AI/Meta AI list entries.
 * A set deduplicates entries found by both link and text signals; collection itself does not hide or restyle anything.
 * @returns Sidebar elements to collapse, retaining discovery order across navigation and right-panel searches.
 */
export function getSidePanelAiTargets() {
  const targets = new Set<Element>();

  const navs = Array.from(document.querySelectorAll('div[role="navigation"]'));
  navs.forEach((nav) => {
    const metaLinks = Array.from(nav.querySelectorAll("a[href]")).filter(isMetaAiLink);
    metaLinks.forEach((link) => {
      const li = link.closest("li");
      targets.add(li || link);
    });

    const navItems = Array.from(nav.querySelectorAll("li"));
    navItems.forEach((li) => {
      const text = li.textContent ? li.textContent.trim() : "";
      if (text === "Manus AI") {
        targets.add(li);
      }
    });
  });

  const rightPanel = document.querySelector('div[role="complementary"]');
  if (rightPanel) {
    const metaThreads = rightPanel.querySelectorAll('a[href*="/messages/t/36327,2227039302/"]');
    metaThreads.forEach((link) => {
      const li = link.closest("li");
      targets.add(li || link);
    });

    const rightItems = Array.from(rightPanel.querySelectorAll("li"));
    rightItems.forEach((li) => {
      const text = li.textContent ? li.textContent.trim() : "";
      if (text.includes("Meta AI")) {
        targets.add(li);
      }
    });
  }

  return Array.from(targets);
}

/** Collapse detected AI sidebar entries while retaining native CSS for option-disable and lifecycle restoration. */
export function scrubSidePanelAi(context: FeedContext | null) {
  if (!context) return;
  const targets = new Map(getSidePanelAiTargets().map((target) => [target, newsCollapsedSpacing]));
  reconcileNewsPresentation("sidebar", targets, context.state.hideAtt);
}
