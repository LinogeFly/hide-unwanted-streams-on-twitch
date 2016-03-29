var husot = husot || {};
husot.tests = husot.tests || {};
husot.tests.settingsProvider = husot.tests.settingsProvider || {};

husot.tests.settingsProvider.clear = function (cb) {
    chrome.storage.sync.clear(cb);
};

husot.tests.settingsProvider.get = function (key, cb) {
    chrome.storage.sync.get(key, function (items) {
        cb(items[key]);
    });
};

husot.tests.settingsProvider.set = function (key, value, cb) {
    var data = {};
    data[key] = value;

    chrome.storage.sync.set(data, cb);
};