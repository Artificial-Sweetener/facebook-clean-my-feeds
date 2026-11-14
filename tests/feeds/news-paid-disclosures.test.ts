// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { isNewsSponsoredPaidBy, mopNewsFeed } from "../../src/feeds/news";
import { getNewsBlocks } from "../../src/feeds/shared/blocks";
import { translations } from "../../src/i18n";
import { newsLabels } from "../../src/i18n/news-labels";
import { createNewsContext, requireElement } from "./news-fixtures";
import { mountNewsPost, newsTextBlocks, postCases } from "../validation/news-contract-fixtures";

const disclosure = "<span>Sponsored · </span><span>Paid for by Example</span>";
const { keyWords } = createNewsContext();

/**
 * Reduce issue #24's November 14 report to its relevant semantic structure.
 * The button is beside the profile heading, outside it, with two unnamed spans and no link/SVG label.
 * Classes, identities, tracking values and unrelated creative/reaction markup are intentionally omitted.
 */
function mountPaidDisclosure(label = disclosure, tag = 'div role="button" tabindex="0"') {
  return mountNewsPost(`<div data-virtualized="false"><div id="header">
    <div><div><span><div data-ad-rendering-role="profile_name"><h4><span><a href="/publisher">Publisher</a></span></h4></div></span></div>
      <div><span dir="ltr"><div><${tag} id="disclosure">${label}</${tag.split(" ")[0]}>
        <span aria-hidden="true"> · </span><svg role="img"><title>Shared with Public</title></svg>
      </div></span></div></div>
    </div><div id="body" data-ad-rendering-role="story_message">Ordinary creative</div>
    <div id="footer"></div></div>`);
}

/** Read the production classifier without conflating the ordinary sponsored filter with its paid-by setting. */
function detected(post: Element): boolean {
  return isNewsSponsoredPaidBy(post, keyWords) !== "";
}

afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
});

test("hides the reported paid disclosure and preserves its ordinary neighbor", () => {
  const { post, neighbor, main } = mountPaidDisclosure();
  expect(detected(post)).toBe(true);
  const context = createNewsContext({ options: { NF_SPONSORED_PAID: true } });
  mopNewsFeed(context);
  expect(post.getAttribute(postAtt)).toBe(keyWords.NF_SPONSORED_PAID);
  expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
  expect(neighbor.hasAttribute(postAtt)).toBe(false);
  expect(main.hasAttribute(postAtt)).toBe(false);
});

test.each(["button", 'span role="button"', 'a href="/ads/about/"'])(
  "recognizes the same header disclosure in a %s control",
  (tag) => {
    expect(detected(mountPaidDisclosure(disclosure, tag).post)).toBe(true);
  }
);

test.each(Object.entries(newsLabels))(
  "recognizes complete localized copy for %s",
  (locale, labels) => {
    const sponsored = Object.entries(translations).find(([code]) => code === locale)?.[1].SPONSORED;
    for (const template of labels[8].split("|")) {
      expect(
        detected(
          mountPaidDisclosure(`${sponsored} · ${template.replace("______", "Example")}`).post
        )
      ).toBe(true);
    }
  }
);

test("retains the older paid-by layout", () => {
  const legacy = requireElement(postCases.find(({ option }) => option === "NF_SPONSORED_PAID"));
  expect(detected(mountNewsPost(legacy.markup).post)).toBe(true);
});

test.each([
  "Sponsored · Paid for by",
  "Sponsored · Paid for bystander",
  "Not sponsored · Paid for by Example",
  "Sponsored event tickets · Paid for by Example",
  "Sponsored · Community fundraiser",
  "Yesterday · Paid for by Example",
  "We discussed Sponsored · Paid for by Example",
  "Sponsored",
])("preserves unrelated or incomplete metadata: %s", (label) => {
  expect(detected(mountPaidDisclosure(label).post)).toBe(false);
});

test.each(["body", "footer", '[data-ad-rendering-role="profile_name"]'])(
  "does not classify a disclosure in %s",
  (target) => {
    const { post } = mountPaidDisclosure();
    requireElement(post.querySelector(target.startsWith("[") ? target : `#${target}`)).append(
      requireElement(post.querySelector("#disclosure"))
    );
    expect(detected(post)).toBe(false);
  }
);

