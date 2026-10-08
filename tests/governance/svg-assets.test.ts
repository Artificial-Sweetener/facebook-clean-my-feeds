/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import { validateSvg } from "../../tools/svg-assets";

const open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">';

/** Surround one reviewed or deliberately invalid shape with the required standalone SVG root. */
function artwork(shape: string): string {
  return `${open}${shape}</svg>`;
}

describe("static SVG build boundary", () => {
  test("preserves hand-authored paths and transparent cutouts exactly", () => {
    const markup = artwork('<path fill-rule="evenodd" d="M2 2h60v60H2z M8 8v48h48V8z"/>');
    expect(validateSvg(`\n${markup}\n`, "handmade.svg")).toBe(markup);
  });

  test.each([
    "<script>alert(1)</script>",
    '<image href="data:image/png;base64,AA=="/>',
    "<foreignObject><div>foreign markup</div></foreignObject>",
    '<use href="#another-icon"/>',
    "<style>body { display:none }</style>",
    '<animate attributeName="fill"/>',
    '<a href="https://example.test"><path d="M0 0"/></a>',
    '<path onload="alert(1)" d="M0 0"/>',
    '<path id="global-collision" d="M0 0"/>',
    '<path style="fill:red" d="M0 0"/>',
    '<path fill="url(https://example.test/paint)" d="M0 0"/>',
    '<path xmlns="http://www.w3.org/1999/xhtml"/>',
    '<svg viewBox="0 0 64 64"/>',
    "unowned text",
  ])("rejects active, external or document-scoped markup: %s", (shape) => {
    expect(() => validateSvg(artwork(shape), "unsafe.svg")).toThrow();
  });

  test.each([
    '<?xml version="1.0"?>',
    '<!DOCTYPE svg [<!ENTITY payload "unsafe">]>',
    "<!-- A comment is outside the deliberately narrow static grammar -->",
  ])("rejects processing instructions and extra XML syntax", (prefix) => {
    expect(() => validateSvg(prefix + artwork(""), "unsafe.svg")).toThrow();
  });

  test("rejects malformed XML, changed source canvases and entity expansions", () => {
    expect(() => validateSvg(artwork('<path d="M0 0">'), "broken.svg")).toThrow();
    expect(() => validateSvg(artwork("").replace("0 0 64 64", "0 0 32 32"), "small.svg")).toThrow();
    expect(() => validateSvg(artwork("&amp;"), "entity.svg")).toThrow();
  });
});
