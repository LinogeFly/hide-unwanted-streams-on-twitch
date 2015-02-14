# Important!
A standalone extension for Google Chrome is now available on Chrome Web Store, [here](https://chrome.google.com/webstore/detail/hide-unwanted-streams-on/kpgfplcjhleaadnmjmkjddcmekdhdiia). No need to use [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) anymore if you are a Google Chrome user.

# Description
Allows to hide content that you don't want to see on [Twitch TV](http://www.twitch.tv/) by blocking channels and games. Blocked content will not be visible for you anymore on Directory pages, such as Games, Channels, Videos etc.

# Installation and System Requirements
This is not a standalone application or web browser extension but a so-called userscript. It is designed to work with userscript manager extension installed in your browser.

The userscript works with the following configurations:
- Google Chrome 18 or later with installed [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) extension from the Chrome Web Store.
- Firefox 14 or later with installed [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey) extension from Mozilla Add-ons.

**Important:** Userscript manager extension must be installed in your web browser BEFORE installing this userscript.

# How to use
## Overlay menu
After installation there will be a menu added on [Twitch TV](http://www.twitch.tv/) web site for using and configuring "Hide unwanted streams on Twitch" solution. The menu can be accessed by hovering mouse over a stream, video or game thumbnail image on supported pages (see [Supported pages](#supported-pages) section further in this document), like on the following screenshot:

![Overlay menu for channel](https://cdn.rawgit.com/LinogeFly/hide-unwanted-streams-on-twitch/master/docs/screenshots/screenshot-1-640x400.png)

## Blocking a channel
To block a channel navigate to [Channels](http://www.twitch.tv/directory/all) or [Videos](http://www.twitch.tv/directory/videos) page and use `Block` button in the [overlay menu](#overlay-menu) on a stream or video thumbnail. The channel will be added to the "Blocked Channels" list and content of that channel will not be visible anymore unless unblocked back.

## Blocking a game
To block a game navigate to [Games](http://www.twitch.tv/directory) page and use `Block` button in the [overlay menu](#overlay-menu) on a game thumbnail. The game will be added to the "Blocked Games" list and content of that game will not be visible anymore unless unblocked back. See picture below:

![Overlay menu for game](https://cdn.rawgit.com/LinogeFly/hide-unwanted-streams-on-twitch/3c0123f6750857c7ddefdfd7b230badee793e412/docs/screenshots/screenshot-3-640x400.png)

## Unblocking content
To unblock content that has been blocked use the [overlay menu](#overlay-menu) and click `Settings` button to access Setting window. Open "Blocked Channels" and "Blocked Games" tabs to find blocked items and click `Unblock` button to unblock them, like on the following picture:

![Settings window](https://cdn.rawgit.com/LinogeFly/hide-unwanted-streams-on-twitch/3c0123f6750857c7ddefdfd7b230badee793e412/docs/screenshots/screenshot-2-640x400.png)

## Supported pages
Not all pages on [Twitch TV](http://www.twitch.tv/) web site are affected by this solution. For example, content on Home page will not be hidden for blocked channels and games. Here is the list of supported pages:
- [Games](http://www.twitch.tv/directory)
- [Channels](http://www.twitch.tv/directory/all)
- [Videos](http://www.twitch.tv/directory/videos)

# Version history
- 1.3.2 Fixed a bug when streams were not hiding on CS:GO pages.
- 1.3.1 Fixed performance issue that occurred when a lot of channels and games were blocked. Blocked items are now sorted alphabetically in Settings window.
- 1.3.0 Added support for blocking games.
- 1.2.2 Fixed a bug when new video thumbs were not loading sometimes after blocked channels were hidden.
- 1.2.0 First release in Chrome Web Store.
- 1.1.0 Added support for hiding videos in addition to live streams.
- 1.0.0 First release.

# Links
- [Topic on Reddit](http://www.reddit.com/r/Twitch/comments/2segt6/hiding_unwanted_streams_on_twitch/)