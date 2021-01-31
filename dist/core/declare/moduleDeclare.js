"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc   moduleDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file moduleDeclare.js
 */
const commandDeclare_1 = __importDefault(require("./commandDeclare"));
class ModuleDeclare {
    constructor(deep = 0, commandDeclares = []) {
        this.deep = deep;
        this.commandDeclares = commandDeclares;
    }
    push(...items) {
        this.commandDeclares.push(...items);
    }
    toString(indent) {
        const commandDeclaresLines = [];
        this.commandDeclares.forEach(commandDeclare => {
            commandDeclaresLines.push(' '.repeat(indent * this.deep) + commandDeclare.toString(indent));
        });
        return commandDeclaresLines.join('\n');
    }
    static compile(str, deep = 0) {
        const root = new ModuleDeclare(deep), stack = [];
        let name = '', content = '', curCommand = undefined;
        let quotationMarks = false, isChild = false;
        const defaultFun = (char) => {
            if (curCommand === undefined) {
                name += char;
            }
            else {
                content += char;
            }
        };
        const createCurCommand = () => {
            isChild = true;
            const command = new commandDeclare_1.default(deep + 1, name);
            root.push(command);
            name = '';
            return command;
        };
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            const isEnd = i === str.length - 1;
            if (ch === ';' || isEnd) {
                if (stack.length === 0
                    || (ch === '}' && stack.length === 1)) {
                    if (ch !== ';' && ch !== '\n')
                        defaultFun(ch);
                    if (curCommand === undefined) {
                        curCommand = createCurCommand();
                    }
                    if (content !== '') {
                        curCommand.appendChildren(commandDeclare_1.default.compile(content, deep + 1));
                    }
                    content = '';
                    isChild = false;
                    curCommand = undefined;
                    continue;
                }
            }
            switch (ch) {
                case '\n':
                case '\r':
                    break;
                case '{':
                    stack.push('{');
                    defaultFun(ch);
                    break;
                case '}':
                    stack.pop();
                    defaultFun(ch);
                    break;
                case '"':
                    quotationMarks = !quotationMarks;
                    defaultFun(ch);
                    break;
                case ':':
                    if (isChild) {
                        defaultFun(ch);
                    }
                    else {
                        curCommand = createCurCommand();
                    }
                    break;
                default:
                    if (ch === ' ' && !quotationMarks) {
                        break;
                    }
                    defaultFun(ch);
            }
        }
        return root;
    }
}
exports.default = ModuleDeclare;
