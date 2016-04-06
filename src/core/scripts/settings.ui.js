// Settings UI

var husot = husot || {};
husot.settings = husot.settings || {};
husot.settings.ui = husot.settings.ui || {};

// class Tab

husot.settings.ui.Tab = function ($blockedList, blockedItemsManager, emptyText, thumbsManager) {
    this._$blockedList = $blockedList;
    this._blockedItemsManager = blockedItemsManager;
    this._emptyText = emptyText;
    this._thumbsManager = thumbsManager;
};

husot.settings.ui.Tab.prototype = (function () {
    return {
        _unblockBtn_onClick: function (self, sender) {
            var $sender = $(sender);
            var $blockedListItem = $sender.closest('.husot-settings-blockedList-item');
            var name = $blockedListItem.find('.husot-settings-blockedList-item-name').text();

            self._blockedItemsManager.remove(name, function () {
                self.loadBlockedItems();
                self._thumbsManager.showThumbs(name);
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
                    var $blockedListItem = $(husot.htmlLayout.blockedListItem.format(item));
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
        husot.constants.blockedChannelsListEmpty,
        husot.thumbs.streamThumbsManager
    );

    this._blockedGamesTab = new husot.settings.ui.Tab(
        $('#husot-settings-blockedGamesList'),
        husot.settings.blockedGames,
        husot.constants.blockedGamesListEmpty,
        husot.thumbs.gameThumbsManager
    );

    this._blockedLanguagesTab = new husot.settings.ui.LanguagesTab(
        $('#husot-settings-blockedLanguagesList'),
        husot.settings.blockedLanguages,
        husot.thumbs.streamThumbsManager
    );
}

husot.settings.ui.Window.prototype = {
    init: function (blockedItemType) {
        // Load tab content
        this._blockedChannelsTab.loadBlockedItems();
        this._blockedGamesTab.loadBlockedItems();
        this._blockedLanguagesTab.loadBlockedItems();

        // Activate tab
        if (typeof blockedItemType === 'undefined' || blockedItemType === '') {
            return;
        }
        if (blockedItemType === husot.constants.blockedItemType.channel) {
            this._blockedChannelsTab.activate();
            return;
        }
        if (blockedItemType === husot.constants.blockedItemType.game) {
            this._blockedGamesTab.activate();
            return;
        }

        throw Error('Unknown blockedItemType');
    }
}

// Languages Tab class

husot.settings.ui.LanguagesTab = function ($blockedList, blockedItemsManager, thumbsManager) {
    this._$blockedList = $blockedList;
    this._blockedItemsManager = blockedItemsManager;
    this._thumbsManager = thumbsManager;
}

husot.settings.ui.LanguagesTab.prototype = (function () {
    return {
        loadBlockedItems: loadBlockedItems
    }

    function loadBlockedItems() {
        var self = this;

        self._blockedItemsManager.list(function (items) {
            self._$blockedList.empty();

            husot.constants.blockLanguages.forEach(function (lang) {
                var $langUiItem = $(_getLanguageUiItem(items, lang));
                var $unblockBtn = $('.husot-settings-blockedList-item-unblockBtn', $langUiItem);
                $unblockBtn.click(function () {
                    unblockBtn_onClick(self, this);
                });
                self._$blockedList.append($langUiItem);
            });
        });
    }

    function unblockBtn_onClick(self, sender) {
        var $sender = $(sender);
        var action = $sender.data('action');
        var lang = $sender.data('language');

        if (action.toLowerCase() === 'block') {
            self._blockedItemsManager.add(lang, function () {
                self.loadBlockedItems();
                husot.domListener.getThumbnailData(self._thumbsManager);

            });
        }
        if (action.toLowerCase() === 'unblock') {
            self._blockedItemsManager.remove(lang, function () {
                self.loadBlockedItems();
            });
        }
    }

    function _getLanguageUiItem(blockedLanguages, language) {
        var isBlocked = blockedLanguages.some(function (x) {
            return language.code.toLowerCase() === x.toLowerCase();
        });

        if (isBlocked)
            return husot.htmlLayout.languageBlockedListItemBlocked.format(language.name, language.code);
        else
            return husot.htmlLayout.languageBlockedListItemAllowed.format(language.name, language.code);
    }
})();

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
