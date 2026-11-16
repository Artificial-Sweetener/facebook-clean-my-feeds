// SPDX-License-Identifier: GPL-3.0-only

import { getStructuralSponsoredKind } from "../../src/feeds/shared/sponsored-structure";
import { hasPeopleDiscoveryStructure } from "../../src/feeds/news-people-structure";
import { hasDiscoveryShelf } from "../../src/feeds/discovery-structure";
import { hasVerifiedGeometry } from "../../src/feeds/verified-structure";
import { findMetaAiPromptSuggestionRows } from "../../src/feeds/news-meta-ai";
import { isNewsVerifiedBadge } from "../../src/feeds/news-detectors";
import { scrubVerifiedBadges } from "../../src/feeds/news-features";
import { restoreNewsPresentation } from "../../src/feeds/news-presentation";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { mountNewsPost } from "../validation/news-contract-fixtures";
import { createMetaAiPromptRow, createNewsContext, requireElement } from "./news-fixtures";
import { nonLocalePostCases } from "./non-locale-cases";
import { verifiedGlyph } from "./locale-structure-fixtures";
import { peopleStructure, sponsoredStructure } from "./structural-disclosure-fixtures";

afterEach(() => {
  restoreNewsPresentation();
  releaseDirtyObservers();
  document.body.replaceChildren();
});

test.each(["groups", "events"] as const)(
  "%s discovery does not consume a neighboring independently owned post",
  (kind) => {
    const markup = requireElement(
      nonLocalePostCases.find(
        (item) => item.name === `${kind === "groups" ? "group" : "event"} discovery`
      )
    ).markup;
    const { post } = mountNewsPost(
      `${markup}<div role="article"><video></video><div>Neighbor</div></div>`
    );
    expect(hasDiscoveryShelf(post, kind)).toBe(false);
  }
);

test("people discovery does not consume a neighboring independently owned post", () => {
  const { post } = mountNewsPost(
    `${peopleStructure()}<div role="article"><video></video><div>Neighbor</div></div>`
  );
  expect(hasPeopleDiscoveryStructure(post)).toBe(false);
});

test.each([
  'aria-pressed="false"',
  'aria-expanded="false"',
  'aria-controls="details"',
  'aria-disabled="true"',
])(
  "a stateful header control cannot turn an ordinary ad into a paid-by disclosure: %s",
  (attributes) => {
    const markup = sponsoredStructure("paid").replace(
      'role="button"',
      `role="button" ${attributes}`
    );
    expect(getStructuralSponsoredKind(mountNewsPost(markup).post)).toBeNull();
  }
);

test.each([
  verifiedGlyph.replace("<path ", '<path style="display:none" '),
  verifiedGlyph.replace("<path ", "<defs><path ").replace("</path>", "</path></defs>"),
])("non-rendered SVG geometry does not establish verification", (markup) => {
  const { post } = mountNewsPost(`<h4><a href="/person">Person</a>${markup}</h4>`);
  expect(hasVerifiedGeometry(requireElement(post.querySelector("svg")), post)).toBe(false);
});

test.each(["hidden", 'style="display:none"', 'aria-hidden="true"'])(
  "badge cleanup cannot promote concealed artwork into a verified-post match: %s",
  (attributes) => {
    const { post } = mountNewsPost(
      `<h4><a href="/person">Person</a><span ${attributes}>${verifiedGlyph}</span></h4>`
    );
    const context = createNewsContext();
    expect(isNewsVerifiedBadge(post, context.keyWords)).toBe("");
    scrubVerifiedBadges(context);
    expect(isNewsVerifiedBadge(post, context.keyWords)).toBe("");
  }
);

test.each(['data-commentid="123"', 'data-ad-preview="message"', 'role="comment"'])(
  "ordinary authored chip controls do not become AI prompts: %s",
  (attributes) => {
    const { post } = mountNewsPost(`<div ${attributes}></div>`);
    requireElement(post.querySelector("div")).append(
      createMetaAiPromptRow({ includeSignals: false }).outer
    );
    expect(findMetaAiPromptSuggestionRows(post)).toEqual([]);
  }
);

test("native concealment wins after CMF has already collapsed a visible badge", () => {
  const { post } = mountNewsPost(
    `<h4><a href="/person">Person</a><span>${verifiedGlyph}</span></h4>`
  );
  const context = createNewsContext();
  scrubVerifiedBadges(context);
  expect(isNewsVerifiedBadge(post, context.keyWords)).toBe(
    context.keyWords.NF_FILTER_VERIFIED_BADGE
  );
  requireElement(post.querySelector("span")).setAttribute("hidden", "");
  expect(isNewsVerifiedBadge(post, context.keyWords)).toBe("");
});
