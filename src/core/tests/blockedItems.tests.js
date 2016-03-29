var husot = husot || {};
husot.tests = husot.tests || {};
husot.tests.blockedItems = husot.tests.blockedItems || {};

husot.tests.blockedItems.runAll = function () {
    var self = this;

    self.runTest(self.should_list_default_value_if_empty);

    self.runTest(self.should_list_for_string_array);
    self.runTest(self.should_add_for_string_array);
    self.runTest(self.should_add_nothing_if_already_exists_for_string_array);
    self.runTest(self.should_remove_for_string_array);
    self.runTest(self.should_remove_nothing_if_doesnt_exist_for_string_array);

    self.runTest(self.should_list_for_objects_with_name);
    self.runTest(self.should_add_for_objects_with_name);
    self.runTest(self.should_add_nothing_if_already_exists_for_objects_with_name);
    self.runTest(self.should_remove_for_objects_with_name);
    self.runTest(self.should_remove_nothing_if_doesnt_exist_for_objects_with_name);
};

husot.tests.blockedItems.runTest = function (test) {
    test(husot.tests.settingsProvider);
};

husot.tests.blockedItems.should_list_default_value_if_empty = function (provider) {
    var key = 'should_list_default_value_if_empty';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        settings.list(function (items) {
            if (Object.prototype.toString.call(items) !== '[object Array]') {
                husot.tests.fail();
            }
            if (items.length !== 0) {
                husot.tests.fail();
            }
        });
    });
};

husot.tests.blockedItems.should_list_for_string_array = function (provider) {
    var key = 'should_list_for_string_array';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '["item1", "item2"]', function () {
            settings.list(function (items) {
                if (items.length !== 2) {
                    husot.tests.fail();
                }
                if (items[0] !== 'item1') {
                    husot.tests.fail();
                }
                if (items[1] !== 'item2') {
                    husot.tests.fail();
                }
            });
        });
    });
};

husot.tests.blockedItems.should_add_for_string_array = function (provider) {
    var key = 'should_add_for_string_array';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '["item1", "item2"]', function () {
            settings.add('item3', function () {
                settings.list(function (items) {
                    if (items.length !== 3) {
                        husot.tests.fail();
                    }
                    if (items[0] !== 'item1') {
                        husot.tests.fail();
                    }
                    if (items[1] !== 'item2') {
                        husot.tests.fail();
                    }
                    if (items[2] !== 'item3') {
                        husot.tests.fail();
                    }
                });
            });
        });
    });
};

husot.tests.blockedItems.should_add_nothing_if_already_exists_for_string_array = function (provider) {
    var key = 'should_add_nothing_if_already_exists_for_string_array';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '["item1", "item2"]', function () {
            settings.add('item3', function () {
                settings.add('item3', function () {
                    settings.list(function (items) {
                        if (items.length !== 3) {
                            husot.tests.fail();
                        }
                        if (items[0] !== 'item1') {
                            husot.tests.fail();
                        }
                        if (items[1] !== 'item2') {
                            husot.tests.fail();
                        }
                        if (items[2] !== 'item3') {
                            husot.tests.fail();
                        }
                    });
                });
            });
        });
    });
};

husot.tests.blockedItems.should_remove_for_string_array = function (provider) {
    var key = 'should_remove_for_string_array';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '["item1", "item2"]', function () {
            settings.remove('item1', function () {
                settings.list(function (items) {
                    if (items.length !== 1) {
                        husot.tests.fail();
                    }
                    if (items[0] !== 'item2') {
                        husot.tests.fail();
                    }
                });
            });
        });
    });
};

husot.tests.blockedItems.should_remove_nothing_if_doesnt_exist_for_string_array = function (provider) {
    var key = 'should_remove_nothing_if_doesnt_exist_for_string_array';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '["item1", "item2"]', function () {
            settings.remove('item3', function () {
                settings.list(function (items) {
                    if (items.length !== 2) {
                        husot.tests.fail();
                    }
                    if (items[0] !== 'item1') {
                        husot.tests.fail();
                    }
                    if (items[1] !== 'item2') {
                        husot.tests.fail();
                    }
                });
            });
        });
    });
};

// Backward compatibility tests
// Previously, items in block list were stored as objects with 'name' property.
// So the following tests are to make sure that functional is workimg for block list items that were stored in old format.

husot.tests.blockedItems.should_list_for_objects_with_name = function (provider) {
    var key = 'should_list_for_objects_with_name';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '[{"name":"item1"},{"name":"item2"}]', function () {
            settings.list(function (items) {
                if (items.length !== 2) {
                    husot.tests.fail();
                }
                if (items[0] !== 'item1') {
                    husot.tests.fail();
                }
                if (items[1] !== 'item2') {
                    husot.tests.fail();
                }
            });
        });
    });
};

husot.tests.blockedItems.should_add_for_objects_with_name = function (provider) {
    var key = 'should_add_for_objects_with_name';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '[{"name":"item1"},{"name":"item2"}]', function () {
            settings.add('item3', function () {
                settings.list(function (items) {
                    if (items.length !== 3) {
                        husot.tests.fail();
                    }
                    if (items[0] !== 'item1') {
                        husot.tests.fail();
                    }
                    if (items[1] !== 'item2') {
                        husot.tests.fail();
                    }
                    if (items[2] !== 'item3') {
                        husot.tests.fail();
                    }
                });
            });
        });
    });
};

husot.tests.blockedItems.should_add_nothing_if_already_exists_for_objects_with_name = function (provider) {
    var key = 'should_add_nothing_if_already_exists_for_objects_with_name';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '[{"name":"item1"},{"name":"item2"}]', function () {
            settings.add('item3', function () {
                settings.add('item3', function () {
                    settings.list(function (items) {
                        if (items.length !== 3) {
                            husot.tests.fail();
                        }
                        if (items[0] !== 'item1') {
                            husot.tests.fail();
                        }
                        if (items[1] !== 'item2') {
                            husot.tests.fail();
                        }
                        if (items[2] !== 'item3') {
                            husot.tests.fail();
                        }
                    });
                });
            });
        });
    });
};

husot.tests.blockedItems.should_remove_for_objects_with_name = function (provider) {
    var key = 'should_remove_for_objects_with_name';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '[{"name":"item1"},{"name":"item2"}]', function () {
            settings.remove('item1', function () {
                settings.list(function (items) {
                    if (items.length !== 1) {
                        husot.tests.fail();
                    }
                    if (items[0] !== 'item2') {
                        husot.tests.fail();
                    }
                });
            });
        });
    });
};

husot.tests.blockedItems.should_remove_nothing_if_doesnt_exist_for_objects_with_name = function (provider) {
    var key = 'should_remove_nothing_if_doesnt_exist_for_objects_with_name';

    provider.clear(function () {
        var settings = new husot.settings.BlockedItems(key);
        provider.set(key, '[{"name":"item1"},{"name":"item2"}]', function () {
            settings.remove('item3', function () {
                settings.list(function (items) {
                    if (items.length !== 2) {
                        husot.tests.fail();
                    }
                    if (items[0] !== 'item1') {
                        husot.tests.fail();
                    }
                    if (items[1] !== 'item2') {
                        husot.tests.fail();
                    }
                });
            });
        });
    });
};
