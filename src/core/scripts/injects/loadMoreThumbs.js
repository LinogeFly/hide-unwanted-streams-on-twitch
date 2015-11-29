// Loads more stream/video thumbnails by calling internal function of Twitch
document.addEventListener('husot.loadMoreThumbs', function (e) {
    $('#directory-list .items > .ember-view').each(function () {
        var viewId = $(this).attr('id');
        var thumbsView = App.__container__.lookup("-view-registry:main")[viewId];

        if (typeof thumbsView === 'undefined') {
            return;
        };

        if (typeof thumbsView._ensureViewFilled === 'undefined') {
            return;
        };

        thumbsView._ensureViewFilled();
    });
});
