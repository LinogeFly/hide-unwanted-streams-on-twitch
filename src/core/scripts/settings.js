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
    add: function (name, callback) {
        var self = this,
            start = new Date().getTime();

        // Initial checks
        if (typeof name === 'undefined' || name === '') {
            return;
        }

        husot.log.debug('husot.settings.BlockedItems.add() starts');
        self._get(name, function (item) {
            // Don't process if already in the list
            if (typeof item !== 'undefined') {
                callback();
                return;
            }

            // Add to the list
            self.list(function (items) {
                items.push({ 'name': name });

                husot.settings.setValue(self._settingsKey, JSON.stringify(items), function () {
                    // Invalidate cached list of blocked items
                    self._blockedItems = undefined;

                    husot.log.debug('husot.settings.BlockedItems.add() ends after {0} ms'.format((new Date().getTime()) - start));

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
                husot.settings.setValue(self._settingsKey, JSON.stringify(items), function () {
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
            husot.log.debug('husot.settings.BlockedItems.list() starts');
            husot.settings.getValue(self._settingsKey, '[]', function (item) {
                // Convert to JSON
                var items = JSON.parse(item);

                // Sort by name alphabetically
                items.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

                // Save in cache
                self._blockedItems = items;

                husot.log.debug('husot.settings.BlockedItems.list() ends after {0} ms'.format((new Date().getTime()) - start));

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
