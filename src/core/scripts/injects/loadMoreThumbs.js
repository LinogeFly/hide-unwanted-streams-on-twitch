// Loads more stream/video thumbnails
document.addEventListener('husot-event-loadMoreThumbs', function () {
    $('#directory-list .items > .ember-view').trigger('scroll');
});
