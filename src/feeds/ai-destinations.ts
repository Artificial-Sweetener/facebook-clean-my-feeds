// SPDX-License-Identifier: GPL-3.0-only

/**
 * Resolve a direct service link or Facebook's outbound redirect without accepting credentials or lookalike domains.
 * @param link Navigation anchor whose literal destination is inspected without following the link.
 * @returns The HTTP destination hostname, or null for malformed and unsupported links.
 */
function serviceHostname(link: Element): string | null {
  const href = link.getAttribute("href");
  if (!href) return null;
  try {
    let url = new URL(href, document.baseURI);
    if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
      if (url.username || url.password || !/^https?:$/.test(url.protocol)) return null;
      const destination = url.searchParams.get("u");
      if (!destination) return null;
      url = new URL(destination);
    }
    return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.hostname : null;
  } catch {
    return null;
  }
}

/** Recognize Meta's AI service destination independently of its translated navigation caption. */
export function isMetaAiLink(link: Element): boolean {
  const hostname = serviceHostname(link);
  return hostname === "meta.ai" || hostname?.endsWith(".meta.ai") === true;
}

/** Match the Manus application hosts, excluding user-published sites and arbitrary redirect services. */
export function isManusAiLink(link: Element): boolean {
  const hostname = serviceHostname(link);
  return hostname === "manus.im" || hostname === "www.manus.im";
}
