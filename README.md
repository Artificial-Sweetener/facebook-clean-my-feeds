# FB - Clean My Feeds

You should be in control of what you see online, but Facebook throws all kinds of garbage at you making it practically impossible to see updates from your friends and pages you care about. "FB - Clean My Feeds" is the mop bucket you roll in when you want control back.

Originally built by **[zbluebugz](https://github.com/zbluebugz)** and battle-tested since 2021.

Thank you to **[trinhquocviet](https://github.com/trinhquocviet)** for their [simplified_ui branch](https://github.com/trinhquocviet/facebook-clean-my-feeds/tree/simplified_ui), which has been merged here.

## Installation

1. Install a userscript manager such as **[Violentmonkey](https://violentmonkey.github.io/)**, **[Tampermonkey](https://www.tampermonkey.net/)**, or **[FireMonkey](https://addons.mozilla.org/en-US/firefox/addon/firemonkey/)**.
2. Add the script (your preference of method):
   - From this repo: open [`fb-clean-my-feeds.user.js`](https://raw.githubusercontent.com/Artificial-Sweetener/facebook-clean-my-feeds/main/fb-clean-my-feeds.user.js) and let your userscript manager import it.
   - Visit the [GreasyFork release page](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) and click **install this script**.
3. Reload Facebook. The mop icon appears bottom-left by default. You can set it to appear in the top-right or hide it completely.

## What it does

### Kill the Sponsored Sludge

- Nukes "Sponsored" posts across News, Groups, Watch, Marketplace, Search, and Reels.
- Filters "Paid Partnership" and "Suggested for you" detours before they ever load.

### Control The Feed Types

- Pause or hide reels, reels-and-short-videos units, and those "Stories" stacks that eat half the viewport when you first load in.
- Toggle individual feeds on/off. Hate Marketplace? Bye. Love Watch but loathe live videos? Tweak it.

### Text & Phrase Filtering

- Build personal blocklists for words, phrases, or user-defined spam. Regular expression mode is there when you want surgical precision.
- Cap the maximum "Likes" a post can have before it gets swept. No more viral nonsense unless you allow it.

### Clean the Noise

- Strip share counts, info boxes, survey promos, "People You May Know", "Follow", and any "Participate" prompts trying to drag you into engagement traps.
- Optional pause button for autoplaying GIFs and videos so you're not ambushed by motion.

### Polished Controls

- A floating toggle button with the simplified-ui styling updates from trinhquocviet's branch.
- Dialog rewritten for clarity, with translated labels and dark-mode friendly theming. All configuration happens in one place, no menu maze.

## Using the Control Panel

- Click the **Clean My Feeds** mop icon (or open it from your userscript manager menu) to bring up the settings dialog.
- Options are grouped by feed (News, Groups, Watch, Marketplace, Profiles, Search, Reels). Flip the switches you want, save, and the script immediately re-sweeps the page.
- Toggle **Debug** to reveal hidden posts with dotted outlines so you can verify what's being filtered.
- Use **Export / Import** to back up your settings. The script stores preferences locally; incognito/private browsing wipes them when the session ends.

### Language Support

The dialog and detection dictionaries ship with many UI languages so localized feeds stay clean.

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

If you spot gaps or mistranslations, open an issue. I'd love to make this even friendlier for non-English feeds.


## Contributing & Support

- **Issues & Features:** Open an issue if something breaks or Facebook changes the markup again. I read them.
- **Pull Requests:** Yes please. Keep them focused and describe what you touched.
- **Translations:** If you can help keep the language dictionary sharp, I'm all ears.

## To Do...

- **This script is huge!** Let's split it up and then create a bundling pipeline so that the system is easier to build on, reason about, and maintain

## License & Credits

- **License:** GNU General Public License v3.0. You are free to share, tweak, and improve as long as you pass those freedoms on.
- **Original Project:** [facebook-clean-my-feeds](https://github.com/zbluebugz/facebook-clean-my-feeds) by [zbluebugz](https://github.com/zbluebugz)
- **Simplified UI & styling refresh:** [Simplified_UI branch](https://github.com/trinhquocviet/facebook-clean-my-feeds/tree/simplified_ui) by [trinhquocviet](https://github.com/trinhquocviet)
- **Current Maintainer:** [Artificial Sweetener](https://github.com/Artificial-Sweetener) - me!~

## From the Maintainer 💖

I hope this script helps you reclaim your feed. I promise to be your ally in the fight against stuff you don't wanna see online.

- **My Website & Socials**: See my art, poetry, and other dev updates at [artificialsweetener.ai](https://artificialsweetener.ai).
- **If you like this project**, it would mean a lot to me if you gave me a star here on Github!! ⭐
