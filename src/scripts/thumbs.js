// Video Thumbnails module

var husot = husot || {};
husot.thumbs = husot.thumbs || {};

// abstract class ThumbsManagerBase

husot.thumbs.ThumbsManagerBase = function () {

}

husot.thumbs.ThumbsManagerBase.prototype = {
    _getContainerSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    _getThumbSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    _addThumbOverlay: function ($thumb) {
        var self = this;

        // Initial checks
        if ($thumb.find('.husot-thumbOverlay').length) {
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
            self._blockBtn_onClick(self, this)
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function (event) {
            event.stopPropagation();
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function () {
            self._showSettingsBtn_onClick(self, this);
        });

        // Add hover event handler to a stream/video thumb in order to hide/show overlay menu
        $thumb.hover(function () {
            $thumbOverlay.show();
        }, function () {
            $thumbOverlay.hide();
        });
    },
    _blockBtn_onClick: function (self, sender) {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    _showSettingsBtn_onClick: function (self, sender) {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    // Triggers "infinite scroll" feature on Twitch to load more stream/video thumbnails
    // in order to make sure that page it is filled with new thumbnails after some thumbnails were hidden.
    _loadMoreThumbs: function () {
        husot.log.debug('Triggering "infinite scroll" to load more thumbs');

        // Raise injected custom event that triggers "infinite scroll" feature on Twitch.
        var event = document.createEvent('Event');
        event.initEvent('husot.loadMoreThumbs', true, true);
        document.dispatchEvent(event);
    },
    // TODO: Rename this function
    getThumbFindSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
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
    hideThumbs: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    showThumbs: function (name) {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    }
};

// class StreamThumbsManager: ThumbsManagerBase

husot.thumbs.StreamThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);
}

husot.thumbs.StreamThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.StreamThumbsManager.prototype.constructor = husot.thumbs.StreamThumbsManager;

husot.thumbs.StreamThumbsManager.prototype._getContainerSelector = function () {
    return '#directory-list .items .stream.item, #directory-list .items .video.item';
}

husot.thumbs.StreamThumbsManager.prototype._getThumbSelector = function () {
    return '#directory-list .items .stream.item .thumb, #directory-list .items .video.item .thumb';
}

husot.thumbs.StreamThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init(husot.constants.blockedItemType.channel);
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.StreamThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
    var $sender = $(sender);

    var $thumbContainer = $sender.closest(self._getContainerSelector());

    // Initial checks
    if (!$thumbContainer.length) {
        throw Error('Thumb container not found');
    };

    var $name = self._getChanneNamejQueryElement($thumbContainer);
    var name = $name.text().trim();

    husot.settings.blockedChannels.add(name, function () {
        self._hideThumb(name);
        self._loadMoreThumbs();
    });
}

husot.thumbs.StreamThumbsManager.prototype._hideThumb = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForChannel(name);

    // Initial checks
    if (!$thumbContainer.length) {
        throw Error('Thumb container not found for "{0}" channel'.format(name));
    };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for channel "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._showThumbIfExists = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForChannel(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();

    husot.log.info('Thumbnail{0} for channel "{1}" {2} shown'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForChannel = function (name) {
    var self = this;

    var $thumbContainers = $(self._getContainerSelector());

    // No stream thumbs on the page
    if (!$thumbContainers.length) {
        return $();
    }

    var $channel = self._getChanneNamejQueryElement($thumbContainers)
        .filter(function () {
            return $(this).text().trim().toLowerCase() === name.toLowerCase();
        });

    // No stream thumb with specified channel name found on the page
    if (!$channel.length) {
        return $();
    }

    return $channel.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForGame = function (name) {
    var self = this;

    var $thumbContainers = $(self._getContainerSelector());

    // No stream thumbs on the page
    if (!$thumbContainers.length) {
        return $();
    }

    var $game = self._getGameNamejQueryElement($(self._getContainerSelector()))
        .filter(function () {
            var title1 = this.getAttribute('title');
            var title2 = this.getAttribute('original-title');

            if (title1 !== null && title1.toLowerCase() === name.toLowerCase()) { return true; }
            if (title2 !== null && title2.toLowerCase() === name.toLowerCase()) { return true; }

            return false;
        });

    // No stream thumb with specified game name found on the page
    if (!$game.length) {
        return $();
    }

    return $game.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype._getChanneNamejQueryElement = function ($thumbContainer) {
    // Initial checks
    if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
        throw Error(husot.constants.exceptions.argumentNullOrEmpty.format('$thumbContainer'));
    }

    var $result = $thumbContainer.find('.meta .info a');

    if (!$result.length) {
        throw Error('Channel name not found. CSS selector must be broken.');
    }

    return $result;
}

husot.thumbs.StreamThumbsManager.prototype._getGameNamejQueryElement = function ($thumbContainer) {
    // Initial checks
    if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
        throw Error(husot.constants.exceptions.argumentNullOrEmpty.format('$thumbContainer'));
    }

    return $thumbContainer.find('.boxart[title], .boxart[original-title]')
        .filter(function () {
            // Check that game thumbnail is hidden explicitly and not because an ancestor element is hidden
            return $(this).css('display') !== 'none';
        });
}

husot.thumbs.StreamThumbsManager.prototype._isThumbMustBeHiddenForChannel = function ($thumbContainer, blockedChannels) {
    var self = this;

    // Initial checks
    if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
        throw Error(husot.constants.exceptions.argumentNullOrEmpty.format('$thumbContainer'));
    }

    var $channelName = self._getChanneNamejQueryElement($thumbContainer);
    var channelName = $channelName.text().trim();

    return blockedChannels.some(function (item) {
        return channelName.toLowerCase() === item.name.toLowerCase();
    });
};

