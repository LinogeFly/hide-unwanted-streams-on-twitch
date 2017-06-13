# Important!
A standalone extension for Google Chrome is now available on Chrome Web Store, [here](https://chrome.google.com/webstore/detail/hide-unwanted-streams-on/kpgfplcjhleaadnmjmkjddcmekdhdiia). No need to use [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) anymore if you are a Google Chrome user.

# Description
Allows to hide content that you don't want to see on [twitch.tv](http://www.twitch.tv/) by blocking channels and games. Blocked content will not be visible for you anymore on Directory pages, such as Games, Channels, Videos etc.

# Installation and System Requirements
This is not a standalone application or web browser extension but a so-called userscript. It is designed to work with userscript manager extension installed in your browser.

The userscript works with the following configurations:
- Google Chrome 18 or later with installed [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) extension from the Chrome Web Store.
- Firefox 14 or later with installed [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey) extension from Mozilla Add-ons.

**Important:** Userscript manager extension must be installed in your web browser BEFORE installing this userscript.

# How to use
## Overlay menu
After installation there will be a menu added on [twitch.tv](http://www.twitch.tv/) for using and configuring "Hide unwanted streams on Twitch" solution. The menu can be accessed by hovering mouse over a stream, video or game thumbnail on supported pages (see [Supported pages](#supported-pages) section further in this document), like on the following screenshot:

![Overlay menu for channel](https://cdn.rawgit.com/LinogeFly/hide-unwanted-streams-on-twitch/73a09b4c344c9ffeec56dfd832297b037ce113a7/docs/screenshots/screenshot-1-640x400.png)

## Blocking a channel
To block a channel open [Channels](http://www.twitch.tv/directory/all) page or any game page, for example [Dark Souls](http://www.twitch.tv/directory/game/Dark%20Souls) page and use `Block` button in the [overlay menu](#overlay-menu) on a stream thumbnail. The channel will be added to the "Blocked Channels" list and content of that channel will not be visible anymore unless unblocked back.

## Blocking a game
To block a game open [Games](http://www.twitch.tv/directory) page and use `Block` button in the [overlay menu](#overlay-menu) on a game thumbnail. The game will be added to the "Blocked Games" list and content of that game will not be visible anymore unless unblocked back. See picture below:

![Overlay menu for game](https://cdn.rawgit.com/LinogeFly/hide-unwanted-streams-on-twitch/3c0123f6750857c7ddefdfd7b230badee793e412/docs/screenshots/screenshot-3-640x400.png)

## Unblocking content
To unblock content that has been blocked use the [overlay menu](#overlay-menu) and click `Settings` button to access Setting window. Open "Blocked Channels" and "Blocked Games" tabs to find blocked items and click `Unblock` button to unblock them, like on the following picture:

![Settings window](https://cdn.rawgit.com/LinogeFly/hide-unwanted-streams-on-twitch/338c2c3c037e1677fa136d9527cadb329721c161/docs/screenshots/screenshot-2-640x400.png)

## Supported pages
Not all pages on [twitch.tv](http://www.twitch.tv/) are affected by this solution. For example, content on Home page will not be hidden for blocked channels and games. Here is the list of supported pages:
- [Games](http://www.twitch.tv/directory)
- [Channels](http://www.twitch.tv/directory/all)
- [Videos](http://www.twitch.tv/directory/videos)

# Version history
- 1.3.20 Hot fix for blocking games/streams. Blocking for videos still doesn't work. Will be fixed soon.
- 1.3.19 Hot fix due to recent Twitch updates.
- 1.3.18 Fixed an issue when blocking stopped working on League of Legends page.
- 1.3.17 Added support for Communities pages.
- 1.3.16 Fixed a bug when "Infinite scroll" stopped triggering on Games page.
# Links
- [Topic on Reddit](http://www.reddit.com/r/Twitch/comments/2segt6/hiding_unwanted_streams_on_twitch/)
