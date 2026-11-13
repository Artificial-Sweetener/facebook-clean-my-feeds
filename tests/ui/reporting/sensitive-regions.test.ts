// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { captureTransitionSnapshot } from "../../../src/diagnostics/transition-snapshot";
import { SensitiveRegions } from "../../../src/diagnostics/sensitive-regions";
import { DomCapture } from "../../../src/diagnostics/dom-capture-tree";
import { snapshotLimits } from "../../../src/core/diagnostics/dom-snapshot";
import { SensitiveText } from "../../../src/diagnostics/sensitive-text";
import { isDomSnapshot } from "../../../src/core/diagnostics/snapshot-validation";
import { requireElement } from "../../feeds/news-fixtures";

afterEach(() => document.body.replaceChildren());

test("a profile-name control stays private while a separate nested action retains its label", async () => {
  document.body.innerHTML =
    '<div data-ad-rendering-role="profile_name" role="button">Secret Author<button>Novel profile action</button></div>';
  const snapshot = await captureDomSnapshot(document, { target: document.querySelector("div") });
  expect(JSON.stringify(snapshot)).not.toContain("Secret Author");
  expect(JSON.stringify(snapshot)).toContain("Novel profile action");
});

test.each([0, 3, 12, 20])(
  "changed wrappers at depth %s retain unfamiliar labels beside sensitive regions",
  async (depth) => {
    document.body.innerHTML = `<main><div role="article">${"<div>".repeat(depth)}
    <div><a data-ad-rendering-role="profile_name" href="/profile.php?id=123456789012">Secret Fullname</a>
    <span dir="auto">Unrecognized disclosure vNext</span><button title="Different useful explanation">Unfamiliar action</button></div>
    <div data-ad-preview="message"><div>Secret body</div><button>Secret authored control</button></div>
    <div role="comment">Secret reply</div><input value="Secret input"><textarea>Secret draft</textarea>
    ${"</div>".repeat(depth)}</div></main>`;
    const post = requireElement(document.querySelector('[role="article"]'));
    const snapshot = await captureDomSnapshot(document, { target: post });
    const data = JSON.stringify(snapshot);
    expect(data).toContain("Unrecognized disclosure vNext");
    expect(data).toContain("Different useful explanation");
    expect(data).toContain("Unfamiliar action");
    expect(data).not.toMatch(/Secret|123456789012/);
    expect(data).toContain('"reason":"authored-region"');
    expect(data).toContain('"reason":"editable-region"');
    expect(snapshot.privacy.policy).toBe("sensitive-regions-v2");
    expect(isDomSnapshot(snapshot)).toBe(true);
  }
);

test.each([
  "p",
  "blockquote",
  'div role="log"',
  'div contenteditable="plaintext-only"',
  'div data-ad-rendering-role="description-7"',
])(
  "redacts sensitive text and accessible attributes inside %s without erasing neighboring evidence",
  async (wrapper) => {
    const tag = wrapper.split(" ")[0];
    document.body.innerHTML = `<section><h3>Brand-new module</h3><${wrapper}><button title="Secret title">Secret text</button></${tag}><button aria-label="Novel standalone label">Novel action</button></section>`;
    const snapshot = await captureDomSnapshot(document, {
      target: document.querySelector("section"),
    });
    expect(JSON.stringify(snapshot)).not.toContain("Secret");
    expect(JSON.stringify(snapshot)).toContain("Novel standalone label");
    expect(JSON.stringify(snapshot)).toContain("Brand-new module");
  }
);

test("unannotated multiline prose is inferred narrowly without making its ancestor header private", async () => {
  document.body.innerHTML =
    '<div role="article"><div><h4><a href="/author">Secret Author</a></h4><span>Novel label</span></div><div dir="auto">Secret prose<br>Secret continuation</div><button>Novel footer control</button></div>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  expect(JSON.stringify(snapshot)).not.toContain("Secret");
  expect(JSON.stringify(snapshot)).toContain("Novel label");
  expect(JSON.stringify(snapshot)).toContain("Novel footer control");
  expect(JSON.stringify(snapshot)).toContain('"reason":"post-body","confidence":"inferred"');
});

test("an unfamiliar nested post preserves its own labels while both post bodies and authors are redacted", async () => {
  document.body.innerHTML =
    '<div role="article"><h4><a href="/outer">Secret Outer</a></h4><button>Outer placement</button><p>Secret outer body</p><div role="article"><h5><a href="/inner">Secret Inner</a></h5><button>Inner placement</button><p>Secret inner body</p></div></div>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  expect(JSON.stringify(snapshot)).not.toContain("Secret");
  expect(JSON.stringify(snapshot)).toContain("Outer placement");
  expect(JSON.stringify(snapshot)).toContain("Inner placement");
});

