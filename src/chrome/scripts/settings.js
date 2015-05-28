// Application settings (Chrome specific)

var husot = husot || {};
husot.settings = husot.settings || {};

husot.settings.getChunkKey = function (key, index) {
    return (index === 0) ? key : key + "_" + index;
};

husot.settings.getChunkKeys = function (key, index) {
    var self = this,
        result = [];

    for (i = 0; i < chrome.storage.sync.MAX_ITEMS; i++) {
        var chunkKey = self.getChunkKey(key, i);
        result.push(chunkKey);
    }

    return result;
};

husot.settings.setValue = function (key, value, callback) {
    var self = this,
        i = 0,
        items = {},
        chunk,
        chunkKey,
        start = new Date().getTime();

    husot.log.debug('husot.settings.setValue() starts');

    // Splitting value into chuncks in case if value is bigger than QUOTA_BYTES_PER_ITEM
    while (value.length > 0) {
        chunkKey = self.getChunkKey(key, i);
        // I case if you are wondering about -2 at the end see: https://code.google.com/p/chromium/issues/detail?id=261572
        // Divide QUOTA_BYTES_PER_ITEM by 2 because one character takes two bytes in unicode.
        chunk = value.substr(0, chrome.storage.sync.QUOTA_BYTES_PER_ITEM / 2 - chunkKey.length - 2);
        items[chunkKey] = chunk;
        value = value.substr(chrome.storage.sync.QUOTA_BYTES_PER_ITEM / 2 - chunkKey.length - 2);
        i++;
    }

    // Remove old value and set new value afterwards
    chrome.storage.sync.remove(self.getChunkKeys(key), function () {
        chrome.storage.sync.set(items, function () {
            husot.log.debug('husot.settings.setValue() ends after {0} ms'.format((new Date().getTime()) - start));
            callback();
        });
    });
};

husot.settings.getValue = function (key, defaultValue, callback) {
    var self = this,
        start = new Date().getTime();

    husot.log.debug('husot.settings.getValue() starts');

    chrome.storage.sync.get(null, function (items) {
        var value = '';

        // Joining all value chunks because it could be stored with multiple keys when it's bigger than QUOTA_BYTES_PER_ITEM
        for (i = 0; i < chrome.storage.sync.MAX_ITEMS; i++) {
            var chunkKey = self.getChunkKey(key, i);
            if (items[chunkKey] === undefined) {
                break;
            }
            value += items[chunkKey];
        }

        husot.log.debug('husot.settings.getValue() ends after {0} ms'.format((new Date().getTime()) - start));

        if (value === '') {
            callback(defaultValue);
        } else {
            callback(value);
        }
    });
};
