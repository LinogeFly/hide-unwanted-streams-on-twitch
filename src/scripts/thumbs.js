// Video Thumbnails Manager module

husot.thumbsManager = husot.thumbsManager || {};

husot.thumbsManager = (function () {
    function getThumbContainer(name) {
        var $channelLink = $('#directory-list .items .item .info a:containsIgnoreCase("{0}")'.format(name));
        if (!$channelLink.length) {
            return $();
        }

        return $channelLink.closest('#directory-list .items .item');
    }

    function addThumbOverlay($thumb) {
        if ($thumb.find('.husot-thumbOverlay').length) {
            return;
        }

        // Add overlay
        var $thumbOverlay = $(husot.htmlLayout.streamOverlay);
        $thumb.append($thumbOverlay);

        // Add event handlers for overlay buttons
        $thumbOverlay.find('.husot-blockStreamBtn').click(blockChannelBtn_onClick);
        $thumbOverlay.find('.husot-showSettingsBtn').click(showSettingsBtn_onClick);

        // Add hover event handler to a stream/video thumb in order to hide/show overlay menu
        $thumb.hover(function () {
            $thumbOverlay.show();
        }, function () {
            $thumbOverlay.hide();
        });
    }

    function blockChannelBtn_onClick() {
        var $sender = $(this);
        var name = $sender.closest('.content').find('.meta .info a').text().trim();

        husot.settings.blockedChannels.add(name, function () {
            hideThumb(name);
            loadMoreThumbs();
        });
    }

    function showSettingsBtn_onClick() {
        husot.settings.ui.window.init();
        husot.modalDialog.show($('.husot-settings'));
    }

    function addThumbOverlays() {
        var $thumbs = $('#directory-list .items .item .thumb');
        if (!$thumbs.length) {
            return;
        }

        $thumbs.each(function () {
            addThumbOverlay($(this));
        });
    }

    function hideThumbs() {
        if (!$('#directory-list .items').length) {
            return;
        }

        var atLeastOneThumbWasHidden = false;
        husot.settings.blockedChannels.list(function (items) {
            items.forEach(function (item) {
                var wasHidden = hideThumb(item.name);
                if (wasHidden) {
                    atLeastOneThumbWasHidden = true;
                }
            });

            if (atLeastOneThumbWasHidden) {
                loadMoreThumbs();
            }
        });
    }

    function hideThumb(name) {
        var $thumbContainer = getThumbContainer(name);
        if (!$thumbContainer.length) {
            return false;
        }
        if (!$thumbContainer.is(":visible")) {
            return false;
        }

        $thumbContainer.hide();
        husot.log.info('Video thumbnail for "{0}" was hidden'.format(name));
        return true;
    }

    function showThumb(name) {
        var $thumbContainer = getThumbContainer(name);
        if (!$thumbContainer.length) {
            return;
        }
        if ($thumbContainer.is(":visible")) {
            return;
        }

        $thumbContainer.show();
        husot.log.info('Video thumbnail for "{0}" was shown'.format(name));
    }

    // Trigger infinite scroll feature on Twitch to load more stream/video thumbs if some thumbs were hidden,
    // so list of stream/video thumbnails is not full and should be fulfilled with new thumbs.
    function loadMoreThumbs() {
        var $thumbs = $('#directory-list .items .item .thumb:visible');
        if (!$thumbs.length) {
            return;
        }
        if ($thumbs.length >= husot.constants.minimumStreamsCountOnPage) {
            return;
        }

        // Call injected custom event in order to trigger "loadMore()" function of Twitch
        var event = document.createEvent('Event');
        event.initEvent('husot.loadMoreThumbs', true, true);
        document.dispatchEvent(event);
    }

    return {
        addThumbOverlays: addThumbOverlays,
        hideThumbs: hideThumbs,
        hideThumb: hideThumb,
        showThumb: showThumb,
        loadMoreThumbs: loadMoreThumbs
    };
})();
