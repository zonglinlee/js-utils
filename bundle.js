'use strict';

var typeCheck = {
    typeCheck: function (val) {
        var type = "";
        var result = Object.prototype.toString.apply(val);
        switch (result) {
            case "[object String]":
                type = 'string';
                break;
            case "[object Array]":
                type = 'array';
                break;
        }
        if (!type)
            throw new Error('unknownType');
        return type;
    }
};

typeCheck.typeCheck("hello");
