// SPDX-License-Identifier: GPL-3.0-only

/** Fail at fixture setup rather than hiding a missing element with a type assertion. */
export function requireShared<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Missing shared-test fixture");
  return value;
}

/** Parse static test markup into a detached scope without touching a user's live document. */
export function sharedPost(markup = ""): HTMLDivElement {
  const post = document.createElement("div");
  post.innerHTML = markup;
  return post;
}

/**
 * Model both supported content depths with explicit references for selector-boundary assertions.
 * @param depth Number of div edges between the aria wrapper and each content block.
 * @param attribute Alternate Facebook wrapper annotation; neither variant changes block order.
 */
export function sharedContentPost(
  contents: readonly string[],
  depth: 8 | 9 = 8,
  attribute: "aria-posinset" | "aria-describedby" = "aria-posinset"
): { post: HTMLDivElement; blocks: HTMLDivElement[] } {
  const post = sharedPost();
  const wrapper = sharedPost();
  wrapper.setAttribute(attribute, "fixture");
  post.append(wrapper);
  let parent = wrapper;
  for (let level = 1; level < depth; level += 1) {
    const child = sharedPost();
    parent.append(child);
    parent = child;
  }
  const blocks = contents.map((content) => sharedPost(content));
  parent.append(...blocks);
  return { post, blocks };
}

/** Simulate a loaded content image so jsdom can exercise the production icon-width cutoff. */
export function sharedImage(alt: string, width: number): HTMLImageElement {
  const image = document.createElement("img");
  image.alt = alt;
  Object.defineProperty(image, "naturalWidth", { configurable: true, value: width });
  return image;
}

/**
 * Construct the exact share-control ancestry with no classifier mocks.
 * @returns The root and mutable count spans, including empty or untranslated labels.
 */
export function sharedShares(labels: readonly string[]): {
  post: HTMLDivElement;
  shares: HTMLSpanElement[];
} {
  const post = sharedPost(
    '<div data-visualcompletion="ignore-dynamic"><div><div><div><div class="counts"><div><div><div><span><div></div></span></div></div></div></div></div></div></div></div>'
  );
  const parent = requireShared(post.querySelector("span > div"));
  const shares = labels.map((label) => {
    const share = document.createElement("span");
    share.dir = "auto";
    share.textContent = label;
    parent.append(share);
    return share;
  });
  return { post, shares };
}
