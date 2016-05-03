var husot = husot || {};
husot.thumbs = husot.thumbs || {};

// abstract ThumbsManagerBase

husot.thumbs.ThumbsManagerBase = function () {
}

husot.thumbs.ThumbsManagerBase.prototype = {
    _getContainerSelector: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    _getThumbSelector: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    _btnBlock_onClick: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    _btnSettings_onClick: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    _addThumbOverlay: function ($thumb) {
        var self = this;

        // Initial checks
        if ($thumb.find('.husot-thumbOverlay').length) { // Overlay is added already
            return;
        };

        // Add overlay
        var $thumbOverlay = $(husot.htmlLayout.streamOverlay);
        $thumb.append($thumbOverlay);

        // Add event handlers for overlay buttons
        $thumbOverlay.find('.husot-blockStreamBtn').click(function (event) {
            event.stopPropagation();
        });
        $thumbOverlay.find('.husot-blockStreamBtn').click(function () {
            self._btnBlock_onClick(self, this)
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function (event) {
            event.stopPropagation();
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function () {
            self._btnSettings_onClick();
        });

        // Add hover event handler to a stream/video thumb in order to hide/show overlay menu
        $thumb.hover(function () {
            $thumbOverlay.show();
        }, function () {
            $thumbOverlay.hide();
        });
    },
    _loadMoreThumbs: function () {
        husot.log.debug('Triggering "infinite scroll" to load more thumbs');

        // Raise injected custom event that triggers "infinite scroll" feature on Twitch.
        window.postMessage({
            direction: 'husot-event-loadMoreThumbs',
            message: ''
        }, "*");
    },
    _notifyAboutHiddenThumbs: function (count) {
        // Initial checks
        if (count === 0)
            return;

        husot.log.info('{0} thumbnail{1} {2} hidden'.format(
            count,
            (count > 1 ? 's' : ''),
            (count > 1 ? 'were' : 'was')
        ));
    },
    _notifyAboutShownThumbs: function (count) {
        // Initial checks
        if (count === 0)
            return;

        husot.log.info('{0} thumbnail{1} {2} shown'.format(
            count,
            (count > 1 ? 's' : ''),
            (count > 1 ? 'were' : 'was')
        ));
    },
    _isThumbMustBeHidden: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    getId: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    addThumbOverlays: function () {
        var self = this;

        // Initial checks
        var $thumbs = $(self._getThumbSelector());
        if (!$thumbs.length) { return; }

        $thumbs.each(function () {
            self._addThumbOverlay($(this));
        });
    },
    hideThumbs: function (thumbsData) {
        var self = this,
            start = new Date().getTime();

        husot.log.debug('ThumbsManagerBase.hideThumbs() starts');

        // Load block lists
        var blockedChannelsPromise = new Promise(function (resolve, reject) {
            husot.settings.blockedChannels.list(function (items) {
                resolve(items);
            });
        });
        var blockedGamesPromise = new Promise(function (resolve, reject) {
            husot.settings.blockedGames.list(function (items) {
                resolve(items);
            });
        });
        var blockedLanguagesPromise = new Promise(function (resolve, reject) {
            husot.settings.blockedLanguages.list(function (items) {
                resolve(items);
            });
        });

        Promise.all([blockedChannelsPromise, blockedGamesPromise, blockedLanguagesPromise]).then(function (values) {
            var blockLists = {
                channels: values[0],
                games: values[1],
                languages: values[2]
            };

            var $thumbContainers = $(self._getContainerSelector()).filter(':visible');
            var hiddenThumbsCount = 0;
            $thumbContainers.each(function () {
                var $thumbContainer = $(this);

                // Hide
                if (self._isThumbMustBeHidden($thumbContainer, blockLists, thumbsData)) {
                    $thumbContainer.hide();
                    hiddenThumbsCount++;
                }

                // Remove fading that was added in DOM listner during thumbs loading
                $thumbContainer.css('opacity', '');
            });

            if (hiddenThumbsCount > 0) {
                self._notifyAboutHiddenThumbs(hiddenThumbsCount);
                self._loadMoreThumbs();
            }

            husot.log.debug('ThumbsManagerBase.hideThumbs() ends after {0} ms'.format((new Date().getTime()) - start));
        });
    },
    hideAndShowThumbs: function (thumbsData) {
        var self = this,
            start = new Date().getTime();

        husot.log.debug('ThumbsManagerBase.hideAndShowThumbs() starts');

        // Load block lists
        var blockedChannelsPromise = new Promise(function (resolve, reject) {
            husot.settings.blockedChannels.list(function (items) {
                resolve(items);
            });
        });
        var blockedGamesPromise = new Promise(function (resolve, reject) {
            husot.settings.blockedGames.list(function (items) {
                resolve(items);
            });
        });
        var blockedLanguagesPromise = new Promise(function (resolve, reject) {
            husot.settings.blockedLanguages.list(function (items) {
                resolve(items);
            });
        });

        Promise.all([blockedChannelsPromise, blockedGamesPromise, blockedLanguagesPromise]).then(function (values) {
            var finish = function () {
                // Hide
                if (thumbsToHide.length > 0) {
                    thumbsToHide.forEach(function ($thumbToHide) {
                        $thumbToHide.hide();
                        // Remove fading that was added in DOM listner during thumbs loading
                        $thumbToHide.css('opacity', '');
                    });
                    self._notifyAboutHiddenThumbs(thumbsToHide.length);
                }

                // Show
                if (thumbsToShow.length > 0) {
                    thumbsToShow.forEach(function ($thumbToShow) {
                        $thumbToShow.show();
                        // Remove fading that was added in DOM listner during thumbs loading
                        $thumbToShow.css('opacity', '');
                    });
                    self._notifyAboutShownThumbs(thumbsToShow.length);

                }

                // If more items were hidden then shown - trigger invinite scroll to load more thumbs
                if (thumbsToHide.length - thumbsToShow.length > 0) {
                    self._loadMoreThumbs();
                }

                husot.log.debug('ThumbsManagerBase.hideAndShowThumbs() ends after {0} ms'.format((new Date().getTime()) - start));
            }

            var blockLists = {
                channels: values[0],
                games: values[1],
                languages: values[2]
            };

            var thumbsToHide = [];
            var thumbsToShow = [];

            var $thumbContainers = $(self._getContainerSelector());
            if (!$thumbContainers.length) { // No thumbnails to process
                finish();
                return;
            }

            // Collecting thumbnails to hide and show asynchronously
            var current = 0;
            var job = setInterval(function () {
                var $currentThumb = $thumbContainers.eq(current);
                if (self._isThumbMustBeHidden($currentThumb, blockLists, thumbsData)) {
                    if ($currentThumb.is(":visible")) { // was visible before
                        thumbsToHide.push($currentThumb);
                    }
                } else {
                    if (!$currentThumb.is(":visible")) { // was hidden before
                        thumbsToShow.push($currentThumb);
                    }
                }
                
                current++;

                if (current >= $thumbContainers.length) {
                    clearInterval(job);
                    finish();
                }
            }, 5);
        });
    }
};

// abstract ChannelThumbsManagerBase : ThumbsManagerBase

husot.thumbs.ChannelThumbsManagerBase = function () {
    husot.thumbs.ThumbsManagerBase.call(this);

    this._customChannelNameSelectors = [{
        selector: '.meta .title a',
        urls: [
            '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/Counter-Strike: Global Offensive(/?|[?].+)$',
            '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/Counter-Strike: Global Offensive/map/(.+)$'
        ]
    }];
};

husot.thumbs.ChannelThumbsManagerBase.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.ChannelThumbsManagerBase.prototype.constructor = husot.thumbs.ChannelThumbsManagerBase;
$.extend(husot.thumbs.ChannelThumbsManagerBase.prototype, {
    _getContainerSelector: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    _getThumbSelector: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    },
    _btnBlock_onClick: function (self, sender) {
        var $sender = $(sender);

        var $thumbContainer = $sender.closest(self._getContainerSelector());

        // Initial checks
        if (!$thumbContainer.length) {
            throw Error(husot.exceptions.elementNotFound('Thumb container'));
        };

        var $name = self._getChannelNameJQueryElement($thumbContainer);
        var name = $name.text().trim();

        husot.settings.blockedChannels.add(name, function () {
            self._hideThumb(name);
            self._loadMoreThumbs();
        });
    },
    _btnSettings_onClick: function () {
        husot.settings.ui.window.init(husot.constants.blockedItemType.channel);
        husot.modalDialog.show($('.husot-settings'));
    },
    _getChannelNameJQueryElement: function ($thumbContainer) {
        var self = this;

        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }

        var $result = $thumbContainer.find(self._getChannelNameCssSelector());

        if (!$result.length) {
            throw Error(husot.exceptions.elementNotFound('Channel name'));
        }

        return $result;
    },
    _getChannelNameCssSelector: function ($thumbContainer) {
        var self = this;

        // Default
        var result = '.meta .info a';

        // Use custom URL specific selector if there is any that matches current URL
        self._customChannelNameSelectors.forEach(function (item) {
            var isMatch = item.urls.some(function (url) {
                return (new RegExp(url)).test(decodeURIComponent(document.URL));
            });

            if (isMatch) {
                result = item.selector;
                return;
            }
        });

        return result;
    },
    _getGameNameJQueryElement: function ($thumbContainer) {
        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }

        return $thumbContainer.find('.boxart[title], .boxart[original-title]')
            .filter(function () {
                // Check that game thumbnail is hidden explicitly and not because an ancestor element is hidden
                return $(this).css('display') !== 'none';
            });
    },
    _getThumbContainersForChannel: function (name) {
        var self = this;

        var $thumbContainers = $(self._getContainerSelector());

        // No stream thumbs on the page
        if (!$thumbContainers.length) {
            return $();
        }

        var $channel = self._getChannelNameJQueryElement($thumbContainers)
            .filter(function () {
                return $(this).text().trim().toLowerCase() === name.toLowerCase();
            });

        // No stream thumb with specified channel name found on the page
        if (!$channel.length) {
            return $();
        }

        return $channel.closest(self._getContainerSelector());
    },
    _isThumbMustBeHiddenForChannel: function ($thumbContainer, blockedChannels) {
        var self = this;

        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }
        if ($thumbContainer.length !== 1) {
            throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'));
        }

        var $channelName = self._getChannelNameJQueryElement($thumbContainer);
        var channelName = $channelName.text().trim();

        return blockedChannels.some(function (item) {
            return channelName.toLowerCase() === item.toLowerCase();
        });
    },
    _isThumbMustBeHiddenForGame: function ($thumbContainer, blockedGames) {
        var self = this;

        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }
        if ($thumbContainer.length !== 1) {
            throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'));
        }

        var $gameName = self._getGameNameJQueryElement($thumbContainer);
        if (!$gameName.length) { // Game name is optional in this manager
            return false;
        }

        var gameName = $gameName.attr('title') || $gameName.attr('original-title');

        return blockedGames.some(function (item) {
            return gameName.toLowerCase() === item.toLowerCase();
        });
    },
    _isThumbMustBeHiddenForLanguage: function ($thumbContainer, blockedLanguages, thumbsData) {
        var self = this;

        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }
        if ($thumbContainer.length !== 1) {
            throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'));
        }
        if (typeof thumbsData === 'undefined' || !thumbsData.length) {
            return false; // There is nothing to hide for language because languages are supposed to be recieved in thumbsData
        }
        if (typeof blockedLanguages === 'undefined' || !thumbsData.length) {
            return false; // There are no languages to be blocked
        }

        var $channelName = self._getChannelNameJQueryElement($thumbContainer);
        var channelName = $channelName.text().trim();

        var channelData = thumbsData.find(function (x) {
            if (typeof x.channel === 'undefined' || x.channel === null || x.channel === '') {
                return false;
            }

            return x.channel.toLowerCase() === channelName.toLowerCase()
        });

        if (typeof channelData === 'undefined' || typeof channelData.language === 'undefined' || channelData.language === null || channelData.language === '') {
            return false;
        }

        return blockedLanguages.some(function (x) {
            return channelData.language.toLowerCase() === x.toLowerCase();
        });
    },
    _isThumbMustBeHidden: function ($thumbContainer, blockLists, thumbsData) {
        var self = this;

        // Initial checks
        if (typeof blockLists === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists'));
        if (typeof blockLists.channels === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists.channels'));
        if (typeof blockLists.games === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists.games'));
        if (typeof blockLists.languages === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists.languages'));

        if (self._isThumbMustBeHiddenForChannel($thumbContainer, blockLists.channels))
            return true;

        if (self._isThumbMustBeHiddenForGame($thumbContainer, blockLists.games))
            return true;

        if (self._isThumbMustBeHiddenForLanguage($thumbContainer, blockLists.languages, thumbsData))
            return true;

        return false;
    },
    _hideThumb: function (name) {
        var self = this;

        var $thumbContainers = self._getThumbContainersForChannel(name).filter(':visible');

        // Initial checks
        if (!$thumbContainers.length) {
            throw Error(husot.exceptions.elementNotFoundFor('Thumb container', '"{0}" channel'.format(name)));
        };

        $thumbContainers.hide();
        self._notifyAboutHiddenThumbs($thumbContainers.length);
    },
    getDomListnerThumbSelector: function () {
        throw Error(husot.exceptions.abstractFunctionCall());
    }
});

// StreamThumbsManager : ChannelThumbsManagerBase

husot.thumbs.StreamThumbsManager = function () {
    husot.thumbs.ChannelThumbsManagerBase.call(this);
};

husot.thumbs.StreamThumbsManager.prototype = Object.create(husot.thumbs.ChannelThumbsManagerBase.prototype);
husot.thumbs.StreamThumbsManager.prototype.constructor = husot.thumbs.StreamThumbsManager;
$.extend(husot.thumbs.StreamThumbsManager.prototype, {
    _getContainerSelector: function () {
        return '#directory-list .items .stream.item';
    },
    _getThumbSelector: function () {
        return '#directory-list .items .stream.item .thumb';
    },
    getId: function () {
        return 'DFC8B51A-EF8C-49D7-983F-01B3DCCA32B0';
    },
    getDomListnerThumbSelector: function () {
        return '.stream.item';
    },
});

// VideoThumbsManager : ChannelThumbsManagerBase

husot.thumbs.VideoThumbsManager = function () {
    husot.thumbs.ChannelThumbsManagerBase.call(this);
};

husot.thumbs.VideoThumbsManager.prototype = Object.create(husot.thumbs.ChannelThumbsManagerBase.prototype);
husot.thumbs.VideoThumbsManager.prototype.constructor = husot.thumbs.VideoThumbsManager;
$.extend(husot.thumbs.VideoThumbsManager.prototype, {
    _getContainerSelector: function () {
        return '#directory-list .items .video.item';
    },
    _getThumbSelector: function () {
        return '#directory-list .items .video.item .thumb';
    },
    _isThumbMustBeHidden: function ($thumbContainer, blockLists) {
        var self = this;

        // Initial checks
        if (typeof blockLists === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists'));
        if (typeof blockLists.channels === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists.channels'));
        if (typeof blockLists.games === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists.games'));

        if (self._isThumbMustBeHiddenForChannel($thumbContainer, blockLists.channels))
            return true;

        if (self._isThumbMustBeHiddenForGame($thumbContainer, blockLists.games))
            return true;

        return false;
    },
    getId: function () {
        return '63219B1B-1B1A-4D9E-BCBE-C37D90125099';
    },
    getDomListnerThumbSelector: function () {
        return '.video.item';
    },
});

// GameThumbsManager : ThumbsManagerBase

husot.thumbs.GameThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);
};

husot.thumbs.GameThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.GameThumbsManager.prototype.constructor = husot.thumbs.GameThumbsManager;
$.extend(husot.thumbs.GameThumbsManager.prototype, {
    _getContainerSelector: function () {
        return '#directory-list .items .game.item';
    },
    _getThumbSelector: function () {
        return '#directory-list .items .game.item .boxart';
    },
    _btnBlock_onClick: function (self, sender) {
        var $sender = $(sender);

        var $thumbContainer = $sender.closest(self._getContainerSelector());

        // Initial checks
        if (!$thumbContainer.length) {
            throw Error(husot.exceptions.elementNotFound('Thumb container'));
        };

        var $name = self._getGameNameJQueryElement($thumbContainer);
        var name = $name.text().trim();

        husot.settings.blockedGames.add(name, function () {
            self._hideThumb(name);
            self._loadMoreThumbs();
        });
    },
    _btnSettings_onClick: function () {
        husot.settings.ui.window.init(husot.constants.blockedItemType.game);
        husot.modalDialog.show($('.husot-settings'));
    },
    _getGameNameJQueryElement: function ($thumbContainer) {
        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }

        var $result = $thumbContainer.find('.meta .title');

        if (!$result.length) {
            throw Error(husot.exceptions.elementNotFound('Game name'));
        }

        return $result;
    },
    _getThumbContainer: function (name) {
        var self = this;

        var $thumbContainers = $(self._getContainerSelector());

        // No game thumbs on the page
        if (!$thumbContainers.length) {
            return $();
        }

        var $game = self._getGameNameJQueryElement($thumbContainers).filter(function () {
            return $(this).text().trim().toLowerCase() === name.toLowerCase();
        });

        // No game thumb with specified name found on the page
        if (!$game.length) {
            return $();
        };

        return $game.closest(self._getContainerSelector());
    },
    _isThumbMustBeHiddenForGame: function ($thumbContainer, blockedGames) {
        var self = this;

        // Initial checks
        if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
            throw Error(husot.exceptions.argumentNullOrEmpty('$thumbContainer'));
        }
        if ($thumbContainer.length !== 1) {
            throw Error(husot.exceptions.argumentOneElementExpected('$thumbContainer'));
        }

        var $gameName = self._getGameNameJQueryElement($thumbContainer);
        var gameName = $gameName.text().trim();

        return blockedGames.some(function (item) {
            return gameName.toLowerCase() === item.toLowerCase();
        });
    },
    _isThumbMustBeHidden: function ($thumbContainer, blockLists) {
        var self = this;

        // Initial checks
        if (typeof blockLists === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists'));
        if (typeof blockLists.games === 'undefined')
            throw Error(husot.exceptions.argumentNullOrEmpty('blockLists.games'));

        if (self._isThumbMustBeHiddenForGame($thumbContainer, blockLists.games))
            return true;

        return false;
    },
    _hideThumb: function (name) {
        var self = this;

        var $thumbContainer = self._getThumbContainer(name).filter(':visible');

        // Initial checks
        if (!$thumbContainer.length) {
            throw Error(husot.exceptions.elementNotFoundFor('Thumb container', '"{0}" game'.format(name)));
        };

        $thumbContainer.hide();
        self._notifyAboutHiddenThumbs($thumbContainer.length);
    },
    getId: function () {
        return '598E9D28-A8B0-4D7F-A6C5-1C9CD87E29E2';
    },
    getDomListnerThumbSelector: function () {
        return '.game.item';
    },
});
