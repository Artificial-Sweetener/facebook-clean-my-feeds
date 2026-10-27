// SPDX-License-Identifier: GPL-3.0-only

import { sanitizePathname } from "./location";

const publicQuery = new Map([
  ["s", new Set(["ifu_see_more"])],
  ["source", new Set(["from_feed", "profile"])],
  ["section_header_type", new Set<string>()],
]);

/**
 * Preserve useful destination families and signature lengths, never account paths, tracking values or external addresses.
 * @param href Raw local attribute value; credentials and opaque path/query components never leave this boundary.
 * @returns A structural destination template with synthetic signature padding and safe diagnostic facts.
 */
export function snapshotDestination(href: string): {
  value: string;
  facts: Record<string, string>;
} {
  const facts: Record<string, string> = {};
  try {
    let url = new URL(href, "https://www.facebook.com/");
    if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
      facts["data-cmf-redirect"] = "facebook-outbound";
      const destination = url.searchParams.get("u");
      if (destination) url = new URL(destination);
    }
    if (!/^https?:$/.test(url.protocol) || url.username || url.password)
      return { value: "[non-web]", facts };
    if (url.hostname === "meta.ai" || url.hostname.endsWith(".meta.ai"))
      return { value: "https://meta.ai/", facts };
    if (!(url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com")))
      return { value: "https://external.invalid/[path]", facts };
    let value = sanitizePathname(url.pathname);
    const query = new URLSearchParams();
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
