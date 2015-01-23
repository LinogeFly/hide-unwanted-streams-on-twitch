# About
This solution is for hiding unwanted content on [Twitch TV](http://www.twitch.tv/) web site, such as streams, videos etc. Currently, the following platforms are supported:
- Extension for Google Chrome. Available on Chrome Web Store [here](https://chrome.google.com/webstore/detail/hide-unwanted-streams-on/kpgfplcjhleaadnmjmkjddcmekdhdiia).
- Userscript, to be used with userscript managers such as [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/). Can be installed from [here](https://openuserjs.org/scripts/LinogeFly/Hide_unwanted_streams_on_Twitch).

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

# Version history
- 1.2.0 Added Google Chrome Extension platform.
- 1.1.0 Added support for hiding videos in addition to live streams.
- 1.0.0 First release. Only Userscript platfom is supported.

# Known issues

# TODO
- Add support for blocking games
- Add tests for DOM selectors

# Links
- [Topic on Reddit](http://www.reddit.com/r/Twitch/comments/2segt6/hiding_unwanted_streams_on_twitch/)