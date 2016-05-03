// Loads more thumbnails
window.addEventListener('message', function (event) {
    if (event.data.direction && event.data.direction === 'husot-event-loadMoreThumbs') {
        $('#directory-list .items > .ember-view').trigger('scroll');
    }
});

$(document).ready(function () {
    var ctrl = App.__container__.lookup('controller:game-directory/index');
    if (ctrl === null || window.languageHooked)
        return;

    var oriGet = ctrl.get;
    ctrl.get = function (e) {
        debugger;
        if (e !== 'model')
            return oriGet.apply(this, arguments);

        var model = oriGet.apply(this, arguments);
        model.broadcaster_language = 'en';

        return model;
    }

    window.languageHooked = true;
});


window.addEventListener('message', function (event) {
    return;
    if (event.data.direction && event.data.direction === 'husot-event-setLanguage') {
        var ctrl = App.__container__.lookup('controller:game-directory/index');
        if (ctrl !== null && !window.languageHooked) {

            var oriGet = ctrl.get;
            ctrl.get = function (e) {
                debugger;
                if (e !== 'model')
                    return oriGet.apply(this, arguments);
                
                var model = oriGet.apply(this, arguments);
                model.broadcaster_language = 'en';

                return model;
            }

            window.languageHooked = true;
        }
            

        //console.log('HUSOT: husot-event-setLanguage called');
    }
});
