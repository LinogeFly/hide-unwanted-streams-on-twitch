// DOM Listner Tests

var husot = husot || {};
husot.tests = husot.tests || {};
husot.tests.domListener = husot.tests.domListener || {};

husot.tests.domListener.runAll = function () {
    var self = this;

    husot.tests.domListener.shouldAllowUrls();
    husot.tests.domListener.shouldNotAllowUrls();
};

husot.tests.domListener.shouldAllowUrls = function () {
    var urls = [
        'http://twitch.tv/directory',
        'http://twitch.tv/directory/',
        'https://twitch.tv/directory',
        'https://twitch.tv/directory/',
        'http://www.twitch.tv/directory',
        'http://www.twitch.tv/directory/',
        'http://en.twitch.tv/directory',
        'http://en.twitch.tv/directory/',

        'http://www.twitch.tv/directory/all',
        'http://www.twitch.tv/directory/all/',
        'http://www.twitch.tv/directory/game/Minecraft',
        'http://www.twitch.tv/directory/game/Minecraft/',
        'http://www.twitch.tv/directory/game/League%20of%20Legends',
        'http://www.twitch.tv/directory/game/League%20of%20Legends/',
        'http://www.twitch.tv/directory/game/Minecraft/videos/week',
        'http://www.twitch.tv/directory/game/Minecraft/videos/week/',
        'http://www.twitch.tv/directory/game/League%20of%20Legends/videos/week',
        'http://www.twitch.tv/directory/game/League%20of%20Legends/videos/week/',
        'http://www.twitch.tv/directory/random',
        'http://www.twitch.tv/directory/random/',
        'http://www.twitch.tv/directory/videos/week',
        'http://www.twitch.tv/directory/videos/week/',

        'http://www.twitch.tv/directory/following',
        'http://www.twitch.tv/directory/following/',
        'http://www.twitch.tv/directory/following/live',
        'http://www.twitch.tv/directory/following/live/',
        'http://www.twitch.tv/directory/following/hosts',
        'http://www.twitch.tv/directory/following/hosts/',
        'http://www.twitch.tv/directory/following/games',
        'http://www.twitch.tv/directory/following/games/',
        'http://www.twitch.tv/directory/following/videos',
        'http://www.twitch.tv/directory/following/videos/'
    ];

    urls.forEach(function (url) {
        if (!husot.domListener.isUrlAllowed(url)) {
            husot.tests.fail();
        }
    });
};

husot.tests.domListener.shouldNotAllowUrls = function () {
    var urls = [
        'http://twitch.tv',
        'http://twitch.tv/',
        'https://twitch.tv',
        'https://twitch.tv/',
        'http://www.twitch.tv',
        'http://www.twitch.tv/',
        'http://en.twitch.tv',
        'http://en.twitch.tv/',
        'http://www.twitch.tv/bla-bla-bla',
        'http://www.twitch.tv/bla-bla-bla/',
        'http://www.twitch.tv/directory/bla-bla-bla',
        'http://www.twitch.tv/directory/bla-bla-bla/'
    ];

    urls.forEach(function (url) {
        if (husot.domListener.isUrlAllowed(url)) {
            husot.tests.fail();
        }
    });
};
