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

        window.postMessage({
            direction: 'husot-event-setLanguage',
            message: ''
        }, "*");

        husot.debug.hideRedundantElements();

        modifyThumbs(mutations, husot.thumbs.streamThumbsManager);
        modifyThumbs(mutations, husot.thumbs.videoThumbsManager);
        modifyThumbs(mutations, husot.thumbs.gameThumbsManager);
    });

    window.addEventListener('message', function (event) {
        if (!event.data.direction)
            return;

        if (event.data.direction === 'husot-message-gotThumbnailData') {
            var messageData = JSON.parse(event.data.message);

            // Initial checks
            if (typeof messageData.thumbsData === 'undefined')
                throw Error('Thumbs data was not fetched from the page.');

            if (typeof messageData.thumbsManagerId === 'undefined')
                throw Error('Thumbs manager was not returned from the page.');

            var thumbManager = getThumbManagerById(messageData.thumbsManagerId);
            thumbManager.hideThumbs(messageData.thumbsData);
        };

        
        if (event.data.direction === 'husot-message-gotThumbnailData-full') {
            var messageData = JSON.parse(event.data.message);

            // Initial checks
            if (typeof messageData.thumbsData === 'undefined')
                throw Error('Thumbs data was not fetched from the page.');

            if (typeof messageData.thumbsManagerId === 'undefined')
                throw Error('Thumbs manager was not returned from the page.');

            var thumbManager = getThumbManagerById(messageData.thumbsManagerId);
            thumbManager.hideAndShowThumbs(messageData.thumbsData);
        };
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

        // Make thumbs transparent upon adding so they don't blink during hiding process
        fadeOutNewThumbs(mutations, thumbsManager.getDomListnerThumbSelector());

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

    function fadeOutNewThumbs(mutations, selector) {
        mutations.forEach(function (item) {
            $(item.addedNodes).find(selector).css('opacity', '0');
        });
    }

    function getThumbnailData(thumbsManager) {
        var messageData = {
            thumbsSelector: thumbsManager.getDomListnerThumbSelector(),
            thumbsManagerId: thumbsManager.getId(),
            callback: 'husot-message-gotThumbnailData'
        };

        window.postMessage({
            direction: 'husot-message-getThumbnailData',
            message: JSON.stringify(messageData)
        }, "*");
    }

    function getThumbManagerById(id) {
        if (id === 'DFC8B51A-EF8C-49D7-983F-01B3DCCA32B0')
            return husot.thumbs.streamThumbsManager;
        if (id === '63219B1B-1B1A-4D9E-BCBE-C37D90125099')
            return husot.thumbs.videoThumbsManager;
        if (id === '598E9D28-A8B0-4D7F-A6C5-1C9CD87E29E2')
            return husot.thumbs.gameThumbsManager;

        throw Error('Unknown thumb manager.');
    }

    return {
        start: start,
        isUrlAllowed: isUrlAllowed,
        getThumbnailData: getThumbnailData
    };
})();
