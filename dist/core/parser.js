"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc   parser.ts
 * @author yijie
 * @date   2021-01-30
 * @note   yijie 2021-01-30 Created the file parser.ts
 */
const moduleDeclare_1 = __importDefault(require("./declare/moduleDeclare"));
class Parser {
    static compile(str, deep = 0) {
        if (str[str.length - 1] === '\n') {
            str = str.slice(0, str.length - 1);
        }
        return moduleDeclare_1.default.compile(str, deep);
    }
}
exports.default = Parser;
