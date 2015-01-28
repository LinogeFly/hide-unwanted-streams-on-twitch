// Constants

husot.constants = husot.constants || {};
husot.constants.exceptions = husot.constants.exceptions || {};

husot.constants.blockedChannelsSettingsKey = 'blockedChannels';
husot.constants.blockedGamesSettingsKey = 'blockedGames';
husot.constants.blockedChannelsListEmpty = 'No Blocked Channels';
husot.constants.blockedGamesListEmpty = 'No Blocked Games';
husot.constants.minimumStreamsCountOnPage = 20; // TODO: Check if there is such constant already exists on Twitch
husot.constants.minimumGamesCountOnPage = 40;
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
