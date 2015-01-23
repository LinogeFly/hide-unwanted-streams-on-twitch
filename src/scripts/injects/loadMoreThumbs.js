// Loads more stream/video thumbnails by calling internal function of Twitch named "loadMore()"
document.addEventListener('husot.loadMoreThumbs', function (e) {
    var thumbsView = Ember.View.views[$('#directory-list .items > .ember-view').attr('id')];
    if (typeof thumbsView === 'undefined' || typeof thumbsView.content === 'undefined') {
        return;
    };

    thumbsView._loadMore();
});
