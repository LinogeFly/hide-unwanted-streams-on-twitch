// Exceptions

var husot = husot || {};
husot.exceptions = husot.exceptions || {};

husot.exceptions.abstractFunctionCall = function () {
    return 'Cannot call abstract function'
};

husot.exceptions.notImplemented = function () {
    return 'Method or operation is not implemented'
};

husot.exceptions.argumentNullOrEmpty = function (argumentName) {
    return 'Argument "{0}" is undefined or empty'.format(argumentName);
};

husot.exceptions.argumentOneElementExpected = function (argumentName) {
    return 'More than one element in argument "{0}"'.format(argumentName);
};

husot.exceptions.elementNotFound = function (elementName) {
    return '{0} not found. CSS selector must be broken.'.format(elementName);
};

husot.exceptions.elementNotFoundFor = function (elementName, forName) {
    return '{0} not found for {1}. CSS selector must be broken.'.format(elementName, forName);
};
