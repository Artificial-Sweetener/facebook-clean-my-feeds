// SPDX-License-Identifier: GPL-3.0-only
import { classifyRoute } from "../../src/core/routing/routes";
import { setFeedSettings } from "../../src/runtime/routes";
import { createState } from "../../src/runtime/state";

describe("pure Facebook routing", () => {
  test.each([
    ["/", "", "isNF"],
    ["/home.php", "?filter=groups", "isGF"],
    ["/groups/example", "", "isGF"],
    ["/watch/search", "", "isVF"],
    ["/marketplace/search", "", "isMF"],
    ["/commerce/listing/123", "", "isMF"],
    ["/search/posts/", "", "isSF"],
    ["/reel/123", "", "isRF"],
    ["/profile.php", "?id=1", "isPP"],
    ["/person.name", "", "isPP"],
  ] as const)("classifies %s%s", (path, search, flag) => {
    const route = classifyRoute(path, search, { REELS_CONTROLS: true });
    expect(route[flag]).toBe(true);
    expect(route.isAF).toBe(true);
  });

  test("keeps inactive Reels pages and unrelated multi-part routes inactive", () => {
    expect(classifyRoute("/reel/123", "", {}).isAF).toBe(false);
    expect(classifyRoute("/settings/privacy", "", {}).isAF).toBe(false);
  });

  test.each(["/settings", "/settings/", "/settings/privacy", "/privacy", "/privacy/"])(
    "keeps reserved application route %s out of username profiles",
    (path) => {
      expect(classifyRoute(path, "?ref=home", {}).isAF).toBe(false);
    }
  );

  test.each(["/login", "/login/", "/login.php", "/login.php/", "/help", "/help/"])(
    "keeps official account/help endpoint %s unsupported across query and hash transitions",
    (path) => {
      const state = createState();
      state.showAtt = "cmf-visible";
      state.btnToggleEl = document.createElement("button");
      for (const suffix of ["", "?next=%2Fhelp%2F", "?next=%2Fhelp%2F#account"]) {
        setFeedSettings(state, {}, false, new URL("https://www.facebook.com/"));
        setFeedSettings(state, {}, false, new URL(`https://www.facebook.com${path}${suffix}`));
        expect(state.isAF).toBe(false);
        expect(state.btnToggleEl.hasAttribute(state.showAtt)).toBe(false);
      }
    }
  );

  test.each(["/reels", "/reels/", "/reel/123/"])(
    "activates %s only when a Reels modification is enabled",
    (path) => {
      expect(classifyRoute(path, "", {}).isAF).toBe(false);
      expect(classifyRoute(path, "", { REELS_CONTROLS: true }).isRF).toBe(true);
      expect(classifyRoute(path, "", { REELS_DISABLE_LOOPING: true }).isRF).toBe(true);
    }
  );

  test.each([
    "/person.name",
    "/person.name/",
    "/login-fan",
    "/login-fan/",
    "/helpful",
    "/helpful/",
  ])("retains username profile %s", (path) => {
    expect(classifyRoute(path, "?ref=home", {}).isPP).toBe(true);
  });

  test("retains historical group, video and marketplace subtype contracts", () => {
    expect(classifyRoute("/groups/feed", "", {}).gfType).toBe("groups");
    expect(classifyRoute("/watch", "?v=123", {}).vfType).toBe("item");
    expect(classifyRoute("/marketplace/example/category", "", {}).mpType).toBe("category");
  });
});

describe("route transitions", () => {
  test("clear prior flags, counters and topbar visibility without replacing state", () => {
    const state = createState();
    state.showAtt = "cmf-visible";
    state.btnToggleEl = document.createElement("button");
    const original = state;
    setFeedSettings(state, {}, true, {
      href: "https://www.facebook.com/",
      pathname: "/",
      search: "",
    });
    expect(state.isNF).toBe(true);
    expect(state.btnToggleEl.hasAttribute(state.showAtt)).toBe(true);
    state.echoCount = 5;
    state.noChangeCounter = 20;
    state.lastNewsPostSweepAt = 50;
    setFeedSettings(state, {}, false, {
      href: "https://www.facebook.com/settings/privacy",
      pathname: "/settings/privacy",
      search: "",
    });
    expect(state).toBe(original);
    expect(state.isNF).toBe(false);
    expect(state.isAF).toBe(false);
    expect(state.echoCount).toBe(0);
    expect(state.noChangeCounter).toBe(0);
    expect(state.lastNewsPostSweepAt).toBe(0);
    expect(state.btnToggleEl.hasAttribute(state.showAtt)).toBe(false);
  });

  test("rapid query/hash and supported/unsupported transitions publish current visibility", () => {
    const state = createState();
    state.showAtt = "cmf-visible";
    state.btnToggleEl = document.createElement("button");
    for (let cycle = 0; cycle < 10; cycle += 1) {
      for (const [suffix, visible] of [
        ["/?q=one#first", true],
        ["/?q=two#second", true],
        ["/settings?ref=home#privacy", false],
        ["/person.name/?ref=home#posts", true],
        ["/settings/privacy/#other", false],
      ] as const) {
        const location = new URL(`https://www.facebook.com${suffix}`);
        setFeedSettings(state, {}, false, location);
        expect(state.isAF).toBe(visible);
        expect(state.btnToggleEl.hasAttribute(state.showAtt)).toBe(visible);
        expect(state.prevURL).toBe(location.href);
      }
    }
  });

  test("unchanged URLs are skipped unless options require a forced refresh", () => {
    const state = createState();
    const location = { href: "https://www.facebook.com/reel/1", pathname: "/reel/1", search: "" };
    expect(setFeedSettings(state, {}, false, location)).toBe(true);
    expect(setFeedSettings(state, { REELS_CONTROLS: true }, false, location)).toBe(false);
    expect(setFeedSettings(state, { REELS_CONTROLS: true }, true, location)).toBe(true);
    expect(state.isRF).toBe(true);
  });
});
