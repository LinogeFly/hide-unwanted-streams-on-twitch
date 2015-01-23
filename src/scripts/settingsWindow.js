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
