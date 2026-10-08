/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only
import ts from "typescript";
import { compilerPolicyProblems } from "../../tools/governance/configuration";

import policy from "../../governance/policy.json";
import inventory from "../../governance/source-inventory.json";
import { assertSupportedNode } from "../../tools/check-node";
import { localeProblems } from "../../tools/check-locales";
import { documentationProblems } from "../../tools/governance/documentation";
import { coversViolation, exceptionProblems } from "../../tools/governance/exceptions";
import { fingerprint, inventoryProblems, nonCommentLines } from "../../tools/governance/files";
import { findCycles, layerFor, moduleReferences } from "../../tools/governance/graph";
import type { ReviewedException } from "../../tools/governance/types";

/** Parse isolated fixtures with parents enabled so declaration ownership matches repository checking. */
function source(text: string): ts.SourceFile {
  return ts.createSourceFile("fixture.ts", text, ts.ScriptTarget.Latest, true);
}

/** Supply a specific shrinking review whose clock is fixed, so tests never depend on today's date. */
function reviewedException(): ReviewedException {
  return {
    rule: "size",
    file: "src/feeds/news.ts",
    fingerprint: fingerprint("reviewed source"),
    owner: "maintainer@example.test",
    reason: "The remaining rendering paths share a state transition contract.",
    extraction: "Extract the right-rail discovery and mutation helpers before the next review.",
    reviewedAt: "2026-01-01T00:00:00Z",
    expires: "2026-02-01T00:00:00Z",
    cap: 550,
    previousCap: 600,
  };
}

const reviewTime = new Date("2026-01-10T00:00:00Z");

describe("compiler and runtime contracts", () => {
  test.each(["22.14.0", "22.20.0"])("accepts supported Node %s", (version) => {
    expect(() => assertSupportedNode(version)).not.toThrow();
  });
  test.each(["18.20.0", "22.13.9", "23.0.0", "24.0.0"])(
    "rejects unsupported Node %s",
    (version) => {
      expect(() => assertSupportedNode(version)).toThrow("Node >=22.14.0 <23");
    }
  );
  test("preserves empty and array-valued labels while checking reviewed extras", () => {
    expect(
      localeProblems({ en: { label: [] }, vi: { label: "", extra: "copy" } }, { vi: ["extra"] })
    ).toEqual([]);
    expect(localeProblems({ en: { label: "copy" }, vi: { wrong: "copy" } }, {})).toEqual([
      "vi: missing label",
      "vi: unreviewed extra wrong",
    ]);
  });
});

describe("complete source ownership", () => {
  test("includes unreachable tests and tools rather than checking only entry dependencies", () => {
    expect(
      inventoryProblems(
        ["tests/unused.test.ts", "tools/unused.ts", "tsconfig.browser.json"],
        inventory
      )
    ).toEqual([]);
    expect(inventoryProblems(["src/orphan.js"], inventory)).toHaveLength(1);
  });
  test("assigns the DOM utility before generic pure utilities", () => {
    expect(layerFor("src/utils/dom.ts", policy.layers)?.name).toBe("dom");
    expect(layerFor("src/utils/random.ts", policy.layers)?.name).toBe("pure-utils");
    expect(layerFor("src/core/rules/feed-rules.ts", policy.layers)?.allows).not.toContain("ui");
  });
  test("extracts syntax edges without treating comments and ordinary strings as imports", () => {
    const references = moduleReferences(
      source(`
      // import './comment';
      const text = "require('./text')";
      import type { Contract } from './types';
      export { value } from './value';
      type Other = import('./other').Other;
      require('./required');
      import('./lazy');
      import(variable);
    `)
    );
    expect(references).toEqual([
      "./types",
      "./value",
      "./other",
      "./required",
      "./lazy",
      "<dynamic>",
    ]);
  });
  test("reports cycles in disconnected modules and ignores converging acyclic edges", () => {
    expect(
      findCycles(
        new Map([
          ["entry", new Set(["leaf"])],
          ["leaf", new Set<string>()],
          ["orphan-a", new Set(["orphan-b"])],
          ["orphan-b", new Set(["orphan-a"])],
        ])
      )
    ).toEqual([["orphan-a", "orphan-b", "orphan-a"]]);
    expect(
      findCycles(
        new Map([
          ["a", new Set(["c"])],
          ["b", new Set(["c"])],
          ["c", new Set<string>()],
        ])
      )
    ).toEqual([]);
  });
});

