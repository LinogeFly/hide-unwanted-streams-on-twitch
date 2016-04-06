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
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedChannelsList">Channels</a>\
            </li>\
            <li class="husot-settings-nav-item">\
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedGamesList">Games</a>\
            </li>\
            <li class="husot-settings-nav-item">\
                <a class="husot-settings-nav-item-name" data-husot-contentPanelId="husot-settings-blockedLanguagesList">Languages</a>\
            </li>\
        </ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedChannelsList"></ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedGamesList"></ul>\
        <ul class="husot-settings-blockedList" id="husot-settings-blockedLanguagesList"></ul>\
        <div class="husot-settings-footer">\
            <a href="#" class="husot-modalClose husot-button">Close</a>\
        </div>\
    </div>';

husot.htmlLayout.modalDialogOverlay = '<div class="husot-modalOverlay"></div>';

husot.htmlLayout.blockedListItem = '\
    <li class="husot-settings-blockedList-item">\
        <div class="husot-settings-blockedList-item-name">{0}</div>\
        <a class="husot-settings-blockedList-item-unblockBtn husot-button" href="javascript:void(0);">Unblock</a>\
    </li>';

husot.htmlLayout.languageBlockedListItemAllowed = '\
    <li class="husot-settings-blockedList-item">\
        <div class="husot-settings-blockedList-item-name"><span>{0}<span>&nbsp;<span class="allowed">(Allowed)</span></div>\
        <a class="husot-settings-blockedList-item-unblockBtn husot-button" href="javascript:void(0);">Block</a>\
    </li>';

husot.htmlLayout.languageBlockedListItemBlocked = '\
    <li class="husot-settings-blockedList-item">\
        <div class="husot-settings-blockedList-item-name"><span>{0}<span>&nbsp;<span class="blocked">(Blocked)</span></div>\
        <a class="husot-settings-blockedList-item-unblockBtn husot-button" href="javascript:void(0);">Unblock</a>\
    </li>';

husot.htmlLayout.blockedListItemEmpty = '<li><div class="husot-settings-blockedList-item-empty">{0}</div></li>';
