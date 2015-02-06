// DOM Listener module

var husot = husot || {};
husot.domListener = husot.domListener || {};

husot.domListener = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        // Don't process page if its URL is not allowed
        if (!isCurrentUrlAllowed()) {
            return;
        }

        modifyThumbs(mutations, husot.thumbs.streamThumbsManager);
        modifyThumbs(mutations, husot.thumbs.gameThumbsManager);
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

    function modifyThumbs(mutations, thumbsManager) {
        // Process thumbs if they were added to the DOM
        if (!isThumbsAdded(mutations, thumbsManager.getDomListnerThumbSelector())) { return }

        // Add overlay menu
        stop();
        thumbsManager.addThumbOverlays();
        start();

        // Hide blocked thumbs
        thumbsManager.hideThumbs();
    }

    function isCurrentUrlAllowed() {
        return husot.constants.allowedUrls.some(function (item) {
            return (new RegExp(item)).test(document.URL);
        });
    }

    function isThumbsAdded(mutations, selector) {
        return mutations.some(function (item) {
            return $(item.addedNodes).find(selector).filter(function () {
                // Check that thumbnail is hidden explicitly and not because an ancestor element is hidden
                return $(this).css('display') !== 'none';
            }).length !== 0;
        });
    }

    return {
        start: start
    };
})();
