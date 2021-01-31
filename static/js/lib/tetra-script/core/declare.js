define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModuleDeclare = exports.Declare = exports.VarDeclare = exports.VarDeclareType = void 0;
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
    exports.VarDeclare = VarDeclare;
    var Declare = (function () {
        function Declare(deep, name) {
            this.deep = -1;
            this.name = '';
            this.children = [];
            this.deep = deep;
            this.name = name;
        }
        Declare.prototype.appendChild = function (child) {
            this.children.push(child);
        };
        Declare.prototype.appendChildren = function (children) {
            var _a;
            (_a = this.children).push.apply(_a, children);
        };
        Declare.prototype.toString = function (indent) {
            var _this = this;
            if (this.children.length > 0) {
                var childStr_1 = '';
                this.children.forEach(function (child, index) {
                    if (child instanceof VarDeclare) {
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
        Declare.compile = function (str, deep) {
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
                    compileDeclares.push(VarDeclare.compile(childStr));
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
                        compileDeclares.push(ModuleDeclare.compile(childStr, deep));
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
        return Declare;
    }());
    exports.Declare = Declare;
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
                var command = new Declare(deep + 1, name);
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
                            curCommand.appendChildren(Declare.compile(content, deep + 1));
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
    exports.ModuleDeclare = ModuleDeclare;
});
