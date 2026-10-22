// SPDX-License-Identifier: GPL-3.0-only

import { pathInfo } from "../../src/core/rules/feed-rules";
import { scrubInfoBoxes } from "../../src/dom/info-boxes";
import { translations } from "../../src/i18n";
import { cleanRouteDocument, element, nested } from "./routes-fixtures";

const options = {
  OTHER_INFO_BOX_CLIMATE_SCIENCE: true,
  OTHER_INFO_BOX_CORONAVIRUS: true,
  OTHER_INFO_BOX_SUBSCRIBE: true,
  VERBOSITY_DEBUG: false,
};
const state = { cssHideEl: "hide-info", showAtt: "show-info" };

/** Keep each information component independent of its owning post and its ordinary neighbor. */
function mount(href: string, attributes = ""): HTMLElement {
  document.body.innerHTML = `<div role="main"><div id="post" aria-posinset="1"><div id="box" style="color:red">${nested(`<a id="link" ${attributes} href="${href}">معلومات إضافية</a>`, 4)}</div><p id="ordinary">Community news</p></div></div>`;
  return element("post");
}

afterEach(cleanRouteDocument);

test.each(Object.entries(pathInfo))(
  "production string route %s hides only its information component",
  (topic, path) => {
    const post = mount(`${path}123/`);
    scrubInfoBoxes(post, options, translations.en, pathInfo, state);
    expect(element("box").hasAttribute(state.cssHideEl)).toBe(true);
    expect(element("link").getAttribute("cmfr")).toBe(Reflect.get(translations.en, topic));
    expect(post.hasAttribute(state.cssHideEl)).toBe(false);
    expect(element("ordinary").hasAttribute(state.cssHideEl)).toBe(false);
  }
);

test.each([
  "https://example.org/coronavirus_info/123/",
  "https://facebook.com.example.org/coronavirus_info/123/",
  "/help/?next=/coronavirus_info/123/",
  "/coronavirus_info-extra/123/",
])("deceptive or unrelated destinations remain visible: %s", (href) => {
  const post = mount(href);
  scrubInfoBoxes(post, options, translations.en, pathInfo, state);
  expect(element("box").hasAttribute(state.cssHideEl)).toBe(false);
});

test.each(["hidden", 'style="display:none"', 'aria-hidden="true"'])(
  "concealed links cannot identify an information component: %s",
  (attribute) => {
    const post = mount("/support/123/", attribute);
    scrubInfoBoxes(post, options, translations.en, pathInfo, state);
    expect(element("box").hasAttribute(state.cssHideEl)).toBe(false);
  }
);

test.each(["article", "comment"])(
  "nested %s components cannot hide part of the parent post",
  (role) => {
    const post = mount("/support/123/");
    element("box").setAttribute("role", role);
    scrubInfoBoxes(post, options, translations.en, pathInfo, state);
    expect(element("box").hasAttribute(state.cssHideEl)).toBe(false);
  }
);

test("authored message links and shallow links never promote the post or page into a hidden box", () => {
  const post = mount("/coronavirus_info/123/");
  element("box").setAttribute("data-ad-preview", "message");
  scrubInfoBoxes(post, options, translations.en, pathInfo, state);
  expect(element("box").hasAttribute(state.cssHideEl)).toBe(false);
  post.innerHTML = '<a href="/coronavirus_info/123/">An ordinary discussion link</a>';
  scrubInfoBoxes(post, options, translations.en, pathInfo, state);
  expect(document.querySelector(`[${state.cssHideEl}]`)).toBeNull();
});

test("repeated scans are stable and recycling the destination restores the component", () => {
  const post = mount("/support/123/");
  scrubInfoBoxes(post, options, translations.en, pathInfo, state);
  expect(element("box").hasAttribute(state.cssHideEl)).toBe(true);
  const observer = new MutationObserver(() => undefined);
  observer.observe(post, { attributes: true, subtree: true });
  scrubInfoBoxes(post, options, translations.en, pathInfo, state);
  expect(observer.takeRecords()).toHaveLength(0);
  observer.disconnect();
  element("link").setAttribute("href", "/help/community/");
  scrubInfoBoxes(post, options, translations.en, pathInfo, state);
  expect(element("box").hasAttribute(state.cssHideEl)).toBe(false);
  expect(element("link").hasAttribute("cmfr")).toBe(false);
  expect(element("box").getAttribute("style")).toBe("color:red");
});

test("disabling the topic releases its own markers and preserves a native debug marker", () => {
  const post = mount("/support/123/");
  element("box").setAttribute(state.showAtt, "native");
  scrubInfoBoxes(post, { ...options, VERBOSITY_DEBUG: true }, translations.en, pathInfo, state);
  expect(element("box").getAttribute(state.showAtt)).toBe("");
  scrubInfoBoxes(
    post,
    { ...options, OTHER_INFO_BOX_SUBSCRIBE: false },
    translations.en,
    pathInfo,
    state
  );
  expect(element("box").getAttribute(state.showAtt)).toBe("native");
  expect(element("box").hasAttribute(state.cssHideEl)).toBe(false);
});
