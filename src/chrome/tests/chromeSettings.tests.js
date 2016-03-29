// Chrome Settings Tests

var husot = husot || {};
husot.tests = husot.tests || {};
husot.tests.chromeSettings = husot.tests.chromeSettings || {};

husot.tests.chromeSettings.runAll = function () {
    var self = this;

    self.testDataForBigValueShouldBeBiggerThatQuotaLimit();
    self.shouldReturnDefaultValue();
    self.shouldSetAndReturnValue();
    self.shouldSetAndReturnValueLongerThanQuotaLimit();
    self.shouldAddChunkIfValueExceedsQuotaLimit();
    self.shouldRemoveRedundantChunksIfNewValueTakesLessChunksThanTheOldOne();
};

husot.tests.chromeSettings.smallTestValue = '[{"name":"League of Legends"},{"name":"Dota 2"},{"name":"Counter-Strike: Global Offensive"},{"name":"H1Z1"}]';
husot.tests.chromeSettings.bigTestValue = '[{"name":"A Game of Thrones: Genesis"},{"name":"Action Henk"},{"name":"Agar.io"},{"name":"Aion: Ascension"},{"name":"Alien: Isolation"},{"name":"Alliance of Valiant Arms"},{"name":"Animal Crossing"},{"name":"APB Reloaded"},{"name":"ArcheAge"},{"name":"ArmA III"},{"name":"Battlefield 3"},{"name":"Battlefield 4"},{"name":"Battlefield Hardline"},{"name":"Black Desert"},{"name":"Blackjack"},{"name":"Blade and Soul"},{"name":"Bloodborne"},{"name":"Borderlands 2"},{"name":"Call of Duty: Advanced Warfare"},{"name":"Call of Duty: Black Ops II"},{"name":"Cities: Skylines"},{"name":"Clash of Clans"},{"name":"Clicker Heroes"},{"name":"Command & Conquer: Red Alert"},{"name":"Company of Heroes 2"},{"name":"Counter-Strike: Global Offensive"},{"name":"Creative"},{"name":"Crusaders Quest"},{"name":"Dark Souls"},{"name":"Dark Souls II: Scholar of the First Sin"},{"name":"DayZ"},{"name":"Destiny"},{"name":"Diablo II: Lord of Destruction"},{"name":"Diablo III: Reaper of Souls"},{"name":"Dofus"},{"name":"Dota 2"},{"name":"Dragon Age: Inquisition"},{"name":"Dragon Ball XenoVerse"},{"name":"Dying Light"},{"name":"Elite: Dangerous"},{"name":"Elsword"},{"name":"Euro Truck Simulator 2"},{"name":"EVE Online"},{"name":"EverQuest"},{"name":"Evolve"},{"name":"Farming Simulator 15"},{"name":"FIFA 14"},{"name":"FIFA 15"},{"name":"Final Fantasy VII"},{"name":"Final Fantasy X/X-2 HD Remaster"},{"name":"Final Fantasy XII"},{"name":"Final Fantasy XIV Online: A Realm Reborn"},{"name":"Football Manager 2015"},{"name":"Game Development"},{"name":"Gaming Talk Shows"},{"name":"Garry\'s Mod"},{"name":"Grand Theft Auto V"},{"name":"Guild Wars 2"},{"name":"Guilty Gear Xrd -SIGN-"},{"name":"H1Z1"},{"name":"Halo: The Master Chief Collection"},{"name":"Harry Potter and the Philosopher\'s Stone"},{"name":"Hearthstone: Heroes of Warcraft"},{"name":"Heroes of Might and Magic III: The Shadow of Death"},{"name":"Heroes of Newerth"},{"name":"Heroes of the Storm"},{"name":"I Wanna Be The Guy"},{"name":"Infestation: Survivor Stories"},{"name":"Invisible, Inc."},{"name":"iRacing.com"},{"name":"Kantai Collection"},{"name":"Kerbal Space Program"},{"name":"Kirby and the Rainbow Curse"},{"name":"League of Legends"},{"name":"Lineage II: The Chaotic Chronicle"},{"name":"M.U.G.E.N"},{"name":"Madden NFL 15"},{"name":"Mafia II"},{"name":"Magic: The Gathering"},{"name":"Magicka 2"},{"name":"MapleStory"},{"name":"Marvel Heroes"},{"name":"Microsoft Flight Simulator X"},{"name":"Minecraft"},{"name":"Minecraft: Xbox One Edition"},{"name":"MLB 15: The Show"},{"name":"Monster Hunter 4 Ultimate"},{"name":"Mortal Kombat X"},{"name":"Music"},{"name":"NBA 2K15"},{"name":"Neverwinter"},{"name":"Osu!"},{"name":"Outlast"},{"name":"OverBlood"},{"name":"Path of Exile"},{"name":"Payday 2"},{"name":"Perfect Dark"},{"name":"Plague Inc: Evolved"},{"name":"Pokémon Battle Revolution"},{"name":"Pokémon Gold/Silver"},{"name":"Pokémon Omega Ruby/Alpha Sapphire"},{"name":"Pokémon Yellow: Special Pikachu Edition"},{"name":"Poker"},{"name":"Project CARS"},{"name":"Puzzle & Dragons"},{"name":"Puzzle & Dragons Z"},{"name":"Ragnarok Online"},{"name":"Rayman Legends"},{"name":"Reign Of Kings"},{"name":"Resident Evil"},{"name":"RimWorld"},{"name":"Robocraft"},{"name":"RuneScape"},{"name":"Rust"},{"name":"Ryū ga Gotoku Zero"},{"name":"Smite"},{"name":"SpeedRunners"},{"name":"Splatoon"},{"name":"Spyro 2: Ripto\'s Rage"},{"name":"Spyro: Year of the Dragon"},{"name":"Star Citizen"},{"name":"StarCraft II: Heart of the Swarm"},{"name":"StarCraft: Brood War"},{"name":"Summoners War: Sky Arena"},{"name":"Super Mario 64"},{"name":"Super Mario World"},{"name":"Super Smash Bros. for Wii U"},{"name":"Team Fortress 2"},{"name":"Tera"},{"name":"Terraria"},{"name":"The Binding of Isaac: Rebirth"},{"name":"The Elder Scrolls Online: Tamriel Unlimited"},{"name":"The Elder Scrolls V: Skyrim"},{"name":"The Forest"},{"name":"The Last of Us"},{"name":"The Legend of Zelda: Majora\'s Mask"},{"name":"The Legend of Zelda: Ocarina of Time"},{"name":"The Sims 4"},{"name":"The Walking Dead: Season Two"},{"name":"The Witcher 3: Wild Hunt"},{"name":"Tibia"},{"name":"Tomb Raider"},{"name":"Tower of Saviors"},{"name":"TrackMania² Stadium"},{"name":"Tree of Life"},{"name":"Ultra Street Fighter IV"},{"name":"Vainglory"},{"name":"War Thunder"},{"name":"Warcraft III: The Frozen Throne"},{"name":"Warframe"},{"name":"WildStar"},{"name":"Wing Commander"},{"name":"World of Tanks"},{"name":"World of Warcraft"},{"name":"World of Warcraft: Warlords of Draenor"},{"name":"World of Warships"},{"name":"WWE 2K15"},{"name":"刀塔傳奇 Dota Legend"}]';

