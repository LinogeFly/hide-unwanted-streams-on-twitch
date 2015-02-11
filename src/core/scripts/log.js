// Log manager

var husot = husot || {};
husot.log = husot.log || {};

husot.log.info = function (obj) {
    console.log('HUSOT: ' + obj);
};

husot.log.error = function (obj) {
    console.error('HUSOT: ' + obj);
};

husot.log.debug = function (obj) {
    if (typeof husot.debug === 'undefined') {
        return;
    }

    console.log('HUSOT DEBUG: ' + obj);
};
