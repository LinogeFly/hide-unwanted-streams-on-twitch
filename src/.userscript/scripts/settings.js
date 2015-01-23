// Application settings (Userscript specific)

husot.settings = husot.settings || {};

husot.settings.setValue = function (key, value, callback) {
    GM_setValue(key, value);

    callback();
};

husot.settings.getValue = function (key, defaultValue, callback) {
    var value = GM_getValue(key, defaultValue);

    callback(value);
};
