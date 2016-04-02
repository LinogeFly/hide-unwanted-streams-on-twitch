document.addEventListener('husot-event-getThumbnailData', function (args) {
    function getThumbsData() {
        if (typeof args.detail === 'undefined' || typeof args.detail.thumbSelector === 'undefined') {
            return [];
        }

        try {
            var result = [];

            $(args.detail.thumbSelector).each(function () {
                var $item = $(this);
                var viewId = $item.parent('.ember-view').attr('id');
                var view = App.__container__.lookup("-view-registry:main")[viewId];
                var language = view.controller.stream.channel.broadcaster_language;
                var channel = view.controller.stream.channel.display_name;

                result.push({
                    language: language,
                    channel: channel
                });
            });

            return result;
        }
        catch (err) {
            // Could have logged the error here but Twitch overrides console.log.error function, Kappa
            return [];
        }
    }

    window.postMessage({
        direction: 'husot-message-gotThumbnailData',
        message: JSON.stringify(getThumbsData())
    }, "*");
});
