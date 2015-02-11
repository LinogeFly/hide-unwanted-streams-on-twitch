// Embedded CSS styles

(function () {
    // Run only in top frame
    if (window.top !== window.self) {
        return;
    }

    var style = document.createElement('style');
    style.textContent = '{{APP_EMBEDDED_STYLES}}';
    (document.head || document.documentElement).appendChild(style);
})();