husot.thumbs.StreamThumbsManager.prototype._isThumbMustBeHiddenForGame = function ($thumbContainer, blockedGames) {
    var self = this;

    // Initial checks
    if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
        throw Error(husot.constants.exceptions.argumentNullOrEmpty.format('$thumbContainer'));
    }

    var $gameName = self._getGameNamejQueryElement($thumbContainer);
    if (!$gameName.length) { // Game name is optional in this manager
        return false;
    }

    var gameName = $gameName.attr('title') || $gameName.attr('original-title');

    return blockedGames.some(function (item) {
        return gameName.toLowerCase() === item.name.toLowerCase();
    });
};

husot.thumbs.StreamThumbsManager.prototype.getThumbFindSelector = function () {
    return '.item .thumb';
}

husot.thumbs.StreamThumbsManager.prototype.hideThumbs = function () {
    var self = this;

    var start = new Date().getTime();
    husot.log.debug('StreamThumbsManager.hideThumbs() starts');

    // Load block lists for channels and games
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

    // Hide thumbnails after block lists are loaded
    Promise.all([blockedChannelsPromise, blockedGamesPromise]).then(function (values) {
        var blockedChannels = values[0];
        var blockedGames = values[1];

        // Get visible thumbs
        var hiddenThumbsCount = 0;
        $thumbContainers = $(self._getContainerSelector()).filter(":visible");

        // Enumerate visible thumbs and hide those that must be hidden
        $thumbContainers.each(function () {
            var $item = $(this);

            // Hide for channels
            if (self._isThumbMustBeHiddenForChannel($item, blockedChannels)) {
                $item.hide();
                hiddenThumbsCount++;
                return;
            }

            // Hide for games
            if (self._isThumbMustBeHiddenForGame($item, blockedGames)) {
                $item.hide();
                hiddenThumbsCount++;
                return;
            }
        });

        // Write summary for hidden thumbs in log
        if (hiddenThumbsCount > 0) {
            husot.log.info('{0} thumbnail{1} {2} hidden'.format(
                hiddenThumbsCount,
                (hiddenThumbsCount > 1 ? 's' : ''),
                (hiddenThumbsCount > 1 ? 'were' : 'was')
            ));
        }

        husot.log.debug('StreamThumbsManager.hideThumbs() ends after: {0} ms'.format((new Date().getTime()) - start));
        self._loadMoreThumbs();
    }).catch(function (reason) {
        husot.log.error(reason.message);
    });
}

husot.thumbs.StreamThumbsManager.prototype.showThumbs = function (name) {
    var self = this;

    self._showThumbIfExists(name);
}

