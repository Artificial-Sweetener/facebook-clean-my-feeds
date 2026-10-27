// SPDX-License-Identifier: GPL-3.0-only

import { browserIdentity, diagnosticLocale } from "../../../src/core/diagnostics/environment";
import { getScriptInfo, buildEnvironmentSnapshot } from "../../../src/diagnostics/serialization";

afterEach(() => {
  globalThis.GM = undefined;
  jest.restoreAllMocks();
});

test.each([
  [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
    "Firefox",
    "144.0",
    "Gecko",
    "Windows",
  ],
  [
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/141.0.7390.122 Safari/537.36 Edg/141.0.3537.85",
    "Edge",
    "141.0.3537.85",
    "Blink",
    "Windows",
  ],
  [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
    "Safari",
    "18.0",
    "WebKit",
    "macOS",
  ],
  [
    "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/141.0.0.0 Mobile Safari/537.36",
    "Chrome",
    "141.0.0.0",
    "Blink",
    "Android",
  ],
])(
  "records product versions without retaining arbitrary user-agent text",
  (source, name, version, engine, os) => {
    expect(browserIdentity(source || "")).toMatchObject({ name, version, engine, os });
  }
);

test("arbitrary browser metadata and page language cannot introduce private strings", () => {
  jest.spyOn(navigator, "userAgent", "get").mockReturnValue("PrivateUserAgent-SecretIdentity");
  document.documentElement.lang = "PrivateLanguageValue";
  const environment = buildEnvironmentSnapshot();
  expect(JSON.stringify(environment)).not.toMatch(
    /PrivateUserAgent|SecretIdentity|PrivateLanguageValue/
  );
  expect(environment.browser.name).toBe("unknown");
  expect(diagnosticLocale("zh-Hant")).toBe("zh-Hant");
  expect(diagnosticLocale("ar")).toBe("ar");
  document.documentElement.removeAttribute("lang");
});

test("records the userscript manager version separately from the script version and source identity", () => {
  globalThis.GM = {
    info: { script: { version: "6.3.2" }, scriptHandler: "Violentmonkey", version: "2.31.0" },
  };
  expect(getScriptInfo()).toMatchObject({
    version: "6.3.2",
    handler: "Violentmonkey",
    handlerVersion: "2.31.0",
    buildIdentity: "unbundled",
  });
});
