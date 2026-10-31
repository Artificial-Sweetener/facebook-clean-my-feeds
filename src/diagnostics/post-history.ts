// SPDX-License-Identifier: GPL-3.0-only

import type {
  NewsHistoryRule,
  PostHistory,
  PostHistoryFrame,
  PostPresentation,
  PostHistoryTrigger,
} from "../core/diagnostics/post-history";
import { getContentVersion } from "../dom/content-version";
import { postAtt } from "../dom/attributes";
import { beginPostTrace, finishPostTrace, installPostTraceSink } from "../dom/post-trace";
import type { PostTrace } from "../dom/post-trace";
import { captureTransitionSnapshot } from "./transition-snapshot";

const limits = {
  events: 160,
  frames: 16,
  frameBytes: 1_000_000,
  ageMs: 120_000,
  nodesPerFrame: 256,
  capturesPerSecond: 4,
  captureMsPerSecond: 24,
  captureMsPerFrame: 12,
};
/** Per-node state uses weak ownership, retaining neither discarded posts nor their original text. */
interface TrackedPost {
  last: PostPresentation;
  version: number | null;
  rule: NewsHistoryRule | null;
}
/** Frame accounting is internal; exported history contains only sanitized structures. */
interface RetainedFrame {
  value: PostHistoryFrame;
  bytes: number;
}
let current: PostHistoryRecorder | null = null;

/**
 * Record bounded decision transitions without a whole-document mutation observer or persistent storage.
 * Structural frames are redacted at collection time; event fields are fixed enums, booleans, timings and aliases.
 * Every frame is at most 256 nodes; captures are limited to four per second, with a soft 24 ms/second work budget checked between bounded operations.
 */
export class PostHistoryRecorder {
  private ids = new WeakMap<Element, string>();
  private tracked = new WeakMap<Element, TrackedPost>();
  private events: PostHistory["events"] = [];
  private frames: RetainedFrame[] = [];
  private nextId = 0;
  private sequence = 0;
  private nextFrame = 0;
  private frameBytes = 0;
  private dropped = { events: 0, frames: 0, errors: 0 };
  private captureMs = 0;
  private windowStart = 0;
  private windowCaptures = 0;
  private windowWork = 0;
  private start = performance.now();
  private disconnect: () => void;

  /** Bind the recorder to one document and sink; teardown releases listeners and all retained sanitized data. */
  constructor(private document: Document) {
    this.disconnect = installPostTraceSink((post, trigger) => this.begin(post, trigger));
    document.addEventListener("toggle", this.onToggle, true);
  }

