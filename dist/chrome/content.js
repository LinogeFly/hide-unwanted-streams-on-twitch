// Application start

var husot = husot || {};

husot.main = function () {
    // Run only in top frame
    if (window.top !== window.self) {
        return;
    }

    this.injector.addScripts();
    this.modalDialog.initOverlay();
    this.settingsWindow.create();
    this.domListener.start();
};

$(document).ready(function () {
    husot.main();
});

// Constants

husot.constants = husot.constants || {};

husot.constants.blockedChannelsSettingsKey = 'blockedChannels';
husot.constants.minimumStreamsCountOnPage = 20; // TODO: Check if there is such constant already exists on Twitch
husot.constants.modalDialogShowingSpeed = 150;
husot.constants.allowedUrls = [ // TODO: replace with regEx patterns
    'http://www.twitch.tv/directory/game/',
    'http://www.twitch.tv/directory/all',
    'http://www.twitch.tv/directory/random',
    'http://www.twitch.tv/directory/videos/'
];

// DOM Listener module

husot.domListener = husot.domListener || {};

husot.domListener = (function () {
    // TODO: Add polyfill for MutationObserver
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        // Don't process page if its URL is not allowed
        if (!isCurrentUrlAllowed()) {
            return;
        }

        husot.thumbsManager.hideThumbs();
        stop();
        husot.thumbsManager.addThumbOverlays();
        start();
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function stop() {
        observer.disconnect();
    }

    function isCurrentUrlAllowed() {
        return husot.constants.allowedUrls.some(function (item) {
            return document.URL.startsWith(item);
        });
    }

    return {
        start: start,
        stor: stop
    };
})();

// Helper functions

if (!String.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
};

if (!String.startsWith) {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
};

