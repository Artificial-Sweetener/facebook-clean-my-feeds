// SPDX-License-Identifier: GPL-3.0-only

/** Known route words can remain useful while every variable segment is replaced with a label. */
interface RoutePrivacyRule {
  identifier: string;
  firstSegments: ReadonlySet<string>;
  laterSegments: ReadonlySet<string>;
}

const contentSections = new Set([
  "posts",
  "permalink",
  "photos",
  "videos",
  "reels",
  "about",
  "friends",
  "followers",
  "following",
  "members",
  "events",
  "media",
]);
const staticRoots = new Set([
  "home.php",
  "profile.php",
  "feed",
  "saved",
  "memories",
  "notifications",
  "settings",
]);
const identifierLabels = new Map([
  ["posts", "[post]"],
  ["permalink", "[post]"],
  ["photos", "[photo]"],
  ["videos", "[video]"],
  ["reel", "[reel]"],
  ["reels", "[reel]"],
  ["item", "[item]"],
  ["listing", "[item]"],
  ["category", "[category]"],
]);
const routeRules = new Map<string, RoutePrivacyRule>([
  [
    "groups",
    {
      identifier: "[group]",
      firstSegments: new Set(["feed", "search", "discover", "joins", "create"]),
      laterSegments: contentSections,
    },
  ],
  ["reel", { identifier: "[reel]", firstSegments: new Set(), laterSegments: new Set() }],
  ["reels", { identifier: "[reel]", firstSegments: new Set(), laterSegments: new Set() }],
  [
    "watch",
    {
      identifier: "[video]",
      firstSegments: new Set(["search", "live", "shows", "saved"]),
      laterSegments: new Set(),
    },
  ],
  [
    "search",
    {
      identifier: "[segment]",
      firstSegments: new Set([
        "top",
        "posts",
        "pages",
        "people",
        "photos",
        "videos",
        "groups",
        "events",
        "marketplace",
      ]),
      laterSegments: new Set(),
    },
  ],
  [
    "marketplace",
    {
      identifier: "[location]",
      firstSegments: new Set(["item", "np", "search", "category", "you", "create", "saved"]),
      laterSegments: new Set(["item", "category", "search", "selling", "buying"]),
    },
  ],
  [
    "commerce",
    { identifier: "[segment]", firstSegments: new Set(["listing"]), laterSegments: new Set() },
  ],
]);

/**
 * Preserve feed routing structure without publishing profile names, group names, or content IDs.
 * Only exact known route words are retained; encoded and unknown values are replaced without decoding.
 * @param pathname Browser pathname without query or fragment components.
 * @returns An absolute structural path whose variable segments contain descriptive placeholders.
 */
export function sanitizePathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const root = segments[0];
  if (!root) return "/";
  const rule = routeRules.get(root);
  const knownRoot = Boolean(rule) || staticRoots.has(root);
  const safeSegments = [knownRoot ? root : "[profile]"];
  for (const [offset, segment] of segments.slice(1).entries()) {
    const index = offset + 1;
    const previous = segments[index - 1] ?? "";
    if (index > 1 && identifierLabels.has(previous)) {
      safeSegments.push(identifierLabels.get(previous) ?? "[segment]");
      continue;
    }
    const staticSegments = index === 1 ? rule?.firstSegments : rule?.laterSegments;
    const allowed = staticSegments ?? (knownRoot ? new Set<string>() : contentSections);
    if (allowed.has(segment)) safeSegments.push(segment);
    else safeSegments.push(index === 1 ? (rule?.identifier ?? "[segment]") : "[segment]");
  }
  return `/${safeSegments.join("/")}${pathname.endsWith("/") ? "/" : ""}`;
}