describe("size and documentation contracts", () => {
  test("counts code and multiline data but not standalone comments or blank lines", () => {
    expect(
      nonCommentLines(
        "// ignored\n\nconst x = 1; // ignored\n/* comment\nmore comment */\nconst y = `a\nb`;\n"
      )
    ).toBe(3);
  });
  test("requires useful JSDoc on declared helpers, methods, classes and exported contracts", () => {
    expect(documentationProblems(source("function helper() {}"))).toHaveLength(1);
    expect(documentationProblems(source("/** Helper. */ function helper() {}"))).toHaveLength(1);
    expect(
      documentationProblems(
        source(
          "/** Bound retries so repeated mutations cannot monopolize the page. */ function helper() {}"
        )
      )
    ).toEqual([]);
    expect(
      documentationProblems(source("export interface Contract { run(): void; }"))
    ).toHaveLength(2);
    expect(documentationProblems(source("class Worker { run() {} }"))).toHaveLength(2);
  });
  test("documents named object-property operations as public callables", () => {
    expect(
      documentationProblems(source("const operations = { save: async () => {} };"))
    ).toHaveLength(1);
    expect(
      documentationProblems(
        source(
          "const operations = { /** Persist only validated settings after the user saves. */ save: async () => {} };"
        )
      )
    ).toEqual([]);
  });
  test.each([
    "const value = (input as unknown) as Contract;",
    "const value = <Contract><unknown>input;",
    "const value = (<unknown>input) as Contract;",
    "const value = <Contract>(input as unknown);",
  ])("rejects grouped and mixed double-assertion syntax: %s", (text) => {
    expect(documentationProblems(source(text)).some((issue) => issue.rule === "type-safety")).toBe(
      true
    );
  });
  test("covers class expressions, class-field operations and explicitly named callbacks", () => {
    expect(
      documentationProblems(source("const Handler = class { save = () => {}; };"))
    ).toHaveLength(2);
    expect(documentationProblems(source("register(function namedCallback() {});"))).toHaveLength(1);
  });
  test("anonymous local callbacks rely on the documented enclosing operation", () => {
    expect(documentationProblems(source("items.map((item) => item.id);"))).toEqual([]);
  });
  test("requires parameter and result semantics for longer operations", () => {
    const lines = Array.from({ length: 25 }, (_, index) => `const value${index} = input;`).join(
      "\n"
    );
    const issues = documentationProblems(
      source(
        `/** Accumulate separate observations before evaluating the final contract. */ function inspect(input: number) {\n${lines}\nreturn input;\n}`
      )
    );
    expect(issues.map((issue) => issue.detail)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("@param semantics for input"),
        expect.stringContaining("@returns semantics"),
      ])
    );
  });
  test("rejects explicit any, double assertions and actual suppression comments", () => {
    expect(
      documentationProblems(source("const value: any = undefined;")).some(
        (issue) => issue.rule === "type-safety"
      )
    ).toBe(true);
    expect(
      documentationProblems(source("const value = input as unknown as Contract;")).some(
        (issue) => issue.rule === "type-safety"
      )
    ).toBe(true);
    expect(
      documentationProblems(source("// @ts-ignore\nconst value = missing;")).some(
        (issue) => issue.rule === "type-safety"
      )
    ).toBe(true);
    expect(documentationProblems(source('const example = "@ts-ignore";'))).toEqual([]);
  });
});

describe("precise temporary exceptions", () => {
  test("accepts an exact, owned, unexpired approval with a decreasing cap", () => {
    const entry = reviewedException();
    expect(exceptionProblems(entry, entry.fingerprint, policy, reviewTime)).toEqual([]);
    expect(
      coversViolation(entry, { rule: "size", file: entry.file, detail: "oversized", lines: 540 })
    ).toBe(true);
    expect(
      coversViolation(entry, { rule: "size", file: entry.file, detail: "growing", lines: 551 })
    ).toBe(false);
  });
  test("invalidates changed content and expired approvals", () => {
    const entry = reviewedException();
    expect(exceptionProblems(entry, fingerprint("modified source"), policy, reviewTime)).toContain(
      "Fingerprint no longer matches reviewed content"
    );
    expect(
      exceptionProblems(entry, entry.fingerprint, policy, new Date("2026-03-01T00:00:00Z"))
    ).toContain("Review has expired");
  });
  test("rejects wildcard, unowned, open-ended and non-decreasing approvals", () => {
    const entry = {
      ...reviewedException(),
      file: "src/**",
      owner: "",
      expires: "2027-01-01T00:00:00Z",
      cap: 600,
    };
    const issues = exceptionProblems(entry, entry.fingerprint, policy, reviewTime);
    expect(issues).toEqual(
      expect.arrayContaining([
        "Path must identify one file",
        "Named review owner is required",
        "Review exceeds 90 days",
        "Size approval needs an explicit cap smaller than the prior reviewed cap",
      ])
    );
  });
  test("never applies an approval to another rule or file", () => {
    const entry = reviewedException();
    expect(coversViolation(entry, { rule: "cycle", file: entry.file, detail: "cycle" })).toBe(
      false
    );
    expect(
      coversViolation(entry, { rule: "size", file: "src/ui/dialog.ts", detail: "size", lines: 510 })
    ).toBe(false);
  });
});

describe("strict inherited compiler policy", () => {
  test.each([
    "noImplicitAny",
    "noImplicitThis",
    "strictNullChecks",
    "strictFunctionTypes",
    "strictBindCallApply",
    "strictPropertyInitialization",
    "strictBuiltinIteratorReturn",
    "alwaysStrict",
    "useUnknownInCatchVariables",
  ] as const)("rejects %s:false beneath strict:true", (flag) => {
    const parsed = ts.parseJsonConfigFileContent(
      { extends: "./tsconfig.browser.json", compilerOptions: { [flag]: false } },
      ts.sys,
      process.cwd()
    );
    expect(parsed.errors).toEqual([]);
    expect(
      compilerPolicyProblems(parsed.options, "fixture").some((problem) =>
        problem.detail.includes(flag)
      )
    ).toBe(true);
  });
  test.each(["noCheck", "skipLibCheck", "skipDefaultLibCheck"] as const)(
    "rejects %s source/declaration bypass",
    (flag) => {
      const parsed = ts.parseJsonConfigFileContent(
        { extends: "./tsconfig.browser.json", compilerOptions: { [flag]: true } },
        ts.sys,
        process.cwd()
      );
      expect(
        compilerPolicyProblems(parsed.options, "fixture").some((problem) =>
          problem.detail.includes(flag)
        )
      ).toBe(true);
    }
  );
  test("accepts the complete inherited browser strict policy", () => {
    const parsed = ts.parseJsonConfigFileContent(
      { extends: "./tsconfig.browser.json" },
      ts.sys,
      process.cwd()
    );
    expect(compilerPolicyProblems(parsed.options, "fixture")).toEqual([]);
  });
});
