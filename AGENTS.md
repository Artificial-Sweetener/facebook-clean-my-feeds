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
- `src/ui/` for settings dialog and i18n.
- `src/storage/` for persistence wrappers.

## 3) Public Contract & Compatibility

The public contract is:

- Userscript behavior (what users see and filter outcomes).
- The userscript metadata header.
- The settings UI and options.
- The README (installation + usage).

Do not change user-visible behavior unless explicitly requested. Internal refactors are fine, but remove old paths in the same change when migrating.

## 4) Documentation

- **No docs/ tree.** Keep documentation limited to `README.md`.
- **Docstrings:** Use Google-style JSDoc only when complexity warrants it. Simple, self-explanatory functions do not need docstrings.
- **Self-documenting code:** Prefer expressive function and variable names.

## 5) Naming & Casing (JS Norms)

- `camelCase` for variables, functions, and methods.
- `PascalCase` for classes/constructors.
- Use `UPPER_SNAKE_CASE` only for true module-level constants if it improves clarity; otherwise stay with `camelCase`.
- Files and folders should be consistent; prefer `kebab-case` for files unless a pattern already exists.

## 6) Verification

Run the project’s lint, test, and build scripts when available. If no scripts exist yet, call that out clearly.

## 7) Commit Messages

When asked to draft a commit, use Conventional Commits: `type(scope): subject`.
