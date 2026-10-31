// SPDX-License-Identifier: GPL-3.0-only

import { requireElement } from "./news-fixtures";

/**
 * Reproduce the two issue reports' unnamed header SVG and eight fragment-reference hops.
 * Text was redacted in those reports, so supplied labels are explicit test hypotheses, not recovered user copy.
 * @param label Synthetic SVG text; callers control public, private and timestamp variants independently.
 * @param hops Number of referenced definition wrappers, including the terminal text element.
 * @returns Concrete post root in a real News main column, with definitions outside every post.
 */
export function mountSvgDisclosure(label = "Sponsored", hops = 8): HTMLElement {
  const definitions = Array.from({ length: hops }, (_, index) =>
    index === hops - 1
      ? `<text id="glyph-${index}" y="12">${label}</text>`
      : `<svg id="glyph-${index}"><use xlink:href="#glyph-${index + 1}"></use></svg>`
  ).join("");
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div id="post" aria-posinset="1"><div data-virtualized="false"><div id="header"><div data-ad-rendering-role="profile_name"><a href="/publisher">Example Publisher</a></div><div><span><a id="disclosure" role="link" href="/?__cft__[0]=${"x".repeat(200)}"><span><svg id="instance"><use xlink:href="#glyph-0"></use></svg></span></a></span></div></div><div id="message" data-ad-rendering-role="story_message">Private authored post</div></div></div><div id="ordinary" aria-posinset="2"><h4>Ordinary publisher</h4><p>Community news</p></div></div><svg id="definitions" style="position:absolute;top:-100000px" aria-hidden="true">${definitions}</svg>`;
  return requireElement(document.getElementById("post"));
}
