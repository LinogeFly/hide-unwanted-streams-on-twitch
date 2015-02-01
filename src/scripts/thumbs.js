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
        $thumbOverlay.find('.husot-blockStreamBtn').click(function () {
            self._blockBtn_onClick(self, this)
        });
        $thumbOverlay.find('.husot-blockStreamBtn').click(function (event) {
            event.stopPropagation();
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function () {
            self._showSettingsBtn_onClick(self, this);
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function (event) {
            event.stopPropagation();
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
    getThumbFindSelector: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    addThumbOverlays: function () {
        var self = this;

        // Initial checks
        var $thumbs = $(self._getThumbSelector());
        if (!$thumbs.length) {
            return;
        };

        $thumbs.each(function () {
            self._addThumbOverlay($(this));
        });
    },
    hideThumbs: function () {
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    showThumb: function (name) {
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
    return '#directory-list .items .item';
}

husot.thumbs.StreamThumbsManager.prototype._getThumbSelector = function () {
    return '#directory-list .items .item .thumb';
}

husot.thumbs.StreamThumbsManager.prototype._showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init('channels');
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.StreamThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
    var $sender = $(sender);
    var $name = $sender.closest(self._getContainerSelector()).find('.meta .info a');

    if (!$name.length) {
        log.error('Stream name not found');
        return;
    }

    var name = $name.text().trim();
    husot.settings.blockedChannels.add(name, function () {
        self._hideThumbForChannel(name);
        self._loadMoreThumbs();
    });
}

husot.thumbs.StreamThumbsManager.prototype._hideThumbForChannel = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForChannel(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for channel "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._hideThumbForGame = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForGame(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if (!$thumbContainer.is(":visible")) { return };

    $thumbContainer.hide();

    husot.log.info('Thumbnail{0} for game "{1}" {2} hidden'.format(
        ($thumbContainer.length > 1 ? 's' : ''),
        name,
        ($thumbContainer.length > 1 ? 'were' : 'was')
    ));
}

husot.thumbs.StreamThumbsManager.prototype._showThumbForChannel = function (name) {
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

husot.thumbs.StreamThumbsManager.prototype._showThumbForGame = function (name) {
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

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForChannel = function (name) {
    var self = this;

    var $channel = $(self._getContainerSelector()).find('.meta .info a').filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    if (!$channel.length) {
        return $();
    }

    return $channel.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForGame = function (name) {
    var self = this;

    var $game = $(self._getContainerSelector())
        .find('.boxart[title], .boxart[original-title]')
        .filter(function () {
            // Check that game thumbnail is hidden explicitly.
            // jQuery's :visible selector is not used here because it considers element as hidden if an ancestor element is hidden,
            // and we need to get only explicitly hidden elements with Twitch's ".no-boxart" class.
            return $(this).css('display') !== 'none';
        })
        .filter(function () {
            var title1 = this.getAttribute('title');
            var title2 = this.getAttribute('original-title');

            if (title1 !== null && title1.toLowerCase() === name.toLowerCase()) { return true; }
            if (title2 !== null && title2.toLowerCase() === name.toLowerCase()) { return true; }

            return false;
        });

    if (!$game.length) {
        return $();
    }

    return $game.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype.getThumbFindSelector = function () {
    return '.item .thumb';
}

husot.thumbs.StreamThumbsManager.prototype.hideThumbs = function () {
    var self = this;

    // Initial checks
    if (!$(self._getThumbSelector()).length) { return; }

    var start = new Date().getTime();
    husot.log.debug('StreamThumbsManager.hideThumbs() starts');

    // A little bit of callback hell ahead :)
    husot.settings.blockedChannels.list(function (channels) {
        // Hide thumbs for blocked channels
        channels.forEach(function (item) {
            self._hideThumbForChannel(item.name);
        });

        // Hide thumbs for blocked games
        husot.settings.blockedGames.list(function (games) {
            games.forEach(function (item) {
                self._hideThumbForGame(item.name);
            });

            husot.log.debug('StreamThumbsManager.hideThumbs() ends after: {0} ms'.format((new Date().getTime()) - start));
            self._loadMoreThumbs();
        });
    });
}

husot.thumbs.StreamThumbsManager.prototype.showThumb = function (name) {
    var self = this;

    self._showThumbForChannel(name);
    self._showThumbForGame(name);
}

// class GameThumbsManager: ThumbsManagerBase

husot.thumbs.GameThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);
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
    husot.settings.ui.window.init('games');
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.GameThumbsManager.prototype._blockBtn_onClick = function (self, sender) {
    var $sender = $(sender);
    var $name = $sender.closest(self._getContainerSelector()).find('.meta .title');

    if (!$name.length) {
        log.error('Game name not found');
        return;
    }

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
    if (!$thumbContainer.length) { return };
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

    var $game = $(self._getContainerSelector()).find('.meta .title').filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    if (!$game.length) {
        return $();
    };

    return $game.closest(self._getContainerSelector());
}

husot.thumbs.GameThumbsManager.prototype.getThumbFindSelector = function () {
    return '.game.item .boxart';
}

husot.thumbs.GameThumbsManager.prototype.hideThumbs = function () {
    var self = this;

    // Initial checks
    if (!$(self._getThumbSelector()).length) {
        return;
    };

    var start = new Date().getTime();
    husot.log.debug('GameThumbsManager.hideThumbs() starts');

    // Hide thumbs for blocked games
    husot.settings.blockedGames.list(function (items) {
        items.forEach(function (item) {
            self._hideThumb(item.name);
        });

        husot.log.debug('GameThumbsManager.hideThumbs() ends after: {0} ms'.format((new Date().getTime()) - start));
        self._loadMoreThumbs();
    });
};

husot.thumbs.GameThumbsManager.prototype.showThumb = function (name) {
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
