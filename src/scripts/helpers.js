// Helper functions

if (!String.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
};

if (!String.startsWith) {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) == str;
    };
};

if (!jQuery.expr[':'].containsIgnoreCase) {
    jQuery.expr[':'].containsIgnoreCase = function (a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
};
