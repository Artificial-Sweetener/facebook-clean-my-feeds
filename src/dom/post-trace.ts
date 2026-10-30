// SPDX-License-Identifier: GPL-3.0-only

import type {
  NewsHistoryRule,
  PostHistoryAction,
  PostHistoryTrigger,
} from "../core/diagnostics/post-history";

/** A synchronous probe freezes evidence before a feed mutation and completes immediately afterwards. */
export interface PostTrace {
  /** Complete once after the mutation, recording a machine rule ID rather than a private display reason. */
  complete(action: PostHistoryAction, rule: NewsHistoryRule | null): void;
}
/** Composition supplies the optional diagnostics sink; DOM and feed code never depend on diagnostics collection. */
export type PostTraceSink = (post: Element, trigger: PostHistoryTrigger) => PostTrace | null;
let sink: PostTraceSink | null = null;

/** Install one session-owned sink, returning teardown that cannot remove a newer session's subscription. */
export function installPostTraceSink(next: PostTraceSink): () => void {
  sink = next;
  return () => {
    if (sink === next) sink = null;
  };
}

/** Diagnostics failures must never interrupt filtering or leave a post half-mutated. */
export function beginPostTrace(post: Element, trigger: PostHistoryTrigger): PostTrace | null {
  try {
    return sink?.(post, trigger) || null;
  } catch {
    return null;
  }
}

/** Record an outcome at the filtering boundary while insulating the host page from optional diagnostics failures. */
export function finishPostTrace(
  trace: PostTrace | null,
  action: PostHistoryAction,
  rule: NewsHistoryRule | null = null
): void {
  try {
    trace?.complete(action, rule);
  } catch {
    /* Optional diagnostics cannot change filtering outcomes. */
  }
}
