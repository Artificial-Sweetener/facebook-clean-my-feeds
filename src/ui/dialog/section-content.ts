// SPDX-License-Identifier: GPL-3.0-only

import type { Keywords, TranslationRegistry, TranslationKey } from "../../i18n";
import type { SectionState } from "./types";
import { readValue } from "./value-helpers";

/** A localized placeholder token replaced with a fixed, trusted navigation link. */
interface TextLink {
  token: string;
  href: string;
  label: string;
}

/**
 * Prefer nonempty localized strings and fall back to English while excluding array-valued catalog entries.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param translations Complete supported locale registry used for fallback and language choices.
 * @param key Catalog key requested for a string-valued label.
 * @returns The localized nonempty string, its English fallback, or an empty string.
 */
export function getKeyword(
  keyWords: Keywords,
  translations: TranslationRegistry,
  key: TranslationKey
): string {
  const value = readValue(keyWords, key);
  if (typeof value === "string" && value.trim() !== "") return value;
  const fallback = readValue(translations.en, key);
  return typeof fallback === "string" ? fallback : "";
}

/**
 * Replace trusted localization tokens with safe external anchors using text nodes rather than parsing HTML.
 * @param container Element receiving safe text nodes and anchors.
 * @param template Localized text containing trusted link placeholders.
 * @param links Fixed placeholder tokens and verified link destinations.
 */
export function appendTextWithLinks(container: HTMLElement, template: string, links: TextLink[]) {
  if (!container || !template) {
    return;
  }
  let remaining = template;
  while (remaining.length > 0) {
    let nextToken: TextLink | null = null;
    let nextIndex = -1;
    for (const link of links) {
      const idx = remaining.indexOf(link.token);
      if (idx !== -1 && (nextIndex === -1 || idx < nextIndex)) {
        nextIndex = idx;
        nextToken = link;
      }
    }
    if (!nextToken) {
      container.appendChild(document.createTextNode(remaining));
      break;
    }
    if (nextIndex > 0) {
      container.appendChild(document.createTextNode(remaining.slice(0, nextIndex)));
    }
    const anchor = document.createElement("a");
    anchor.href = nextToken.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = nextToken.label;
    container.appendChild(anchor);
    remaining = remaining.slice(nextIndex + nextToken.token.length);
  }
}

/**
 * Build the icon/title/subtitle header used by both section search and expansion styling.
 * @param state Shared presentation state retained by mounted listeners.
 * @param title Primary localized section title.
 * @param subtitle Optional localized explanatory subtitle.
 * @param iconHTML Trusted section icon markup, with the default legend icon as fallback.
 * @returns The section legend containing decorative icon and localized text.
 */
export function createLegend(state: SectionState, title: string, subtitle: string, iconHTML = "") {
  const legend = document.createElement("legend");
  legend.classList.add("cmf-legend");
  if (title) {
    legend.dataset.cmfTitle = title;
  }
  if (subtitle) {
    legend.dataset.cmfSubtitle = subtitle;
  }

  const iconWrap = document.createElement("span");
  iconWrap.className = "cmf-legend-icon";
  iconWrap.innerHTML = iconHTML || state.iconLegendHTML;

  const textWrap = document.createElement("span");
  textWrap.className = "cmf-legend-text";
  const titleWrap = document.createElement("span");
  titleWrap.className = "cmf-legend-title";
  titleWrap.textContent = title || "";
  textWrap.appendChild(titleWrap);
  if (subtitle) {
    const subtitleWrap = document.createElement("span");
    subtitleWrap.className = "cmf-legend-subtext";
    subtitleWrap.textContent = subtitle;
    textWrap.appendChild(subtitleWrap);
  }

  legend.appendChild(iconWrap);
  legend.appendChild(textWrap);
  return legend;
}

/**
 * Assemble localized maintainer and support paragraphs with trusted project links and optional locale-only copy.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param translations Complete supported locale registry used for fallback and language choices.
 * @returns The assembled tips container containing only text and trusted links.
 */
