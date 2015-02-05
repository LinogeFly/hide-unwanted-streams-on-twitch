// Constants

var husot = husot || {};

husot.constants = husot.constants || {};
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

husot.constants.exceptions = husot.constants.exceptions || {};
husot.constants.exceptions.abstractFunctionCall = 'Cannot call abstract function';
husot.constants.exceptions.notImplemented = 'Method or operation is not implemented';
husot.constants.exceptions.argumentNullOrEmpty = 'Argument "{0}" is undefined or empty';

husot.constants.blockedItemType = husot.constants.blockedItemType || {};
husot.constants.blockedItemType.game = 'game';
husot.constants.blockedItemType.channel = 'channel';
