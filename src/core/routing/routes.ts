// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../options/types";

/** Route ownership is represented as independent legacy flags for compatibility with feed runners. */
export interface FeedRoute {
  isNF: boolean;
  isGF: boolean;
  isVF: boolean;
  isMF: boolean;
  isSF: boolean;
  isRF: boolean;
  isPP: boolean;
  isAF: boolean;
  gfType: string;
  vfType: string;
  mpType: string;
}

/**
 * Classify Facebook routes without reading location or touching the page.
 *
 * @param pathname - URL pathname only; historical path checks remain intentionally unchanged.
 * @param search - Query including its leading question mark.
 * @param options - Reels routes activate only when a supported video modification is enabled.
 * @returns Fresh flags; callers replace every prior flag to avoid carrying a previous feed across navigation.
 */
export function classifyRoute(pathname: string, search: string, options: Options): FeedRoute {
  const route: FeedRoute = {
    isNF: false,
    isGF: false,
    isVF: false,
    isMF: false,
    isSF: false,
    isRF: false,
    isPP: false,
    isAF: false,
    gfType: "",
    vfType: "",
    mpType: "",
  };
  if (pathname === "/" || pathname === "/home.php") {
    if (search.indexOf("?filter=groups") < 0) {
      route.isNF = true;
    } else {
      route.isGF = true;
      route.gfType = "groups-recent";
    }
  } else if (pathname.includes("/groups/")) {
    route.isGF = true;
    if (pathname.includes("/groups/feed")) {
      route.gfType = "groups";
    } else if (pathname.includes("/groups/search")) {
      route.gfType = "search";
    } else if (pathname.includes("?filter=groups&sk=h_chr")) {
      route.gfType = "groups-recent";
    } else {
      route.gfType = "group";
    }
  } else if (pathname.includes("/watch")) {
    route.isVF = true;
    if (pathname.includes("/watch/search")) {
      route.vfType = "search";
    } else if (search.includes("?ref=seach")) {
      route.vfType = "item";
    } else if (search.includes("?v=")) {
      route.vfType = "item";
    } else {
      route.vfType = "videos";
    }
  } else if (pathname.includes("/marketplace")) {
    route.isMF = true;
    if (route.isMF && pathname.includes("/item/")) {
      route.mpType = "item";
    } else if (pathname.includes("/search")) {
      route.mpType = "search";
    } else if (pathname.includes("/category/")) {
      route.mpType = "category";
    } else {
      const urlBits = pathname.split("/");
      if (urlBits.length > 3) {
        route.mpType = "category";
      } else {
        route.mpType = "marketplace";
      }
    }
  } else if (pathname.includes("/commerce/listing/")) {
    route.isMF = true;
    route.mpType = "item";
  } else if (
    ["/search/top/", "/search/top", "/search/posts/", "/search/posts", "/search/pages/"].includes(
      pathname
    )
  ) {
    route.isSF = true;
  } else if (pathname.includes("/reel/")) {
    route.isRF = options.REELS_CONTROLS === true || options.REELS_DISABLE_LOOPING === true;
  } else if (pathname.includes("/profile.php")) {
    route.isPP = true;
  } else if (pathname.substring(1).length > 1 && pathname.substring(1).indexOf("/") < 0) {
    route.isPP = true;
  }

  route.isAF =
    route.isNF || route.isGF || route.isVF || route.isMF || route.isSF || route.isRF || route.isPP;
  return route;
}