test.each([
  'div role="article"',
  'div data-commentid="comment"',
  'div role="comment"',
  'div data-ad-preview="message"',
  'div contenteditable="true"',
  "blockquote",
  "p",
])("rejects a nested disclosure inside %s even in the header", (wrapper) => {
  const { post } = mountPaidDisclosure();
  const control = requireElement(post.querySelector("#disclosure"));
  const container = document.createElement("div");
  container.innerHTML = `<${wrapper}></${wrapper.split(" ")[0]}>`;
  const nested = requireElement(container.firstElementChild);
  control.replaceWith(nested);
  nested.append(control);
  expect(detected(post)).toBe(false);
});

test("rejects a profile link whose name resembles the disclosure without a profile annotation", () => {
  const { post } = mountNewsPost(
    newsTextBlocks('<h4><a href="/publisher">Sponsored · Paid for by Example</a></h4>')
  );
  expect(getNewsBlocks(post)).toHaveLength(2);
  expect(detected(post)).toBe(false);
});

test.each(['a href="https://example.org/"', 'a href="javascript:void(0)"'])(
  "does not use an external or non-HTTP link: %s",
  (tag) => {
    expect(detected(mountPaidDisclosure(disclosure, tag).post)).toBe(false);
  }
);

test("requires an established header boundary for the new control family", () => {
  expect(detected(mountNewsPost(`<button>${disclosure}</button>`).post)).toBe(false);
});

test("does not inspect oversized disclosure copy", () => {
  expect(detected(mountPaidDisclosure(`Sponsored · Paid for by ${"x".repeat(260)}`).post)).toBe(
    false
  );
});

test("rejects an unannotated body in the established legacy block layout", () => {
  const { post } = mountNewsPost(
    newsTextBlocks("<h4>Publisher</h4>", `<button>${disclosure}</button>`)
  );
  expect(getNewsBlocks(post)).toHaveLength(2);
  expect(detected(post)).toBe(false);
});

test.each(["hidden", 'style="display:none"', 'style="visibility:hidden"', 'aria-hidden="true"'])(
  "does not use a concealed disclosure: %s",
  (attributes) => {
    expect(detected(mountPaidDisclosure(disclosure, `div role="button" ${attributes}`).post)).toBe(
      false
    );
  }
);

test("rejects copy borrowed from a nested interactive child", () => {
  expect(
    detected(
      mountPaidDisclosure(`<span>Sponsored · </span><a href="/author">Paid for by Example</a>`).post
    )
  ).toBe(false);
});

test("does not accept a conflicting accessible name", () => {
  expect(detected(mountPaidDisclosure(disclosure, 'button aria-label="Publisher"').post)).toBe(
    false
  );
});

test("ignores harmless wrapper changes and hidden decoy copy", () => {
  const { post } = mountPaidDisclosure(
    "<span>Sponsored</span><span hidden> event</span> · <span>Paid for <b>by Example</b></span>"
  );
  const header = requireElement(post.querySelector("#header"));
  header.innerHTML = `<section><div><div>${header.innerHTML}</div></div></section>`;
  expect(detected(post)).toBe(true);
});

test("the paid-by setting can remain disabled", () => {
  const { post } = mountPaidDisclosure();
  mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true, NF_SPONSORED_PAID: false } }));
  expect(post.hasAttribute(postAtt)).toBe(false);
});

test("revalidates a late disclosure and restores a recycled ordinary post", () => {
  const { post } = mountPaidDisclosure("Yesterday");
  const context = createNewsContext({ options: { NF_SPONSORED_PAID: true } });
  mopNewsFeed(context);
  expect(post.hasAttribute(postAtt)).toBe(false);
  const control = requireElement(post.querySelector("#disclosure"));
  control.innerHTML = disclosure;
  context.state.lastNewsPostSweepAt = 0;
  mopNewsFeed(context);
  expect(post.getAttribute(postAtt)).toBe(keyWords.NF_SPONSORED_PAID);
  control.textContent = "Yesterday";
  context.state.lastNewsPostSweepAt = 0;
  mopNewsFeed(context);
  expect(post.hasAttribute(postAtt)).toBe(false);
  expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
});
