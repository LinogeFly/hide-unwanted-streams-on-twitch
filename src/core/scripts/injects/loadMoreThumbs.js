// Loads more stream/video thumbnails
document.addEventListener('husot.loadMoreThumbs', function () {
    $('#directory-list .items > .ember-view').trigger('scroll');
});
