// Settings UI

husot.settings = husot.settings || {};
husot.settings.ui = husot.settings.ui || {};

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
                self._thumbsManager.showThumb(name);
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

            return;

            $('.husot-settings-blockedList').hide();
            $('.husot-settings-nav-item-name').removeClass('husot-settings-nav-item-name-active');

            this._$blockedList.show();
            $('.husot-settings-nav-item-name[data-husot-contentPanelId=#{0}]'.format(this._$blockedList.attr('id')))
                .addClass('husot-settings-nav-item-name-active');
        }
    }
})();

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

        return;

        var $sender = $(this);

        // Hide all tab content panels
        $('.husot-settings-blockedList').hide();
        $('.husot-settings-nav-item-name').removeClass('husot-settings-nav-item-name-active');
        // Show activated tab content panel
        var panelId = $sender.attr('data-husot-contentPanelId');
        $(panelId).show();
        $sender.addClass('husot-settings-nav-item-name-active');
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
}

husot.settings.ui.Window.prototype = {
    init: function (tabName) {
        this._blockedChannelsTab.loadBlockedItems();
        this._blockedGamesTab.loadBlockedItems();

        this._blockedChannelsTab.activate();
    }
}

husot.settings.ui.activateTab = function (tabId) {
    // Hide all tabs
    $('.husot-settings-blockedList').hide();
    $('.husot-settings-nav-item-name').removeClass('husot-settings-nav-item-name-active');

    // Show active tab
    var $tabHeader = $('.husot-settings-nav-item-name[data-husot-contentPanelId={0}]'.format(tabId));
    var $tab = $('#{0}'.format(tabId));
    $tab.show();
    $tabHeader.addClass('husot-settings-nav-item-name-active');
}
