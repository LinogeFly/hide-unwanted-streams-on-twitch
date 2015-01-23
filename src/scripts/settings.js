// Application settings

husot.settings = husot.settings || {};

husot.settings.blockedChannels = (function () {
    var blockedChannelsList; // For caching

    function get(name, callback) {
        list(function (items) {
            var $item = $.grep(items, function (x) { return x.name === name; });

            if (!$item.length) {
                callback();
            } else {
                callback($item[0]);
            }
        });
    }

    function add(name, callback) {
        // Initial checks
        if (typeof name === 'undefined' || name === '') {
            return;
        }

        get(name, function (item) {
            // Don't process if already in the list
            if (typeof item !== 'undefined') {
                callback();
                return;
            }

            // Add to the list
            list(function (items) {
                items.push({ 'name': name });
                husot.settings.setValue(husot.constants.blockedChannelsSettingsKey, JSON.stringify(items), function () {
                    // Invalidate cached Blocked Channels List
                    blockedChannelsList = undefined;

                    callback();
                });
            });
        });
    }

    function remove(name, callback) {
        // Initial checks
        if (typeof name === 'undefined' || name === '') {
            callback();
            return;
        }

        get(name, function (item) {
            // Don't process if not in the list
            if (typeof item === 'undefined') {
                callback();
                return;
            }

            // Remove from the list
            list(function (items) {
                var index = $.inArray(item, items);
                items.splice(index, 1);
                husot.settings.setValue(husot.constants.blockedChannelsSettingsKey, JSON.stringify(items), function () {
                    // Invalidate cached Blocked Channels List
                    blockedChannelsList = undefined;

                    callback();
                });
            });
        });
    }

    function list(callback) {
        if (typeof blockedChannelsList === 'undefined') {
            husot.settings.getValue(husot.constants.blockedChannelsSettingsKey, '[]', function (item) {
                // Save in cache
                blockedChannelsList = JSON.parse(item);

                callback(blockedChannelsList);
            });
        } else {
            callback(blockedChannelsList);
        }
    }

    return {
        add: add,
        remove: remove,
        list: list
    };
})();