husot.tests.chromeSettings.testDataForBigValueShouldBeBiggerThatQuotaLimit = function () {
    var self = this;

    // Times 2 because JavaScript string takes 2 bytes per character in UTF-8
    if (self.bigTestValue.length * 2 < chrome.storage.sync.QUOTA_BYTES_PER_ITEM) {
        husot.tests.fail();
    }
};

husot.tests.chromeSettings.shouldReturnDefaultValue = function () {
    var self = this,
        testKey = 'shouldReturnDefaultValue',
        testDefaultValue = '[]';

    chrome.storage.sync.clear(function () {
        husot.settings.getValue(testKey, testDefaultValue, function (value) {
            if (value != testDefaultValue) {
                husot.tests.fail();
            }
        });
    });
};

husot.tests.chromeSettings.shouldSetAndReturnValue = function () {
    var self = this,
        testKey = 'shouldSetAndReturnValue';

    chrome.storage.sync.clear(function () {
        husot.settings.setValue(testKey, self.smallTestValue, function () {
            husot.settings.getValue(testKey, '[]', function (value) {
                if (value != self.smallTestValue) {
                    husot.tests.fail();
                }
            });
        });
    });
};

husot.tests.chromeSettings.shouldSetAndReturnValueLongerThanQuotaLimit = function () {
    var self = this,
        testKey = 'shouldSetAndReturnValueLongerThanQuotaLimit';

    chrome.storage.sync.clear(function () {
        husot.settings.setValue(testKey, self.bigTestValue, function () {
            husot.settings.getValue(testKey, '[]', function (value) {
                if (value != self.bigTestValue) {
                    husot.tests.fail();
                }
            });
        });
    });

};

husot.tests.chromeSettings.shouldAddChunkIfValueExceedsQuotaLimit = function () {
    var self = this,
        testKey = 'shouldAddChunkIfValueExceedsQuotaLimit';

    chrome.storage.sync.clear(function () {
        husot.settings.setValue(testKey, self.smallTestValue, function () {
            chrome.storage.sync.get(husot.settings.getChunkKeys(testKey), function (items) {
                if (Object.keys(items).length !== 1) {
                    husot.tests.fail();
                }

                husot.settings.setValue(testKey, self.bigTestValue, function () {
                    chrome.storage.sync.get(husot.settings.getChunkKeys(testKey), function (items) {
                        if (Object.keys(items).length !== 2) {
                            husot.tests.fail();
                        }
                    });
                });
            });
        });
    });
};

husot.tests.chromeSettings.shouldRemoveRedundantChunksIfNewValueTakesLessChunksThanTheOldOne = function () {
    var self = this,
        testKey = 'shouldRemoveRedundantChunksIfNewValueTakesLessChunksThanTheOldOne';

    chrome.storage.sync.clear(function () {
        husot.settings.setValue(testKey, self.bigTestValue, function () {
            chrome.storage.sync.get(husot.settings.getChunkKeys(testKey), function (items) {
                if (Object.keys(items).length !== 2) {
                    husot.tests.fail();
                }

                husot.settings.setValue(testKey, self.smallTestValue, function () {
                    chrome.storage.sync.get(husot.settings.getChunkKeys(testKey), function (items) {
                        if (Object.keys(items).length !== 1) {
                            husot.tests.fail();
                        }
                    });
                });
            });
        });
    });
};