husot.thumbs.StreamThumbsManager.prototype.showThumbForGame = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForGame(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();

    husot.log.info('Thumbnail{0} for game "{1}" {2} shown'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

// class GameThumbsManager: ThumbsManagerBase

husot.thumbs.GameThumbsManager = function (streamThumbsManager) {
    husot.thumbs.ThumbsManagerBase.call(this);

    this.streamThumbsManager = streamThumbsManager;
}

husot.thumbs.GameThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.GameThumbsManager.prototype.constructor = husot.thumbs.GameThumbsManager;

husot.thumbs.GameThumbsManager.prototype._getContainerSelector = function () {
    return '#directory-list .items .game.item';
}

husot.thumbs.GameThumbsManager.prototype._getThumbSelector = function () {
    return '#directory-list .items .game.item .boxart';
}

husot.thumbs.GameThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init(husot.constants.blockedItemType.game);
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.GameThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
    var $sender = $(sender);

    var $thumbContainer = $sender.closest(self._getContainerSelector());

    // Initial checks
    if (!$thumbContainer.length) {
        throw Error('Thumb container not found');
    };
    
    var $name = self._getGameNamejQueryElement($thumbContainer);
    var name = $name.text().trim();

    husot.settings.blockedGames.add(name, function () {
        self._hideThumb(name);
        self._loadMoreThumbs();
    });
}

husot.thumbs.GameThumbsManager.prototype._hideThumb = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainer(name);

    // Initial checks
    if (!$thumbContainer.length) {
        throw Error('Thumb container not found for "{0}" game'.format(name));
    };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for game "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.GameThumbsManager.prototype._getThumbContainer = function (name) {
    var self = this;

    var $thumbContainers = $(self._getContainerSelector());

    // No game thumbs on the page
    if (!$thumbContainers.length) {
        return $();
    }

    var $game = self._getGameNamejQueryElement($thumbContainers).filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    // No game thumb with specified name found on the page
    if (!$game.length) {
        return $();
    };

    return $game.closest(self._getContainerSelector());
}

husot.thumbs.GameThumbsManager.prototype._getGameNamejQueryElement = function ($thumbContainer) {
    // Initial checks
    if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
        throw Error(husot.constants.exceptions.argumentNullOrEmpty.format('$thumbContainer'));
    }

    var $result = $thumbContainer.find('.meta .title');

    if (!$result.length) {
        throw Error('Game name not found. CSS selector must be broken.');
    }

    return $result;
}

husot.thumbs.GameThumbsManager.prototype._isThumbMustBeHidden = function ($thumbContainer, blockedGames) {
    var self = this;

    // Initial checks
    if (typeof $thumbContainer === 'undefined' || !$thumbContainer.length) {
        throw Error(husot.constants.exceptions.argumentNullOrEmpty.format('$thumbContainer'));
    }

    var $gameName = self._getGameNamejQueryElement($thumbContainer);
    var gameName = $gameName.text().trim();

    return blockedGames.some(function (item) {
        return gameName.toLowerCase() === item.name.toLowerCase();
    });
};

husot.thumbs.GameThumbsManager.prototype._showThumbIfExists = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainer(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();

    husot.log.info('Thumbnail{0} for game "{1}" {2} shown'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
};

husot.thumbs.GameThumbsManager.prototype.getThumbFindSelector = function () {
    return '.game.item .boxart';
}

husot.thumbs.GameThumbsManager.prototype.hideThumbs = function () {
    var self = this;

    var start = new Date().getTime();
    husot.log.debug('GameThumbsManager.hideThumbs() starts');

    // Load Blocked Games list
    var blockedGamesPromise = new Promise(function (resolve, reject) {
        husot.settings.blockedGames.list(function (items) {
            resolve(items);
        });
    });

    // Hide thumbnails after block list
    blockedGamesPromise.then(function (blockedGames) {
        // Enumerate visible thumbs and hide those that must be hidden
        var hiddenThumbsCount = 0;
        $thumbContainers = $(self._getContainerSelector() + ':visible');
        $thumbContainers.each(function () {
            var $item = $(this);

            // Hide game if needed
            if (self._isThumbMustBeHidden($item, blockedGames)) {
                $item.hide();
                hiddenThumbsCount++;
            }
        });

        // Write summary for hidden thumbs in log
        if (hiddenThumbsCount > 0) {
            husot.log.info('{0} thumbnail{1} {2} hidden'.format(
                hiddenThumbsCount,
                (hiddenThumbsCount > 1 ? 's' : ''),
                (hiddenThumbsCount > 1 ? 'were' : 'was')
            ));
        }

        husot.log.debug('GameThumbsManager.hideThumbs() ends after: {0} ms'.format((new Date().getTime()) - start));
        self._loadMoreThumbs();
    }).catch(function (reason) {
        husot.log.error(reason.message);
    });
};

husot.thumbs.GameThumbsManager.prototype.showThumbs = function (name) {
    var self = this;

    self._showThumbIfExists(name);
    self.streamThumbsManager.showThumbForGame(name);
};
