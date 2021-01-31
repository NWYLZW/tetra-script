"use strict";
/**
 * @desc   varDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file varDeclare.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarDeclareType = void 0;
var VarDeclareType;
(function (VarDeclareType) {
    VarDeclareType[VarDeclareType["NUMBER"] = 0] = "NUMBER";
    VarDeclareType[VarDeclareType["STRING"] = 1] = "STRING";
    VarDeclareType[VarDeclareType["VARIABLE"] = 2] = "VARIABLE";
})(VarDeclareType || (VarDeclareType = {}));
exports.VarDeclareType = VarDeclareType;
class VarDeclare {
    constructor(content, type) {
        this.type = undefined;
        this.content = '';
        this.type = type;
        this.content = content;
    }
    toString() {
        if (this.type === VarDeclareType.STRING) {
            return `"${this.content}"`;
        }
        return this.content;
    }
    static compile(str) {
        if (/^-?\d+\.?\d*$/.test(str)) {
            return new VarDeclare(str, VarDeclareType.NUMBER);
        }
        else if (/^\$[\s|\S]+$/.test(str)) {
            return new VarDeclare(str, VarDeclareType.VARIABLE);
        }
        return new VarDeclare(str, VarDeclareType.STRING);
    }
}
exports.default = VarDeclare;
