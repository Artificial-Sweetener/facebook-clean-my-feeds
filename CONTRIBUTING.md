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

All 17 runtime icons are manually authored static SVGs on the original 64px canvas. Do not trace, vectorize or embed raster copies. The build validates a narrow, inert shape/attribute grammar before inlining owned markup; scripts, external resources, arbitrary style rules and document-scoped IDs are forbidden. The only allowed stylesheet contains fixed standalone light/dark root colors; it is stripped before inline embedding so no selector can affect the host page. Inline icons inherit their control color. Standalone README and userscript-manager icons follow the embedding color scheme, with dark ink on light surfaces and light ink on dark surfaces. Metadata and runtime use the same geometry. Original PNG bytes and their historical decoded-pixel contract remain immutable references; `npm run icons:optimize` inspects those historical reference sizes without changing artwork or the SVG bundle. Verification builds twice independently, requires all 17 SVG counterparts, checks unchanged source hashes, and rejects stale output or external runtime dependencies.

Preserve userscript behavior, filter outcomes, metadata grants and matches, settings options, and installation guidance unless the requested change intentionally affects them. Mention any such impact in the PR. Keep failures at boundaries so a malformed setting or missing element cannot break the page.

## Offline performance and failure checks

Run `node --import tsx tools/performance/feed-profile.ts` with Node 22.14.0 to profile the real News processor in jsdom. The deterministic fixture contains 80 mixed organic/sponsored posts, nested media/comment markup, and 20 hidden posts. After two settling passes, it measures 24 idle ticks, 24 periodic sweeps, 24 hidden-post content replacements, 24 coalesced mutation batches of 100 changes at 75 ms intervals, and 24 SPA root replacements. It reports HTML serialization work, median/p95 scan milliseconds, and scans exceeding 50 ms. No Facebook account, network request, or live-page stress is involved.

For native-browser measurements, run `node --import tsx tools/performance/build-browser-profile.ts` and open the printed temporary HTML file in a separate browser tab. The page contains its own bundle and replaces the fixture with JSON when finished. `browserLongTasks` is `null` when the browser lacks Long Tasks support; this does not mean zero long tasks. jsdom elapsed times are synthetic CPU measurements, not browser responsiveness or rendering telemetry. Neither fixture proves that a live Facebook crash or splash screen is caused or prevented by CMF.

The same Node 22 fixture, compared with the pre-profile source, reduced serialized characters in the following scenarios. Counts are per 24 scans, and all scenarios preserved the expected 20 hidden posts:

| Scenario                 |    Before |     After |
| ------------------------ | --------: | --------: |
| Settled idle ticks       | 3,685,920 |         0 |
| Periodic sweeps          | 9,092,832 | 1,823,952 |
| Hidden-post replacements | 9,092,696 | 1,823,884 |
| Mutation churn           | 9,096,256 | 1,824,656 |
| SPA root replacements    | 8,180,856 |   911,976 |

Two paired offline Firefox 157 runs, one in each before/after order, reproduced those work counts. Idle medians changed from 1 ms to below the observed timer resolution, and periodic-sweep medians from 18–23 ms to 16–17 ms. Mutation-heavy p95 measurements increased from 43–48 ms to 61–114 ms, while SPA-replacement p95 changed from 37–39 ms to 45–46 ms. These samples establish no uniform latency improvement. Firefox did not support the Long Tasks API, so its reported null is not a count of zero. Extra instrumentation found identical selector/computed-style totals for mutation and SPA scenarios, but News observation added 5,760 records across 24 mutation batches and 1,944 records across 24 SPA replacements. This direct-processor fixture excludes the runtime-wide observer shared by both versions. Reduced serialization has a real mutation-observation tradeoff; the counters do not attribute all tail variation to that overhead.

News now uses content-version observation to avoid whole-feed serialization on idle ticks, while its periodic sweep and exact hidden-post signatures remain intact. Same-turn records are consumed before dirty decisions, including equal-length and attribute-only replacements. CMF's own no-caption markers are idempotent, so reconciliation settles instead of triggering an attribute feedback loop. Without MutationObserver, News retains its serialized-size fallback. Exact post snapshots remain weakly keyed; this change does not claim a measured heap-size reduction.

Lifecycle regressions cover 100 settled idle scans with zero serialization; 40 navigation changes whose still-connected cached roots retain only the latest observer; detached consecutive-caption references; body replacement; and zero scheduled timers after teardown. Host-processing exceptions retry with exponential backoff from one to thirty seconds, even under mutation/scroll churn, and a changed URL may retry immediately. Failed route cleanup remains pending before any feed dispatch; URL identity and route flags publish only after successful restoration. Reels owns the same bounded failure backoff independently, and stopping an in-flight pass prevents it from rescheduling. Replaced topbar controls and banners have individual owners: 40 two-button replacements retain a constant six session cleanup records and four active observers, with no geometry reads from unrelated feed churn. These tests assert resource ownership and liveness, not garbage-collector timing or a universal crash-free guarantee.

Startup permits at most ten Safari readiness probes over one second and bounds the initial settings read to three seconds. Timeout recovery uses in-memory session defaults without writing them, matching the existing storage-failure behavior. Late reads cannot replace live options or subsequent user edits. A stalled read therefore does not mean saved settings loaded successfully. Explicit saves retain native IndexedDB commit/error semantics and can still remain pending if the browser never settles the underlying transaction.

## Localization

User-facing copy is an all-locales surface. Update the English baseline in `src/i18n/locales/en.ts` and every supported catalog when adding or changing copy. Preserve intentional empty labels, array-valued labels, and reviewed locale-only keys in `governance/locale-contract.json`. `npm run check:locales` checks required keys and unreviewed extras without rewriting translations. Keep `README.md` and `README.vi.md` substantively synchronized, including setup, features, warnings, and credits.

## Style and review

Use camelCase for values and functions, PascalCase for classes and types, and kebab-case for new files. Prefer explicit domain types and narrow runtime validation. Add focused regression tests for behavior changes and exercise persistence failure paths. Remove stale paths when moving modules; do not retain compatibility JavaScript copies.

Use Conventional Commits (`type(scope): subject`), such as `fix(feeds): handle missing sponsored label`. Review should establish stable behavior, sensible module ownership, substantive contracts, complete locale coverage, and reproducible output.

## CI and releases

Pull requests and pushes to `main` run the same full verification on Node 22.14.0. CI also checks that the generated userscript was committed. The release job depends on successful verification and runs only for `main`; no repository branch-protection changes are made by this setup.

semantic-release uses Conventional Commits for versioning and changelog entries. After version preparation it reruns `npm run verify`, then commits the manifest, lockfile, changelog, and rebuilt userscript. Automatic releases require an existing version-tag baseline; maintainers can use the manual dry-run input to inspect the release plan. The workflow uses GitHub's existing token and does not add credentials or publish to npm.