export function createTipsContent(keyWords: Keywords, translations: TranslationRegistry) {
  const wrap = document.createElement("div");
  wrap.className = "cmf-tips-content";

  const maintainerText = getKeyword(keyWords, translations, "DLG_TIPS_MAINTAINER");
  if (maintainerText) {
    const p = document.createElement("p");
    p.textContent = maintainerText;
    wrap.appendChild(p);
  }

  const linkLabels = {
    github: getKeyword(keyWords, translations, "DLG_TIPS_LINK_REPO"),
    facebook: getKeyword(keyWords, translations, "DLG_TIPS_LINK_FACEBOOK"),
    site: getKeyword(keyWords, translations, "DLG_TIPS_LINK_SITE"),
    threads: getKeyword(keyWords, translations, "DLG_TIPS_LINK_THREADS"),
  };
  const linkMap = [
    {
      token: "{github}",
      label: linkLabels.github || "GitHub",
      href: "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds",
    },
    {
      token: "{facebook}",
      label: linkLabels.facebook || "Facebook",
      href: "https://www.facebook.com/artificialsweetenerai",
    },
    {
      token: "{site}",
      label: linkLabels.site || "website",
      href: "https://artificialsweetener.ai",
    },
    {
      token: "{threads}",
      label: linkLabels.threads || "Bobbin Threads Filter",
      href: "https://github.com/Artificial-Sweetener/bobbin-threads-filter",
    },
  ];

  const starText = getKeyword(keyWords, translations, "DLG_TIPS_STAR");
  if (starText) {
    const p = document.createElement("p");
    appendTextWithLinks(p, starText, linkMap);
    wrap.appendChild(p);
  }

  const threadsText = getKeyword(keyWords, translations, "DLG_TIPS_THREADS");
  if (threadsText) {
    const p = document.createElement("p");
    appendTextWithLinks(p, threadsText, linkMap);
    wrap.appendChild(p);
  }

  const facebookText = getKeyword(keyWords, translations, "DLG_TIPS_FACEBOOK");
  if (facebookText) {
    const p = document.createElement("p");
    appendTextWithLinks(p, facebookText, linkMap);
    wrap.appendChild(p);
  }

  const siteText = getKeyword(keyWords, translations, "DLG_TIPS_SITE");
  if (siteText) {
    const p = document.createElement("p");
    appendTextWithLinks(p, siteText, linkMap);
    wrap.appendChild(p);
  }

  const creditsText = getKeyword(keyWords, translations, "DLG_TIPS_CREDITS");
  if (creditsText) {
    const p = document.createElement("p");
    appendTextWithLinks(p, creditsText, [
      {
        token: "{zbluebugz}",
        label: "zbluebugz",
        href: "https://github.com/zbluebugz",
      },
      {
        token: "{trinhquocviet}",
        label: "trinhquocviet",
        href: "https://github.com/trinhquocviet",
      },
    ]);
    wrap.appendChild(p);
  }

  const thanksText = getKeyword(keyWords, translations, "DLG_TIPS_THANKS");
  if (thanksText) {
    const p = document.createElement("p");
    p.textContent = thanksText;
    wrap.appendChild(p);
  }

  return wrap;
}

/**
 * Move existing section content into one animated body while keeping the legend outside the clipping region.
 * @param fieldset Section whose classes and measured expansion height are synchronized.
 */
export function wrapFieldsetBody(fieldset: HTMLFieldSetElement | null) {
  if (!fieldset) {
    return;
  }
  const existingBody = fieldset.querySelector(".cmf-section-body");
  if (existingBody) {
    return;
  }
  const legend = fieldset.querySelector("legend");
  const body = document.createElement("div");
  body.className = "cmf-section-body";
  const children = Array.from(fieldset.children);
  children.forEach((child) => {
    if (child === legend) {
      return;
    }
    body.appendChild(child);
  });
  fieldset.appendChild(body);
}
