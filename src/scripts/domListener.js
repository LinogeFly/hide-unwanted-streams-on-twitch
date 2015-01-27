// DOM Listener module

husot.domListener = husot.domListener || {};

husot.domListener = (function () {
    // TODO: Add polyfill for MutationObserver
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        // Don't process page if its URL is not allowed
        if (!isCurrentUrlAllowed()) {
            return;
        }

        husot.thumbsManager.hideThumbs();
        stop();
        husot.thumbsManager.addThumbOverlays();
        start();
    });

    function start() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function stop() {
        observer.disconnect();
    }

    function isCurrentUrlAllowed() {
        return husot.constants.allowedUrls.some(function (item) {
            return (new RegExp(item)).test(document.URL);
        });
    }

    return {
        start: start,
        stor: stop
    };
})();
