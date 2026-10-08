// SPDX-License-Identifier: GPL-3.0-only

import { hydrateOptions } from "../../src/core/options/hydrate";
import { pathInfo } from "../../src/core/rules/feed-rules";
import { initializeRuntimeAttributes, postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking, pruneDirtyObservers } from "../../src/dom/dirty-check";
import { createDomState } from "../../src/dom/types";
import { mopNewsFeed } from "../../src/feeds/news";
import { restoreFeedPresentation } from "../../src/feeds/reset";
import { createFeedState } from "../../src/feeds/state";
import type { FeedContext } from "../../src/feeds/types";

/** Measurements separate serialization work from noisy wall time; jsdom is not a browser renderer. */
export interface Measurements {
  scenario: string;
  scans: number;
  medianMs: number;
  p95Ms: number;
  scansOver50Ms: number;
  htmlReads: number;
  serializedCharacters: number;
  hiddenPosts: number;
  browserLongTasks: number | null;
}

/** Allocate default-enabled filtering with production markers and a small number of known ads. */
function createContext(): FeedContext {
  const settings = hydrateOptions({ VERBOSITY_LEVEL: "1" });
  const state = {
    ...createDomState(),
    ...createFeedState(),
    options: settings.options,
    language: settings.language,
    hideAnInfoBox: settings.hideAnInfoBox,
    iconNewWindow: "",
    iconNewWindowClass: "cmf-new-window",
    isChromium: false,
    isAF: true,
    isNF: true,
  };
  initializeRuntimeAttributes(state);
  return { ...settings, state, pathInfo };
}

/** Build mixed organic/sponsored posts with nested media and comments typical of a virtualized feed. */
function createPost(page: Document, index: number): Element {
  const post = page.createElement("div");
  post.setAttribute("aria-posinset", String(index));
  post.innerHTML = `<h4><a href="/author${index}">Author ${index}</a></h4>
    <div data-ad-preview="message"><p>Ordinary post ${index}</p></div>
    <div>${Array.from({ length: 24 }, (_, child) => `<span><span>Text ${child}</span><a href="/photo/?fbid=${index}_${child}">Photo</a></span>`).join("")}</div>
    <div role="comment">An unrelated comment</div>`;
  if (index % 4 === 0) {
    const ad = page.createElement("a");
    ad.setAttribute("href", "/ads/about/?id=fixture");
    ad.textContent = "Sponsored";
    post.prepend(ad);
  }
  return post;
}

/**
 * Measure the real News processor on an isolated DOM with deterministic simulated elapsed time.
 * No Facebook session, network, clicks, or userscript-manager storage is used. Mutation delivery is
 * flushed between scans; operation counts are reproducible, while timing depends on the host.
 * @returns Scenario metrics for idle ticks, scheduled sweeps, recycled hidden posts, and SPA replacement.
 * @throws If the supplied DOM environment lacks the main root or native serialization contract.
 */
export async function runFeedProfile(): Promise<Measurements[]> {
  const context = createContext();
  const originalNow = Date.now;
  let clock = 10000;
  Date.now = () => clock;
  let htmlReads = 0;
  let serializedCharacters = 0;
  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
  if (!descriptor?.get) throw new Error("The fixture requires the native innerHTML getter");
  const nativeRead = descriptor.get;
  Object.defineProperty(Element.prototype, "innerHTML", {
    ...descriptor,
    /** Count exact serialization requests while returning the original native result unchanged. */
    get(this: Element): string {
      const value: unknown = nativeRead.call(this);
      if (typeof value !== "string") throw new Error("Unexpected innerHTML result");
      htmlReads += 1;
      serializedCharacters += value.length;
      return value;
    },
  });
  let main = document.querySelector('[role="main"]');
  if (!main) throw new Error("The fixture requires a main feed root");
  for (let index = 0; index < 80; index += 1) main.append(createPost(document, index));
  mopNewsFeed(context);
  await Promise.resolve();
  mopNewsFeed(context);
  await Promise.resolve();
  const results: Measurements[] = [];
  try {
    for (const scenario of [
      "idle",
      "periodic-sweep",
      "recycled-hidden",
      "mutation-churn",
      "spa-replacement",
    ]) {
      const durations: number[] = [];
      const scanWindows: Array<readonly [number, number]> = [];
      let browserLongTasks: number | null = null;
      const longTasks =
        typeof PerformanceObserver === "undefined"
          ? null
          : new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (
                  scanWindows.some(
                    ([start, end]) =>
                      entry.startTime <= end && entry.startTime + entry.duration >= start
                  )
                )
                  browserLongTasks = (browserLongTasks ?? 0) + 1;
              }
            });
      if (longTasks && PerformanceObserver.supportedEntryTypes.includes("longtask")) {
        browserLongTasks = 0;
        longTasks.observe({ type: "longtask" });
      }
      htmlReads = 0;
      serializedCharacters = 0;
      for (let iteration = 0; iteration < 24; iteration += 1) {
        clock += scenario === "idle" ? 10 : scenario === "mutation-churn" ? 75 : 800;
        if (scenario === "recycled-hidden") {
          const post = main.querySelector('div[aria-posinset="0"]');
          const body = post?.querySelector("p");
          if (body) body.textContent = `Replacement ${iteration}`;
        } else if (scenario === "mutation-churn") {
          const bodies = main.querySelectorAll("p");
          for (let mutation = 0; mutation < 100; mutation += 1) {
            const body = bodies[mutation % bodies.length];
            if (body) body.textContent = `Live update ${iteration}-${mutation}`;
          }
          // Model the scheduler's one forced scan after a coalesced 75 ms child-list batch.
          context.state.forceProcess = true;
        } else if (scenario === "spa-replacement") {
          const next = document.createElement("div");
          next.setAttribute("role", "main");
          for (let index = 0; index < 80; index += 1) next.append(createPost(document, index));
          main.replaceWith(next);
          main = next;
          context.state.forceProcess = true;
          pruneDirtyObservers();
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        const start = performance.now();
        mopNewsFeed(context);
        const end = performance.now();
        durations.push(end - start);
        scanWindows.push([start, end]);
        context.state.forceProcess = false;
        await Promise.resolve();
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      longTasks?.disconnect();
      durations.sort((a, b) => a - b);
      results.push({
        scenario,
        scans: durations.length,
        medianMs: Number((durations[Math.floor(durations.length / 2)] ?? 0).toFixed(3)),
        p95Ms: Number((durations[Math.floor(durations.length * 0.95)] ?? 0).toFixed(3)),
        scansOver50Ms: durations.filter((duration) => duration > 50).length,
        htmlReads,
        serializedCharacters,
        hiddenPosts: main.querySelectorAll(`div[aria-posinset][${postAtt}]`).length,
        browserLongTasks,
      });
    }
  } finally {
    restoreFeedPresentation(context.state);
    clearDirtyTracking();
    Object.defineProperty(Element.prototype, "innerHTML", descriptor);
    Date.now = originalNow;
  }
  return results;
}
