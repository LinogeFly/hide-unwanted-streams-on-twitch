# Description
Allows to block channels you don't normally watch on Twitch TV. As a result streams and videos of those channels will not visible on Directory pages, such as Games, Channels, Videos etc.

# Installation and System Requirements
This is not a standalone application or web browser extension but a so-called userscript. It is designed to work with userscript manager extension installed in your browser.

The userscript works with the following configurations:
- Google Chrome 18 or later with installed [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) extension from the Chrome Web Store.
- Firefox 14 or later with installed [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey) extension from Mozilla Add-ons.

**Important:** Userscript manager extension must be installed in your web browser BEFORE installing this userscript.

# Usage
## Overlay menu
There will be a menu added on Twitch TV web site for using and configuring the userscript. The menu can be accessed by hovering mouse over a stream/video thumbnail image on supported pages (see [Supported pages](#supported-pages) section further in this document), like on the following screenshot:

![Overlay menu](https://cdn.rawgit.com/LinogeFly/Scripts/84e501d61872f562bdcfad2fee5bebd53344c6cc/hideUnwantedStreamsOnTwitch/images/screenshot1_tuckfrump.png)

## Blocking a channel
In order to block a channel use `Block` button in the [overlay menu](#overlay-menu). The channel will be added to the "Blocked channels" list and content of that channel will not be visible anymore unless unblocked back.

## Unblocking a channel
To unblock a channel that was blocked previously find `Blocked Channels` tab in Settings window that can be accessed by clicking `Settings` button in the [overlay menu](#overlay-menu). List of blocked channels will be displayed on the tab with `Unblock` button next to their names. Use `Unblock` button for the corresponding channel in order to unblock it, like on the following picture:

![Blocked channels](https://cdn.rawgit.com/LinogeFly/Scripts/master/hideUnwantedStreamsOnTwitch/images/screenshot1_blockedChannels.png)

## Supported pages
Not all pages on Twitch TV web site are affected by the userscript, for example streams/videos on Home page will not be hidden for blocked channels. Here is the list of supported pages:
- Games
- Channels
- Videos

# Known issues
- "Back" button doesn't work after clicking on something in the overlay menu

# TODO
- Make a standalone extension for Google Chrome
- Add tests
- Add support for blocking games

# Links
- [Topic on Reddit](http://www.reddit.com/r/Twitch/comments/2segt6/hiding_unwanted_streams_on_twitch/)