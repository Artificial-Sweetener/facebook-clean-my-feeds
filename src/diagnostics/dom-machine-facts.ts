// SPDX-License-Identifier: GPL-3.0-only

import { readPageMediaFacts } from "../dom/page-media-facts";
import { facebookUrl } from "../dom/post-evidence";

/**
 * Preserve explicit server flags beside their original DOM identity hooks without exporting payloads or IDs.
 * These inert diagnostic annotations are never trusted by runtime classifiers. Missing annotations mean
 * unknown metadata, not a negative classification; report-local URL aliases retain DOM relationships.
 * @param element Source link or video wrapper whose exact identity can be resolved locally.
 * @returns Boolean flags and bounded public renderer type names, with no opaque token or private JSON.
 */
export function snapshotMachineFacts(element: Element): Record<string, string> {
  const player = element.getAttribute("data-video-id");
  const url = element.matches("a[href]") ? facebookUrl(element) : null;
  const token = url?.searchParams.get("__cft__[0]");
  const video =
    player ||
    (url &&
      (/^\/watch\/?$/.test(url.pathname)
        ? url.searchParams.get("v")
        : /^\/(?:reel|(?:[^/]+\/)?videos)\/(\d+)\/?$/.exec(url.pathname)?.[1]));
  const result: Record<string, string> = {};
  for (const [kind, identity] of [
    ["story", token],
    ["video", video],
  ] as const) {
    if (!identity || identity.length > 2048 || (kind === "video" && !/^\d{1,30}$/.test(identity)))
      continue;
    const facts = readPageMediaFacts(element, `${kind}:${identity}`);
    if (!facts) continue;
    for (const field of ["ai", "live"] as const)
      if (facts[field] !== undefined) result[`data-cmf-${kind}-${field}`] = String(facts[field]);
    if (facts.renderers?.length) result[`data-cmf-${kind}-renderers`] = facts.renderers.join(" ");
  }
  return result;
}
