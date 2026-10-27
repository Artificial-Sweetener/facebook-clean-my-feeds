// SPDX-License-Identifier: GPL-3.0-only
import type { DiagnosticsState } from "./types";
import { sanitizePathname } from "./location";
import { browserIdentity, diagnosticLocale } from "../core/diagnostics/environment";
import { buildIdentity } from "../core/diagnostics/build-identity";
/** The build-source classifier needs only download metadata, not runtime manager capabilities. */
export interface ScriptSourceMetadata {
  downloadURL?: string;
  updateURL?: string;
}
const SUPPORT_URL_FALLBACK =
  "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues";

/**
 * Prefer userscript-manager support metadata, falling back to the public project issue tracker.
 * @returns The manager-provided support URL or the public GitHub issue tracker.
 */
export function getSupportUrl() {
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  if (gm && gm.info && gm.info.script && gm.info.script.supportURL) {
    return gm.info.script.supportURL;
  }
  return SUPPORT_URL_FALLBACK;
}

/**
 * Keep support-relevant userscript metadata while reducing the download URL to a source label.
 * @returns Selected script identity, manager name, and privacy-safe build-source metadata.
 */
export function getScriptInfo() {
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  const script = gm && gm.info && gm.info.script ? gm.info.script : null;
  return {
    name: "FB - Clean my feeds",
    version:
      script?.version && /^\d+(?:\.\d+){0,4}(?:[-+][a-z0-9.-]+)?$/i.test(script.version)
        ? script.version
        : "unknown",
    buildSource: getBuildSource(script),
    supportURL: getSupportUrl() === SUPPORT_URL_FALLBACK ? SUPPORT_URL_FALLBACK : "custom",
    handler:
      [
        "Violentmonkey",
        "Tampermonkey",
        "Greasemonkey",
        "FireMonkey",
        "ScriptCat",
        "Userscripts",
      ].find((name) => name === gm?.info?.scriptHandler) || "unknown",
    handlerVersion:
      gm?.info?.version && /^\d+(?:\.\d+){0,4}(?:[-+][a-z0-9.-]+)?$/i.test(gm.info.version)
        ? gm.info.version
        : "unknown",
    buildIdentity,
  };
}

/**
 * Identify the release channel without retaining URL parameters or unrelated source URL details.
 * @param script Optional userscript metadata supplied by the current manager.
 * @returns A GitHub ref label, Greasy Fork label, or an unknown/custom-source sentinel.
 */
export function getBuildSource(script: ScriptSourceMetadata | null) {
  if (!script) {
    return "unknown";
  }

  const sourceUrl = script.downloadURL || script.updateURL || "";
  if (!sourceUrl) {
    return "unknown";
  }

  try {
    const url = new URL(sourceUrl);
    const repositoryPath = "/Artificial-Sweetener/facebook-clean-my-feeds/";
    if (url.hostname === "raw.githubusercontent.com" && url.pathname.startsWith(repositoryPath)) {
      const sourcePath = url.pathname.slice(repositoryPath.length);
      const fileSuffix = "/fb-clean-my-feeds.user.js";
      const refPath = sourcePath.endsWith(fileSuffix)
        ? sourcePath.slice(0, -fileSuffix.length)
        : sourcePath;
      return `github:${decodeURIComponent(refPath)}`;
    }
    if (url.hostname === "greasyfork.org" || url.hostname.endsWith(".greasyfork.org")) {
      return "greasyfork";
    }
    return "custom";
  } catch {
    return "custom";
  }
}

/**
 * Capture browser and viewport characteristics relevant to userscript compatibility.
 * @returns Browser identity, userscript support flags, and viewport dimensions.
 */
export function buildEnvironmentSnapshot() {
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  return {
    browser: browserIdentity(navigator.userAgent),
    language: diagnosticLocale(navigator.language),
    languages: navigator.languages.slice(0, 8).map((value) => diagnosticLocale(value)),
    facebookLanguage: diagnosticLocale(document.documentElement.lang),
    hasGM: !!gm,
    hasGMInfo: !!(gm && gm.info),
    readyState: document.readyState,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
  };
}

/**
 * Collect bounded network script locations without embedding opaque code payloads or session identifiers.
 * @param limit Maximum number of examples to include; counts still describe the full collection.
 * @returns HTTP(S) origin/path samples with credentials/query/fragment removed; other sources use static sentinels.
 */
export function getScriptsSample(limit = 20) {
  const scripts = Array.from(document.scripts || []);
  const samples = [];
  for (const script of scripts) {
    if (samples.length >= limit) {
      break;
    }
    if (script && script.src) {
      try {
        const url = new URL(script.src, window.location.href);
        if (url.protocol === "http:" || url.protocol === "https:") {
          samples.push(
            /(^|\.)facebook\.com$/i.test(url.hostname)
              ? "facebook-script"
              : /(^|\.)fbcdn\.net$/i.test(url.hostname)
                ? "facebook-cdn-script"
                : "external-script"
          );
        } else if (url.protocol === "data:") {
          samples.push("data-script");
        } else if (url.protocol === "blob:") {
          samples.push("blob-script");
        } else if (url.protocol === "javascript:") {
          samples.push("javascript-script");
        } else if (["moz-extension:", "chrome-extension:"].includes(url.protocol)) {
          samples.push("extension-script");
        } else {
          samples.push("other-script");
        }
      } catch {
        samples.push("unparseable-script");
      }
      continue;
    }
    samples.push("inline-script");
  }
  return samples;
}

/**
 * Serialize feed flags and subtypes without copying unrelated mutable runtime state.
 * @param state Active feed flags, subtypes, and hide-marker names.
 * @returns Only feed-selection flags and known subtype strings.
 */
export function buildFeedSnapshot(state: DiagnosticsState) {
  return {
    isNF: !!state.isNF,
    isGF: !!state.isGF,
    isVF: !!state.isVF,
    isMF: !!state.isMF,
    isSF: !!state.isSF,
    isRF: !!state.isRF,
    isPP: !!state.isPP,
    gfType: state.gfType || "",
    vfType: state.vfType || "",
    mpType: state.mpType || "",
  };
}

/**
 * Retain structural routing context while removing identifiers, queries, and fragments.
 * @returns The current origin and redacted structural path, with an empty search field.
 */
export function buildSafeLocation() {
  const location = window.location || {};
  const origin = location.origin || "";
  const pathname = sanitizePathname(location.pathname || "");
  const url = `${origin}${pathname}`;
  return { url, pathname, search: "" };
}
