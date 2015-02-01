// Constants

var husot = husot || {};
husot.constants = husot.constants || {};
husot.constants.exceptions = husot.constants.exceptions || {};

husot.constants.blockedChannelsSettingsKey = 'blockedChannels';
husot.constants.blockedGamesSettingsKey = 'blockedGames';
husot.constants.blockedChannelsListEmpty = 'No Blocked Channels';
husot.constants.blockedGamesListEmpty = 'No Blocked Games';
husot.constants.modalDialogShowingSpeed = 150;
husot.constants.allowedUrls = [
    '^http://www.twitch.tv/directory/?$',
    '^http://www.twitch.tv/directory/all/?$',
    '^http://www.twitch.tv/directory/all/.+',
    '^http://www.twitch.tv/directory/game/.+',
    '^http://www.twitch.tv/directory/random/?$',
    '^http://www.twitch.tv/directory/videos/.+'
];
husot.constants.exceptions.abstractFunctionCall = 'Cannot call abstract function';
husot.constants.exceptions.notImplemented = 'Method or operation is not implemented';

// DOM Listener module

var husot = husot || {};
husot.domListener = husot.domListener || {};

husot.domListener = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        // Don't process page if its URL is not allowed
        if (!isCurrentUrlAllowed()) {
            return;
        }

        // Don't run hiding if it's not a stream thumbs adding triggered the DOM change
        if (isThumbsAdded(mutations, husot.thumbs.streamThumbsManager.getThumbFindSelector())) {
            husot.thumbs.streamThumbsManager.hideThumbs();
        }

        // Don't run hiding if it's not a game thumbs adding triggered the DOM change
        if (isThumbsAdded(mutations, husot.thumbs.gameThumbsManager.getThumbFindSelector())) {
            husot.thumbs.gameThumbsManager.hideThumbs();
        }

        // Add overlay menus
        stop();
        husot.thumbs.streamThumbsManager.addThumbOverlays();
        husot.thumbs.gameThumbsManager.addThumbOverlays();
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
            return (new RegExp(item)).test(document.URL);
        });
    }

    function isThumbsAdded(mutations, selector) {
        return mutations.some(function (item) {
            return $(item.addedNodes).find(selector).length !== 0;
        });
    }

    return {
        start: start
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

// HTML Templates
// TODO: Move into separate files

var husot = husot || {};
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
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedChannelsList">Blocked Channels</a>\
            </li>\
            <li class="husot-settings-nav-item">\
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedGamesList">Blocked Games</a>\
            </li>\
        </ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedChannelsList"></ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedGamesList"></ul>\
        <div class="husot-settings-footer">\
            <a href="#" class="husot-modalClose husot-button">Close</a>\
        </div>\
    </div>';

husot.htmlLayout.modalDialogOverlay = '<div class="husot-modalOverlay"></div>';

husot.htmlLayout.blockedListItem = '\
    <li class="husot-settings-blockedList-item">\
        <a class="husot-settings-blockedList-item-unblockBtn husot-button" href="javascript:void(0);">Unblock</a>\
        <div class="husot-settings-blockedList-item-name">{0}</div>\
    </li>';

husot.htmlLayout.blockedListItemEmpty = '<li><div class="husot-settings-blockedList-item-empty">{0}</div></li>';

// Log manager

var husot = husot || {};
husot.log = husot.log || {};

husot.log.info = function (obj) {
    console.log('HUSOT: ' + obj);
};

husot.log.error = function (obj) {
    console.error('HUSOT: ' + obj);
};

husot.log.debug = function (obj) {
    if (typeof husot.debug === 'undefined') {
        return;
    }

    console.log('HUSOT DEBUG: ' + obj);
};

// Modal Dialog module

var husot = husot || {};
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
        var self = this;

        // Initial checks
        if (typeof name === 'undefined' || name === '') {
            return;
        }

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
        var self = this;

        if (typeof self._blockedItems === 'undefined') {
            husot.settings.getValue(self._settingsKey, '[]', function (item) {
                // Save in cache
                self._blockedItems = JSON.parse(item);

                callback(self._blockedItems);
            });
        } else {
            callback(self._blockedItems);
        }
    }
};

// Settings UI

