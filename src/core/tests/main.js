// Tests

var husot = husot || {};
husot.tests = husot.tests || {};

husot.tests.runAll = function () {
    husot.tests.chromeSettings.runAll();
};

husot.tests.fail = function (message) {
    if (message === undefined) {
        console.error('HUSOT: Test failed.');
        return;
    }

    console.error('HUSOT: Test failed. ' + message);
};
