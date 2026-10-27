// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttTab } from "../../src/dom/attributes";
import { hidePost, toggleHiddenElements } from "../../src/dom/hide";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { translations } from "../../src/i18n";
import { control, createSettingsFixture } from "./settings-fixtures";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));

afterEach(() => document.body.replaceChildren());

describe("settings verbosity and locale caption side effects", () => {
  test.each(["0", "1", "2"].flatMap((level) => [false, true].map((debug) => ({ level, debug }))))(
    "verbosity $level with debug $debug creates reversible DOM presentation",
    ({ level, debug }) => {
      const { state, context } = createSettingsFixture({
        VERBOSITY_LEVEL: level,
        VERBOSITY_DEBUG: debug,
      });
      document.body.innerHTML = '<main><div id="post"><p>Original content</p></div></main>';
      const post = control("#post");
      hidePost(post, "Fixture match", "marker", {
        ...context,
        attributes: { postAtt, postAttTab },
      });
      expect(post.getAttribute(postAtt)).toBe("Fixture match");
      expect(post.hasAttribute(state.showAtt)).toBe(debug);
      if (level === "0") {
        expect(post.hasAttribute(state.hideAtt)).toBe(true);
        expect(document.querySelector("details")).toBeNull();
        expect(post.querySelector(`[${postAttTab}]`) !== null).toBe(debug);
      } else {
        const wrapper = control<HTMLDetailsElement>(`details[${postAtt}]`);
        expect(wrapper.open).toBe(debug);
        expect(wrapper.contains(post)).toBe(true);
        expect(control("summary").textContent).toContain("Fixture match");
      }
      state.isAF = true;
      state.options.VERBOSITY_DEBUG = false;
      resetFeedProcessing(state);
      expect(document.querySelector("details")).toBeNull();
      expect(post.textContent).toBe("Original content");
      expect(post.hasAttribute(postAtt)).toBe(false);
      expect(post.hasAttribute(state.hideAtt)).toBe(false);
      expect(post.hasAttribute(state.showAtt)).toBe(false);
    }
  );

  test.each(Object.entries(translations))(
    "caption text uses selected locale %s",
    (language, catalog) => {
      const { state, context } = createSettingsFixture({
        CMF_DIALOG_LANGUAGE: language,
        VERBOSITY_LEVEL: "1",
      });
      document.body.innerHTML = '<main><div id="post">Original content</div></main>';
      const post = control("#post");
      hidePost(post, "Fixture match", "marker", {
        ...context,
        attributes: { postAtt, postAttTab },
      });
      expect(control("summary").textContent).toBe(`${catalog.VERBOSITY_MESSAGE[1]}Fixture match`);
      expect(post.hasAttribute(state.showAtt)).toBe(false);
    }
  );

  test("debug mode affects only owned filtering markers and remains reversible across repeated toggles", () => {
    const { state } = createSettingsFixture();
    document.body.innerHTML = `<main><div id="unrelated">Visible post</div><div ${state.hideAtt}>Hidden post</div><div ${state.hideWithNoCaptionAtt}>Hidden row</div><div ${state.cssHideEl}>Hidden box</div><div ${state.cssHideNumberOfShares}>Hidden count</div></main>`;
    for (let iteration = 0; iteration < 8; iteration += 1) {
      const debug = iteration % 2 === 0;
      toggleHiddenElements(state, { VERBOSITY_DEBUG: debug });
      expect(document.querySelectorAll(`[${state.showAtt}]`)).toHaveLength(debug ? 4 : 0);
      expect(control("#unrelated").hasAttribute(state.showAtt)).toBe(false);
      expect(control("#unrelated").textContent).toBe("Visible post");
    }
  });
});
