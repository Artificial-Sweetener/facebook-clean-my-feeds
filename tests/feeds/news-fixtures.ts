// SPDX-License-Identifier: GPL-3.0-only

import { hydrateOptions } from "../../src/core/options/hydrate";
import type { HydratedOptions } from "../../src/core/options/types";
import { pathInfo } from "../../src/core/rules/feed-rules";
import { createDomState } from "../../src/dom/types";
import { createFeedState } from "../../src/feeds/state";
import type { FeedContext } from "../../src/feeds/types";
import type { Keywords } from "../../src/i18n";
import { newsSelectors } from "../../src/selectors/news";

/** Fail at fixture construction when required markup is absent, instead of hiding a nullable test assumption. */
export function requireElement<T>(value: T | null | undefined): T {
  if (value === null || value === undefined)
    throw new Error("Required test fixture element is missing");
  return value;
}

/** Attach deterministic React-like prompt metadata so tests exercise fiber discovery without React. */
export function attachSuggestionFiber(
  button: Element,
  {
    promptId,
    genAISessionID,
    suggestionKey,
  }: { promptId: string; genAISessionID: string; suggestionKey: string }
) {
  const suggestionFiber = {
    key: suggestionKey,
    memoizedProps: {
      promptId,
      genAISessionID,
    },
    return: null,
  };
  Object.defineProperty(button, "__reactFiber$test", {
    value: {
      key: "button",
      memoizedProps: {},
      return: suggestionFiber,
    },
  });
}

/**
 * Build three scroll chips with independently removable signals for positive and negative prompt fixtures.
 * @param configuration Toggle the first/second React signals and prompt/feedback icons independently; null feedback labels or icon roles omit those attributes.
 * @returns The outer row, its nested wrapper, and all three buttons for focused test mutations.
 */
export function createMetaAiPromptRow({
  includeSignals = true,
  includeSecondSignal = true,
  includePromptIcon = true,
  includeFeedbackIcon = true,
  feedbackAriaLabel = "Feedback",
  feedbackIconRole = "img",
}: {
  includeSignals?: boolean;
  includeSecondSignal?: boolean;
  includePromptIcon?: boolean;
  includeFeedbackIcon?: boolean;
  feedbackAriaLabel?: string | null;
  feedbackIconRole?: string | null;
} = {}) {
  const outer = document.createElement("div");
  const inner = document.createElement("div");
  const strip = document.createElement("div");
  const buttons = [];

  outer.appendChild(inner);
  inner.appendChild(strip);

  for (let index = 0; index < 3; index += 1) {
    const chip = document.createElement("div");
    chip.setAttribute("data-type", "hscroll-child");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    if (index === 0) {
      if (includePromptIcon) {
        const icon = document.createElement("i");
        icon.setAttribute("role", "img");
        button.appendChild(icon);
      }
      button.append("Prompt 1");
    } else if (index === 1) {
      button.textContent = "Prompt 2";
    } else {
      if (feedbackAriaLabel !== null) {
        button.setAttribute("aria-label", feedbackAriaLabel);
      }
      if (includeFeedbackIcon) {
        const icon = document.createElement("i");
        if (feedbackIconRole) {
          icon.setAttribute("role", feedbackIconRole);
        }
        button.appendChild(icon);
      }
    }
    chip.appendChild(button);
    strip.appendChild(chip);
    buttons.push(button);

    if (index < 2 && includeSignals && (includeSecondSignal || index === 0)) {
      attachSuggestionFiber(button, {
        promptId: `prompt-${index + 1}`,
        genAISessionID: "session-1",
        suggestionKey: `suggestion-${index}`,
      });
    }
  }

  return { outer, inner, buttons };
}

/** Wrap a prompt row in a realistic feed post so root-boundary checks are exercised. */
export function createPostWithRow(row: Element) {
  const post = document.createElement("div");
  post.setAttribute("aria-posinset", "1");
  const pageLink = document.createElement("a");
  pageLink.href = "/DemocraticSocialismNow";
  pageLink.textContent = "Democratic Socialism Now";
  post.append(pageLink, row);
  return post;
}

/**
 * Create a news-only fixture with its classifiers and presentation cleanup disabled unless a test overrides them; unrelated feed options retain hydration defaults.
 * @param configuration Overlay selected option values and translated labels on the disabled-news-filter fixture; blocked-text arrays retain their empty hydrated defaults.
 * @returns A fully hydrated typed context with unrelated news filters disabled for deterministic fixtures.
 */
