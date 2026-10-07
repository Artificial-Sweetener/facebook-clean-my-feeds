# Assistant Engineering Guidelines

You are contributing to `facebook-clean-my-feeds`. Your primary goal is **stability, correctness, and clarity**.

## 1) Prime Directive: Production Quality

- **Stability > Velocity:** Favor safe, readable changes over quick fixes.
- **Zero Debt:** Do not leave commented-out code, temporary debug logs, or TODOs.
- **Graceful Failure:** Never break the page; guard DOM access and handle errors at the boundary.

## 2) Architecture & Separation of Concerns

Keep the modular structure clean:

- `src/core/` for pure logic (no DOM access).
- `src/selectors/` for CSS selectors only.
- `src/feeds/` for per-feed DOM logic and mutations.
- `src/dom/` for shared DOM helpers and mutation scheduling.
- `src/ui/` for settings dialog and controls; `src/i18n/` for independent locale catalogs.
- `src/storage/` for persistence wrappers.

## 3) Public Contract & Compatibility

The public contract is:

- Userscript behavior (what users see and filter outcomes).
- The userscript metadata header.
- The settings UI and options.
- The README (installation + usage).

Do not change user-visible behavior unless explicitly requested. Internal refactors are fine, but remove old paths in the same change when migrating.

## 4) Documentation

- **No docs/ tree.** Keep documentation limited to `README.md` and approved localized README variants.
- **Mandatory docstrings:** Every declared function, method, class, and non-obvious exported contract must have a useful TypeScript-compatible JSDoc comment. Use full Google-style substance where complexity warrants it and a concise comment where it does not. A docstring must never merely restate the name or what the code obviously does.
- **Documentation substance:** Explain purpose and why, contracts, invariants, side effects, errors, units, and non-obvious parameters or results as applicable. Complex functions must document Args, Returns, Raises, and examples when meaningful, using TypeScript-compatible `@param`, `@returns`, `@throws`, and `@example` sections. Type annotations are the source of truth for types; comments explain semantics.
- **Coverage:** Follow this guidance throughout the TypeScript port, including runtime modules, tests, and tools. Anonymous callbacks may rely on the documented enclosing operation when their semantics are local and self-evident.
- **Self-documenting code:** Prefer expressive function and variable names.

### Localization

Treat user-facing copy as an all-locales surface. This includes `src/i18n/locales/en.ts`, `README.md`, and any localized README variants.

Any change to existing user-facing text must be updated across every supported locale in the same change. Do not make English-only wording edits unless the user explicitly requests an English-only change.

Write translations as natural product copy in each language, not rigid word-for-word conversions from English. Preserve tone, clarity, and intent so the text feels native to that language.

When localized README files exist, keep them in sync with the English README for substantive content, setup steps, feature descriptions, warnings, and credits. Localized README wording may adapt for natural flow, but it must not drift in meaning or omit important changes.

## 5) Naming & Casing (JS Norms)

- `camelCase` for variables, functions, and methods.
- `PascalCase` for classes/constructors.
- Use `UPPER_SNAKE_CASE` only for true module-level constants if it improves clarity; otherwise stay with `camelCase`.
- Files and folders should be consistent; prefer `kebab-case` for files unless a pattern already exists.

## 6) Verification

Run the project’s lint, test, and build scripts when available. If no scripts exist yet, call that out clearly.

### Localization Checks

When adding new strings to `src/i18n/locales/en.ts`, ensure you add them to the English (`en`) block. After any UI localization change, run:

```bash
npm run check:locales
```

This tool compares all supported languages against the English baseline and reports missing keys.

## 7) Commit Messages

When asked to draft a commit, use Conventional Commits: `type(scope): subject`.

## 8) TypeScript and Repository Governance

- Use Node >=22.14.0 <23; `.nvmrc` and CI pin 22.14.0. Install with `npm ci`.
- Author source, tests, and tools in TypeScript. Only `fb-clean-my-feeds.user.js` may remain tracked JavaScript; metadata is `src/entry/metadata.txt` and executable configs are replaced by JSON.
- `npm run verify` is the single required local/CI gate. Do not substitute selected checks for the complete gate.
- Keep browser, pure core, tools, and test type scopes strict with `noEmit`, `allowJs: false`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. Never hide failures with `any`, double assertions, `ts-ignore`, `ts-nocheck`, or excluded problem files.
- Respect the AST-checked ownership in `governance/policy.json`. Core has no DOM, UI, or storage dependencies; i18n is independent; application owns workflow contracts; runtime/entry compose live state. Type-only imports also count, and cycles fail.
- Modules over 350 non-comment lines require review; 500 is the default hard cap. All runtime, declaration, tool, and test files are included, even if unreachable from the entry point.
- Keep the mandatory substantive docstring rules above. The executable checker cannot replace human review of semantics or justify tautological filler.
- Exceptions must be exact-fingerprint, owned, expiring within 90 days, and have concrete extraction plans. Size caps must decrease from the previous review. Do not create blanket legacy exemptions.
- Keep `governance/source-inventory.json` complete and the GPL-3.0-only license consistent. Root `CONTRIBUTING.md` and `AGENTS.md` are the approved contributor guidance alongside synchronized READMEs; do not create a `docs/` tree.
- Builds must keep original PNG bytes unchanged. Optimize only in memory, preserve the browser ES2018 IIFE contract, and verify cold-build reproducibility plus no external runtime dependencies.