test.each([true, false])(
  "out-of-line SVG chains inherit private-source context, private=%s",
  async (privateSource) => {
    document.body.innerHTML = `<main><div role="article"><div ${privateSource ? 'data-ad-preview="message"' : ""}><a href="/?new-disclosure=1"><svg><use href="#step1"></use></svg></a></div></div></main><svg><g id="step1"><use href="#step2"></use></g><g id="step2"><text>Novel SVG label</text></g></svg>`;
    const snapshot = await captureDomSnapshot(document, {
      target: document.querySelector('[role="article"]'),
    });
    expect(JSON.stringify(snapshot).includes("Novel SVG label")).toBe(!privateSource);
    if (privateSource) expect(JSON.stringify(snapshot)).toContain('"reason":"private-reference"');
  }
);

test("a shared SVG definition remains diagnostic when an independent interface control uses it", async () => {
  document.body.innerHTML =
    '<main><div role="article"><p><svg><use href="#label"></use></svg></p><button><svg><use href="#label"></use></svg></button></div></main><svg><text id="label">Shared interface label</text></svg>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  expect(JSON.stringify(snapshot)).toContain("Shared interface label");
});

test("reference cycles and detached references do not hang or invent sensitive evidence", () => {
  document.body.innerHTML =
    '<span id="one" aria-labelledby="two">Novel one</span><span id="two" aria-labelledby="one">Novel two</span>';
  const regions = new SensitiveRegions();
  const one = requireElement(document.getElementById("one"));
  regions.rememberReferences(one);
  expect(regions.classify(one).content).toBe("interface");
  one.removeAttribute("aria-labelledby");
  regions.rememberReferences(one);
  expect(regions.classify(requireElement(document.getElementById("two"))).content).toBe(
    "interface"
  );
});

test("full names are removed without corrupting matching substrings in diagnostic vocabulary", () => {
  const labels = new SensitiveText();
  labels.remember("Ann");
  labels.remember("May Chen");
  expect(labels.redact("Announcement: People you may know — Ann and May Chen")).toBe(
    "Announcement: People you may know — [identity] and [identity]"
  );
  expect(labels.redact("New disclosure at 2026-11-13 13:45")).toBe(
    "New disclosure at 2026-11-13 13:45"
  );
});

test("fragmented private substrings do not erase the surrounding unfamiliar label", async () => {
  document.body.innerHTML =
    '<main><a data-profileid="person" href="/person">Secret Person</a><button>Placement by <span>Secret </span><span>Person</span> · contact <span>test@</span><span>example.com</span></button></main>';
  const snapshot = await captureDomSnapshot(document, { target: document.querySelector("button") });
  const data = JSON.stringify(snapshot);
  expect(data).toContain("Placement by");
  expect(data).toContain("contact");
  expect(data).toContain("[identity]");
  expect(data).toContain("[email]");
  expect(data).not.toMatch(/Secret|test@|example.com/);
});

test("full captures and transition frames both preserve future labels without a vocabulary lookup", async () => {
  document.body.innerHTML =
    '<div role="article"><h3>Future placement</h3><button aria-label="New accessible wording">Novel control</button><p>Secret prose</p></div>';
  const post = requireElement(document.querySelector('[role="article"]'));
  for (const snapshot of [
    await captureDomSnapshot(document, { target: post }),
    captureTransitionSnapshot(post, Infinity),
  ]) {
    const data = JSON.stringify(snapshot);
    expect(data).toContain("New accessible wording");
    expect(data).toContain("Future placement");
    expect(data).not.toContain("Secret prose");
    expect(isDomSnapshot(snapshot)).toBe(true);
  }
});

test("new attributes retain selector evidence while explicit credentials and contact details are sanitized", async () => {
  document.body.innerHTML =
    '<section data-future-placement="variant-beta" data-session-token="SecretToken" data-explanation="Ask test@example.com" data-private-userid="123456789012"><svg><path d="M0 0 L10 10"></path></svg><button>Inspect</button></section>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  const data = JSON.stringify(snapshot);
  expect(data).toContain("variant-beta");
  expect(data).toContain("M0 0 L10 10");
  expect(data).not.toMatch(/SecretToken|123456789012|test@example.com/);
  expect(data).toContain("[email]");
});

test("unfamiliar plain labels after a body are evidence, not presumed extensions of authored content", async () => {
  document.body.innerHTML =
    '<div role="article"><p>Secret body</p><div dir="auto"><span>New placement after body</span></div><span role="future-status">Novel state</span></div>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  const data = JSON.stringify(snapshot);
  expect(data).toContain("New placement after body");
  expect(data).toContain("future-status");
  expect(data).toContain("Novel state");
  expect(data).not.toContain("Secret body");
});

