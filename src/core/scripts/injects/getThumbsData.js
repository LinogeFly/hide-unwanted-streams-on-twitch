window.addEventListener('message', function (event) {
    if (event.data.direction && event.data.direction === 'husot-message-getThumbnailData') {
        function parseChannelData(thumbsSelector) {
            try {
                var result = [];

                $(thumbsSelector).each(function () {
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
                // Could have logged the error here but Twitch overrides console.log.error function Kappa
                return [];
            }
        };

        function postMessage(data, direction) {
            window.postMessage({
                direction: direction,
                message: JSON.stringify(data)
            }, "*");
        }

        var inputData = JSON.parse(event.data.message);
        if (typeof inputData.callback === 'undefined' || typeof inputData.thumbsSelector === 'undefined')
            return;

        var callbackData = {
            thumbsData: parseChannelData(inputData.thumbsSelector),
            thumbsManagerId: inputData.thumbsManagerId
        };

        postMessage(callbackData, inputData.callback);
    }
});
