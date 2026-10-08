// SPDX-License-Identifier: GPL-3.0-only
import { buildBugReport } from "../../src/diagnostics/bug-report";
import { routeContext } from "./routes-fixtures";
import { getScriptsSample } from "../../src/diagnostics/serialization";

/** Create source attributes without executing third-party code or fetching any resource. */
function scriptSource(value?: string): HTMLScriptElement {
  const script = document.createElement("script");
  if (value !== undefined) script.setAttribute("src", value);
  document.head.appendChild(script);
  return script;
}

afterEach(() => document.head.querySelectorAll("script").forEach((script) => script.remove()));

describe("diagnostic script-source privacy", () => {
  test.each([
    ["data:text/javascript,private_payload_sentinel", "data-script"],
    ["blob:https://www.facebook.com/private-session-sentinel", "blob-script"],
    ["javascript:private_payload_sentinel", "javascript-script"],
    ["moz-extension://private-extension-sentinel/content.js", "extension-script"],
    ["chrome-extension://private-extension-sentinel/content.js", "extension-script"],
    ["private-sentinel:private_payload_sentinel", "other-script"],
    ["http://[private-invalid-sentinel", "unparseable-script"],
  ])("redacts non-network script source %s", (source, sentinel) => {
    scriptSource(source);
    const samples = getScriptsSample();
    expect(samples).toEqual([sentinel]);
    expect(JSON.stringify(samples)).not.toContain("private");
  });

  test("keeps useful network paths while removing credentials, queries and fragments", () => {
    scriptSource(
      "https://private-user:private-pass@static.example.test/assets/main.js?private_token=secret#private-fragment"
    );
    expect(getScriptsSample()).toEqual(["https://static.example.test/assets/main.js"]);
  });

  test("retains inline-script sentinels and bounds source samples", () => {
    scriptSource();
    scriptSource("https://static.example.test/one.js");
    scriptSource("https://static.example.test/two.js");
    expect(getScriptsSample(2)).toEqual(["inline-script", "https://static.example.test/one.js"]);
  });
});

test("report identifies quarantined regex coordinates without leaking private patterns", () => {
  const context = routeContext("/", {
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_RE: true,
    NF_BLOCKED_TEXT: "[private-pattern-sentinelİİvalid",
  });
  const report = buildBugReport(context);
  expect(report.data.regexValidationIssues).toEqual([
    { field: "NF_BLOCKED_TEXT", line: 1, destination: "NF" },
  ]);
  expect(report.text).not.toContain("private-pattern-sentinel");
});
