"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc   commandDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file commandDeclare.js
 */
const varDeclare_1 = __importDefault(require("./varDeclare"));
const moduleDeclare_1 = __importDefault(require("./moduleDeclare"));
class CommandDeclare {
    constructor(deep, name) {
        this.deep = -1;
        this.name = '';
        this.children = [];
        this.deep = deep;
        this.name = name;
    }
    appendChild(child) {
        this.children.push(child);
    }
    appendChildren(children) {
        this.children.push(...children);
    }
    toString(indent) {
        if (this.children.length > 0) {
            let childStr = '';
            this.children.forEach((child, index) => {
                if (child instanceof varDeclare_1.default) {
                    childStr += `${child.toString()}`;
                }
                else {
                    childStr += '{\n' +
                        child.toString(indent) +
                        '\n' + ' '.repeat(indent * (this.deep - 1)) + '}';
                }
                if (index !== this.children.length - 1) {
                    childStr += ', ';
                }
            });
            return `${this.name}: ${childStr};`;
        }
        else {
            return `${this.name};`;
        }
    }
    static compile(str, deep = 0) {
        const compileDeclares = [];
        const stack = [];
        let childStr = '', quotationMarks = false;
        const isVar = () => {
            return stack.length === 0;
        };
        const inChild = () => {
            return stack.length > 0;
        };
        const defaultFun = (ch) => {
            childStr += ch;
        };
        const dealVar = (ch, isEnd) => {
            if (isEnd || (!isVar() && ch == ','))
                defaultFun(ch);
            if (childStr === '')
                return;
            if (isVar()) {
                if (childStr[0] === '"' || childStr[0] == "'") {
                    childStr = childStr.slice(1, childStr.length - 1);
                }
                compileDeclares.push(varDeclare_1.default.compile(childStr));
                childStr = '';
            }
        };
        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            const isEnd = i === str.length - 1;
            if (!isVar()
                && (ch === '}' || isEnd)) {
                if (stack.length > 1) {
                    defaultFun(ch);
                }
                stack.pop();
                if (stack.length === 0) {
                    compileDeclares.push(moduleDeclare_1.default.compile(childStr, deep));
                    childStr = '';
                }
                continue;
            }
            if (ch === ',' || isEnd) {
                dealVar(ch, isEnd);
                continue;
            }
            if (ch === '\"' && !inChild()) {
                quotationMarks = !quotationMarks;
            }
            if (ch === '{' && !quotationMarks) {
                dealVar(ch, isEnd);
                if (!isVar() || childStr === '') {
                    stack.push(ch);
                    if (stack.length > 1) {
                        defaultFun(ch);
                    }
                }
                else {
                    defaultFun(ch);
                }
            }
            else {
                // 不是变量跳过
                if (ch === ' ' && !isVar() && !inChild()) {
                    break;
                }
                defaultFun(ch);
            }
        }
        return compileDeclares;
    }
}
exports.default = CommandDeclare;
