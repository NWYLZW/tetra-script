var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./declare/moduleDeclare"], function (require, exports, moduleDeclare_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    moduleDeclare_1 = __importDefault(moduleDeclare_1);
    var Parser = (function () {
        function Parser() {
        }
        Parser.compile = function (str, deep) {
            if (deep === void 0) { deep = 0; }
            if (str[str.length - 1] === '\n') {
                str = str.slice(0, str.length - 1);
            }
            return moduleDeclare_1.default.compile(str, deep);
        };
        return Parser;
    }());
    exports.default = Parser;
});
