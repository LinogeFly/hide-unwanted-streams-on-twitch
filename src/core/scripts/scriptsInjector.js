// Inject javaScript into main window

var husot = husot || {};
husot.injector = husot.injector || {};

husot.injector.addScripts = function () {
    var script = document.createElement('script');
    script.textContent = '{{APP_EMBEDDED_INJECT_SCRIPTS}}';
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
};
