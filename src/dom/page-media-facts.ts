// SPDX-License-Identifier: GPL-3.0-only

import { extractPageMediaFacts } from "../core/filters/page-media-facts";
import type { PageMediaFacts } from "../core/filters/page-media-facts";
import { pageMetadataSelectors } from "../selectors/page-metadata";
import { invalidateContentVersion } from "./content-version";

/** One bounded document index amortizes parsing across posts and watches only newly supplied payloads. */
interface FactIndex {
  facts: Map<string, PageMediaFacts>;
  subscribers: Map<string, Set<Element>>;
  seen: WeakSet<Element>;
  observer: MutationObserver | undefined;
}

const indexes = new Map<Document, FactIndex>();

/**
 * Merge explicit updates, invalidating dependent post classifications only when their facts change.
 * @param script Native inert payload; malformed and oversized bodies supply no facts.
 * @param index Document-local bounded facts and dependent post registrations.
 */
function ingest(script: Element, index: FactIndex): void {
  if (index.seen.has(script) || !script.matches(pageMetadataSelectors.payload)) return;
  const text = script.textContent || "";
  if (!text) return;
  index.seen.add(script);
  if (
    text.length > 2500000 ||
    !/"(?:is_live_streaming|augments|encrypted_click_tracking)"\s*:/.test(text)
  )
    return;
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return;
  }
  for (const [key, update] of extractPageMediaFacts(input)) {
    const previous = index.facts.get(key);
    const next = { ...previous, ...update };
    index.facts.delete(key);
    index.facts.set(key, next);
    if (previous?.ai !== next.ai || previous?.live !== next.live) {
      const posts = index.subscribers.get(key);
      for (const post of posts || []) {
        if (post.isConnected) invalidateContentVersion(post);
        else posts?.delete(post);
      }
    }
    if (index.facts.size > 2048) {
      const oldest = index.facts.keys().next().value;
      if (oldest !== undefined) {
        index.facts.delete(oldest);
        index.subscribers.delete(oldest);
      }
    }
  }
}

/** Process script additions without rescanning old payloads or traversing ordinary post subtrees. */
function receive(records: MutationRecord[], index: FactIndex): void {
  for (const mutation of records) {
    if (
      mutation.target instanceof Element &&
      mutation.target.matches(pageMetadataSelectors.payload)
    ) {
      index.seen.delete(mutation.target);
      ingest(mutation.target, index);
    }
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.tagName === "SCRIPT") ingest(node, index);
      else if (node.tagName === "HEAD" || node.tagName === "BODY")
        for (const script of node.querySelectorAll(pageMetadataSelectors.payload))
          ingest(script, index);
    }
  }
}

/**
 * Read machine facts lazily: the first eligible detector builds the index, subsequent reads are map lookups.
 * Late native script updates invalidate subscribed posts, including previously hidden posts. Unsupported
 * payload placement or missing data returns unknown and leaves the established caption fallback available.
 * @param post Post subscribed to the identity; its DOM ownership is checked by the calling detector.
 * @param key Exact typed identity, never a caption or substring match.
 * @returns Explicit facts, or undefined when no supported payload supplied this identity.
 */
export function readPageMediaFacts(post: Element, key: string): PageMediaFacts | undefined {
  const page = post.ownerDocument;
  let index = indexes.get(page);
  if (!index) {
    index = { facts: new Map(), subscribers: new Map(), seen: new WeakSet(), observer: undefined };
    indexes.set(page, index);
    for (const script of page.querySelectorAll(pageMetadataSelectors.payload))
      ingest(script, index);
    if (typeof MutationObserver !== "undefined") {
      const current = index;
      index.observer = new MutationObserver((records) => receive(records, current));
      index.observer.observe(page, { childList: true, subtree: true });
    }
  }
  receive(index.observer?.takeRecords() || [], index);
  if (post.isConnected) {
    let posts = index.subscribers.get(key);
    if (!posts) {
      if (index.subscribers.size >= 2048) index.subscribers.clear();
      posts = new Set();
      index.subscribers.set(key, posts);
    }
    for (const previous of posts) if (!previous.isConnected) posts.delete(previous);
    if (posts.size < 64) posts.add(post);
  }
  return index.facts.get(key);
}

/** Release native payload observers and opaque in-memory identities at userscript teardown. */
export function clearPageMediaFacts(): void {
  for (const index of indexes.values()) index.observer?.disconnect();
  indexes.clear();
}