test("unknown destinations and new marker values do not require a navigation whitelist", async () => {
  document.body.innerHTML =
    '<section><a href="/futuremodule">Previously unseen destination</a><div data-ad-rendering-role="description-7" data-testid="New/Body/Variant:7">Secret creative</div></section>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  expect(JSON.stringify(snapshot)).toContain("Previously unseen destination");
  expect(JSON.stringify(snapshot)).toContain("description-7");
  expect(JSON.stringify(snapshot)).toContain("New/Body/Variant:7");
  expect(JSON.stringify(snapshot)).not.toContain("Secret creative");
});

test("the final pass updates moved regions and late identities in text attributes and ancestry shells", () => {
  document.body.innerHTML =
    '<section><button title="Secret attribute" data-future="Secret custom">Secret text</button><p></p><aside title="Contact Secret Person"></aside></section>';
  const capture = new DomCapture(snapshotLimits, false);
  const root = capture.regionNow(requireElement(document.querySelector("section")));
  const aside = requireElement(document.querySelector("aside"));
  const shell = capture.shell(aside);
  requireElement(document.querySelector("p")).append(
    requireElement(document.querySelector("button"))
  );
  aside.innerHTML = '<a data-profileid="person">Secret Person</a>';
  capture.privacy.remember(requireElement(aside.querySelector("a")));
  capture.reconcilePrivacy();
  expect(JSON.stringify({ root, shell })).not.toContain("Secret");
  expect(shell.attributes.title).toBe("Contact [identity]");
});

test("privacy work that reaches a transition deadline is reported explicitly", () => {
  document.body.innerHTML = "<section><button>New label</button></section>";
  let now = 0;
  const clock = jest.spyOn(performance, "now").mockImplementation(() => now);
  try {
    const capture = new DomCapture(snapshotLimits, false, 10);
    capture.regionNow(requireElement(document.querySelector("section")));
    now = 10;
    capture.reconcilePrivacy();
    expect(capture.omissions["redaction-time-limit"]).toBe(1);
  } finally {
    clock.mockRestore();
  }
});

test("moving out of a sensitive region cannot publish previously captured private text or attributes", () => {
  document.body.innerHTML =
    '<main><p><button title="Secret title" data-extra="Secret attribute">Secret text</button></p><section>New interface label</section></main>';
  const capture = new DomCapture(snapshotLimits, false);
  const root = capture.regionNow(requireElement(document.querySelector("main")));
  const button = requireElement(document.querySelector("button"));
  requireElement(document.querySelector("section")).append(button);
  button.title = "Updated public label";
  capture.reconcilePrivacy();
  expect(JSON.stringify(root)).not.toContain("Secret");
  expect(JSON.stringify(root)).toContain("New interface label");
});

test("a late independent reference can retain shared label evidence without declassifying private regions", () => {
  document.body.innerHTML =
    '<p><span aria-labelledby="label"></span></p><span id="label" title="New explanation">New shared label</span>';
  const capture = new DomCapture(snapshotLimits, false);
  capture.regionNow(requireElement(document.querySelector("p")));
  const label = capture.regionNow(requireElement(document.getElementById("label")));
  expect(JSON.stringify(label)).not.toContain("New shared label");
  const button = document.createElement("button");
  button.setAttribute("aria-labelledby", "label");
  document.body.append(button);
  capture.privacy.remember(button);
  capture.reconcilePrivacy();
  expect(JSON.stringify(label)).toContain("New shared label");
  expect(label.attributes.title).toBe("New explanation");
});

test("user-configured filter reasons are private while classification markers and surrounding controls survive", async () => {
  document.body.innerHTML =
    '<details cmfr="Secret configured text"><summary>Hidden: Secret configured text</summary><div role="article" cmfr="Secret configured text"><h6 cmftsb="0">Secret configured text</h6><p>Secret body</p><button>Future action</button></div></details>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("details"),
  });
  const data = JSON.stringify(snapshot);
  expect(data).not.toContain("Secret");
  expect(data).toContain('"cmfr":""');
  expect(data).toContain("filter-caption");
  expect(data).toContain("Future action");
  expect(isDomSnapshot(snapshot)).toBe(true);
});

test("prose inference never redacts a broad wrapper's loose interface text", async () => {
  document.body.innerHTML =
    '<div role="article"><div>Novel loose label<h4><a href="/author">Secret Author</a></h4><div>Secret prose<br>Secret continuation</div></div></div>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  expect(JSON.stringify(snapshot)).toContain("Novel loose label");
  expect(JSON.stringify(snapshot)).not.toContain("Secret");
});

test("identity discovery limits remain inspectable without suppressing unfamiliar labels", async () => {
  document.body.innerHTML = `<section><a data-profileid="person">${"Long identity ".repeat(30)}</a><button>New control wording</button></section>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  expect(snapshot.coverage.omissions["redaction-identity-limit"]).toBe(1);
  expect(JSON.stringify(snapshot)).toContain("New control wording");
  expect(JSON.stringify(snapshot)).not.toContain("Long identity");
});
