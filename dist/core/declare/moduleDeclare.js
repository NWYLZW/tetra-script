var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./commandDeclare"], function (require, exports, commandDeclare_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    commandDeclare_1 = __importDefault(commandDeclare_1);
    var ModuleDeclare = (function () {
        function ModuleDeclare(deep, commandDeclares) {
            if (deep === void 0) { deep = 0; }
            if (commandDeclares === void 0) { commandDeclares = []; }
            this.deep = deep;
            this.commandDeclares = commandDeclares;
        }
        ModuleDeclare.prototype.push = function () {
            var _a;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            (_a = this.commandDeclares).push.apply(_a, items);
        };
        ModuleDeclare.prototype.toString = function (indent) {
            var _this = this;
            var commandDeclaresLines = [];
            this.commandDeclares.forEach(function (commandDeclare) {
                commandDeclaresLines.push(' '.repeat(indent * _this.deep) + commandDeclare.toString(indent));
            });
            return commandDeclaresLines.join('\n');
        };
        ModuleDeclare.compile = function (str, deep) {
            if (deep === void 0) { deep = 0; }
            var root = new ModuleDeclare(deep), stack = [];
            var name = '', content = '', curCommand = undefined;
            var quotationMarks = false, isChild = false;
            var defaultFun = function (char) {
                if (curCommand === undefined) {
                    name += char;
                }
                else {
                    content += char;
                }
            };
            var createCurCommand = function () {
                isChild = true;
                var command = new commandDeclare_1.default(deep + 1, name);
                root.push(command);
                name = '';
                return command;
            };
            for (var i = 0; i < str.length; i++) {
                var ch = str[i];
                var isEnd = i === str.length - 1;
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
        };
        return ModuleDeclare;
    }());
    exports.default = ModuleDeclare;
});
