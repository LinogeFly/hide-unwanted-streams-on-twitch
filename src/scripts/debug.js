// Debug build specific stuff here

var husot = husot || {};
husot.debug = husot.debug || {};

husot.debug.hideRedundantElements = function () {
    $('#logo').hide();
    $('.item .thumb .cap > img').hide();
    $('.directory_header .title').hide();
    $('.game.item .boxart > img').removeAttr('src')
};

husot.debug.setBlockedChannelsList = function () {
    var fewChannels = '[{"name":"Happasc2"},{"name":"roxkisAbver"},{"name":"Eligorko"},{"name":"gnumme"},{"name":"Ek0p"}]';
    var manyChannels = '[{"name":"BeyondTheSummit"},{"name":"DotaCinema"},{"name":"nl_Kripp"},{"name":"RiotGames2"},{"name":"starladder3"},{"name":"Trick2g"},{"name":"RiotGamesTurkish"},{"name":"Voyboy"},{"name":"starladder4"},{"name":"RocketBeansTV"},{"name":"MushIsGosu"},{"name":"PhantomL0rd"},{"name":"BeyondTheSummit2"},{"name":"flosd"},{"name":"esltv_sc2"},{"name":"Fairlight_Excalibur"},{"name":"Greentea"},{"name":"witwix"},{"name":"Radu_HS"},{"name":"bibaboy"},{"name":"skumbagkrepo"},{"name":"wintergaming"},{"name":"Monstercat"},{"name":"SCGLive"},{"name":"PetritLP"},{"name":"DethridgeCraft"},{"name":"OgamingLoL"},{"name":"MkRR3"},{"name":"steel_tv"},{"name":"Kinguin_net"},{"name":"Happasc2"},{"name":"CDNThe3rd"},{"name":"Vityshka"},{"name":"5hizzle"},{"name":"Mrtweeday"},{"name":"Loserfruit"},{"name":"Richard_Hammer"},{"name":"VeRsuta"},{"name":"Yagamileong"},{"name":"DailyTradingTips"},{"name":"HearthstoneFR"},{"name":"StreamerHouse"},{"name":"Ltzonda"},{"name":"Suntouch"},{"name":"Fatefalls"},{"name":"AlaskanSavage"},{"name":"kHRYSTAL_cs"},{"name":"Manyrin"},{"name":"starladder5"},{"name":"ActaBunniFooFoo"},{"name":"RazieLero"},{"name":"Zombie_Barricades"},{"name":"Liveplayging"},{"name":"spb_89"},{"name":"GreddyZ"},{"name":"GamerStudioTV"},{"name":"TaKeTV"},{"name":"sparcmaclived"},{"name":"MineskiTV"},{"name":"A_L_O_H_A"},{"name":"BehkuhTV"},{"name":"Santzo84"},{"name":"NoMadTV"},{"name":"DraySWE"},{"name":"nikstrelnikoff"},{"name":"Galaxy_Alliance"},{"name":"manwojciech"},{"name":"Sva16162"},{"name":"chinglishtv"},{"name":"Swifty"},{"name":"starladder1"},{"name":"liquidneo"},{"name":"Darcigh"},{"name":"ga619003"},{"name":"Frostfire_Annie"},{"name":"Aces_TV"},{"name":"Talon2461"},{"name":"TakeTheElevator_Twitch"},{"name":"Motroco_87"},{"name":"Maldiva"},{"name":"LibikPOLAND"},{"name":"FODDERTV"},{"name":"SickMotionLoL"},{"name":"KevinDDR"},{"name":"VJLinkHero"},{"name":"LIRIK"},{"name":"TGSlive"},{"name":"SethBling"},{"name":"Cro_"},{"name":"GOGcom"},{"name":"ROBLOX"},{"name":"Riot Games"},{"name":"FiraxisGames"},{"name":"Toyz_HKES"},{"name":"Domtendo"},{"name":"Aiekillu"},{"name":"Valcor203"},{"name":"summit1g"},{"name":"Reckful"},{"name":"VGBootCamp"},{"name":"exe_de"},{"name":"AmazHS"},{"name":"Xargon0731"},{"name":"PerfectWorld_Community"},{"name":"Kolento"},{"name":"Wingsofdeath"},{"name":"Fragnance"},{"name":"IzakOOO"},{"name":"ScreaM"},{"name":"imaqtpie"},{"name":"CosmoWright"},{"name":"Admiral_Bahroo"},{"name":"MusicJJ"},{"name":"Kylelandrypiano"},{"name":"Igromania"},{"name":"GuildWars2"},{"name":"BesserwerdenimRanked"},{"name":"zEmersonGamer"},{"name":"PsiSyndicate"},{"name":"DEMOLITION_D"},{"name":"PAX"},{"name":"raizQT"},{"name":"Vinesauce"},{"name":"COMETARY3"},{"name":"esltv_lol"},{"name":"RoomOnFire"},{"name":"Markiplier"},{"name":"Kushfodawin"},{"name":"RuneScape"},{"name":"Itmejp"},{"name":"zoasty"},{"name":"Quin69"},{"name":"Spaziogames"}]';

    husot.settings.setValue(husot.constants.blockedChannelsSettingsKey, manyChannels, function () { });
}

husot.debug.setBlockedGamesList = function () {
    var fewGames = '[{"name":"League of Legends"},{"name":"Dota 2"},,{"name":"Counter-Strike: Global Offensive"},{"name":"H1Z1"}]';
    var manyGames = '[{"name":"Dota 2"},{"name":"League of Legends"},{"name":"Hearthstone: Heroes of Warcraft"},{"name":"Counter-Strike: Global Offensive"},{"name":"StarCraft II: Heart of the Swarm"},{"name":"Minecraft"},{"name":"Gaming Talk Shows"},{"name":"Dying Light"},{"name":"World of Warcraft: Warlords of Draenor"},{"name":"H1Z1"},{"name":"FIFA 15"},{"name":"World of Tanks"},{"name":"RuneScape"},{"name":"Call of Duty: Advanced Warfare"},{"name":"Super Mario 64"},{"name":"Destiny"},{"name":"Grand Theft Auto V"},{"name":"Music"},{"name":"Magic: The Gathering"},{"name":"Heroes of the Storm"},{"name":"Darkest Dungeon"},{"name":"Diablo III: Reaper of Souls"},{"name":"Smite"},{"name":"DayZ"},{"name":"Mirror\'s Edge"},{"name":"Hero Siege"},{"name":"Call of Duty: Black Ops II"},{"name":"ArmA III"},{"name":"Path of Exile"},{"name":"Dark Souls"},{"name":"The Binding of Isaac: Rebirth"},{"name":"Pokémon Omega Ruby/Alpha Sapphire"},{"name":"Battlefield 4"},{"name":"The Legend of Zelda: Skyward Sword"},{"name":"iRacing.com"},{"name":"Resident Evil"},{"name":"Sonic Adventure 2: Battle"},{"name":"Tabletop Simulator"},{"name":"Elite: Dangerous"},{"name":"Poker"},{"name":"Guild Wars 2"}]';

    husot.settings.setValue(husot.constants.blockedGamesSettingsKey, manyGames, function () { });
}

husot.debug.cleanSettings = function () {
    husot.settings.setValue(husot.constants.blockedChannelsSettingsKey, '[]', function () { });
    husot.settings.setValue(husot.constants.blockedGamesSettingsKey, '[]', function () { });
};
