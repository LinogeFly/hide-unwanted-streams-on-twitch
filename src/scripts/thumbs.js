// Video Thumbnails module

husot.thumbs = husot.thumbs || {};

// TODO: Refactor selectors so they are nicely groupped and not spreaded through the classes
// TODO: Prformance optimizations
//   Test performance carefully so there are no unnecessary calls for hiding thumbnails. Add additional initial checks if needed.

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
    _getMinimumThumbsCountOnPage: function () {
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
    // Triggers infinite scroll feature on Twitch to load more stream/video thumbs if some thumbs were hidden,
    // so list of stream/video thumbnails is not full and should be fulfilled with new thumbs.
    _loadMoreThumbs: function () {
        var self = this;

        // Initial checks
        var $thumbs = $(self._getThumbSelector() + ':visible');
        if ($thumbs.length >= self._getMinimumThumbsCountOnPage()) {
            return;
        };

        console.log('Trigger husot.loadMoreThumbs event');

        // Call injected custom event in order to trigger "loadMore()" function of Twitch
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

husot.thumbs.StreamThumbsManager.prototype._getMinimumThumbsCountOnPage = function () {
    return husot.constants.minimumStreamsCountOnPage;
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
    if (!$thumbContainer.length) { return false };
    if (!$thumbContainer.is(":visible")) { return false };

    $thumbContainer.hide();
    husot.log.info('Thumbnail(s) for channel "{0}" was(were) hidden'.format(name));
    return true;
}

husot.thumbs.StreamThumbsManager.prototype._hideThumbForGame = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForGame(name);

    // Initial checks
    if (!$thumbContainer.length) { return false };
    if (!$thumbContainer.is(":visible")) { return false };

    $thumbContainer.hide();
    husot.log.info('Thumbnail(s) for game "{0}" was(were) hidden'.format(name));
    return true;
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForChannel = function (name) {
    var self = this;

    var start = new Date().getTime();
    console.log('[StreamThumbsManager.getThumbContainerForChannel] starts')

    var $channel = $(self._getContainerSelector()).find('.meta .info a').filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    console.log('[StreamThumbsManager.getThumbContainerForChannel] ended after: ' + ((new Date().getTime()) - start));

    if (!$channel.length) {
        return $();
    }

    return $channel.closest(self._getContainerSelector());
}

husot.thumbs.StreamThumbsManager.prototype._getThumbContainerForGame = function (name) {
    var self = this;

    var start = new Date().getTime();
    console.log('[StreamThumbsManager.getThumbContainerForGame] starts')

    var $game = $(self._getContainerSelector())
        .find('.boxart[title], .boxart[original-title]')
        .filter(":visible")
        .filter(function () {
            var title1 = this.getAttribute('title');
            var title2 = this.getAttribute('original-title');

            if (title1 !== null && title1.toLowerCase() === name.toLowerCase()) { return true; }
            if (title2 !== null && title2.toLowerCase() === name.toLowerCase()) { return true; }

            return false;
        });

    console.log('[StreamThumbsManager.getThumbContainerForGame] ended after: ' + ((new Date().getTime()) - start));

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
    console.log('[StreamThumbsManager.hideThumbs] starts')

    // A little bit of callback hell ahead :)
    husot.settings.blockedChannels.list(function (channels) {
        var atLeastOneThumbWasHidden = false;

        // Hide thumbs for blocked channels
        channels.forEach(function (item) {
            var wasHidden = self._hideThumbForChannel(item.name);
            if (wasHidden) {
                atLeastOneThumbWasHidden = true;
            }
        });

        // Hide thumbs for blocked games
        husot.settings.blockedGames.list(function (games) {
            games.forEach(function (item) {
                var wasHidden = self._hideThumbForGame(item.name);
                if (wasHidden) {
                    atLeastOneThumbWasHidden = true;
                }
            });

            // Trigger more thumbs to be loaded
            if (atLeastOneThumbWasHidden) {
                self._loadMoreThumbs();
            }

            var duration = (new Date().getTime()) - start;
            console.log('[StreamThumbsManager.hideThumbs] ended after: ' + duration);
        });
    });
}

husot.thumbs.StreamThumbsManager.prototype.showThumb = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainerForChannel(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();
    husot.log.info('Thumbnail(s) for channel "{0}" was(were) shown'.format(name));
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

husot.thumbs.GameThumbsManager.prototype._getMinimumThumbsCountOnPage = function () {
    return husot.constants.minimumGamesCountOnPage;
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
    if (!$thumbContainer.length) { return false };
    if (!$thumbContainer.is(":visible")) { return false };

    $thumbContainer.hide();
    husot.log.info('Thumbnail(s) for game "{0}" was(were) hidden'.format(name));
    return true;
}

husot.thumbs.GameThumbsManager.prototype._getThumbContainer = function (name) {
    var self = this;

    var start = new Date().getTime();
    console.log('[GameThumbsManager.getThumbContainer] starts')

    var $game = $(self._getContainerSelector()).find('.meta .title').filter(function () {
        return $(this).text().trim().toLowerCase() === name.toLowerCase();
    });

    console.log('[GameThumbsManager.getThumbContainer] ended after: ' + ((new Date().getTime()) - start));

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
    console.log('[GameThumbsManager.hideThumbs] starts')

    // Hide thumbs for blocked games
    husot.settings.blockedGames.list(function (items) {
        var atLeastOneThumbWasHidden = false;
        items.forEach(function (item) {
            var wasHidden = self._hideThumb(item.name);
            if (wasHidden) {
                atLeastOneThumbWasHidden = true;
            }
        });

        if (atLeastOneThumbWasHidden) {
            self._loadMoreThumbs();
        };

        console.log('[GameThumbsManager.hideThumbs] ended after: ' + ((new Date().getTime()) - start));
    });
};

husot.thumbs.GameThumbsManager.prototype.showThumb = function (name) {
    var self = this;

    var $thumbContainer = self._getThumbContainer(name);

    // Initial checks
    if (!$thumbContainer.length) { return };
    if ($thumbContainer.is(":visible")) { return };

    $thumbContainer.show();
    husot.log.info('Thumbnail(s) for game "{0}" was(were) shown'.format(name));
}
