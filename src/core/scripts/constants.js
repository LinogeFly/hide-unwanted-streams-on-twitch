// Constants

var husot = husot || {};

husot.constants = husot.constants || {};
husot.constants.blockedChannelsSettingsKey = 'blockedChannels';
husot.constants.blockedGamesSettingsKey = 'blockedGames';
husot.constants.blockedLanguagesSettingsKey = 'blockedLanguages';
husot.constants.blockedChannelsListEmpty = 'No Blocked Channels';
husot.constants.blockedGamesListEmpty = 'No Blocked Games';
husot.constants.modalDialogShowingSpeed = 150;
husot.constants.allowedUrls = [
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/?$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/all(/?|/.+)$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/.+',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/random/?$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/videos/.+',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/following(/?|/.+)$'
];
husot.constants.blockedItemType = husot.constants.blockedItemType || {};
husot.constants.blockedItemType.game = 'game';
husot.constants.blockedItemType.channel = 'channel';
husot.constants.blockLanguages = [
    {
        name: "English",
        code: "en"
    },
    {
        name: "Dansk",
        code: "da"
    },
    {
        name: "Deutsch",
        code: "de"
    },
    {
        name: "Español",
        code: "es"
    },
    {
        name: "Français",
        code: "fr"
    },
    {
        name: "Italiano",
        code: "it"
    },
    {
        name: "Magyar",
        code: "hu"
    },
    {
        name: "Nederlands",
        code: "nl"
    },
    {
        name: "Norsk",
        code: "no"
    },
    {
        name: "Polski",
        code: "pl"
    },
    {
        name: "Português",
        code: "pt"
    },
    {
        name: "Slovenčina",
        code: "sk"
    },
    {
        name: "Suomi",
        code: "fi"
    },
    {
        name: "Svenska",
        code: "sv"
    },
    {
        name: "Tiếng Việt",
        code: "vi"
    },
    {
        name: "Türkçe",
        code: "tr"
    },
    {
        name: "Čeština",
        code: "cs"
    },
    {
        name: "Български",
        code: "bg"
    },
    {
        name: "Русский",
        code: "ru"
    },
    {
        name: "العربية",
        code: "ar"
    },
    {
        name: "ภาษาไทย",
        code: "th"
    },
    {
        name: "中文",
        code: "zh"
    },
    {
        name: "日本語",
        code: "ja"
    },
    {
        name: "한국어",
        code: "ko"
    },
    {
        name: "Other",
        code: "other"
    }
];
