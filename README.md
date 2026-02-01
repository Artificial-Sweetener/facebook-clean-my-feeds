# <img src="src/res/mop.png" alt="mop" width="36"/> FB - Clean My Feeds

You should be in control of what you see online, but Facebook throws all kinds of garbage at you making it practically impossible to see updates from your friends and pages you care about. "FB - Clean My Feeds" is the mop bucket you roll in when you want control back.

Originally built by **[zbluebugz](https://github.com/zbluebugz)** and battle-tested since 2021.

Thank you to **[trinhquocviet](https://github.com/trinhquocviet)** for their [simplified_ui branch](https://github.com/trinhquocviet/facebook-clean-my-feeds/tree/simplified_ui), which has been merged here.

## <img src="src/res/import.png" alt="install" width="36"/> Installation

1. Install a userscript manager such as **[Violentmonkey](https://violentmonkey.github.io/)**, **[Tampermonkey](https://www.tampermonkey.net/)**, or **[FireMonkey](https://addons.mozilla.org/en-US/firefox/addon/firemonkey/)**.
2. Add the script (your preference of method):
   - From this repo: open [`fb-clean-my-feeds.user.js`](https://raw.githubusercontent.com/Artificial-Sweetener/facebook-clean-my-feeds/main/fb-clean-my-feeds.user.js) and let your userscript manager import it.
   - Visit the [GreasyFork release page](https://greasyfork.org/en/scripts/552339-fb-clean-my-feeds-5-05) and click **install this script**.
3. Reload Facebook. You can set the mop icon to appear in the bottom-left, top-right, or hide it completely.

## <img src="src/res/check.png" alt="features" width="36"/> Features

"FB - Clean My Feeds" is designed to make your browsing experience calm, clean, and completely under your control.

- **Nuke the Ads:** We automatically scrub "Sponsored" posts, "Paid Partnership" labels, and "Suggested for you" sections across News, Groups, Watch, Marketplace, Search, and Reels.
- **Tame the Layout:** Hide Reels, "Short Videos," and those massive "Stories" shelves that eat up your screen. You can even toggle off entire sections like Marketplace if you never use them.
- **Filter the Noise:** Create custom blocklists for specific words or phrases (with regex support!). You can also cap viral posts by "Like" count to keep your feed personal.
- **Quiet Down:** We strip out "People You May Know," "Follow" suggestions, survey promos, and other engagement traps. Plus, you can pause autoplaying GIFs and videos so you're not ambushed by motion.
- **Easy Controls:** Enjoy a refined, dark-mode friendly settings menu with translated labels. Just click the mop icon, flip a switch, and see the results instantly.

## <img src="src/res/pref.png" alt="options" width="36"/> Using the Control Panel

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

## <img src="src/res/bug.png" alt="bugs" width="36"/> Contributing & Support

- **Issues & Features:** Open an issue if something breaks or Facebook changes the markup again. I read them.
- **Pull Requests:** Yes please. Keep them focused and describe what you touched.
- **Translations:** If you can help keep the language dictionary sharp, I'm all ears.

## <img src="src/res/info.png" alt="license" width="36"/> License & Credits

- **License:** GNU General Public License v3.0. You are free to share, tweak, and improve as long as you pass those freedoms on.
- **Original Project:** [facebook-clean-my-feeds](https://github.com/zbluebugz/facebook-clean-my-feeds) by [zbluebugz](https://github.com/zbluebugz)
- **Simplified UI & styling refresh:** [Simplified_UI branch](https://github.com/trinhquocviet/facebook-clean-my-feeds/tree/simplified_ui) by [trinhquocviet](https://github.com/trinhquocviet)
- **Current Maintainer:** [Artificial Sweetener](https://github.com/Artificial-Sweetener) - me!~

## <img src="src/res/about.png" alt="about" width="36"/> From the Maintainer

I hope this script helps you reclaim your feed. I promise to be your ally in the fight against stuff you don't wanna see online.

- **My Website & Socials**: See my art, poetry, and other dev updates at [artificialsweetener.ai](https://artificialsweetener.ai).
- **If you like this project**, it would mean a lot to me if you gave me a star here on Github!! ⭐
