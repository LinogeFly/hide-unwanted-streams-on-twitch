// Constants

var husot = husot || {};

husot.constants = husot.constants || {};
husot.constants.blockedChannelsSettingsKey = 'blockedChannels';
husot.constants.blockedGamesSettingsKey = 'blockedGames';
husot.constants.blockedChannelsListEmpty = 'No Blocked Channels';
husot.constants.blockedGamesListEmpty = 'No Blocked Games';
husot.constants.modalDialogShowingSpeed = 150;
husot.constants.allowedUrls = [
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/?$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/all(/?|/.+)$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/.+',
    '^https?://([a-zA-Z]+\.)?twitch.tv/communities/[^/]+/?$'
];
husot.constants.blockedItemType = husot.constants.blockedItemType || {};
husot.constants.blockedItemType.game = 'game';
husot.constants.blockedItemType.channel = 'channel';
