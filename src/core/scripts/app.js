// Application start

var husot = husot || {};

husot.main = function () {
    // Run only in top frame
    if (window.top !== window.self) {
        return;
    }

    husot.debug.setBlockedLanguagesList();

    husot.settings.blockedChannels = new husot.settings.BlockedItems(husot.constants.blockedChannelsSettingsKey);
    husot.settings.blockedChannels.list(); // Warm up settings loading
    husot.settings.blockedGames = new husot.settings.BlockedItems(husot.constants.blockedGamesSettingsKey);
    husot.settings.blockedGames.list(); // Warm up settings loading
    husot.settings.blockedLanguages = new husot.settings.BlockedItems(husot.constants.blockedLanguagesSettingsKey);
    husot.settings.blockedLanguages.list(); // Warm up settings loading

    husot.thumbs.streamThumbsManager = new husot.thumbs.StreamThumbsManager();
    husot.thumbs.gameThumbsManager = new husot.thumbs.GameThumbsManager(husot.thumbs.streamThumbsManager);

    window.addEventListener('message', function (event) {
        if (event.data.direction && event.data.direction === 'husot-message-gotThumbnailData') {
            var thumbsData = JSON.parse(event.data.message);

            husot.thumbs.streamThumbsManager.hideThumbs(thumbsData);
            husot.thumbs.gameThumbsManager.hideThumbs();
        }
    });

    husot.modalDialog.initOverlay();
    husot.settings.ui.window = new husot.settings.ui.Window();
    husot.injector.addScripts();
    husot.domListener.start();
};

$(document).ready(function () {
    husot.main();
});
