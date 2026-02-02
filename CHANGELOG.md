# [6.1.2](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.1.1...v6.1.2) (2026-02-02)


### Bug Fixes

* **dom:** only show tooltips on hover ([7d0fec8](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/7d0fec88b2d7fed659eefacfc6778e98cbd25eea))
* **feeds:** tighten profile post targeting ([0f5ae6f](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/0f5ae6f542d7c17352b7939cd88b30476096f680))

# [6.1.1](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.1.0...v6.1.1) (2026-02-02)


### Bug Fixes

* **i18n:** add missing translations for verified and ai options ([d65cb46](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/d65cb460d435df0e467551b1e70cd99c17681e8f))

# [6.1.0](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.0.0...v6.1.0) (2026-02-02)


### Bug Fixes

* **ui:** prevent menu text selection and mount styles early ([343421d](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/343421d540a02df844e8ce4c59506d648aa078f1))


### Features

* **news:** add locale-agnostic follow/join and sponsored detection ([307f0b2](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/307f0b281e6bfebe3b26b51ff6ee66e479a03a82))
* **news:** add top cards filter for pages ([4e2600a](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/4e2600ad801d1713f179d47a2054105ddb0f6e00))
* **news:** add verified badge hide and filter options ([7c728cc](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/7c728cc62f3a5170136542e68596f7cd5da3c9bd))

# [6.0.0](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v5.07...v6.0.0) (2026-01-17)

### Features

* **core:** modularize source tree for core logic, feeds, DOM helpers, UI, and storage
* **ui:** rebuild settings dialog with refreshed menus, labels, animations, and feedback
* **ui:** add diagnostics tooling for bug reports and expanded UI controls
* **ui:** improve topbar toggle positioning, styling, and menu sync behavior
* **tooling:** add localization verification tooling and expand translation coverage
* **tooling:** add icon optimization and userscript banner sync tooling
* **release:** add semantic-release workflow and Conventional Commit guidance
* **tests:** add Jest test suite with expanded UI coverage
* **ui:** update tooltips and styling for light/dark theme changes

# Old Changelog

### v5.07 - December 2025

- Deferred mutation observer until `document.documentElement` is present to avoid Firefox race condition.

### v5.06 - October 2025

- Added an optional "Try Meta AI" News Feed filter to hide Meta AI promo cards.
- Merged language fallbacks so new options automatically inherit English copy.

### v5.05 - October 2025

- Promoted the userscript to the repo root and removed legacy beta/uBO folders
- Rewrote the README with new install docs, credits, and language toggle
- Bumped metadata to keep versioning honest
- New GreasyFork release
- Fixed support link in script

### v5.04 - October 2025

- Fixed hidden post gaps by fully collapsing hidden containers
- Updated toggle button styling to match Simplified UI branch

### v5.03 - October 2025

- Improved follow filtering defaults and detection
- Updated default hide options and feed selectors
- Updated metadata (authors, license)
- Pulled in menu styling from Simplified UI branch

### v5.02 - November 2024

- Updated News Feed Sponsored detection rules

### v5.01 - October 2024

- Changed the detect-changes-engine component
- Updated dialog-box
- Users can change dialog-box's ui language
- Updated label for post has been hidden component
- Added Animated GIFs post detection component (News Feed + Groups Feed) (gif/mp4)
- Removed consecutive hidden posts facility from Watch Videos (FB keeps a few posts as you scroll)
- Added Duplicate Video detection component (Watch Videos feed)
- Added Instagram Video detection component (Watch Videos feed)
- Added code to remove "incomplete" Watch Video posts (posts with no content)
- Added icon to open a Watch Videos Feed post in a new window
- Updated News Feed's detection rule
- Updated Group Feed's dection rule
- Updated Marketplace detection rules
- Updated Search posts detection rule
- Updated News Feed's Sponsored posts detection rule
- Added option to Disable looping videos in Reels
- Fix bug with showing/hiding the FB-CMF button
- Updated nf_isSuggested filter rules
- Updated nf_isPeopleYouMayKnow filter rule
- Added RegExp option to text filters
- Code tweaks

