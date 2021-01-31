define(["require", "exports", "./declare"], function (require, exports, declare_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parser = (function () {
        function Parser() {
        }
        Parser.compile = function (str, deep) {
            if (deep === void 0) { deep = 0; }
            if (str[str.length - 1] === '\n') {
                str = str.slice(0, str.length - 1);
            }
            return declare_1.ModuleDeclare.compile(str, deep);
        };
        return Parser;
    }());
    exports.default = Parser;
});
