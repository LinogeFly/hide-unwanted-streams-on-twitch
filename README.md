# About
This solution is for hiding unwanted content on [Twitch TV](http://www.twitch.tv/) web site, such as streams, videos etc. Currently, the following platforms are supported:
- Extension for Google Chrome. Available on Chrome Web Store [here](https://chrome.google.com/webstore/detail/hide-unwanted-streams-on/kpgfplcjhleaadnmjmkjddcmekdhdiia).
- Userscript, to be used with userscript managers such as [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Can be installed from [here](https://openuserjs.org/scripts/LinogeFly/Hide_unwanted_streams_on_Twitch).

# How to use
See [User Guide](https://github.com/LinogeFly/hide-unwanted-streams-on-twitch/tree/master/docs/user-guide.md) document.

# How to build
## Prerequisites
Before you can build this solution, you must install and configure the following dependencies on your machine:
- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/)
- [Gulp](http://gulpjs.com/). Install gulp globally with:
```
npm install --global gulp
```

## Building
In order to build the solution, you need to clone the source code repository first. After that install all necessary dependencies by running the following command in the solution's directory:
```
npm install
```
To build this solution, use:
```
gulp
```
For platform specific builds use `gulp build-chrome` and `gulp build-userscript` commands.

# How to run tests
Currently, tests are semi-automatic. To run tests open browser's console, select "Hide unwanted streams on Twitch" scope and run the following command:
```
husot.tests.runAll()
```
Failing tests will throw errors into console.

# Version history
- 1.3.7 Fixed a bug when "Infinite scroll" didn't get triggered sometimes on language specific Channels page.
- 1.3.6 Fixed a bug when block list was getting reset if hitting total storage limit for a Chrome extension.
- 1.3.5 Fixed a bug when solution was not working if Twitch was accessed with language specific URL.
- 1.3.4 Fixed a bug when it was not possible to save long block lists due to quotation limit for settings (in Chrome only).
- 1.3.3 Fixed a bug when "Infinite scroll" didn't get triggered sometimes on Games page (in Chrome only).
- 1.3.2 Fixed a bug when streams were not hiding on CS:GO pages.
- 1.3.1 Fixed performance issue that occurred when a lot of channels and games were blocked. Blocked items are now sorted alphabetically in Settings window.
- 1.3.0 Added support for blocking games.
- 1.2.0 Added Google Chrome Extension platform.
- 1.1.0 Added support for hiding videos in addition to live streams.
- 1.0.0 First release. Only Userscript platfom is supported.

# Known issues

# TODO
- Add tests for CSS selectors
- Solve the problem when thumbnails blink during hiding. In the other words thumbnails are loaded and there is small lag before they become hidden.

# Links
- [Topic on Reddit](http://www.reddit.com/r/Twitch/comments/2segt6/hiding_unwanted_streams_on_twitch/)
