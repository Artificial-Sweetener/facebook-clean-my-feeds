# Roadmap

This roadmap covers the modularization, build, linting, CI, and release process work. The Jest/testing roadmap will live in a separate document.

## Discovery Notes (Baseline)

- Monolith domains:
  - Metadata/boot: userscript header + IIFE entry.
  - Vendor: inlined idb-keyval UMD bundle.
  - i18n/defaults: masterKeyWords translations + defaults + pathInfo.
  - State/options: VARS, getUserOptions, setLanguageAndOptions.
  - DOM helpers: scanTreeForText, extractTextContent, querySelectorAllNoChildren.
  - Filtering core: cleanText, findFirstMatch*, isSponsored*, \*\_isBlockedText.
  - Feed moppers: mopUpTheNewsFeed/Groups/Videos/Marketplace/Search/Reels/Profile.
  - UI: buildMoppingDialog, toggle button, export/import flows.
  - Runtime: observers, scheduling, page detection.
- Compatibility surface (behavior to lock):
  - Sponsored detection ordering and thresholds across feeds.
  - Text blocking logic per feed (regex vs non-regex).
  - Hide-reason priority order in each feed mopper.
  - Verbosity/debug behavior (labels, hidden markers).
  - Settings defaults and language fallbacks.
  - Userscript metadata header fields.
- External dependencies and APIs:
  - Embedded idb-keyval v6.0.3 UMD (inlined due to Greasemonkey @require bug).
  - GM APIs: GM.registerMenuCommand, GM.info; unsafeWindow.
  - Browser APIs: MutationObserver, TreeWalker, NodeFilter.
- Tooling constraints:
  - Build output stays at repo root as fb-clean-my-feeds.user.js.
  - Bundler decision: esbuild with metadata banner injection.

## Phase 1: Tooling Foundation

- Add a standard project layout (src/, tools/, config/). (Done)
- Configure linting and formatting (ESLint + Prettier, with eslint-config-prettier and eslint-plugin-import). (Done)
- Establish a build pipeline that can emit a single userscript file with metadata header (esbuild), using a temporary build target (not the live userscript location). (Done)
- Notes:
  - Build target is `test_clean_my_feeds.user.js` until the final switchover.
  - Node is pinned to 22.x via `.nvmrc`, with engines set to `>=18 <23`.
  - Setup scripts added: `tools/setup.ps1` and `tools/setup.sh`.

## Phase 2: Modular Architecture and Core Extraction

- Define module boundaries and public APIs (core classifier, selectors, feed logic, UI, storage, runtime).
- Keep `src/core/` pure (no DOM access); DOM mutations live in `src/feeds/` and `src/dom/`.
- Keep selectors centralized in `src/selectors/`; feed modules should not define new selectors inline.
- Userscript header source of truth is `src/entry/metadata.user.js`.
- Use the agreed scaffolding layout:
  - src/entry/ (entrypoint + userscript metadata template)
  - src/core/ (options, filters, rules, state)
  - src/selectors/ (feed-specific selectors)
  - src/feeds/ (per-feed moppers)
  - src/dom/ (DOM helpers, hiding, mutations, styles)
  - src/ui/ (dialog, controls, i18n)
  - src/storage/ (idb wrapper)
  - src/vendor/ (vendored libraries if needed)
  - src/utils/ (shared helpers)
  - tools/ (build scripts)
  - config/ (lint/format configs)
  - Files stubbed:
    - src/entry/userscript.js
    - src/entry/metadata.user.js
    - src/core/options/defaults.js
    - src/core/options/schema.js
    - src/core/options/hydrate.js
    - src/core/filters/text-normalize.js
    - src/core/filters/matching.js
    - src/core/filters/classifiers/sponsored.js
    - src/core/filters/classifiers/blocked-text.js
    - src/core/filters/classifiers/reels.js
    - src/core/filters/classifiers/shares-likes.js
    - src/core/rules/feed-rules.js
    - src/core/state/vars.js
    - src/selectors/news.js
    - src/selectors/groups.js
    - src/selectors/videos.js
    - src/selectors/marketplace.js
    - src/selectors/search.js
    - src/selectors/profile.js
    - src/selectors/reels.js
    - src/selectors/shared.js
    - src/feeds/news.js
    - src/feeds/groups.js
    - src/feeds/videos.js
    - src/feeds/marketplace.js
    - src/feeds/search.js
    - src/feeds/profile.js
    - src/feeds/reels.js
    - src/dom/walker.js
    - src/dom/hide.js
    - src/dom/mutations.js
    - src/dom/styles.js
    - src/ui/dialog/dialog.js
    - src/ui/dialog/sections.js
    - src/ui/controls/toggle-button.js
    - src/ui/i18n/translations.js
    - src/ui/i18n/dictionaries.js
    - src/storage/idb.js
    - src/vendor/idb-keyval.js
    - src/utils/url.js
    - src/utils/dom.js
    - src/utils/log.js
    - tools/build.js
    - tools/banner.js
    - config/eslint.config.cjs
    - config/prettier.config.cjs
- Extract core utilities (text normalization, matching helpers, rule evaluation).
- Keep DOM access in feed-specific modules; keep business logic in core modules.
- Wrap vendor code as a module and remove inline bundles from the source.

## Phase 3: Feed-by-Feed Migration

- Migrate one feed at a time (News, Groups, Videos, Marketplace, Search, Profile, Reels).
- Maintain parity by running the monolith and modules in parallel where possible (dual-run Jest or golden snapshots).
- Document any behavioral edge cases per feed as they are verified.

## Phase 4: Cleanup and DRY Improvements

- Deduplicate repeated feed logic (hide-post, blocked-text evaluation, selectors).
- Consolidate shared rule definitions and per-feed configuration.
- Remove legacy paths and obsolete flags after parity is confirmed.

## Phase 5: Build and Distribution

- Ensure the build output is deterministic and versioned.
- Sync userscript metadata (name, version, description, matches, grants).
- Switch the build target from the temporary location to the live userscript location only after parity checks pass for all feeds.
- Switch the build target from the temporary location to the live userscript location when ready to replace.
- Update release documentation and instructions for developers.

## Phase 6: CI, SemVer, and Release Process

- Adopt Conventional Commits and semantic-release.
- Switch to x.y.z versioning; enforce in CI.
- Move changelog into CHANGELOG.md and link from README.
- Add release automation and changelog generation.

## Phase 7: Documentation and Handoff

- Update README for new developer workflow.
- Document architecture, module boundaries, and build/test commands.
- Provide a "how to add a new filter" guide for future maintenance.
