// SPDX-License-Identifier: GPL-3.0-only

import { startLoop } from "../../src/runtime/loop";
import { processPage } from "../../src/runtime/process-page";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

describe("news layout insertion through the complete mutation lifecycle", () => {
  beforeEach(() => jest.useFakeTimers({ now: 1000 }));
  afterEach(() => jest.useRealTimers());

  test("discovers a late Meta AI sidebar through observer-forced processing", async () => {
    document.body.innerHTML =
      '<div role="navigation"><ul id="nav"></ul></div><div role="main"><p>Ordinary feed</p></div>';
    const context = createNewsContext({ options: { NF_AI_SIDE_PANELS: true } });
    const state = Object.assign(context.state, { isAF: true, prevURL: window.location.href });
    const stop = startLoop(state, {
      updateRoute: jest.fn(),
      /** Exercise real dispatch and its forceProcess reset rather than calling the feed in isolation. */
      process: () => processPage(context),
    });
    try {
      requireElement(document.getElementById("nav")).innerHTML =
        '<li id="late"><a href="https://meta.ai/">Meta AI</a></li>';
      await Promise.resolve();
      jest.advanceTimersByTime(75);
      expect(requireElement(document.getElementById("late")).hasAttribute(state.hideAtt)).toBe(
        true
      );
    } finally {
      stop();
    }
  });

  test("cleans a newly inserted dialog badge through observer-forced processing", async () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><p>Ordinary feed</p></div>';
    const context = createNewsContext({ options: { NF_HIDE_VERIFIED_BADGE: true } });
    const state = Object.assign(context.state, { isAF: true, prevURL: window.location.href });
    const stop = startLoop(state, {
      updateRoute: jest.fn(),
      /** Exercise real dispatch and its forceProcess reset rather than calling the feed in isolation. */
      process: () => processPage(context),
    });
    try {
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div role="dialog"><div role="article"><h4><svg id="badge" aria-label="Verified account"></svg></h4></div></div>'
      );
      await Promise.resolve();
      jest.advanceTimersByTime(75);
      expect(
        requireElement(document.getElementById("badge")).hasAttribute(state.cssHideVerifiedBadge)
      ).toBe(true);
    } finally {
      stop();
    }
  });
});
