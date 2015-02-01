// Loads more stream/video thumbnails by calling internal function of Twitch
document.addEventListener('husot.loadMoreThumbs', function (e) {
    var thumbsView = Ember.View.views[$('#directory-list .items > .ember-view').attr('id')];
    if (typeof thumbsView === 'undefined') {
        return;
    };

    thumbsView._ensureViewFilled();
});
