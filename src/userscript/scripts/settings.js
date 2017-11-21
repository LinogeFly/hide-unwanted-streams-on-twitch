// Application settings (Userscript specific)

var husot = husot || {};
husot.settings = husot.settings || {};

husot.settings.setValue = function (key, value, callback) {
    GM.setValue(key, value).then(function () {
        callback();
    }, function (reason) { // rejection
        husot.log.error(reason);
    });
};

husot.settings.getValue = function (key, defaultValue, callback) {
    GM.getValue(key).then(function (value) {
        if (typeof value === 'undefined' || value === '') {
            callback(defaultValue);
        }

        callback(value);
    }, function (reason) { // rejection
        husot.log.error(reason);
    });
};
