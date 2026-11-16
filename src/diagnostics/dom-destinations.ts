// SPDX-License-Identifier: GPL-3.0-only

import { sanitizePathname } from "./location";

const publicQuery = new Map([
  ["s", new Set(["ifu_see_more"])],
  ["source", new Set(["from_feed", "profile"])],
  ["section_header_type", new Set<string>()],
]);

/** Preserve Instagram service and content-route shape while replacing every account/content segment. */
function instagramDestination(url: URL): string {
  const parts = url.pathname.split("/").filter(Boolean);
  const routes = new Set(["p", "reel", "tv", "stories"]);
  const path = parts.map((part, index) => (index === 0 && routes.has(part) ? part : "[segment]"));
  return `https://www.instagram.com/${path.join("/")}${path.length && url.pathname.endsWith("/") ? "/" : ""}`;
}

/**
 * Preserve useful destination families and signature lengths, never account paths, tracking values or external addresses.
 * @param href Raw local attribute value; credentials and opaque path/query components never leave this boundary.
 * @param numericAlias Optional report-local numeric identifiers for replayable content-route shapes.
 * @param redirectDepth Bounded nesting of Facebook outbound redirects; deeper chains are explicitly omitted.
 * @returns A structural destination template with synthetic signature padding and safe diagnostic facts.
 */
export function snapshotDestination(
  href: string,
  numericAlias?: (identifier: string) => string,
  redirectDepth = 0
): {
  value: string;
  facts: Record<string, string>;
} {
  const facts: Record<string, string> = {};
  if (redirectDepth > 2) return { value: "[redirect-limit]", facts };
  try {
    const url = new URL(href, "https://www.facebook.com/");
    if (!/^https?:$/.test(url.protocol) || url.username || url.password)
      return { value: "[non-web]", facts };
    if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
      facts["data-cmf-redirect"] = "facebook-outbound";
      const destination = url.searchParams.get("u");
      if (destination) {
        const safe = snapshotDestination(destination, numericAlias, redirectDepth + 1);
        return {
          value: `https://l.facebook.com/l.php?u=${encodeURIComponent(safe.value)}${url.searchParams.get("ai") ? "&ai=[value]" : ""}`,
          facts: { ...facts, ...safe.facts },
        };
      }
    }
    if (url.hostname === "meta.ai" || url.hostname.endsWith(".meta.ai"))
      return { value: "https://meta.ai/", facts };
    if (url.hostname === "manus.im" || url.hostname === "www.manus.im")
      return { value: "https://manus.im/", facts };
    if (url.hostname === "instagram.com" || url.hostname === "www.instagram.com")
      return { value: instagramDestination(url), facts };
    if (!(url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com")))
      return { value: "https://external.invalid/[path]", facts };
    let value = sanitizePathname(url.pathname, numericAlias);
    const query = new URLSearchParams();
    if (/^\/pages\/?$/.test(url.pathname)) {
      const category = url.searchParams.get("category");
      if (category !== null)
        query.set(
          "category",
          ["top", "liked", "invites"].includes(category) ? category : "[value]"
        );
    }
    if (url.pathname === "/profile.php") {
      const identifier = url.searchParams.get("id");
      if (identifier !== null)
        query.set("id", identifier ? (numericAlias?.(identifier) ?? "[profile]") : "");
    }
    for (const [key, values] of publicQuery) {
      const original = url.searchParams.get(key);
      if (original !== null) query.set(key, values.has(original) ? original : "[value]");
    }
    const signature = url.searchParams.get("__cft__[0]");
    if (signature !== null) {
      facts["data-cmf-cft-length"] = String(signature.length + "__cft__[0]=".length);
      query.set("__cft__[0]", "x".repeat(Math.min(signature.length, 1024)));
    }
    if (query.size)
      value += `?${Array.from(query, ([key, entry]) => `${key}=${encodeURIComponent(entry)}`).join("&")}`;
    facts["data-cmf-destination"] = "facebook";
    return { value, facts };
  } catch {
    return { value: "[invalid-destination]", facts };
  }
}
