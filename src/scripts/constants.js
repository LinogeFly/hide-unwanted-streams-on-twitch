// Constants

husot.constants = husot.constants || {};

husot.constants.blockedChannelsSettingsKey = 'blockedChannels';
husot.constants.minimumStreamsCountOnPage = 20; // TODO: Check if there is such constant already exists on Twitch
husot.constants.modalDialogShowingSpeed = 150;
husot.constants.allowedUrls = [ // TODO: replace with regEx patterns
    'http://www.twitch.tv/directory/game/',
    'http://www.twitch.tv/directory/all',
    'http://www.twitch.tv/directory/random',
    'http://www.twitch.tv/directory/videos/'
];
