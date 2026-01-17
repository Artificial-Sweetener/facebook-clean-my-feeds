# Contributing to FB - Clean My Feeds

Welcome! We're glad you're here.

This project is a userscript that runs on real pages for real people, so stability and correctness matter more than speed. Most PRs are quick fixes when Facebook changes the DOM, so this guide focuses on doing that safely.

## How We Work

### Stability First

- Prefer safe, readable changes over cleverness.
- Avoid TODOs, commented-out code, or temporary debug logs.
- Guard DOM access and handle errors at boundaries so the page never breaks.

### Separation of Concerns

We keep responsibilities separated by folder so filter fixes stay easy to reason about:

- `src/core/` for pure logic (no DOM access)
- `src/selectors/` for CSS selectors only
- `src/feeds/` for per-feed DOM logic and mutations
- `src/dom/` for shared DOM helpers and mutation scheduling
- `src/ui/` for settings dialog and i18n
- `src/storage/` for persistence wrappers

If you're unsure where code belongs, ask before you merge.
Never edit `fb-clean-my-feeds.user.js` by hand. Always change `src/` and rebuild.

## Build System

This repo ships a compiled userscript. Please do not edit `fb-clean-my-feeds.user.js` directly.

Workflow:

1. Make changes in `src/`.
2. Build the userscript: `npm run build`.
3. Commit both your source changes and the rebuilt `fb-clean-my-feeds.user.js`.

The build step injects the version banner and bundles everything into the userscript, so skipping it will leave the release artifact out of sync.

## Public-Facing Changes

PRs that fix filters or add features are welcome. Just keep these areas consistent and intentional:

- Userscript behavior and filtering outcomes
- Userscript metadata header
- Settings UI and options
- README installation and usage guidance

If you change any of the above, mention it in your PR so we can double-check user impact.

## Naming & Style

- Use `camelCase` for variables, functions, and methods.
- Use `PascalCase` for classes and constructors.
- Prefer `kebab-case` for new files unless a pattern already exists.
- Use `UPPER_SNAKE_CASE` only for true module-level constants when it improves clarity.
- Docstrings are optional; use Google-style JSDoc only when complexity warrants it.

## Verification

Before opening a PR, run:

```bash
npm run lint
npm test
npm run build
```

If you only run one thing, run the tests (`npm test`). Most regressions show up there first.

### Localization Checks

When adding new strings to `src/ui/i18n/translations.js`, add them to the English (`en`) block and verify other locales. You can also run this anytime to spot translation gaps that need help:

```bash
node tools/check-locales.js
```

## Commit Messages & Versioning

We use Conventional Commits: `type(scope): subject`. Your commit messages drive versioning and changelog entries, so please follow the format.

Scopes help everyone understand where a change lives. Common ones here: `feeds`, `selectors`, `ui`, `dom`, `core`, `storage`.

Examples:

- `feat(ui): add new filter toggle`
- `fix(feeds): handle missing sponsored label`
- `chore(build): update tooling`

Breaking changes must include `!` after the type or scope: `feat(ui)!: remove legacy filter`.

## CI & Release Strategy

Releases are automated with semantic-release in GitHub Actions:

- The workflow runs on pushes to `main` and can be triggered manually.
- Version bumps and `CHANGELOG.md` updates are based on Conventional Commits.
- The release job updates `package.json`, `package-lock.json`, and rebuilds `fb-clean-my-feeds.user.js` so the userscript banner stays in sync.
- To prevent an accidental first bump, releases are skipped until a `v6.0.0` tag exists.

## Review Process

We review PRs with the following in mind:

- Does the change respect folder boundaries?
- Is the behavior stable and predictable on real pages?
- Are tests and localization checks updated when needed?
- Is the change clear to maintainers and users?
