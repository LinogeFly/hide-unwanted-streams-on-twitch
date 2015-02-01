// DOM Listener module

var husot = husot || {};
husot.domListener = husot.domListener || {};

husot.domListener = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        //husot.debug.hideRedundantElements();

        // Don't process page if its URL is not allowed
        if (!isCurrentUrlAllowed()) {
            return;
        }

        // Don't run hiding if it's not a stream thumbs adding triggered the DOM change
        if (isThumbsAdded(mutations, husot.thumbs.streamThumbsManager.getThumbFindSelector())) {
            husot.thumbs.streamThumbsManager.hideThumbs();
        }

        // Don't run hiding if it's not a game thumbs adding triggered the DOM change
        if (isThumbsAdded(mutations, husot.thumbs.gameThumbsManager.getThumbFindSelector())) {
            husot.thumbs.gameThumbsManager.hideThumbs();
        }

        // Add overlay menus
        stop();
        husot.thumbs.streamThumbsManager.addThumbOverlays();
        husot.thumbs.gameThumbsManager.addThumbOverlays();
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

    function isThumbsAdded(mutations, selector) {
        return mutations.some(function (item) {
            return $(item.addedNodes).find(selector).length !== 0;
        });
    }

    return {
        start: start
    };
})();