var husot = husot || {};
husot.settings = husot.settings || {};
husot.settings.ui = husot.settings.ui || {};

// class Tab

husot.settings.ui.Tab = function ($blockedList, blockedItemsManager, emptyText, thumbsManager) {
    this._$blockedList = $blockedList;
    this._blockedItemsManager = blockedItemsManager;
    this._emptyText = emptyText;
};

husot.settings.ui.Tab.prototype = (function () {
    return {
        _unblockBtn_onClick: function (self, sender) {
            var $sender = $(sender);
            var $blockedListItem = $sender.closest('.husot-settings-blockedList-item');
            var name = $blockedListItem.find('.husot-settings-blockedList-item-name').text();

            self._blockedItemsManager.remove(name, function () {
                self.loadBlockedItems();

                husot.thumbs.streamThumbsManager.showThumb(name);
                husot.thumbs.gameThumbsManager.showThumb(name);
            });
        },
        loadBlockedItems: function () {
            var self = this;
            this._blockedItemsManager.list(function (items) {
                self._$blockedList.empty();

                if (items.length === 0) {
                    self._$blockedList.append(husot.htmlLayout.blockedListItemEmpty.format(self._emptyText));
                    return;
                }

                items.forEach(function (item) {
                    var $blockedListItem = $(husot.htmlLayout.blockedListItem.format(item.name));
                    var $unblockBtn = $('.husot-settings-blockedList-item-unblockBtn', $blockedListItem);
                    $unblockBtn.click(function () {
                        self._unblockBtn_onClick(self, this);
                    });
                    self._$blockedList.append($blockedListItem);
                });
            });
        },
        activate: function () {
            husot.settings.ui.activateTab(this._$blockedList.attr('id'));
        }
    }
})();

// class Window

husot.settings.ui.Window = function () {
    var create = function () {
        var $settingsWindow = $(husot.htmlLayout.settingsWindow);
        $('.husot-settings-nav-item-name', $settingsWindow).click(navItem_onClick);
        husot.modalDialog.create($settingsWindow);
    }

    // Event handlers for switching content of the tabs
    var navItem_onClick = function () {
        var tabId = $(this).attr('data-husot-contentPanelId');
        husot.settings.ui.activateTab(tabId);
    }

    // Class initialization

    create();

    this._blockedChannelsTab = new husot.settings.ui.Tab(
        $('#husot-settings-blockedChannelsList'),
        husot.settings.blockedChannels,
        husot.constants.blockedChannelsListEmpty
    );

    this._blockedGamesTab = new husot.settings.ui.Tab(
        $('#husot-settings-blockedGamesList'),
        husot.settings.blockedGames,
        husot.constants.blockedGamesListEmpty
    );
}

husot.settings.ui.Window.prototype = {
    init: function (tabName) {
        // Load tab content
        this._blockedChannelsTab.loadBlockedItems();
        this._blockedGamesTab.loadBlockedItems();

        // Activate tab
        if (typeof tabName === 'undefined' || tabName === '') {
            return;
        }
        if (tabName === 'channels') {
            this._blockedChannelsTab.activate();
        }
        if (tabName === 'games') {
            this._blockedGamesTab.activate();
        }
    }
}

// Helper static functions

husot.settings.ui.activateTab = function (tabId) {
    // Hide all tabs
    $('.husot-settings-blockedList').hide();
    $('.husot-settings-nav-item-name').removeClass('husot-settings-nav-item-name-active');

    // Show active tab
    var $tabHeader = $('.husot-settings-nav-item-name[data-husot-contentPanelId={0}]'.format(tabId));
    var $tab = $('#{0}'.format(tabId));
    $tab.show();
    $tabHeader.addClass('husot-settings-nav-item-name-active');
};

// Video Thumbnails module

var husot = husot || {};
husot.thumbs = husot.thumbs || {};

// abstract class ThumbsManagerBase

husot.thumbs.ThumbsManagerBase = function () {

}

