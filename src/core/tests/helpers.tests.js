// Helpers tests

var husot = husot || {};
husot.tests = husot.tests || {};
husot.tests.helpers = husot.tests.helpers || {};

husot.tests.helpers.runAll = function () {
    var self = this;

    husot.tests.helpers.trimSlash_should_remove_leading_and_trailing_slashes();
};

husot.tests.helpers.trimSlash_should_remove_leading_and_trailing_slashes = function () {
    if ('/forsenlol'.trimSlash() !== 'forsenlol') {
        husot.tests.fail();
    }

    if ('/forsenlol/'.trimSlash() !== 'forsenlol') {
        husot.tests.fail();
    }
};
