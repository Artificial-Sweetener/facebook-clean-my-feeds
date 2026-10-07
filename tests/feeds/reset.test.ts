// SPDX-License-Identifier: GPL-3.0-only

import {
  mainColumnAtt,
  postAtt,
  postAttCPID,
  postAttTab,
  postAttChildFlag,
} from "../../src/dom/attributes";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { createNewsContext, requireElement } from "./news-fixtures";

describe("feeds/reset", () => {
  test("unwraps captions, clears all feed markers, and renews an active feed's dusting budget", () => {
    const { state } = createNewsContext();
    state.isAF = true;
    document.body.innerHTML = `<main ${mainColumnAtt}="1"><details ${postAtt}="Sponsored"><summary>Hidden</summary><div id="post" ${postAtt}="Sponsored" ${postAttCPID}="a" ${postAttChildFlag}="1" ${state.hideAtt} ${state.showAtt}><h6 ${postAttTab}="0">Hidden</h6><p>Keep this content</p></div></details><aside ${state.hideWithNoCaptionAtt} ${state.cssHideEl} ${state.cssHideNumberOfShares}></aside></main>`;
    const post = requireElement(document.getElementById("post"));

    expect(resetFeedProcessing(state)).toBe(true);
    expect(state.scanCountStart).toBe(100);
    expect(state.scanCountMaxLoop).toBe(115);
    expect(post.parentElement?.tagName).toBe("MAIN");
    expect(post.textContent).toBe("Keep this content");
    for (const attribute of [
      mainColumnAtt,
      postAtt,
      postAttCPID,
      postAttChildFlag,
      postAttTab,
      state.hideAtt,
      state.hideWithNoCaptionAtt,
      state.cssHideEl,
      state.cssHideNumberOfShares,
      state.showAtt,
    ]) {
      expect(document.querySelector(`[${attribute}]`)).toBeNull();
    }
  });

  test("invalidates roots and toggles debug visibility outside active feeds without unwrapping captions", () => {
    const { state } = createNewsContext({ options: { VERBOSITY_DEBUG: true } });
    state.isAF = false;
    document.body.innerHTML = `<main ${mainColumnAtt}="1"><details ${postAtt}="Sponsored"><div ${state.hideAtt}>Keep</div></details></main>`;

    expect(resetFeedProcessing(state)).toBe(false);
    expect(state.scanCountStart).toBe(0);
    expect(document.querySelector(`[${mainColumnAtt}]`)).toBeNull();
    expect(document.querySelector("details")).not.toBeNull();
    expect(document.querySelector(`[${state.showAtt}]`)).not.toBeNull();
  });
});
