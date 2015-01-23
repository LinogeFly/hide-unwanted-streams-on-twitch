// Application start

var husot = husot || {};

husot.main = function () {
    // Run only in top frame
    if (window.top !== window.self) {
        return;
    }

    this.injector.addScripts();
    this.modalDialog.initOverlay();
    this.settingsWindow.create();
    this.domListener.start();
};

$(document).ready(function () {
    husot.main();
});
