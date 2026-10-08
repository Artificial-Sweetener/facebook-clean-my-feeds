# Contributing to FB - Clean My Feeds

This userscript runs on real pages for real people. Prefer stability, clear contracts, and behavior-preserving changes over quick workarounds. The project is licensed GPL-3.0-only; retain original credits and the license notice.

## Setup and the one verification command

Use Node **>=22.14.0 <23**. `.nvmrc` and CI pin **22.14.0** so local and release checks have a reproducible reference. npm dependencies are exact-pinned and `package-lock.json` is committed.

```sh
nvm use
npm ci
npm run verify
```

If you do not use nvm, install the supported Node version before running npm. `tools/setup.sh` and `tools/setup.ps1` perform the same version check, clean dependency installation, and full verification.

`npm run verify` is the required local and CI gate. It checks the Node policy, formatting, lint, four strict TypeScript scopes, Jest tests, locale parity, governance, the production build, metadata, embedded dependencies, source immutability, and byte-for-byte reproducibility. Individual commands are available in `package.json` for focused feedback; they do not replace the gate.

## Source, output, and architecture

Author executable source, tests, and tools in TypeScript. The package remains CommonJS for tooling. Browser output remains a single self-contained esbuild IIFE targeting ES2018. `fb-clean-my-feeds.user.js` is the only tracked JavaScript and must never be edited by hand. Change source, run `npm run verify`, and include the rebuilt artifact with the source change.

TypeScript checking uses `strict`, `noEmit`, `allowJs: false`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. Browser globals, Node globals, and Jest globals have separate configurations. The pure core scope has neither DOM nor Node ambient types. Do not repair errors with `any`, double assertions, suppression directives, or excluded problem files; validate unknown data at its boundary instead.

Responsibilities and permitted directions are declared in `governance/policy.json`:

- `core`: pure option, routing, matching, and classification logic
- `i18n`: independent locale catalogs and their closed contracts
- `assets` and `selectors`: embedded artwork and CSS selector definitions
- `dom`: shared page access, styling, observation, and mutation helpers
- `feeds`: feed-specific discovery and filtering, depending on lower-level helpers
- `storage`: persistence and the small typed IndexedDB adapter
- `application`: option workflows and persistence orchestration
- `diagnostics`: report collection and serialization, using feed report contracts
- `ui`: dialog rendering and controls, allowed to invoke application workflows
- `runtime` and `entry`: composition, live state, scheduling, and startup
- The exact userscript-manager API adapter is an independent platform leaf; pure utilities remain separate from the DOM utility

Core must not import UI, DOM, or storage. Application contracts must not be owned by UI. All imports, re-exports, import types, and literal dynamic imports are checked using the TypeScript AST. Type-only edges count, and dependency cycles fail even in otherwise unreachable modules. Moving a file requires reviewing ownership, not widening every layer's permissions.

## Size, documentation, inventory, and exceptions

Keep a module below **350 non-comment source lines** where practical. Above 350 produces a review warning; above **500** fails unless a precise reviewed exception exists. Comments and blank lines are excluded using the TypeScript scanner; data and multiline strings still count. Tests and tools have the same limits as runtime code.

Every declared function, method, class, and non-obvious exported contract needs meaningful adjacent TypeScript-compatible JSDoc. Explain purpose, invariants, side effects, errors, or non-obvious inputs and results. A short helper may need only one useful sentence. Complex operations need substantive Google-style `@param`, `@returns`, `@throws`, and examples where relevant. Type annotations own the types; prose owns the semantics. Anonymous local callbacks can rely on their documented enclosing operation. The AST gate catches missing or shallow comments and missing contract sections on larger functions; reviewers must still assess whether the explanation is useful. Do not add boilerplate simply to satisfy the checker.

`governance/source-inventory.json` classifies every tracked or new, non-ignored repository file, including tests, tools, configs, declaration files, and unreachable modules. Unknown or overlapping categories fail. New source must remain covered by lint, strict typechecking, documentation, architectural checks, and the GPL-3.0-only license contract. No `docs/` tree is used; retain contributor guidance here, assistant guidance in `AGENTS.md`, and user/setup information in the synchronized READMEs.

The exception registry starts empty. Any necessary exception in `governance/exceptions.json` must identify an exact file and rule, SHA-256 fingerprint of the full source, a named owner, rationale, concrete extraction/removal plan, review date, and expiration within 90 days. Size exceptions also need a numeric cap below the previous reviewed cap. Modified, expired, unused, duplicate, wildcard, or over-cap approvals fail. Exceptions are temporary reviewed debt, never directory exclusions or a legacy baseline.

## Build assets and public contracts

All 17 runtime icons are manually authored static SVGs on the original 64px canvas. Do not trace, vectorize or embed raster copies. The build validates a narrow, inert shape/attribute grammar before inlining owned markup; scripts, external resources, style rules and document-scoped IDs are forbidden. Inline icons inherit their control color, while a neutral standalone color keeps README and userscript-manager icons visible on light and dark surfaces. Metadata and runtime use the same geometry. Original PNG bytes and their historical decoded-pixel contract remain immutable references; `npm run icons:optimize` inspects those historical reference sizes without changing artwork or the SVG bundle. Verification builds twice independently, requires all 17 SVG counterparts, checks unchanged source hashes, and rejects stale output or external runtime dependencies.

Preserve userscript behavior, filter outcomes, metadata grants and matches, settings options, and installation guidance unless the requested change intentionally affects them. Mention any such impact in the PR. Keep failures at boundaries so a malformed setting or missing element cannot break the page.

## Localization

User-facing copy is an all-locales surface. Update the English baseline in `src/i18n/locales/en.ts` and every supported catalog when adding or changing copy. Preserve intentional empty labels, array-valued labels, and reviewed locale-only keys in `governance/locale-contract.json`. `npm run check:locales` checks required keys and unreviewed extras without rewriting translations. Keep `README.md` and `README.vi.md` substantively synchronized, including setup, features, warnings, and credits.

## Style and review

Use camelCase for values and functions, PascalCase for classes and types, and kebab-case for new files. Prefer explicit domain types and narrow runtime validation. Add focused regression tests for behavior changes and exercise persistence failure paths. Remove stale paths when moving modules; do not retain compatibility JavaScript copies.

Use Conventional Commits (`type(scope): subject`), such as `fix(feeds): handle missing sponsored label`. Review should establish stable behavior, sensible module ownership, substantive contracts, complete locale coverage, and reproducible output.

## CI and releases

Pull requests and pushes to `main` run the same full verification on Node 22.14.0. CI also checks that the generated userscript was committed. The release job depends on successful verification and runs only for `main`; no repository branch-protection changes are made by this setup.

semantic-release uses Conventional Commits for versioning and changelog entries. After version preparation it reruns `npm run verify`, then commits the manifest, lockfile, changelog, and rebuilt userscript. Automatic releases require an existing version-tag baseline; maintainers can use the manual dry-run input to inspect the release plan. The workflow uses GitHub's existing token and does not add credentials or publish to npm.
