// SPDX-License-Identifier: GPL-3.0-only

import { JSDOM } from "jsdom";
import { runFeedProfile } from "./feed-scenarios";

/** Install an isolated synthetic page, never a live Facebook session, for reproducible work counts. */
async function profile(): Promise<void> {
  const dom = new JSDOM('<div role="navigation"></div><div role="main"></div>', {
    url: "https://www.facebook.com/",
  });
  const browser = dom.window;
  for (const name of [
    "window",
    "document",
    "Element",
    "HTMLElement",
    "SVGElement",
    "Node",
    "NodeFilter",
    "MutationObserver",
  ]) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: name === "window" ? browser : Reflect.get(browser, name),
    });
  }
  try {
    const scenarios = await runFeedProfile();
    console.log(
      JSON.stringify(
        {
          node: process.version,
          environment: "jsdom; timing is not browser long-task telemetry",
          posts: 80,
          scenarios,
        },
        null,
        2
      )
    );
  } finally {
    browser.close();
  }
}

void profile().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
