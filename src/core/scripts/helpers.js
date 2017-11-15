// Helper functions

if (!String.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
};

if (!String.trimSlash) {
    String.prototype.trimSlash = function () {
        return this.replace(/^\/|\/$/g, '');
    };
};
