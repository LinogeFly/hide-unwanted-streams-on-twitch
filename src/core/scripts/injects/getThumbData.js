document.addEventListener('husot-event-getThumbnailData', function (args) {
    function parseChannelData(thumbSelector) {
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

    function postMessage(data) {
        window.postMessage({
            direction: 'husot-message-gotThumbnailData',
            message: JSON.stringify(data)
        }, "*");
    }

    if (typeof args.detail === 'undefined' || typeof args.detail.thumbSelector === 'undefined') {
        postMessage([]);
        return;
    }

    postMessage(parseChannelData(args.detail.thumbSelector));
});
