// SPDX-License-Identifier: GPL-3.0-only

import { findMetaAiPromptSuggestionRows } from "../../src/feeds/news-meta-ai";
import { getSidePanelAiTargets } from "../../src/feeds/news-features";
import { findStructuralRailAdSection } from "../../src/feeds/news-rail-structure";
import { getRightRailFriendRequestPanels } from "../../src/feeds/news-friend-requests";
import { scrubInfoBoxes } from "../../src/dom/info-boxes";
import { pathInfo } from "../../src/core/rules/feed-rules";
import { translations } from "../../src/i18n";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { createMetaAiPromptRow, requireElement } from "./news-fixtures";

afterEach(() => {
  releaseDirtyObservers();
  document.body.replaceChildren();
});

test.each(["icon", "caption", "button", "row"] as const)(
  "concealed %s cannot supply AI prompt evidence",
  (part) => {
    const { outer, buttons } = createMetaAiPromptRow({ includeSignals: false });
    document.body.append(outer);
    const first = requireElement(buttons[0]);
    if (part === "icon") requireElement(first.querySelector("i")).setAttribute("hidden", "");
    if (part === "caption") first.innerHTML = "<i></i><span hidden>Prompt</span>";
    if (part === "button") requireElement(buttons[1]).setAttribute("hidden", "");
    if (part === "row") outer.setAttribute("hidden", "");
    expect(findMetaAiPromptSuggestionRows(document.body)).toEqual([]);
  }
);

test("two hidden React prompt controls cannot confirm a row", () => {
  const { outer, buttons } = createMetaAiPromptRow();
  document.body.append(outer);
  requireElement(buttons[0]).setAttribute("hidden", "");
  requireElement(buttons[1]).setAttribute("hidden", "");
  expect(findMetaAiPromptSuggestionRows(document.body)).toEqual([]);
});

test("one chip with three controls is not three independent prompt chips", () => {
  const { outer, buttons } = createMetaAiPromptRow({ includeSignals: false });
  document.body.append(outer);
  requireElement(buttons[0]?.parentElement).append(
    requireElement(buttons[1]),
    requireElement(buttons[2])
  );
  expect(findMetaAiPromptSuggestionRows(document.body)).toEqual([]);
});

test.each(['data-commentid="1"', 'data-ad-preview="message"', "hidden"])(
  "sidebar AI links inside %s do not identify navigation entries",
  (attributes) => {
    document.body.innerHTML = `<div role="navigation"><li><div ${attributes}><a href="https://meta.ai/">Unknown</a></div></li></div>`;
    expect(getSidePanelAiTargets()).toEqual([]);
  }
);

test("sidebar AI links cannot claim a list item outside their navigation surface", () => {
  document.body.innerHTML =
    '<li id="outside"><div role="navigation"><a id="ai" href="https://meta.ai/">Unknown</a></div><div>Other content</div></li>';
  expect(getSidePanelAiTargets()).toEqual([document.getElementById("ai")]);
});

test("sidebar AI links cannot hide neighboring destinations in the same list item", () => {
  document.body.innerHTML =
    '<div role="navigation"><li><a id="ai" href="https://meta.ai/">Unknown</a><a href="/friends/">Other destination</a></li></div>';
  expect(getSidePanelAiTargets()).toEqual([document.getElementById("ai")]);
});

test.each(["<article><video></video></article>", '<div role="article"><video></video></div>'])(
  "rail ads cannot absorb an adjacent independent post: %s",
  (neighbor) => {
    document.body.innerHTML = `<div role="complementary"><section><h3>Unknown</h3><a attributionsrc href="https://l.facebook.com/l.php?u=destination"><img></a>${neighbor}</section></div>`;
    expect(
      findStructuralRailAdSection(
        requireElement(document.querySelector('[role="complementary"]')),
        requireElement(document.querySelector("h3"))
      )
    ).toBeNull();
  }
);

test("one request action with a nested button role does not establish paired actions", () => {
  document.body.innerHTML =
    '<div role="complementary"><section><div><h3><a href="/friends/">Unknown</a></h3></div><div><a href="/friends/requests/?profile_id=123"><img></a><div role="button"><span role="button">Unknown</span></div></div></section></div>';
  expect(getRightRailFriendRequestPanels()).toEqual([]);
});

test.each(["<p>Ordinary caption</p>", '<div data-ad-preview="message">Ordinary body</div>'])(
  "information-box ancestry cannot absorb authored content beside its link: %s",
  (neighbor) => {
    document.body.innerHTML = `<div aria-posinset="1"><div id="target">${neighbor}${"<div>".repeat(4)}<a href="${pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE}fixture">Unknown</a>${"</div>".repeat(4)}</div></div>`;
    scrubInfoBoxes(
      requireElement(document.querySelector("[aria-posinset]")),
      { OTHER_INFO_BOX_CLIMATE_SCIENCE: true },
      translations.en,
      pathInfo,
      { cssHideEl: "hidden-info", showAtt: "show-info" }
    );
    expect(document.getElementById("target")?.hasAttribute("hidden-info")).toBe(false);
  }
);
