// SPDX-License-Identifier: GPL-3.0-only

import * as labels from "../../src/core/filters/labels";
import * as disclosures from "../../src/core/filters/disclosure-labels";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { mountNewsPost } from "../validation/news-contract-fixtures";
import { nonLocalePostCases, nonLocaleDetectors, nonLocaleBoundaries } from "./non-locale-cases";

beforeEach(() => {
  jest.spyOn(labels, "matchesNewsLabel").mockReturnValue(false);
  jest.spyOn(labels, "matchesNewsPaidBy").mockReturnValue(false);
  jest.spyOn(labels, "matchesPaidByDisclosure").mockReturnValue(false);
  jest.spyOn(disclosures, "matchesDisclosureLabel").mockReturnValue(false);
  jest.spyOn(disclosures, "matchesSponsoredLabel").mockReturnValue(false);
  jest.spyOn(disclosures, "containsMetaAiCopy").mockReturnValue(false);
});

afterEach(() => {
  jest.restoreAllMocks();
  releaseDirtyObservers();
  document.body.replaceChildren();
});

describe.each(nonLocalePostCases)("without locale lookup: $name", ({ markup, matches }) => {
  test.each(Object.entries(nonLocaleDetectors))(
    "cross-filter classification: %s",
    (name, detect) => {
      expect(detect(mountNewsPost(markup).post)).toBe(matches.includes(name));
    }
  );
  test.each(Object.entries(nonLocaleBoundaries))(
    "rejects the complete signature inside %s",
    (_name, wrap) => {
      const { post } = mountNewsPost(wrap(markup));
      for (const [name, detect] of Object.entries(nonLocaleDetectors))
        expect({ name, matched: detect(post) }).toEqual({ name, matched: false });
    }
  );
});
