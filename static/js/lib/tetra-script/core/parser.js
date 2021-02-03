define(["require", "exports", "./declare"], function (require, exports, declare_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parser = (function () {
        function Parser() {
        }
        Parser.compile = function (str, deep) {
            if (deep === void 0) { deep = 0; }
            str = str.trim();
            return declare_1.ModuleDeclare.compile(str, deep);
        };
        return Parser;
    }());
    exports.default = Parser;
});
