define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VarDeclareType = void 0;
    var VarDeclareType;
    (function (VarDeclareType) {
        VarDeclareType[VarDeclareType["NUMBER"] = 0] = "NUMBER";
        VarDeclareType[VarDeclareType["STRING"] = 1] = "STRING";
        VarDeclareType[VarDeclareType["VARIABLE"] = 2] = "VARIABLE";
    })(VarDeclareType || (VarDeclareType = {}));
    exports.VarDeclareType = VarDeclareType;
    var VarDeclare = (function () {
        function VarDeclare(content, type) {
            this.type = undefined;
            this.content = '';
            this.type = type;
            this.content = content;
        }
        VarDeclare.prototype.toString = function () {
            if (this.type === VarDeclareType.STRING) {
                return "\"" + this.content + "\"";
            }
            return this.content;
        };
        VarDeclare.compile = function (str) {
            if (/^-?\d+\.?\d*$/.test(str)) {
                return new VarDeclare(str, VarDeclareType.NUMBER);
            }
            else if (/^\$[\s|\S]+$/.test(str)) {
                return new VarDeclare(str, VarDeclareType.VARIABLE);
            }
            return new VarDeclare(str, VarDeclareType.STRING);
        };
        return VarDeclare;
    }());
    exports.default = VarDeclare;
});