if (!jQuery.expr[':'].containsIgnoreCase) {
    jQuery.expr[':'].containsIgnoreCase = function (a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
};

// HTML Templates
// TODO: Move into separate files

husot.htmlLayout = husot.htmlLayout || {};

husot.htmlLayout.streamOverlay = '\
    <div class="husot-thumbOverlay">\
        <ul class="husot-thumbOverlay-menu">\
            <li><a class="husot-blockStreamBtn" href="javascript:void(0);">Block</a></li>\
            <li class="husot-thumbOverlay-menu-separator"> | </li>\
            <li><a class="husot-showSettingsBtn" href="javascript:void(0);">Settings</a></li>\
        </ul>\
    </div>';

husot.htmlLayout.settingsWindow = '\
    <div class="husot-settings husot-modalWindow">\
        <ul class="husot-settings-nav">\
            <li class="husot-settings-nav-item">\
                <div class="husot-settings-nav-item-name">Blocked Channels</div>\
            </li>\
        </ul>\
        <ul class="husot-settings-blockedList"></ul>\
        <div class="husot-settings-footer">\
            <a href="#" class="husot-modalClose husot-button">Close</a>\
        </div>\
    </div>';

husot.htmlLayout.modalDialogOverlay = '<div class="husot-modalOverlay"></div>';

husot.htmlLayout.blockedChannelsListItem = '\
    <li class="husot-settings-blockedList-item">\
        <a class="husot-settings-blockedList-item-unblockBtn husot-button" href="javascript:void(0);">Unblock</a>\
        <div class="husot-settings-blockedList-item-name">{0}</div>\
    </li>';

husot.htmlLayout.blockedChannelsListItemEmpty = '<li><div class="husot-settings-blockedList-item-empty">No Blocked Channels</div></li>';

// Log manager

husot.log = husot.log || {};

husot.log.info = function (obj) {
    console.log('HUSOT: ' + obj);
};

husot.log.error = function (obj) {
    console.log('%cHUSOT: ' + obj, 'color: #ff0000');
};

// Modal Dialog module

husot.modalDialog = husot.modalDialog || {};

husot.modalDialog = (function () {
    function initOverlay() {
        if ($('.husot-modalOverlay').length) {
            return;
        }

        var $overlay = $(husot.htmlLayout.modalDialogOverlay);
        $overlay.click(close);
        $(document.body).append($overlay);
    }

    function create($modalWindow) {
        $modalWindow.click(function (event) {
            event.stopPropagation();
        });
        $modalWindow.find('.husot-modalClose').click(close);
        $('.husot-modalOverlay').append($modalWindow);
    }

    function show($modalWindow) {
        $('.husot-modalOverlay').fadeIn(husot.constants.modalDialogShowingSpeed);
        $modalWindow.fadeIn({ queue: false, duration: husot.constants.modalDialogShowingSpeed });
        $modalWindow.animate({ 'margin-top': '40px' }, husot.constants.modalDialogShowingSpeed);
    }

    function close(event) {
        $('.husot-modalOverlay').fadeOut(husot.constants.modalDialogShowingSpeed);
        var $modalWindow = $('.husot-modalWindow');
        $modalWindow.fadeOut(husot.constants.modalDialogShowingSpeed);
        $modalWindow.animate({ 'margin-top': '50px' }, husot.constants.modalDialogShowingSpeed);
    }

    return {
        initOverlay: initOverlay,
        create: create,
        show: show,
        close: close,
    };
})();

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

// Settings Window module

husot.settingsWindow = husot.settingsWindow || {};

husot.settingsWindow = (function () {
    function loadBlockedChannels() {
        var $settingsWindow = $('.husot-settings');
        var $blockedList = $('.husot-settings-blockedList', $settingsWindow);

        husot.settings.blockedChannels.list(function (blockedChannels) {
            $blockedList.empty();

            if (blockedChannels.length === 0) {
                $blockedList.append(husot.htmlLayout.blockedChannelsListItemEmpty);
                return;
            }

            blockedChannels.forEach(function (item) {
                var $blockedListItem = $(husot.htmlLayout.blockedChannelsListItem.format(item.name));
                var $unblockBtn = $('.husot-settings-blockedList-item-unblockBtn', $blockedListItem);
                $unblockBtn.click(unblockBtn_onClick);
                $blockedList.append($blockedListItem);
            });

        });
    }

    function unblockBtn_onClick() {
        var $sender = $(this);
        var $blockedListItem = $sender.closest('.husot-settings-blockedList-item');
        var name = $blockedListItem.find('.husot-settings-blockedList-item-name').text();

        husot.settings.blockedChannels.remove(name, function () {
            loadBlockedChannels();
            husot.thumbsManager.showThumb(name);
        });
    }

    function init() {
        loadBlockedChannels();
    }

    function create() {
        if ($('.husot-settings').length) {
            return;
        }

        husot.modalDialog.create($(husot.htmlLayout.settingsWindow));
    }

    return {
        create: create,
        init: init
    };
})();

// Video Thumbnails Manager module

husot.thumbsManager = husot.thumbsManager || {};

husot.thumbsManager = (function () {
    function getThumbContainer(name) {
        var $channelLink = $('#directory-list .items .item .info a:containsIgnoreCase("{0}")'.format(name));
        if (!$channelLink.length) {
            return $();
        }

        return $channelLink.closest('#directory-list .items .item');
    }

    function addThumbOverlay($thumb) {
        if ($thumb.find('.husot-thumbOverlay').length) {
            return;
        }

        // Add overlay
        var $thumbOverlay = $(husot.htmlLayout.streamOverlay);
        $thumb.append($thumbOverlay);

        // Add event handlers for overlay buttons
        $thumbOverlay.find('.husot-blockStreamBtn').click(blockChannelBtn_onClick);
        $thumbOverlay.find('.husot-showSettingsBtn').click(showSettingsBtn_onClick);

        // Add hover event handler to a stream/video thumb in order to hide/show overlay menu
        $thumb.hover(function () {
            $thumbOverlay.show();
        }, function () {
            $thumbOverlay.hide();
        });
    }

    function blockChannelBtn_onClick() {
        var $sender = $(this);
        var name = $sender.closest('.content').find('.meta .info a').text().trim();

        husot.settings.blockedChannels.add(name, function () {
            hideThumb(name);
            loadMoreThumbs();
        });
    }

    function showSettingsBtn_onClick() {
        husot.settingsWindow.init();
        husot.modalDialog.show($('.husot-settings'));
    }

    function addThumbOverlays() {
        var $thumbs = $('#directory-list .items .item .thumb');
        if (!$thumbs.length) {
            return;
        }

        $thumbs.each(function () {
            addThumbOverlay($(this));
        });
    }

    function hideThumbs() {
        if (!$('#directory-list .items').length) {
            return;
        }

        var atLeastOneThumbWasHidden = false;
        husot.settings.blockedChannels.list(function (items) {
            items.forEach(function (item) {
                var wasHidden = hideThumb(item.name);
                if (wasHidden) {
                    atLeastOneThumbWasHidden = true;
                }
            });

            if (atLeastOneThumbWasHidden) {
                loadMoreThumbs();
            }
        });
    }

    function hideThumb(name) {
        var $thumbContainer = getThumbContainer(name);
        if (!$thumbContainer.length) {
            return false;
        }
        if (!$thumbContainer.is(":visible")) {
            return false;
        }

        $thumbContainer.hide();
        husot.log.info('Video thumbnail for "{0}" was hidden'.format(name));
        return true;
    }

    function showThumb(name) {
        var $thumbContainer = getThumbContainer(name);
        if (!$thumbContainer.length) {
            return;
        }
        if ($thumbContainer.is(":visible")) {
            return;
        }

        $thumbContainer.show();
        husot.log.info('Video thumbnail for "{0}" was shown'.format(name));
    }

    // Trigger infinite scroll feature on Twitch to load more stream/video thumbs if some thumbs were hidden,
    // so list of stream/video thumbnails is not full and should be fulfilled with new thumbs.
    function loadMoreThumbs() {
        var $thumbs = $('#directory-list .items .item .thumb:visible');
        if (!$thumbs.length) {
            return;
        }
        if ($thumbs.length >= husot.constants.minimumStreamsCountOnPage) {
            return;
        }

        // Call injected custom event in order to trigger "loadMore()" function of Twitch
        var event = document.createEvent('Event');
        event.initEvent('husot.loadMoreThumbs', true, true);
        document.dispatchEvent(event);
    }

    return {
        addThumbOverlays: addThumbOverlays,
        hideThumbs: hideThumbs,
        hideThumb: hideThumb,
        showThumb: showThumb,
        loadMoreThumbs: loadMoreThumbs
    };
})();

// Inject javaScript into main window (Chrome specific)

husot.injector = husot.injector || {};

husot.injector.addScripts = function () {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('injects.js');
    script.onload = function () {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(script);
};

// Application settings (Chrome specific)

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
