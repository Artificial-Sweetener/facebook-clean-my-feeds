// SPDX-License-Identifier: GPL-3.0-only

import { getFullNumber } from "../../src/core/filters/classifiers/shares-likes";
import { translations } from "../../src/i18n";
import { mopNewsFeed } from "../../src/feeds/news";
import { createNewsContext } from "../feeds/news-fixtures";
import { mountNewsPost } from "./news-contract-fixtures";
import { cleanRouteDocument } from "./routes-fixtures";

afterEach(cleanRouteDocument);

test.each(["ar", "de", "ja", "tr", "vi"])(
  "%s counts use the document language while userscript copy remains English",
  (locale) => {
    const original = document.documentElement.lang;
    try {
      document.documentElement.lang = locale;
      const label = new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumSignificantDigits: 3,
      }).format(12000);
      const { post } = mountNewsPost(
        `<span role="toolbar"></span><div><div role="button"><span class="count" aria-hidden="true"><span><span class="number">${label}</span></span></span></div></div>`
      );
      const context = createNewsContext({
        options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: "10000" },
      });
      mopNewsFeed(context);
      expect(post.getAttribute("cmfr")).toBe(context.keyWords.NF_LIKES_MAXIMUM);
    } finally {
      document.documentElement.lang = original;
    }
  }
);

test.each(Object.keys(translations))(
  "%s reaction counts expand using Facebook's document locale",
  (locale) => {
    const formatter = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumSignificantDigits: 3,
    });
    for (const count of [1200, 12000, 120000, 1200000, 12000000])
      expect(getFullNumber(formatter.format(count), locale)).toBe(count);
  }
);

test.each([
  ["١٬٢٣٤", 1234],
  ["১২৩৪", 1234],
  ["１２３４", 1234],
  ["१,२३४", 1234],
])("decimal digits in %s remain independent of the selected script language", (count, expected) => {
  expect(getFullNumber(String(count))).toBe(expected);
});
