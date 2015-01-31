// Application settings (Chrome specific)

var husot = husot || {};
husot.settings = husot.settings || {};

husot.settings.setValue = function (key, value, callback) {
    var items = {};
    items[key] = value;

    chrome.storage.sync.set(items, function () {
        callback();
    });
};

husot.settings.getValue = function (key, defaultValue, callback) {
    var items = {}
    items[key] = defaultValue;

    chrome.storage.sync.get(items, function (result) {
        if ($.isEmptyObject(result)) {
            callback(defaultValue);
        } else {
            callback(result[key]);
        }
    });
};
