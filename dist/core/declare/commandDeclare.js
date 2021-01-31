var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./varDeclare", "./moduleDeclare"], function (require, exports, varDeclare_1, moduleDeclare_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    varDeclare_1 = __importDefault(varDeclare_1);
    moduleDeclare_1 = __importDefault(moduleDeclare_1);
    var CommandDeclare = (function () {
        function CommandDeclare(deep, name) {
            this.deep = -1;
            this.name = '';
            this.children = [];
            this.deep = deep;
            this.name = name;
        }
        CommandDeclare.prototype.appendChild = function (child) {
            this.children.push(child);
        };
        CommandDeclare.prototype.appendChildren = function (children) {
            var _a;
            (_a = this.children).push.apply(_a, children);
        };
        CommandDeclare.prototype.toString = function (indent) {
            var _this = this;
            if (this.children.length > 0) {
                var childStr_1 = '';
                this.children.forEach(function (child, index) {
                    if (child instanceof varDeclare_1.default) {
                        childStr_1 += "" + child.toString();
                    }
                    else {
                        childStr_1 += '{\n' +
                            child.toString(indent) +
                            '\n' + ' '.repeat(indent * (_this.deep - 1)) + '}';
                    }
                    if (index !== _this.children.length - 1) {
                        childStr_1 += ', ';
                    }
                });
                return this.name + ": " + childStr_1 + ";";
            }
            else {
                return this.name + ";";
            }
        };
        CommandDeclare.compile = function (str, deep) {
            if (deep === void 0) { deep = 0; }
            var compileDeclares = [];
            var stack = [];
            var childStr = '', quotationMarks = false;
            var isVar = function () {
                return stack.length === 0;
            };
            var inChild = function () {
                return stack.length > 0;
            };
            var defaultFun = function (ch) {
                childStr += ch;
            };
            var dealVar = function (ch, isEnd) {
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
            for (var i = 0; i < str.length; i++) {
                var ch = str[i];
                var isEnd = i === str.length - 1;
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
                    if (ch === ' ' && !isVar() && !inChild()) {
                        break;
                    }
                    defaultFun(ch);
                }
            }
            return compileDeclares;
        };
        return CommandDeclare;
    }());
    exports.default = CommandDeclare;
});
