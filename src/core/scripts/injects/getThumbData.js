document.addEventListener('husot-event-getThumbnailData', function (e) {
    var start = new Date().getTime();

    console.log('HUSOT: ' + 'husot-event-getThumbnailData starts');

    var $thumbs = $(e.detail.thumbSelector);
    var thumbsData = [];

    $thumbs.each(function () {
        var $item = $(this);
        var viewId = $item.parent('.ember-view').attr('id');
        var view = App.__container__.lookup("-view-registry:main")[viewId];
        var language = view.controller.stream.channel.broadcaster_language;
        var channel = view.controller.stream.channel.display_name;

        thumbsData.push({
            language: language,
            channel: channel
        });
    });

    console.log('HUSOT: ' + $thumbs.length);
    console.log('HUSOT: ' + 'husot-event-getThumbnailData ends after ' + ((new Date().getTime()) - start) + ' ms');
    //console.log('HUSOT: ' + JSON.stringify(thumbsData));

    window.postMessage({
        direction: "husot-message-getThumbnailData",
        message: JSON.stringify(thumbsData)
    }, "*");
});
