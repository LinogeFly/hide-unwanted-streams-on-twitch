// Classes for managing video thumbnails

husot.thumbs = husot.thumbs || {};

// TODO: name private members with "_" prefix

// abstract class ThumbsManagerBase

husot.thumbs.ThumbsManagerBase = function () {
    this._thumbsSelector = undefined; // Abstract
    this._blockedItems = undefined; // Abstract
    this._minimumThumbsCountOnPage = undefined; // Abstract
}

husot.thumbs.ThumbsManagerBase.prototype = {
    addThumbOverlay: function ($thumb) {
        var self = this;

        // Initial checks
        if ($thumb.find('.husot-thumbOverlay').length) {
            return;
        }

        // Add overlay
        var $thumbOverlay = $(husot.htmlLayout.streamOverlay);
        $thumb.append($thumbOverlay);

        // Add event handlers for overlay buttons
        $thumbOverlay.find('.husot-blockStreamBtn').click(function () {
            self.blockChannelBtn_onClick(self, this)
        });
        $thumbOverlay.find('.husot-blockStreamBtn').click(function (event) {
            event.stopPropagation();
        });
        $thumbOverlay.find('.husot-showSettingsBtn').click(function () {
            self.showSettingsBtn_onClick(self, this);
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
    addThumbOverlays: function () {
        var self = this;

        // Initial checks
        var $thumbs = $(this._thumbsSelector);
        if (!$thumbs.length) {
            return;
        }

        $thumbs.each(function () {
            self.addThumbOverlay($(this));
        });
    },
    blockChannelBtn_onClick: function (self, sender) { // Abstract
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    showSettingsBtn_onClick: function (self, sender) { // Abstract
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    getThumbContainer: function (name) { // Abstract
        throw Error(husot.constants.exceptions.abstractFunctionCall);
    },
    hideThumb: function(name) {
        var $thumbContainer = this.getThumbContainer(name);
        if (!$thumbContainer.length) {
            return false;
        }
        if (!$thumbContainer.is(":visible")) {
            return false;
        }

        $thumbContainer.hide();
        husot.log.info('Thumbnail for "{0}" was hidden'.format(name));
        return true;
    },
    // Trigger infinite scroll feature on Twitch to load more stream/video thumbs if some thumbs were hidden,
    // so list of stream/video thumbnails is not full and should be fulfilled with new thumbs.
    loadMoreThumbs: function () {
        var self = this;

        var $thumbs = $(self._thumbsSelector + ':visible');
        if (!$thumbs.length) {
            return;
        }
        if ($thumbs.length >= self._minimumThumbsCountOnPage) {
            return;
        }

        console.log('Triggering husot.loadMoreThumbs');
        // Call injected custom event in order to trigger "loadMore()" function of Twitch
        var event = document.createEvent('Event');
        event.initEvent('husot.loadMoreThumbs', true, true);
        document.dispatchEvent(event);
    },
    hideThumbs: function () {
        var self = this;

        // Initial checks
        if (!$('#directory-list .items').length) {
            return;
        }

        var atLeastOneThumbWasHidden = false;
        self._blockedItems.list(function (items) {
            items.forEach(function (item) {
                var wasHidden = self.hideThumb(item.name);
                if (wasHidden) {
                    atLeastOneThumbWasHidden = true;
                }
            });

            if (atLeastOneThumbWasHidden) {
                self.loadMoreThumbs();
            }
        });
    },
    showThumb: function (name) {
        var $thumbContainer = this.getThumbContainer(name);
        if (!$thumbContainer.length) {
            return;
        }
        if ($thumbContainer.is(":visible")) {
            return;
        }

        $thumbContainer.show();
        husot.log.info('Thumbnail for "{0}" was shown'.format(name));
    }
};

// TODO: check how to use $.extend function

// class StreamThumbsManager: ThumbsManagerBase

husot.thumbs.StreamThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);

    this._thumbsSelector = '#directory-list .items .item .thumb';
    this._blockedItems = husot.settings.blockedChannels;
    this._minimumThumbsCountOnPage = husot.constants.minimumStreamsCountOnPage;
}

husot.thumbs.StreamThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.StreamThumbsManager.prototype.constructor = husot.thumbs.StreamThumbsManager;

husot.thumbs.StreamThumbsManager.prototype.showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init('channels');
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.StreamThumbsManager.prototype.blockChannelBtn_onClick = function (self, sender) {
    var $sender = $(sender);
    var name = $sender.closest('.content').find('.meta .info a').text().trim();

    if (name === '') {
        log.error('Stream name not found');
        return;
    }

    husot.settings.blockedChannels.add(name, function () {
        self.hideThumb(name);
        self.loadMoreThumbs();
    });
}

husot.thumbs.StreamThumbsManager.prototype.getThumbContainer = function (name) {
    var $channelLink = $('#directory-list .items .item .info a:containsIgnoreCase("{0}")'.format(name));
    if (!$channelLink.length) {
        return $();
    }

    return $channelLink.closest('#directory-list .items .item');
}

// class GameThumbsManager: ThumbsManagerBase

husot.thumbs.GameThumbsManager = function () {
    husot.thumbs.ThumbsManagerBase.call(this);

    this._thumbsSelector = '#directory-list .items .item .boxart';
    this._blockedItems = husot.settings.blockedGames;
    this._minimumThumbsCountOnPage = husot.constants.minimumGamesCountOnPage;
}

husot.thumbs.GameThumbsManager.prototype = Object.create(husot.thumbs.ThumbsManagerBase.prototype);
husot.thumbs.GameThumbsManager.prototype.constructor = husot.thumbs.GameThumbsManager;

husot.thumbs.GameThumbsManager.prototype.showSettingsBtn_onClick = function (self, sender) {
    husot.settings.ui.window.init('games');
    husot.modalDialog.show($('.husot-settings'));
}

husot.thumbs.GameThumbsManager.prototype.blockChannelBtn_onClick = function (self, sender) {
    var $sender = $(sender);
    var name = $sender.closest('.game').find('.meta .title').text().trim();

    if (name === '') {
        log.error('Game name not found');
        return;
    }

    husot.settings.blockedGames.add(name, function () {
        self.hideThumb(name);
        self.loadMoreThumbs();
    });
}

husot.thumbs.GameThumbsManager.prototype.getThumbContainer = function (name) {
    var $gameTitle = $('#directory-list .items .item .meta .title:containsIgnoreCase("{0}")'.format(name));

    if (!$gameTitle.length) {
        return $();
    }

    return $gameTitle.closest('#directory-list .items .item');
}