export function createNewsContext({
  options = {},
  keyWords = {},
}: { options?: Partial<HydratedOptions>; keyWords?: Partial<Keywords> } = {}): FeedContext {
  const hydrated = hydrateOptions();
  const context: FeedContext = {
    state: {
      ...createFeedState(),
      ...createDomState(),
      options: hydrated.options,
      language: "en",
      iconNewWindow: "",
      iconNewWindowClass: "cmf-link-new",
      isChromium: false,
      forceProcess: false,
      isNF: true,
      noChangeCounter: 0,
      lastNewsPostSweepAt: 0,
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      showAtt: "show",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
      cssHideVerifiedBadge: "hideBadge",
      hideAnInfoBox: false,
    },
    options: {
      ...hydrated.options,
      VERBOSITY_LEVEL: "0",
      VERBOSITY_DEBUG: false,
      NF_META_AI_PROMPTS: false,
      NF_TABLIST_STORIES_REELS_ROOMS: false,
      NF_SURVEY: false,
      NF_TOP_CARDS_PAGES: false,
      NF_HIDE_VERIFIED_BADGE: false,
      NF_AI_SIDE_PANELS: false,
      NF_SPONSORED: false,
      NF_SUGGESTIONS: false,
      NF_REELS_SHORT_VIDEOS: false,
      NF_SHORT_REEL_VIDEO: false,
      NF_META_AI: false,
      NF_AI_INFO_POSTS: false,
      NF_PAID_PARTNERSHIP: false,
      NF_PEOPLE_YOU_MAY_KNOW: false,
      NF_FOLLOW: false,
      NF_PARTICIPATE: false,
      NF_SPONSORED_PAID: false,
      NF_EVENTS_YOU_MAY_LIKE: false,
      NF_FILTER_VERIFIED_BADGE: false,
      NF_STORIES: false,
      NF_ANIMATED_GIFS_POSTS: false,
      NF_BLOCKED_ENABLED: false,
      NF_LIKES_MAXIMUM: false,
      NF_LIKES_MAXIMUM_COUNT: "",
      NF_ANIMATED_GIFS_PAUSE: false,
      NF_SHARES: false,
      ...options,
    },
    filters: hydrated.filters,
    keyWords: { ...hydrated.keyWords, ...keyWords },
    pathInfo,
  };

  context.state.options = context.options;
  return context;
}

/** Create an unclassified post with a label proxy that can receive late sponsorship evidence. */
export function createSponsoredPost({ labelId = "sponsored-label" } = {}) {
  const post = document.createElement("div");
  post.setAttribute("aria-posinset", "1");

  const pageLink = document.createElement("a");
  pageLink.href = "/DemocraticSocialismNow";
  pageLink.textContent = "Democratic Socialism Now";

  const labelProxy = document.createElement("span");
  labelProxy.setAttribute("aria-labelledby", labelId);

  post.append(pageLink, labelProxy);
  return post;
}

/** Add a tracking URL of a controlled length to test bounded sponsorship detection. */
export function appendSponsoredLinkSignature(post: Element, hrefLength = 320) {
  const wrapper = document.createElement("div");
  const span = document.createElement("span");
  const link = document.createElement("a");
  link.href = `/foo?__cft__[0]=${"a".repeat(hrefLength)}`;
  link.textContent = "Sponsored";
  span.appendChild(link);
  wrapper.appendChild(span);
  post.appendChild(wrapper);
}

/**
 * Build adjacent sponsored and birthday sections to guard against overly broad rail hiding.
 * @returns Required feed, sponsored, and birthday roots plus the obsolete-selector comparison string.
 */
export function createRightRailSponsoredFixture() {
  document.body.innerHTML = `
    <div role="navigation"></div>
    <div role="main"></div>
    <div role="complementary">
      <div>
        <div>
          <div>
            <div>
              <div>
                <div id="right-rail-sections">
                  <div id="right-rail-sponsored">
                    <div>
                      <h3>Sponsored\u200b</h3>
                    </div>
                    <div>
                      <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.com%2F%3Futm_campaign%3Dspring%26ad_id%3D123">
                        Example Ad example.com
                      </a>
                      <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fexample.org%2F%3Ffbclid%3Dabc">
                        Second Ad example.org
                      </a>
                    </div>
                    <div></div>
                  </div>
                  <div id="right-rail-birthdays">
                    <div>
                      <h3>Birthdays</h3>
                    </div>
                    <a href="/events/birthdays/">Amr Farid has a birthday today.</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return {
    mainColumn: requireElement(document.querySelector(newsSelectors.mainColumn)),
    sponsoredSection: requireElement(document.getElementById("right-rail-sponsored")),
    birthdaysSection: requireElement(document.getElementById("right-rail-birthdays")),
    oldSponsoredSelector:
      'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion]) > span',
  };
}
