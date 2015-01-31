// Modal Dialog module

var husot = husot || {};
husot.modalDialog = husot.modalDialog || {};

husot.modalDialog = (function () {
    function initOverlay() {
        if ($('.husot-modalOverlay').length) {
            return;
        }

        var $overlay = $(husot.htmlLayout.modalDialogOverlay);
        $overlay.click(close);
        $(document.body).append($overlay);
    }

    function create($modalWindow) {
        $modalWindow.click(function (event) {
            event.stopPropagation();
        });
        $modalWindow.find('.husot-modalClose').click(close);
        $('.husot-modalOverlay').append($modalWindow);
    }

    function show($modalWindow) {
        $('.husot-modalOverlay').fadeIn(husot.constants.modalDialogShowingSpeed);
        $modalWindow.fadeIn({ queue: false, duration: husot.constants.modalDialogShowingSpeed });
        $modalWindow.animate({ 'margin-top': '40px' }, husot.constants.modalDialogShowingSpeed);
    }

    function close(event) {
        $('.husot-modalOverlay').fadeOut(husot.constants.modalDialogShowingSpeed);
        var $modalWindow = $('.husot-modalWindow');
        $modalWindow.fadeOut(husot.constants.modalDialogShowingSpeed);
        $modalWindow.animate({ 'margin-top': '50px' }, husot.constants.modalDialogShowingSpeed);
    }

    return {
        initOverlay: initOverlay,
        create: create,
        show: show,
        close: close,
    };
})();
