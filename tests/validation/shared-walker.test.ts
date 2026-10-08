// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import {
  countDescendants,
  extractTextContent,
  isNestedMarkedNode,
  mpScanTreeForText,
  scanImagesForAltText,
  scanTreeForText,
} from "../../src/dom/walker";
import { requireShared, sharedImage, sharedPost } from "./shared-fixtures";

describe("validation: shared filtering text extraction", () => {
  test("text traversal covers immediate div/span/blockquote branches, normalizes and deduplicates", () => {
    const root = sharedPost(
      "direct root text<p>unsupported direct paragraph</p><div>ＦＯＯ</div><span>FOO</span><blockquote>Quoted text</blockquote><span>first\nsecond</span><div>A</div><div>Facebook</div>"
    );
    expect(scanTreeForText(root)).toEqual(["FOO", "Quoted text", "first", "second"]);
  });

  test("direct aria flags and title text are excluded without pretending to evaluate CSS visibility", () => {
    const root = sharedPost(
      '<span aria-hidden="true">Hidden direct text</span><div aria-hidden="false">Legacy excluded branch</div><span><svg><title>Icon title</title></svg>Body text</span>'
    );
    expect(scanTreeForText(root)).toEqual(["Body text"]);
  });

  test("button-noise rules retain object controls and single-span text but reject multi-container controls", () => {
    const root = sharedPost(
      '<div role="button">Direct button</div><div><object><div role="button">Object caption</div></object></div><div role="button"><span>Single span</span></div><div role="button"><span>First noise</span><span>Second noise</span></div>'
    );
    expect(scanTreeForText(root)).toEqual(["Object caption", "Single span"]);
  });

  test("a root marker does not suppress its own text while a descendant marker does", () => {
    const root = sharedPost(
      `<div>Retained text</div><div ${postAtt}="nested"><span>Nested hidden text</span></div><div><span ${postAtt}="deep">Deep hidden text</span></div>`
    );
    root.setAttribute(postAtt, "root classification");
    const retained = requireShared(root.firstElementChild);
    const nested = requireShared(root.querySelector("span"));
    expect(isNestedMarkedNode(retained, root)).toBe(false);
    expect(isNestedMarkedNode(nested, root)).toBe(true);
    expect(isNestedMarkedNode(null, root)).toBe(false);
    expect(isNestedMarkedNode(undefined, root)).toBe(false);
    expect(isNestedMarkedNode(nested, null)).toBe(false);
    expect(scanTreeForText(root)).toEqual(["Retained text"]);
  });

  test("descendant counting concerns div/span structure rather than arbitrary HTML descendants", () => {
    const root = sharedPost(
      "<div><span><strong>Text</strong></span></div><p><a>Link</a></p><button>Control</button>"
    );
    expect(countDescendants(root)).toBe(2);
  });

  test("image alt extraction normalizes, deduplicates, keeps case, and rejects nested hidden icons", () => {
    const root = sharedPost();
    root.append(
      sharedImage("ＦＯＯ", 33),
      sharedImage("FOO", 100),
      sharedImage("foo", 100),
      sharedImage("", 100),
      sharedImage("tiny", 32)
    );
    const hidden = sharedPost();
    hidden.setAttribute(postAtt, "hidden child");
    hidden.append(sharedImage("Hidden image text", 100));
    root.append(hidden);
    expect(scanImagesForAltText(root)).toEqual(["FOO", "foo"]);
  });

  test("bounded extraction skips empty structures and marked blocks without expanding its block budget", () => {
    const root = sharedPost(
      `<div class="block">Bare text<img alt="bare image"></div><div class="block" ${postAtt}="nested"><span>Hidden</span></div><div class="block"><span>Third block</span></div>`
    );
    Object.defineProperty(requireShared(root.querySelector("img")), "naturalWidth", { value: 100 });
    expect(extractTextContent(root, ".block", 2)).toEqual([]);
    expect(extractTextContent(root, ".block", 3)).toEqual(["Third block"]);
    expect(extractTextContent(root, ".block", 0)).toEqual([]);
    expect(extractTextContent(root, ".missing", 3)).toEqual([]);
  });

  test("Marketplace traverses direct text, retains duplicates, and excludes short/Facebook nodes", () => {
    const root = sharedPost(
      'Direct ROOT<span>ＦＯＯ</span><span>foo</span><span>facebook</span><span>X</span><span>\u200fשלום</span><img alt="not traversed">'
    );
    expect(mpScanTreeForText(root)).toEqual(["direct root", "foo", "foo", "\u200fשלום"]);
  });
});
