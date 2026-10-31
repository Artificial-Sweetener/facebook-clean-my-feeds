# [6.5.0](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.4.0...v6.5.0) (2026-10-31)


### Bug Fixes

* **diagnostics:** preserve unfamiliar header metadata ([e45b44a](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/e45b44af81a5442972d249299d87aba123bafc1f))
* **filters:** resolve SVG disclosures and improve bug reports ([df7300d](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/df7300dde56604439bd12856104f7868ea9441c1))
* **news:** stop caption blinking during post virtualization ([b0402bb](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/b0402bbb696a8df0b133d0f10592c659f2cd15af))


### Features

* **diagnostics:** capture bounded post transition history ([1e5189d](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/1e5189d05b791db2811e3313afda05dd5fa2bad1))

# [6.4.0](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.3.2...v6.4.0) (2026-10-27)


### Bug Fixes

* **diagnostics:** redact private labels and preserve filter evidence ([969b63b](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/969b63bf3d8540ded7d1964153efa3978afb3ca4))
* **feeds:** filter inline Stories ribbons by preview structure ([076f165](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/076f165dd2ed0a44cd4f1c8f5ee01992024aa592))
* **feeds:** inspect all eligible sponsored candidates ([538b8b3](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/538b8b3204df788edde7e3b956114ce3ecab2ecb)), closes [#19](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues/19)
* **feeds:** scope disclosure evidence to owning post metadata ([16ddd68](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/16ddd686af214986dd6994136776f7f2289ed27f))
* **filters:** classify rendered group and video labels ([98bb58d](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/98bb58d8b8cf662eb1c60823f334489d5323f70e))
* **filters:** enable owned reversible information-box filtering ([b06914a](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/b06914ab2fa6f3aa0d7252d17fe5337cbe0448cb))
* **filters:** honor independent options across groups and search ([d1f0776](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/d1f0776d85cd2f343cddf30af09a2dfe84d20674))
* **filters:** preserve owned evidence and reject concealed previews ([c04f242](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/c04f24292bcc0dd6b9229ad7e9fe6818e6318980))
* **filters:** read owned rendered labels and localized reaction counts ([9d82b27](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/9d82b271dc4b9730bb287f64378ff42025616fb1))
* **filters:** restore duplicate videos and scope group post discovery ([d88175e](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/d88175ea092c8e44bcfbd448169a2d70bd17274c))
* **filters:** validate feature visibility and restore reused ad slots ([c7cc35f](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/c7cc35f027d3b21c59c25693a8184642699423b7))
* **marketplace:** honor validated regex filters ([b04664b](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/b04664b02dea7eadbca2d7a86048edce681034af))
* **marketplace:** recognize current virtualized listing cards ([2b0ce56](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/2b0ce56fe1ddaebf4f8a78d3653089ec243df72f))
* **marketplace:** reconcile disclosed ads and visibility changes ([e83cacb](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/e83cacb8e0f8f2716314d67185c5b2df911b07bc))
* **marketplace:** require visible evidence and restore recycled cards ([9a77344](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/9a773441991d027527c14edd75b7dac816573a9e))
* **runtime:** recover stalled scans and release replaced resources ([0c2fdd2](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/0c2fdd21c450978f1310be50c06fe02583aab88a))
* **ui:** adapt standalone SVG colors to light and dark themes ([27efd71](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/27efd7104458be799252c724d39fddeec8fc09d5))
* **ui:** restore faithful icons and harden toolbar navigation ([2f30d50](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/2f30d50d9dda79d936867c5bf46f44f03dce4456))


### Features

* harden filters and capture redacted session reports ([605c587](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/605c5870c11c192e9c066c9faff7ae1c74382bba))
* migrate to TypeScript and enforce architecture governance ([c509e7e](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/c509e7ef3c4cd388ababa0fc44150e9d6d900458))
* release TypeScript migration, filter fixes, and redacted diagnostics ([d2d7cc2](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/d2d7cc2bd1f29505e5d51cb5c7cc1ace5dc5e251))
* **ui:** replace raster icons with hand-authored SVG ([ad48e17](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/ad48e17aa91a11074645d3e3bb71efca876edf1b))


### Performance Improvements

* **runtime:** reduce duplicate reads and release settings resources ([cebaeeb](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/cebaeebd16b1e18a7d48c334752c7a285528c35d))

## [6.3.2](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.3.1...v6.3.2) (2026-10-05)


### Bug Fixes

* **news:** detect sponsored article-root signatures ([5a70c91](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/5a70c910f92ab41dbc2af0bc13013ddabf935f79))
* **news:** handle orphan virtualized sponsored posts ([b71a390](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/b71a390621a4b8dc6f6f577fad8b5c146754bb7a))

## [6.3.1](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.3.0...v6.3.1) (2026-07-05)


### Bug Fixes

* **news:** detect zero-width sponsored rail labels ([45b0e83](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/45b0e83256110e9cf9e7da6372aac4363d0cf273))

# [6.3.0](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.2.3...v6.3.0) (2026-07-03)


### Features

* **news:** filter posts labeled AI info ([7854587](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/7854587fc01a86caa5fbea38f5c385941f5aa051))

## [6.2.3](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.2.2...v6.2.3) (2026-04-11)


### Bug Fixes

* **news:** hide right-rail sponsored ads ([b61f93f](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/b61f93fcd9656688700bcc36f7f0ae52230cc75e))
* **ui:** avoid page-mode topbar overlap ([dce697c](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/dce697cc9df33651448cb260267e2a6d9ff2132a))
* **ui:** dim mop toggle behind facebook modals ([7988d6d](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/7988d6d74f2f2f29a53461c50194cfe0f5598d79))

## [6.2.2](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.2.1...v6.2.2) (2026-04-01)


### Bug Fixes

* **ui:** stabilize preferences dialog and toggle placement ([77898a9](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/77898a90cee903f0984ef81cfa2bdaf748194443))

## [6.2.1](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.2.0...v6.2.1) (2026-03-16)


### Bug Fixes

* **news:** restore feed filtering ([277b281](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/277b28117b50a1b4aa8b55333fb789cd06cdd37e))

# [6.2.0](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/compare/v6.1.2...v6.2.0) (2026-03-16)


### Features

* **news:** scrub Meta AI prompt suggestions ([536dbec](https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/commit/536dbec1b45f9843cdf6811c0134e0379ba5fbe7))

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