husot.thumbs.ThumbsManagerBase.prototype = {
    _getContainerSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    _getThumbSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    _addThumbOverlay: function ($thumb) {
        var self = this;

        // Initial checks
        if ($thumb.find('.husot-thumbOverlay').length) {
            return;
        };

        // Add overlay
        var $thumbOverlay = $(husot.htmlLayout.streamOverlay);
        $thumb.append($thumbOverlay);

        // Add event handlers for overlay buttons
        $thumbOverlay.find('.husot-blockStreamBtn').click(function () {
            self._blockBtn_onClick(self, this)
        });
        $thumbOverlay.find('.husot-blockStreamBtn').click(function (event) {
            event.stopPropagation();
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function () {
            self._showSettingsBtn_onClick(self, this);
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function (event) {
            event.stopPropagation();
        });

        // Add hover event handler to a stream/video thumb in order to hide/show overlay menu
        $thumb.hover(function () {
            $thumbOverlay.show();
        }, function () {
            $thumbOverlay.hide();
        });
    },
    _blockBtn_onClick: function (self, sender) {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    _showSettingsBtn_onClick: function (self, sender) {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    // Triggers "infinite scroll" feature on Twitch to load more stream/video thumbnails
    // in order to make sure that page it is filled with new thumbnails after some thumbnails were hidden.
    _loadMoreThumbs: function () {
        husot.log.debug('Triggering "infinite scroll" to load more thumbs');

        // Raise injected custom event that triggers "infinite scroll" feature on Twitch.
        var event = document.createEvent('Event');
        event.initEvent('husot.loadMoreThumbs', true, true);
        document.dispatchEvent(event);
    },
    getThumbFindSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    addThumbOverlays: function () {
        var self = this;

        // Initial checks
        var $thumbs = $(self._getThumbSelector());
        if (!$thumbs.length) {
            return;
        };

        $thumbs.each(function () {
            self._addThumbOverlay($(this));
        });
    },
    hideThumbs: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    showThumb: function (name) {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    }
};

// class StreamThumbsManager: ThumbsManagerBase

husot.thumbs.StreamThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);
}

husot.thumbs.StreamThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.StreamThumbsManager.prototype.constructor = husot.thumbs.StreamThumbsManager;

husot.thumbs.StreamThumbsManager.prototype._getContainerSelector = function () {
    return '#directory-list .items .item';
}

husot.thumbs.StreamThumbsManager.prototype._getThumbSelector = function () {
    return '#directory-list .items .item .thumb';
}

husot.thumbs.StreamThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init('channels');
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.StreamThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
    var $sender = $(sender);
    var $name = $sender.closest(self._getContainerSelector()).find('.meta .info a');

    if (!$name.length) {
        log.error('Stream name not found');
        return;
    }

    var name = $name.text().trim();
    husot.settings.blockedChannels.add(name, function () {
        self._hideThumbForChannel(name);
        self._loadMoreThumbs();
    });
}

husot.thumbs.StreamThumbsManager.prototype._hideThumbForChannel = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForChannel(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for channel "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._hideThumbForGame = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForGame(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for game "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._showThumbForChannel = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForChannel(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();

    husot.log.info('Thumbnail{0} for channel "{1}" {2} shown'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._showThumbForGame = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForGame(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();

    husot.log.info('Thumbnail{0} for game "{1}" {2} shown'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForChannel = function (name) {
    var self = this;

    var $channel = $(self._getContainerSelector()).find('.meta .info a').filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    if (!$channel.length) {
        return $();
    }

    return $channel.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForGame = function (name) {
    var self = this;

    var $game = $(self._getContainerSelector())
        .find('.boxart[title], .boxart[original-title]')
        .filter(function () {
            // Check that game thumbnail is hidden explicitly.
            // jQuery's :visible selector is not used here because it considers element as hidden if an ancestor element is hidden,
            // and we need to get only explicitly hidden elements with Twitch's ".no-boxart" class.
            return $(this).css('display') !== 'none';
        })
        .filter(function () {
            var title1 = this.getAttribute('title');
            var title2 = this.getAttribute('original-title');

            if (title1 !== null && title1.toLowerCase() === name.toLowerCase()) { return true; }
            if (title2 !== null && title2.toLowerCase() === name.toLowerCase()) { return true; }

            return false;
        });

    if (!$game.length) {
        return $();
    }

    return $game.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype.getThumbFindSelector = function () {
    return '.item .thumb';
}

husot.thumbs.StreamThumbsManager.prototype.hideThumbs = function () {
    var self = this;

    // Initial checks
    if (!$(self._getThumbSelector()).length) { return; }

    var start = new Date().getTime();
    husot.log.debug('StreamThumbsManager.hideThumbs() starts');

    // A little bit of callback hell ahead :)
    husot.settings.blockedChannels.list(function (channels) {
        // Hide thumbs for blocked channels
        channels.forEach(function (item) {
            self._hideThumbForChannel(item.name);
        });

        // Hide thumbs for blocked games
        husot.settings.blockedGames.list(function (games) {
            games.forEach(function (item) {
                self._hideThumbForGame(item.name);
            });

            husot.log.debug('StreamThumbsManager.hideThumbs() ends after: {0} ms'.format((new Date().getTime()) - start));
            self._loadMoreThumbs();
        });
    });
}

husot.thumbs.StreamThumbsManager.prototype.showThumb = function (name) {
    var self = this;

    self._showThumbForChannel(name);
    self._showThumbForGame(name);
}

// class GameThumbsManager: ThumbsManagerBase

husot.thumbs.GameThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);
}

husot.thumbs.GameThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.GameThumbsManager.prototype.constructor = husot.thumbs.GameThumbsManager;

husot.thumbs.GameThumbsManager.prototype._getContainerSelector = function () {
    return '#directory-list .items .game.item';
}

husot.thumbs.GameThumbsManager.prototype._getThumbSelector = function () {
    return '#directory-list .items .game.item .boxart';
}

husot.thumbs.GameThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init('games');
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.GameThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
    var $sender = $(sender);
    var $name = $sender.closest(self._getContainerSelector()).find('.meta .title');

    if (!$name.length) {
        log.error('Game name not found');
        return;
    }

    var name = $name.text().trim();
    husot.settings.blockedGames.add(name, function () {
        self._hideThumb(name);
        self._loadMoreThumbs();
    });
}

husot.thumbs.GameThumbsManager.prototype._hideThumb = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainer(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for game "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.GameThumbsManager.prototype._getThumbContainer = function (name) {
    var self = this;

    var $game = $(self._getContainerSelector()).find('.meta .title').filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    if (!$game.length) {
        return $();
    };

    return $game.closest(self._getContainerSelector());
}

husot.thumbs.GameThumbsManager.prototype.getThumbFindSelector = function () {
    return '.game.item .boxart';
}

husot.thumbs.GameThumbsManager.prototype.hideThumbs = function () {
    var self = this;

    // Initial checks
    if (!$(self._getThumbSelector()).length) {
        return;
    };

    var start = new Date().getTime();
    husot.log.debug('GameThumbsManager.hideThumbs() starts');

    // Hide thumbs for blocked games
    husot.settings.blockedGames.list(function (items) {
        items.forEach(function (item) {
            self._hideThumb(item.name);
        });

        husot.log.debug('GameThumbsManager.hideThumbs() ends after: {0} ms'.format((new Date().getTime()) - start));
        self._loadMoreThumbs();
    });
};

husot.thumbs.GameThumbsManager.prototype.showThumb = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainer(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();

    husot.log.info('Thumbnail{0} for game "{1}" {2} shown'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
};

// Inject javaScript into main window (Chrome specific)

var husot = husot || {};
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

// Application start

var husot = husot || {};

husot.main = function () {
    // Run only in top frame
    if (window.top !== window.self) {
        return;
    }

    husot.settings.blockedChannels = new husot.settings.BlockedItems(husot.constants.blockedChannelsSettingsKey);
    husot.settings.blockedGames = new husot.settings.BlockedItems(husot.constants.blockedGamesSettingsKey);
    husot.thumbs.streamThumbsManager = new husot.thumbs.StreamThumbsManager();
    husot.thumbs.gameThumbsManager = new husot.thumbs.GameThumbsManager();

    husot.modalDialog.initOverlay();
    husot.settings.ui.window = new husot.settings.ui.Window();
    husot.injector.addScripts();
    husot.domListener.start();
};

$(document).ready(function () {
    husot.main();
});
