// Inject javaScript into main window (Chrome specific)

var husot = husot || {};
husot.injector = husot.injector || {};

husot.injector.addScripts = function () {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('injects.js');
    script.onload = function () {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(script);
};
