// Debug build specific logic

husot.debug = husot.debug || {};

husot.debug.hideRedundantElements = function () {
    $('#logo').hide();
    $('.item .thumb .cap > img').hide();
    $('.directory_header .title').hide();
};

husot.debug.setBlockedChannelsList = function () {
    var channels = [
        { name: 'Happasc2' },
        { name: 'roxkisAbver' },
        { name: 'Eligorko' },
        { name: 'gnumme' },
        { name: 'Ek0p' },
    ];

    husot.settings.setValue(husot.constants.blockedChannelsSettingsKey, JSON.stringify(channels), function () { });
}
