// DOM Listener module

var husot = husot || {};
husot.domListener = husot.domListener || {};

husot.domListener = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        // Don't process page if its URL is not allowed
        if (!isUrlAllowed(document.URL)) {
            return;
        }

        modifyThumbs(mutations, husot.thumbs.streamThumbsManager);
        modifyThumbs(mutations, husot.thumbs.gameThumbsManager);
    });

    window.addEventListener('message', function (event) {
        if (event.data.direction && event.data.direction === 'husot-message-gotThumbnailData') {
            var thumbsData = JSON.parse(event.data.message);

            husot.thumbs.streamThumbsManager.hideThumbs(thumbsData);
            husot.thumbs.gameThumbsManager.hideThumbs();
        }
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

        // Dispatch event to load thumbnail data from main window
        getThumbnailData(thumbsManager);
    }

    function isUrlAllowed(url) {
        return husot.constants.allowedUrls.some(function (item) {
            return (new RegExp(item)).test(decodeURIComponent(url));
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

    function getThumbnailData(thumbsManager) {
        var event = document.createEvent('CustomEvent');
        var eventData = {
            thumbSelector: thumbsManager.getDomListnerThumbSelector()
        };
        event.initCustomEvent('husot-event-getThumbnailData', true, true, eventData);
        document.dispatchEvent(event);
    }

    return {
        start: start,
        isUrlAllowed: isUrlAllowed
    };
})();
