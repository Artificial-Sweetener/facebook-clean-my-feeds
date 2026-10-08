// SPDX-License-Identifier: GPL-3.0-only

import { createNewsContext, requireElement } from "../feeds/news-fixtures";
import { startLoop } from "../../src/runtime/loop";
import { processPage } from "../../src/runtime/process-page";

describe("news runtime fallback regressions", () => {
  beforeEach(() => jest.useFakeTimers({ now: 1000 }));
  afterEach(() => jest.useRealTimers());

  test("detects an attribute-only sidebar destination transition", async () => {
    document.body.innerHTML =
      '<div role="navigation"><ul><li id="target"><a href="/ordinary">Assistant</a></li></ul></div><div role="main"><p>Stable main feed</p></div>';
    const context = createNewsContext({ options: { NF_AI_SIDE_PANELS: true } });
    const state = Object.assign(context.state, { isAF: true, prevURL: window.location.href });
    const stop = startLoop(state, {
      updateRoute: jest.fn(),
      /** Exercise real dispatch and its forceProcess reset rather than calling the feed in isolation. */
      process: () => processPage(context),
    });
    try {
      requireElement(document.querySelector("a")).setAttribute("href", "https://meta.ai/");
      await Promise.resolve();
      jest.advanceTimersByTime(5000);
      expect(requireElement(document.getElementById("target")).hasAttribute(state.hideAtt)).toBe(
        true
      );
    } finally {
      stop();
    }
  });

  test("finds late sidebar entries when MutationObserver is unavailable", () => {
    document.body.innerHTML =
      '<div role="navigation"><ul id="nav"></ul></div><div role="main"><p>Stable main feed</p></div>';
    const context = createNewsContext({ options: { NF_AI_SIDE_PANELS: true } });
    const state = Object.assign(context.state, { isAF: true, prevURL: window.location.href });
    const stop = startLoop(
      state,
      {
        updateRoute: jest.fn(),
        /** Exercise real dispatch and its forceProcess reset rather than calling the feed in isolation. */
        process: () => processPage(context),
      },
      {
        window,
        document,
        /** Drive fallback scheduling with the same fake clock used for the five-second observation. */
        now: () => Date.now(),
        createObserver: undefined,
      }
    );
    try {
      requireElement(document.getElementById("nav")).innerHTML =
        '<li id="target"><a href="https://meta.ai/">Meta AI</a></li>';
      jest.advanceTimersByTime(5000);
      expect(requireElement(document.getElementById("target")).hasAttribute(state.hideAtt)).toBe(
        true
      );
    } finally {
      stop();
    }
  });

  test("cleans a new dialog badge when MutationObserver is unavailable", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><p>Stable main feed</p></div>';
    const context = createNewsContext({ options: { NF_HIDE_VERIFIED_BADGE: true } });
    const state = Object.assign(context.state, { isAF: true, prevURL: window.location.href });
    const stop = startLoop(
      state,
      {
        updateRoute: jest.fn(),
        /** Exercise real dispatch and its forceProcess reset rather than calling the feed in isolation. */
        process: () => processPage(context),
      },
      {
        window,
        document,
        /** Drive fallback scheduling with the same fake clock used for the five-second observation. */
        now: () => Date.now(),
        createObserver: undefined,
      }
    );
    try {
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div role="dialog"><div role="article"><h4><svg id="badge" aria-label="Verified account"></svg></h4></div></div>'
      );
      jest.advanceTimersByTime(5000);
      expect(
        requireElement(document.getElementById("badge")).hasAttribute(state.cssHideVerifiedBadge)
      ).toBe(true);
    } finally {
      stop();
    }
  });
});
