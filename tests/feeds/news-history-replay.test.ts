// SPDX-License-Identifier: GPL-3.0-only

import { startPostHistory, readPostHistory } from "../../src/diagnostics/post-history";
import { buildHistoryFixture } from "../../src/diagnostics/history-fixture";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { postAtt } from "../../src/dom/attributes";
import { mopNewsFeed } from "../../src/feeds/news";
import { createNewsContext, requireElement } from "./news-fixtures";
import { mountSvgDisclosure } from "./svg-disclosure-fixtures";

afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
  jest.restoreAllMocks();
});

test("exported sanitized history replays an SVG ad, nested unload and ordinary replacement through the real filter", () => {
  let time = 0;
  jest.spyOn(performance, "now").mockImplementation(() => time);
  const stop = startPostHistory(document);
  const source = mountSvgDisclosure();
  const loaded = source.innerHTML;
  const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
  mopNewsFeed(context);
  time += 1100;
  source.innerHTML = '<div><div data-virtualized="true"><span></span></div></div>';
  mopNewsFeed(context);
  time += 1100;
  source.innerHTML = loaded;
  mopNewsFeed(context);
  time += 1100;
  source.innerHTML = "<p>Private ordinary replacement</p>";
  mopNewsFeed(context);
  const history = readPostHistory();
  stop();
  const target = history.events.find((event) => event.rule === "NF_SPONSORED")?.post;
  const fixture = buildHistoryFixture(history);
  const steps = fixture.manifest.steps.filter((step) => step.post === target);
  expect(steps.map((step) => step.action)).toEqual(["hide", "defer", "hide", "restore"]);
  expect(steps.every((step) => step.fixtures.length === 1)).toBe(true);
  clearDirtyTracking();
  document.body.innerHTML =
    '<div role="navigation"></div><div role="main"><div aria-posinset="1"></div></div><div id="references"></div>';
  const post = requireElement(document.querySelector("[aria-posinset]"));
  const references = requireElement(document.getElementById("references"));
  const replayContext = createNewsContext({
    options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" },
  });
  let wrapper: Element | null = null;
  for (const [index, step] of steps.entries()) {
    const file = fixture.files.find((file) => file.file === step.fixtures[0]);
    const frame = history.frames.find((frame) => frame.id === step.frame);
    if (!file || !frame) throw new Error("Replay requires the exported frame and its manifest");
    const inert = document.implementation.createHTMLDocument("");
    inert.documentElement.innerHTML = file.html;
    const captured = requireElement(
      inert.querySelector(`[data-cmf-node="${frame.snapshot.target}"]`)
    );
    post.replaceChildren(
      ...Array.from(captured.childNodes).map((node) => document.importNode(node, true))
    );
    references.replaceChildren(
      ...Array.from(inert.querySelectorAll("body > svg")).map((node) =>
        document.importNode(node, true)
      )
    );
    replayContext.state.forceProcess = true;
    mopNewsFeed(replayContext);
    expect(post.hasAttribute(postAtt)).toBe(index < 3);
    if (index === 0) wrapper = post.parentElement;
    if (index < 3) expect(post.parentElement).toBe(wrapper);
    else expect(post.parentElement?.getAttribute("role")).toBe("main");
  }
});
