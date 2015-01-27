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
