// SPDX-License-Identifier: GPL-3.0-only

import type { DomSnapshot } from "./dom-snapshot";
import { isDomSnapshot } from "./snapshot-validation";

/** Machine rule identifiers retain diagnostic meaning without copying localized or configured private reasons. */
export const newsHistoryRules = [
  "NF_REELS_SHORT_VIDEOS",
  "NF_SHORT_REEL_VIDEO",
  "NF_META_AI",
  "NF_AI_INFO_POSTS",
  "NF_PAID_PARTNERSHIP",
  "NF_PEOPLE_YOU_MAY_KNOW",
  "NF_SUGGESTIONS",
  "NF_FOLLOW",
  "NF_PARTICIPATE",
  "NF_SPONSORED_PAID",
  "NF_EVENTS_YOU_MAY_LIKE",
  "NF_FILTER_VERIFIED_BADGE",
  "NF_STORIES",
  "NF_ANIMATED_GIFS_POSTS",
  "NF_SPONSORED",
  "NF_BLOCKED_ENABLED",
  "NF_LIKES_MAXIMUM",
] as const;

/** A matched rule identifies code and settings, never the user's configured keyword or post copy. */
export type NewsHistoryRule = (typeof newsHistoryRules)[number];
/** Triggers explain why a post was evaluated or its presentation was sampled. */
export type PostHistoryTrigger =
  | "discovered"
  | "content-changed"
  | "virtualized-unload"
  | "retained"
  | "caption-toggle";
/** Observed outcomes describe current behavior; they are not assertions that a decision was correct. */
export type PostHistoryAction = "hide" | "restore" | "defer" | "allow" | "retain";

/** Structural presentation facts distinguish caption replacement and movement without rendering or private values. */
export interface PostPresentation {
  classified: boolean;
  wrapper: string | null;
  open: boolean;
  parent: string | null;
  previousSibling: string | null;
}

/** One completed decision references an optional pre-decision sanitized structural frame. */
export interface PostHistoryEvent {
  sequence: number;
  post: string;
  atMs: number;
  durationMs: number;
  trigger: PostHistoryTrigger;
  action: PostHistoryAction;
  rule: NewsHistoryRule | null;
  before: PostPresentation;
  after: PostPresentation;
  frame: number | null;
}

/** Captured states are independent inert fixtures, including their own aliased external label dependencies. */
export interface PostHistoryFrame {
  id: number;
  post: string;
  snapshot: DomSnapshot;
}

/** Session-only bounded evidence; explicit gaps prevent missing history from being mistaken for absent transitions. */
export interface PostHistory {
  version: 1;
  scope: "news-posts";
  elapsedMs: number;
  limits: {
    events: number;
    frames: number;
    frameBytes: number;
    ageMs: number;
    nodesPerFrame: number;
    capturesPerSecond: number;
    captureMsPerSecond: number;
    captureMsPerFrame: number;
  };
  dropped: { events: number; frames: number; errors: number };
  captureMs: number;
  events: PostHistoryEvent[];
  frames: PostHistoryFrame[];
}

/**
 * Reject malformed attachments before the inspector traverses historical trees or constructs fixture paths.
 * @param value Untrusted optional history from a pasted diagnostic report.
 * @returns Whether bounded frames, chronological events and local identity references satisfy the export contract.
 */
export function isPostHistory(value: unknown): value is PostHistory {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const history = value as Record<string, unknown>;
  if (
    history.version !== 1 ||
    history.scope !== "news-posts" ||
    !Array.isArray(history.events) ||
    history.events.length > 160 ||
    !Array.isArray(history.frames) ||
    history.frames.length > 16
  )
    return false;
  for (const key of ["elapsedMs", "captureMs"]) if (!finite(history[key])) return false;
  if (
    !numericRecord(history.limits, [
      "events",
      "frames",
      "frameBytes",
      "ageMs",
      "nodesPerFrame",
      "capturesPerSecond",
      "captureMsPerSecond",
      "captureMsPerFrame",
    ]) ||
    !numericRecord(history.dropped, ["events", "frames", "errors"])
  )
    return false;
  const frames = new Set<number>();
  for (const frame of history.frames) {
    if (
      !object(frame) ||
      !finite(frame.id) ||
      frames.has(frame.id) ||
      !alias(frame.post) ||
      !isDomSnapshot(frame.snapshot, 528) ||
      frame.snapshot.coverage.capturedNodes > 256
    )
      return false;
    frames.add(frame.id);
  }
  let previous = -1;
  for (const event of history.events) {
    if (
      !object(event) ||
      !finite(event.sequence) ||
      event.sequence <= previous ||
      !alias(event.post) ||
      !finite(event.atMs) ||
      !finite(event.durationMs) ||
      ![
        "discovered",
        "content-changed",
        "virtualized-unload",
        "retained",
        "caption-toggle",
      ].includes(String(event.trigger)) ||
      !["hide", "restore", "defer", "allow", "retain"].includes(String(event.action)) ||
      !(event.rule === null || newsHistoryRules.some((rule) => rule === event.rule)) ||
      !presentation(event.before) ||
      !presentation(event.after) ||
      !(event.frame === null || (typeof event.frame === "number" && frames.has(event.frame)))
    )
      return false;
    if (
      event.frame !== null &&
      !history.frames.some(
        (frame) => object(frame) && frame.id === event.frame && frame.post === event.post
      )
    )
      return false;
    previous = event.sequence;
  }
  return true;
}

/** Plain records are checked before accessing untrusted event fields. */
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** History contains only finite nonnegative milliseconds, sequence numbers and counters. */
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
/** Validate diagnostic counters without accepting string-coerced numbers. */
function numericRecord(value: unknown, keys: string[]): boolean {
  return object(value) && keys.every((key) => finite(value[key]));
}
/** Local aliases cannot carry source identifiers or influence output file paths. */
function alias(value: unknown): value is string {
  return typeof value === "string" && /^p\d{1,9}$/.test(value);
}
/** Presentation records contain booleans and local identity edges only. */
function presentation(value: unknown): boolean {
  return (
    object(value) &&
    typeof value.classified === "boolean" &&
    typeof value.open === "boolean" &&
    ["wrapper", "parent", "previousSibling"].every(
      (key) => value[key] === null || alias(value[key])
    )
  );
}
