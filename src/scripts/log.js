// Log manager

var husot = husot || {};
husot.log = husot.log || {};

husot.log.info = function (obj) {
    console.log('HUSOT: ' + obj);
};

husot.log.error = function (obj) {
    console.log('%cHUSOT: ' + obj, 'color: #ff0000');
};

husot.log.debug = function (obj) {
    if (typeof husot.debug === 'undefined') {
        return;
    }

    console.log('HUSOT DEBUG: ' + obj);
}