### v4.31 - June 2024

- Reels and Videos - added extra detection rule (dictionary base)
- Survey - updated detection rule
- Reels - option to stop looping

### v4.30 - March 2024

- Hot fix
- Updated Marketplace feed detection component

### v4.29 - February 2024

- !!! Hot fix !!!
- Issues with FB, Adblockers and FB-CMF - all clashing
- Adjusted News Feed's query rules
- Temporarily disabled News Feed's message/notification tab (will be restored in next version)

### v4.28 - January 2024

- Enabled option to toggle Sponsored post detection rule (for uBO compatibility)
- Added Video's "Live" detection rule
- Enabled Reels' video controls
- Added Ukrainian (Українська)
- Added Bulgarian (български)
- Dialog box - reworded "Miscellaneous items" to "Supplementary / information section"
- Dialog box - added "Reset" button to reset the options
- Fixed bug with Survey detection component
- Fixed bug with Importing settings from a file
- Revised message/notification tab for News feed
- Revised Create Stories detection rule
- Add option to filter posts by number of Likes
- Fixed bug with function scanTreeForText() - failing to detect "Anonymous participant"
- Updated Groups Feed filter rules - new HTML structure via (Feeds > Groups)
- Added display of script's version number to dialog box

### v4.27 - December 2023

- Added Russian (Русский) - supplied by github user Kenya-West

### v4.26 - November 2023

- Added web.facebook.com to @match conditions
- Added Survey detection component (Home / News feed)
- Added Follow detection component (Home / News feed)
- Added Participate detection component (Home / News feed)
- Updated Marketplace detection rules

### v4.25 - November 2023

- Added extra filter rule for nf_isSuggested() (for "Suggested for you" posts) - fix supplied by opello (via github)
- Added News Feed's Stories post detection rule.
- Revised function scanTreeForText() to include other elements for scanning
- Fixed bug with Marketplace prices' filter
- Reduce possible conflicts with uBlock Origin / other adblockers
- Code tweaks

### v4.24 - September 2023

- Fixed issues with v4.23 (selection/detection rules)
- Code tweaks

### v4.23 - August 2023

- Fixed bug with showing Marketplace's hidden items
- Updated Marketplace detection rules
- Split Marketplace's text filter into two - prices and description
- Merged "Stories" with "Stories | Reels | Rooms" detection rules.
- Fixed bug with CMF's hidden dialog box's text being included in CTRL+F search (now excluded)
- Dropped "Create room" detection component (no longer listed in FB)

### v4.22 - July 2023

- Updated News Feed posts selection rule (FB changed structure)
- Updated Events you may like detection rule

### v4.21 - June 2023

- Updated news feed detection rules - for older HTML structures
- Updated watch videos feed detection rules
- Added Greek (Ελληνικά)
- Updated various functions

### v4.20 - May 2023

- Added "Feeds (most recent)" to the clean up rules (FB recently introduced the "Feeds (most recent)" feature)
- Updated Search Feed sponsored posts rule

### v4.19 - May 2023

- Updated News Feed posts selection rule (FB changed structure)

### v4.18 - May 2023

- Updated News Feed sponsored posts rule
- Added News Feed sponsored video posts rule
- Updated News Feed suggested posts rule

### v4.17 - March 2023

- Fixed issue with GreaseMonkey & FireMonkey not able to run userscript
- Updated News Feed sponsored posts rule
- Updated Videos Feed sponsored posts rule
- Added option to hide "# shares" on posts (news + groups)

### v4.16 - February 2023

- Fixed issue with <no message> setting breaking FB
- Code tweaks

### v4.15 - February 2023

- Updated News Feed sponsored posts rule (FB changed structure)
- Updated Marketplace Feed > Item page posts rules
- Code tweaks

### v4.14 - January 2023

- Updated News Feed Suggestion/Recommendation posts rule (FB changed structure)
- Updated News Feed verbosity behaviour. FB limits 40 posts in News Feed. Show either no notification or 1 post hidden. 2+ posts hidden notification disabled.
- Groups Feed posts - added icon to open post in new window (fix annoying FB bug with not showing comments properly)
