// SPDX-License-Identifier: GPL-3.0-only

import { pathInfo } from "../../src/core/rules/feed-rules";
import { postAtt } from "../../src/dom/attributes";
import { scrubInfoBoxes } from "../../src/dom/info-boxes";
import { translations } from "../../src/i18n";
import { sharedPost } from "./shared-fixtures";

const topics = [
  "OTHER_INFO_BOX_CLIMATE_SCIENCE",
  "OTHER_INFO_BOX_CORONAVIRUS",
  "OTHER_INFO_BOX_SUBSCRIBE",
] as const;
const legacyPaths = {
  OTHER_INFO_BOX_CLIMATE_SCIENCE: { pathMatch: pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE },
  OTHER_INFO_BOX_CORONAVIRUS: { pathMatch: pathInfo.OTHER_INFO_BOX_CORONAVIRUS },
  OTHER_INFO_BOX_SUBSCRIBE: { pathMatch: pathInfo.OTHER_INFO_BOX_SUBSCRIBE },
};
const visibility = { cssHideEl: "hide-info", showAtt: "show-info" };
const enabled = {
  OTHER_INFO_BOX_CLIMATE_SCIENCE: true,
  OTHER_INFO_BOX_CORONAVIRUS: true,
  OTHER_INFO_BOX_SUBSCRIBE: true,
};

/** Build a box whose matched anchor has exactly five ancestor steps to the intended hidden root. */
function infoBox(path: string) {
  const box = sharedPost();
  let parent = box;
  for (let index = 0; index < 4; index += 1) {
    const child = sharedPost();
    parent.append(child);
    parent = child;
  }
  const link = document.createElement("a");
  link.href = `${path}fixture`;
  link.textContent = "More information";
  parent.append(link);
  return { box, link };
}

describe("validation: shared informational boxes", () => {
  test.each(Object.entries(translations))(
    "legacy object descriptors preserve all three %s reasons",
    (_locale, keywords) => {
      for (const topic of topics) {
        const post = sharedPost();
        const { box, link } = infoBox(pathInfo[topic]);
        post.append(box);
        scrubInfoBoxes(post, enabled, keywords, legacyPaths, visibility);
        expect(box.hasAttribute(visibility.cssHideEl)).toBe(true);
        expect(link.getAttribute(postAtt)).toBe(keywords[topic]);
        expect(post.hasAttribute(visibility.cssHideEl)).toBe(false);
        expect(box.hasAttribute(visibility.showAtt)).toBe(false);
      }
    }
  );

  test("legacy object descriptors process one box per call in climate, coronavirus, subscribe order", () => {
    const post = sharedPost();
    const fixtures = topics.map((topic) => infoBox(pathInfo[topic]));
    post.append(...fixtures.map(({ box }) => box).reverse());
    for (let iteration = 0; iteration < topics.length; iteration += 1) {
      scrubInfoBoxes(post, enabled, translations.en, legacyPaths, visibility);
      fixtures.forEach(({ box }, index) => {
        expect(box.hasAttribute(visibility.cssHideEl)).toBe(index <= iteration);
      });
    }
    const before = post.outerHTML;
    scrubInfoBoxes(post, enabled, translations.en, legacyPaths, visibility);
    expect(post.outerHTML).toBe(before);
  });

  test.each(topics)("disabled topic %s cannot hide its matching informational link", (topic) => {
    const post = sharedPost();
    const { box, link } = infoBox(pathInfo[topic]);
    post.append(box);
    scrubInfoBoxes(post, { ...enabled, [topic]: false }, translations.en, legacyPaths, visibility);
    expect(box.hasAttribute(visibility.cssHideEl)).toBe(false);
    expect(link.hasAttribute(postAtt)).toBe(false);
  });

  test("debug visibility affects the selected box without marking the surrounding post", () => {
    const post = sharedPost();
    const { box } = infoBox(pathInfo.OTHER_INFO_BOX_CORONAVIRUS);
    post.append(box);
    scrubInfoBoxes(
      post,
      { ...enabled, VERBOSITY_DEBUG: true },
      translations.en,
      legacyPaths,
      visibility
    );
    expect(box.hasAttribute(visibility.showAtt)).toBe(true);
    expect(post.hasAttribute(visibility.showAtt)).toBe(false);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("production string descriptors retain the documented no-op compatibility behavior", () => {
    const post = sharedPost();
    post.append(...topics.map((topic) => infoBox(pathInfo[topic]).box));
    const before = post.outerHTML;
    scrubInfoBoxes(post, enabled, translations.en, pathInfo, visibility);
    expect(post.outerHTML).toBe(before);
  });

  test("null roots, absent descriptors, unrelated links, and marked links remain unchanged", () => {
    scrubInfoBoxes(null, enabled, translations.en, legacyPaths, visibility);
    for (const path of ["/ordinary/", pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE]) {
      const post = sharedPost();
      const { box, link } = infoBox(path);
      if (path !== "/ordinary/") link.setAttribute(postAtt, "already processed");
      post.append(box);
      const before = post.outerHTML;
      scrubInfoBoxes(post, enabled, translations.en, legacyPaths, visibility);
      scrubInfoBoxes(post, enabled, translations.en, {}, visibility);
      expect(post.outerHTML).toBe(before);
    }
  });
});
