# <img src="src/res/mop.png" alt="mop" width="36"/> FB - Clean My Feeds

[![GreasyFork](https://img.shields.io/greasyfork/v/552339-fb-clean-my-feeds-5-05?label=GreasyFork)](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) [![GreasyFork installs](https://img.shields.io/greasyfork/dt/552339-fb-clean-my-feeds-5-05?label=GreasyFork%20installs)](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) [![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

**English** | [Tiếng Việt](README.vi.md)

You should be in control of what you see online, but Facebook throws all kinds of garbage at you making it practically impossible to see updates from your friends and pages you care about. "FB - Clean My Feeds" is the mop bucket you roll in when you want control back.

Originally built by **[zbluebugz](https://github.com/zbluebugz)** and battle-tested since 2021.

Thanks to **[trinhquocviet](https://github.com/trinhquocviet)** for helping maintain filters in 2025.

## <img src="src/res/import.png" alt="install" width="36"/> Installation

1. Install a userscript manager such as **[Violentmonkey](https://violentmonkey.github.io/)**, **[Tampermonkey](https://www.tampermonkey.net/)**, or **[FireMonkey](https://addons.mozilla.org/en-US/firefox/addon/firemonkey/)**.
2. Add the script (your preference of method):
   - From this repo: open [`fb-clean-my-feeds.user.js`](https://raw.githubusercontent.com/Artificial-Sweetener/facebook-clean-my-feeds/main/fb-clean-my-feeds.user.js) and let your userscript manager import it.
   - Visit the [GreasyFork release page](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) and click **install this script**.
3. Reload Facebook. You can set the mop icon to appear in the bottom-left, top-right, or hide it completely.

## <img src="src/res/check.png" alt="features" width="36"/> Features

"FB - Clean My Feeds" is designed to make your browsing experience calm, clean, and completely under your control.

- **Nuke the Ads:** We automatically scrub "Sponsored" posts, "Paid Partnership" labels, and "Suggested for you" sections across News, Groups, Watch, Marketplace, Search, and Reels.
- **Localized Signals:** Filters combine supported Facebook layouts with exact labels from 23 locale catalogs where a label is needed to distinguish the intended control. Changing the settings language does not change those recognized labels. New labels and unfamiliar markup can be missed.
- **Cut the AI Clutter:** Hide "Try Meta AI" cards, Meta AI prompt suggestions, posts labeled with Facebook's "AI info" marker, and AI side-panel distractions before they take over your feed. The "AI info" filter relies on Facebook's label and does not detect every AI-generated post.
- **Tame the Layout:** Hide Reels, "Short Videos," and those massive "Stories" shelves that eat up your screen. You can even toggle off entire sections like Marketplace if you never use them.
- **Filter the Noise:** Create custom blocklists for specific words or phrases (with regex support!). You can also cap viral posts by "Like" count to keep your feed personal.
- **Quiet Down:** We strip out "People You May Know," "Follow" suggestions, survey promos, and other engagement traps. Plus, you can pause autoplaying GIFs and videos so you're not ambushed by motion.
- **Easy Controls:** Enjoy a refined, dark-mode friendly settings menu with translated labels. Just click the mop icon, flip a switch, and see the results instantly.

## <img src="src/res/pref.png" alt="options" width="36"/> Using the Control Panel

- Click the **Clean My Feeds** mop icon (or open it from your userscript manager menu) to bring up the settings dialog.
- Options are grouped by feed (News, Groups, Watch, Marketplace, Profiles, Search, Reels). Flip the switches you want, save, and the script immediately re-sweeps the page.
- Toggle **Debug** to reveal hidden posts with dotted outlines so you can verify what's being filtered.
- Use **Export / Import** to back up your settings. The script stores preferences locally; incognito/private browsing wipes them when the session ends.
- When regex matching is enabled for News, Groups, Watch, or Profiles, invalid expressions block saving or importing and show the original field, line, and affected feed. Your draft and previous settings stay intact. Invalid expressions in older saved settings are skipped individually while valid rules and other filters keep working; open settings to repair them. Marketplace text matching remains literal.

### Language Support

The control panel ships with many UI languages so the settings, labels, and hidden-post reasons stay clear on localized Facebook installs.

<details>
  <summary>Supported languages</summary>

- English
- Português (Portugal & Brazil)
- Deutsch
- Français
- Español
- Čeština
- Tiếng Việt
- Italiano
- Latviešu
- Polski
- Nederlands
- עברית
- العربية
- Bahasa Indonesia
- 中文（简体）
- 中文（繁體）
- 日本語
- Suomi
- Türkçe
- Ελληνικά
- Русский
- Українська
- Български

</details>

If you spot gaps or mistranslations, open an issue. I'd love to make the UI feel smoother and clearer for non-English users too.

## <img src="src/res/bug.png" alt="bugs" width="36"/> Contributing & Support

- **Issues & Features:** Open an issue if something breaks or Facebook changes the markup again. I read them.
- **Pull Requests:** Yes please. Keep them focused and describe what you touched.
- **Translations:** If you can help keep the UI text sharp across languages, I'm all ears.

## Development

Use Node **>=22.14.0 <23**; `.nvmrc` and CI pin **22.14.0**. Author source, tests, and tools in strict TypeScript. The installed userscript remains a single self-contained ES2018 browser bundle.

```sh
nvm use
npm ci
npm run verify
```

If you do not use nvm, install the supported Node version first. The one verification command runs formatting, lint, strict browser/core/tool/test typechecks, Jest tests, locale and governance checks, then builds and validates the userscript. It checks metadata, no external runtime dependencies, unchanged source assets, and reproducible output. Commit the rebuilt `fb-clean-my-feeds.user.js` with source changes; never edit it by hand.

PNG optimization happens in memory and leaves original artwork unchanged. Modules warn above 350 non-comment lines and require a reviewed exception above 500. Named functions, methods, classes, and exported contracts need useful JSDoc. See [CONTRIBUTING.md](CONTRIBUTING.md) for architecture, temporary exceptions, and the release gate. Keep this README and its Vietnamese version synchronized.

## Validation and current limits

`tests/validation/` contains positive, disabled-option, ordinary-content, adversarial, repeated-scan, and restoration cases. Its fixtures exercise supported structures; they are not proof that every Facebook experiment or locale is covered.

| Surface                                                                                                                           | Main validation suites              |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| News filters, shelves, recommendations, author controls, badges and AI features                                                   | `news-*.test.ts`                    |
| Groups, Watch, Marketplace, Search, Profiles and Reels                                                                            | `routes-*.test.ts`                  |
| Sponsorship, blocked text, counts, GIFs, shares and DOM extraction                                                                | `shared-*.test.ts`                  |
| All 76 stored option keys, 4,096 shared-feed scope combinations, all 23 UI locales, import/export, concurrent saves and lifecycle | `settings-*.test.ts`                |
| Report privacy and invalid-rule diagnostics                                                                                       | `diagnostic-script-privacy.test.ts` |

Ordinary header icons/buttons and body/comment links must not stand in for verified badges, Follow/Join actions or recommendation cards. Sponsored tracking links need a supported owned sponsorship signal; a long tracking parameter alone is insufficient. Unsupported obfuscation or labels can therefore leave unwanted content visible. Finite tests cannot guarantee zero false positives; use Debug to inspect a suspected match and report the relevant layout.

The audit also records existing inactive paths instead of presenting them as working features: Marketplace regex remains literal, Watch duplicate-video filtering does not currently hide duplicates, and the three informational-box options do not match the current runtime path descriptors. The dormant Groups paid-partnership key remains for stored-setting compatibility. These gaps are distinct from the tested active filters.

## <img src="src/res/info.png" alt="license" width="36"/> License & Credits

- **License:** GNU General Public License v3.0 only (GPL-3.0-only). You are free to share, tweak, and improve as long as you pass those freedoms on.
- **Original Project:** [facebook-clean-my-feeds](https://github.com/zbluebugz/facebook-clean-my-feeds) by [zbluebugz](https://github.com/zbluebugz)
- **Filter maintenance (2025):** [trinhquocviet](https://github.com/trinhquocviet)
- **Current Maintainer:** [Artificial Sweetener](https://github.com/Artificial-Sweetener) - me!~

## <img src="src/res/about.png" alt="about" width="36"/> From the Maintainer

I hope this script helps you reclaim your feed. I promise to be your ally in the fight against stuff you don't wanna see online.

- **My Website & Socials**: See my art, poetry, and other dev updates at [artificialsweetener.ai](https://artificialsweetener.ai).
- **If you like this project**, it would mean a lot to me if you gave me a star here on Github!! ⭐