  /** Observe native details toggles only for directly owned news roots already encountered by filtering. */
  private onToggle = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element) || !target.matches(`details[${postAtt}]`)) return;
    for (const post of Array.from(target.children).slice(0, 32)) {
      if (!this.tracked.has(post)) continue;
      finishPostTrace(beginPostTrace(post, "caption-toggle"), "retain");
    }
  };

  /** Assign opaque identities without reading, hashing or retaining source IDs, classes or content. */
  private id(element: Element | null): string | null {
    if (!element) return null;
    let id = this.ids.get(element);
    if (!id) {
      id = `p${++this.nextId}`;
      this.ids.set(element, id);
    }
    return id;
  }

  /** Read only owned caption state and structural identity edges; avoid computed styles and layout flushes. */
  private presentation(post: Element): PostPresentation {
    const parent = post.parentElement;
    const wrapper = parent?.matches(`details[${postAtt}]`) ? parent : null;
    const position = wrapper || post;
    return {
      classified: post.hasAttribute(postAtt),
      wrapper: this.id(wrapper),
      open: !!wrapper?.hasAttribute("open"),
      parent: this.id(position.parentElement),
      previousSibling: this.id(position.previousElementSibling),
    };
  }

  /** Expire events and frames together, so bounded history never exposes a dangling frame reference. */
  private prune(now: number): void {
    while (
      this.events.length &&
      (this.events.length > limits.events || (this.events[0]?.atMs ?? now) < now - limits.ageMs)
    ) {
      this.events.shift();
      this.dropped.events++;
    }
    const used = new Set(this.events.map((event) => event.frame));
    this.frames = this.frames.filter((frame) => {
      if (used.has(frame.value.id)) return true;
      this.frameBytes -= frame.bytes;
      return false;
    });
  }

  /**
   * Freeze a budgeted pre-decision frame; skipped work is reported rather than silently represented as an empty tree.
   * @param post Source root sampled synchronously before filtering mutations.
   * @param id Opaque identity linking this frame to its event.
   * @param now Session-relative milliseconds used for the per-second work budget.
   * @returns Retained frame identity, or null with an explicit dropped/error counter.
   */
  private capture(post: Element, id: string, now: number): number | null {
    if (now - this.windowStart >= 1000) {
      this.windowStart = now;
      this.windowCaptures = 0;
      this.windowWork = 0;
    }
    if (
      this.windowCaptures >= limits.capturesPerSecond ||
      this.windowWork >= limits.captureMsPerSecond
    ) {
      this.dropped.frames++;
      return null;
    }
    this.windowCaptures++;
    const start = performance.now();
    try {
      const snapshot = captureTransitionSnapshot(
        post,
        start + Math.min(limits.captureMsPerFrame, limits.captureMsPerSecond - this.windowWork)
      );
      const frame: PostHistoryFrame = { id: ++this.nextFrame, post: id, snapshot };
      const bytes = JSON.stringify(frame).length * 2;
      if (bytes > limits.frameBytes) {
        this.dropped.frames++;
        return null;
      }
      while (this.frames.length >= limits.frames || this.frameBytes + bytes > limits.frameBytes) {
        const removed = this.frames.shift();
        if (!removed) break;
        this.frameBytes -= removed.bytes;
        for (const event of this.events) if (event.frame === removed.value.id) event.frame = null;
        this.dropped.frames++;
      }
      this.frames.push({ value: frame, bytes });
      this.frameBytes += bytes;
      return frame.id;
    } catch {
      this.dropped.errors++;
      return null;
    } finally {
      const elapsed = performance.now() - start;
      this.windowWork += elapsed;
      this.captureMs += elapsed;
    }
  }

  /**
   * Begin only meaningful classifications or changed presentation; unchanged periodic retention creates no events or frames.
   * @param post Source root, used synchronously and weakly remembered after completion.
   * @param trigger Stable reason supplied by the filtering boundary, never a page-derived string.
   * @returns Probe completed by the caller after filtering, or null for unchanged retained presentation.
   */
  private begin(post: Element, trigger: PostHistoryTrigger): PostTrace | null {
    if (post.ownerDocument !== this.document) return null;
    const started = performance.now();
    const now = started - this.start;
    const before = this.presentation(post);
    const previous = this.tracked.get(post);
    if (
      (trigger === "retained" || trigger === "caption-toggle") &&
      previous &&
      JSON.stringify(previous.last) === JSON.stringify(before)
    )
      return null;
    if (
      trigger === "discovered" &&
      previous &&
      previous.version !== null &&
      previous.version === getContentVersion(post) &&
      JSON.stringify(previous.last) === JSON.stringify(before)
    )
      return null;
    this.prune(now);
    const id = this.id(post);
    if (!id) return null;
    const frame = this.capture(post, id, now);
    const decisionStart = performance.now();
    let completed = false;
    return {
      /**
       * Commit the outcome once, retaining no source node in the exported record.
       * @param action Observed filtering outcome; retained and deferred states preserve the last known matching rule.
       * @param rule Current machine rule ID, or null when the evaluation found no match.
       */
      complete: (action, rule) => {
        if (completed) return;
        completed = true;
        const after = this.presentation(post);
        this.events.push({
          sequence: ++this.sequence,
          post: id,
          atMs: Math.round(now),
          durationMs: Math.round((performance.now() - decisionStart) * 100) / 100,
          trigger,
          action,
          rule: action === "defer" || action === "retain" ? previous?.rule || null : rule,
          before:
            trigger === "retained" || trigger === "caption-toggle"
              ? previous?.last || before
              : before,
          after,
          frame,
        });
        this.tracked.set(post, {
          last: after,
          version: getContentVersion(post),
          rule: action === "defer" || action === "retain" ? previous?.rule || null : rule,
        });
        this.prune(performance.now() - this.start);
      },
    };
  }

  /**
   * Export a detached bounded value; alias remapping prevents identities correlating separate pasted reports.
   * @returns Chronological observed decisions and redacted fixtures, with explicit limits and missing-frame counts.
   */
  read(): PostHistory {
    this.prune(performance.now() - this.start);
    const aliases = new Map<string, string>();
    /** Remap only structural identity fields; sanitized DOM aliases remain independent inside each frame. */
    const alias = (value: string | null): string | null => {
      if (value === null) return null;
      let mapped = aliases.get(value);
      if (!mapped) {
        mapped = `p${aliases.size + 1}`;
        aliases.set(value, mapped);
      }
      return mapped;
    };
    /** Copy presentation records so later sampling cannot mutate the already generated report. */
    const presentation = (value: PostPresentation): PostPresentation => ({
      ...value,
      wrapper: alias(value.wrapper),
      parent: alias(value.parent),
      previousSibling: alias(value.previousSibling),
    });
    return {
      version: 1,
      scope: "news-posts",
      elapsedMs: Math.round(performance.now() - this.start),
      limits: { ...limits },
      dropped: { ...this.dropped },
      captureMs: Math.round(this.captureMs * 100) / 100,
      events: this.events.map((event) => ({
        ...event,
        post: alias(event.post) || "p0",
        before: presentation(event.before),
        after: presentation(event.after),
      })),
      frames: this.frames.map(({ value }) => ({
        ...value,
        post: alias(value.post) || "p0",
        snapshot: JSON.parse(JSON.stringify(value.snapshot)),
      })),
    };
  }

  /** Detach only this session's sink and listener; no private browser state or persistent data is changed. */
  stop(): void {
    this.disconnect();
    this.document.removeEventListener("toggle", this.onToggle, true);
    this.events = [];
    this.frames = [];
    this.tracked = new WeakMap();
    this.ids = new WeakMap();
  }
}

/** Compose one active session recorder before the first feed pass. */
export function startPostHistory(document: Document): () => void {
  current?.stop();
  const recorder = new PostHistoryRecorder(document);
  current = recorder;
  return () => {
    recorder.stop();
    if (current === recorder) current = null;
  };
}

/** Reports preserve the recorder's explicit coverage scope, or an empty bounded history before startup. */
export function readPostHistory(): PostHistory {
  return (
    current?.read() || {
      version: 1,
      scope: "news-posts",
      elapsedMs: 0,
      limits: { ...limits },
      dropped: { events: 0, frames: 0, errors: 0 },
      captureMs: 0,
      events: [],
      frames: [],
    }
  );
}
