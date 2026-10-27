// SPDX-License-Identifier: GPL-3.0-only

/** Product/version fields retain compatibility evidence without copying an arbitrary raw user-agent string. */
export interface BrowserIdentity {
  name: string;
  version: string;
  engine: string;
  engineVersion: string;
  os: string;
  mobile: boolean;
}

/**
 * Parse only recognized browser product tokens and platform families; unfamiliar or unavailable fields remain explicit.
 * @param userAgent Local browser identity string, used only for fixed product/version and operating-system extraction.
 * @returns Bounded compatibility facts without retaining arbitrary raw user-agent contents.
 */
export function browserIdentity(userAgent: string): BrowserIdentity {
  const products: Array<[string, RegExp]> = [
    ["Edge", /(?:Edg|EdgA|EdgiOS)\/([\d.]+)/],
    ["Opera", /(?:OPR|OPiOS)\/([\d.]+)/],
    ["Firefox", /(?:Firefox|FxiOS)\/([\d.]+)/],
    ["Chrome", /(?:Chrome|CriOS)\/([\d.]+)/],
    ["Safari", /Version\/([\d.]+).*Safari\//],
  ];
  const product = products.find(([, pattern]) => pattern.test(userAgent));
  const chromium = /(?:Chrome|Chromium)\/([\d.]+)/.exec(userAgent)?.[1];
  const webkit = /AppleWebKit\/([\d.]+)/.exec(userAgent)?.[1];
  const gecko = /Gecko\//.test(userAgent) ? /rv:([\d.]+)/.exec(userAgent)?.[1] : undefined;
  return {
    name: product?.[0] || "unknown",
    version: product?.[1].exec(userAgent)?.[1] || "unknown",
    engine: chromium ? "Blink" : webkit ? "WebKit" : gecko ? "Gecko" : "unknown",
    engineVersion: chromium || webkit || gecko || "unknown",
    os: /Android/i.test(userAgent)
      ? "Android"
      : /iPhone|iPad|iPod/.test(userAgent)
        ? "iOS"
        : /Windows/.test(userAgent)
          ? "Windows"
          : /Macintosh|Mac OS X/.test(userAgent)
            ? "macOS"
            : /Linux/.test(userAgent)
              ? "Linux"
              : "unknown",
    mobile: /Mobile|Android|iPhone|iPad|iPod/.test(userAgent),
  };
}

/** Locale codes convey language context without accepting arbitrary page text as a language identifier. */
export function diagnosticLocale(value: string | undefined): string {
  return value && /^[a-z]{2,3}(?:-[a-z0-9]{2,8}){0,3}$/i.test(value) ? value : "unknown";
}
