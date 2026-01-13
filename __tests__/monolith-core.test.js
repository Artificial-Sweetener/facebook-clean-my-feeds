const { loadFunctions } = require("../tests/helpers/monolith-loader");

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("monolith core helpers", () => {
  test("cleanText normalizes fullwidth characters", () => {
    const { cleanText } = loadFunctions(["cleanText"]);
    const fullWidthA = String.fromCharCode(0xff21);

    expect(cleanText(fullWidthA)).toBe("A");
  });

  test("findFirstMatch returns the first matching entry", () => {
    const { findFirstMatch } = loadFunctions(["findFirstMatch"]);

    const text = "alpha beta gamma";
    const matches = ["gamma", "beta"];

    expect(findFirstMatch(text, matches)).toBe("gamma");
  });

  test("findFirstMatch returns empty string when no entries match", () => {
    const { findFirstMatch } = loadFunctions(["findFirstMatch"]);

    expect(findFirstMatch("alpha", ["beta", "gamma"])).toBe("");
  });

  test("findFirstMatchRegExp matches case-insensitively", () => {
    const { findFirstMatchRegExp } = loadFunctions(["findFirstMatchRegExp"]);

    const text = "Hello FOO123 world";
    const patterns = ["foo\\d+"];

    expect(findFirstMatchRegExp(text, patterns)).toBe("foo\\d+");
  });
});

describe("monolith sponsored detection (plain)", () => {
  test("nf_isSponsored_Plain detects sponsored label via dictionary", () => {
    const VARS = { dictionarySponsored: ["sponsored"] };
    const { nf_isSponsored_Plain } = loadFunctions(["nf_isSponsored_Plain"], {
      VARS,
      document,
    });

    const post = document.createElement("div");
    post.innerHTML = '<div id="x"><span><a role="link"><span>Sponsored</span></a></span></div>';

    expect(nf_isSponsored_Plain(post)).toBe(true);
  });

  test("nf_isSponsored_Plain returns false when dictionary does not match", () => {
    const VARS = { dictionarySponsored: ["sponsored"] };
    const { nf_isSponsored_Plain } = loadFunctions(["nf_isSponsored_Plain"], {
      VARS,
      document,
    });

    const post = document.createElement("div");
    post.innerHTML = '<div id="x"><span><a role="link"><span>Partnered</span></a></span></div>';

    expect(nf_isSponsored_Plain(post)).toBe(false);
  });
});

describe("monolith sponsored detection (shadow root)", () => {
  test("nf_isSponsored_ShadowRoot1 detects sponsored label via aria-labelledby", () => {
    const VARS = { dictionarySponsored: ["sponsored"] };
    const { nf_isSponsored_ShadowRoot1 } = loadFunctions(["nf_isSponsored_ShadowRoot1"], {
      VARS,
      document,
    });

    const label = document.createElement("span");
    label.id = ":sponsoredLabel";
    label.textContent = "Sponsored";
    document.body.appendChild(label);

    const post = document.createElement("div");
    post.innerHTML =
      '<a><span><span aria-labelledby=":sponsoredLabel"><canvas></canvas></span></span></a>';

    expect(nf_isSponsored_ShadowRoot1(post)).toBe(true);
  });
});

describe("monolith sponsored detection (link heuristic)", () => {
  test("isSponsored flags long __cft__ links in news feed posts", () => {
    const VARS = {
      dictionarySponsored: ["sponsored"],
      isNF: true,
      isGF: false,
      isVF: false,
      isSF: false,
    };
    const {
      isSponsored,
      nf_isSponsored_Plain,
      nf_isSponsored_ShadowRoot1,
      nf_isSponsored_ShadowRoot2,
    } = loadFunctions(
      [
        "isSponsored",
        "nf_isSponsored_Plain",
        "nf_isSponsored_ShadowRoot1",
        "nf_isSponsored_ShadowRoot2",
      ],
      { VARS, document }
    );

    const longParam = "__cft__[0]=" + "x".repeat(320);
    const post = document.createElement("div");
    post.innerHTML = `<div aria-posinset="1"><span><a href="https://www.facebook.com/?${longParam}">Link</a></span></div>`;

    expect(isSponsored(post)).toBe(true);
    expect(nf_isSponsored_Plain(post)).toBe(false);
    expect(nf_isSponsored_ShadowRoot1(post)).toBe(false);
    expect(nf_isSponsored_ShadowRoot2(post)).toBe(false);
  });

  test("isSponsored ignores short __cft__ links", () => {
    const VARS = {
      dictionarySponsored: ["sponsored"],
      isNF: true,
      isGF: false,
      isVF: false,
      isSF: false,
    };
    const {
      isSponsored,
      nf_isSponsored_Plain,
      nf_isSponsored_ShadowRoot1,
      nf_isSponsored_ShadowRoot2,
    } = loadFunctions(
      [
        "isSponsored",
        "nf_isSponsored_Plain",
        "nf_isSponsored_ShadowRoot1",
        "nf_isSponsored_ShadowRoot2",
      ],
      { VARS, document }
    );

    const shortParam = "__cft__[0]=" + "x".repeat(10);
    const post = document.createElement("div");
    post.innerHTML = `<div aria-posinset="1"><span><a href="https://www.facebook.com/?${shortParam}">Link</a></span></div>`;

    expect(isSponsored(post)).toBe(false);
    expect(nf_isSponsored_Plain(post)).toBe(false);
    expect(nf_isSponsored_ShadowRoot1(post)).toBe(false);
    expect(nf_isSponsored_ShadowRoot2(post)).toBe(false);
  });
});
