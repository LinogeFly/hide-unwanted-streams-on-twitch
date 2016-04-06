var husot = husot || {};
husot.tests = husot.tests || {};
husot.tests.thumbs = husot.tests.thumbs || {};

husot.tests.thumbs.runAll = function () {
    var self = this;

    new self.isThumbMustBeHiddenForLanguageTests().runAll();
}

// Tests for StreamThumbsManager._isThumbMustBeHiddenForLanguage

husot.tests.thumbs.isThumbMustBeHiddenForLanguageTests = function () {
    this.runAll = runAll;

    function runAll() {
        should_return_true_if_thumbsData_language_found_for_channel();
        should_return_false_if_blockedLanguages_empty();
        should_return_false_if_thumbsData_empty();
        should_return_false_if_thumbsData_language_missing();
        should_return_false_if_thumbsData_channel_missing();
    }

    function should_return_true_if_thumbsData_language_found_for_channel() {
        var $thumbContainer = _getThumbContainer('LenaGol0vach');
        var blockedLanguages = ['ru'];
        var thumbsData = [
            {
                channel: "LenaGol0vach",
                language: "ru"
            }
        ];

        var result = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, thumbsData);

        if (result !== true)
            husot.tests.fail();
    }

    function should_return_false_if_blockedLanguages_empty() {
        var $thumbContainer = _getThumbContainer('LenaGol0vach');
        var thumbsData = [
            {
                channel: "LenaGol0vach",
                language: "ru"
            }
        ];

        var result1 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, [], thumbsData);
        var result2 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, undefined, thumbsData);

        if (result1 !== false)
            husot.tests.fail();
        if (result2 !== false)
            husot.tests.fail();
    }

    function should_return_false_if_thumbsData_empty() {
        var $thumbContainer = _getThumbContainer('LenaGol0vach');
        var blockedLanguages = ['ru'];

        var result1 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, []);
        var result2 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, undefined);

        if (result1 !== false)
            husot.tests.fail();
        if (result2 !== false)
            husot.tests.fail();
    }

    function should_return_false_if_thumbsData_language_missing() {
        var $thumbContainer = _getThumbContainer('LenaGol0vach');
        var blockedLanguages = ['ru'];

        var result1 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, [
            {
                channel: "LenaGol0vach"
            }
        ]);
        var result2 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, [
            {
                channel: "LenaGol0vach",
                language: null
            }
        ]);
        var result3 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, [
            {
                channel: "LenaGol0vach",
                language: ""
            }
        ]);

        if (result1 !== false)
            husot.tests.fail();
        if (result2 !== false)
            husot.tests.fail();
        if (result3 !== false)
            husot.tests.fail();
    }

    function should_return_false_if_thumbsData_channel_missing() {
        var $thumbContainer = _getThumbContainer('LenaGol0vach');
        var blockedLanguages = ['ru'];

        var result1 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, [
            {
                language: "ru"
            }
        ]);
        var result2 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, [
            {
                channel: null,
                language: "ru"
            }
        ]);
        var result3 = husot.thumbs.streamThumbsManager._isThumbMustBeHiddenForLanguage($thumbContainer, blockedLanguages, [
            {
                channel: "",
                language: "ru"
            }
        ]);

        if (result1 !== false)
            husot.tests.fail();
        if (result2 !== false)
            husot.tests.fail();
        if (result3 !== false)
            husot.tests.fail();
    }

    function _getThumbContainer(channel) {
        return $('<div class="stream item"><div class="meta"><p class="info"><a>' + channel + '</a></p></div></div>');
    }
};
