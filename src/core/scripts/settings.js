// Application settings

var husot = husot || {};
husot.settings = husot.settings || {};

husot.settings.BlockedItems = function (settingsKey) {
    this._settingsKey = settingsKey;
    this._blockedItems; // For caching
};

husot.settings.BlockedItems.prototype = {
    _get: function (name, callback) {
        this.list(function (items) {
            var $item = $.grep(items, function (x) { return x.name === name; });

            if (!$item.length) {
                callback();
            } else {
                callback($item[0]);
            }
        });
    },
    // String parameter value can be raw JSON string or compressed JSON string.
    _parse: function (str) {
        try {
            // Try to decompress first
            var decompressed = LZString.decompressFromUTF16(str);

            if (typeof decompressed === 'undefined' || decompressed === null || decompressed === '')
                // When there is nothing to decompress it's raw JSON string
                // so just parse original string to JSON
                return JSON.parse(str);
            else
                // When decompression is successfull parse decompressed string to JSON
                return JSON.parse(decompressed)
        } catch (err) {
            // Decompress + parse to JSON fails when string is not compressed
            // so just parse original string to JSON
            return JSON.parse(str);
        }
    },
    _stringity: function (val) {
        // Stringify to JSON and compress
        return LZString.compressToUTF16(JSON.stringify(val));
    },
    add: function (name, callback) {
        var self = this,
            start = new Date().getTime();

        // Initial checks
        if (typeof name === 'undefined' || name === '') {
            return;
        }

        husot.log.debug('husot.settings.add() starts');
        self._get(name, function (item) {
            // Don't process if already in the list
            if (typeof item !== 'undefined') {
                callback();
                return;
            }

            // Add to the list
            self.list(function (items) {
                items.push({ 'name': name });

                husot.settings.setValue(self._settingsKey, self._stringity(items), function () {
                    // Invalidate cached list of blocked items
                    self._blockedItems = undefined;

                    husot.log.debug('husot.settings.add() ends after {0} ms'.format((new Date().getTime()) - start));

                    callback();
                });
            });
        });
    },
    remove: function (name, callback) {
        var self = this;

        // Initial checks
        if (typeof name === 'undefined' || name === '') {
            callback();
            return;
        }

        this._get(name, function (item) {
            // Don't process if not in the list
            if (typeof item === 'undefined') {
                callback();
                return;
            }

            // Remove from the list
            self.list(function (items) {
                var index = $.inArray(item, items);
                items.splice(index, 1);
                husot.settings.setValue(self._settingsKey, self._stringify(items), function () {
                    // Invalidate cached list of blocked items
                    self._blockedItems = undefined;

                    callback();
                });
            });
        });
    },
    list: function (callback) {
        var self = this,
            start = new Date().getTime();

        if (typeof self._blockedItems === 'undefined') {
            husot.log.debug('husot.settings.list() starts');
            husot.settings.getValue(self._settingsKey, '[]', function (item) {
                // Convert to JSON
                var items = self._parse(item);

                // Sort by name alphabetically
                items.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                // Save in cache
                self._blockedItems = items;

                husot.log.debug('husot.settings.list() ends after {0} ms'.format((new Date().getTime()) - start));

                // Return
                if (typeof callback !== 'undefined') {
                    callback(self._blockedItems);
                }
            });
        } else {
            if (typeof callback !== 'undefined') {
                callback(self._blockedItems);
            }
        }
    }
};
