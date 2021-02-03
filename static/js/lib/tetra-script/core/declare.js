define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModuleDeclare = exports.CommandDeclare = exports.CommentDeclare = exports.VarDeclare = exports.VarDeclareType = void 0;
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
    var CommentDeclare = (function () {
        function CommentDeclare(content) {
            if (content === void 0) { content = ''; }
            this.content = content;
        }
        CommentDeclare.prototype.toString = function (indent) {
            return "//" + this.content;
        };
        return CommentDeclare;
    }());
    exports.CommentDeclare = CommentDeclare;
    var CommandDeclare = (function () {
        function CommandDeclare(deep, name, option) {
            if (option === void 0) { option = ''; }
            this.deep = -1;
            this.name = '';
            this.option = '';
            this.children = [];
            this.deep = deep;
            this.name = name;
            this.option = option;
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
                var childStr_1 = '', childrenLF_1 = true;
                if (this.option !== '') {
                    childrenLF_1 = false;
                }
                this.children.forEach(function (child, index) {
                    if (child instanceof VarDeclare) {
                        childStr_1 += "" + child.toString();
                    }
                    else {
                        if (childrenLF_1) {
                            childStr_1 += '{\n' +
                                child.toString(indent) +
                                '\n' + ' '.repeat(indent * (_this.deep - 1)) + '}';
                        }
                        else {
                            childStr_1 += "{ " + child.toString(0) + " }";
                        }
                    }
                    if (index !== _this.children.length - 1) {
                        childStr_1 += ', ';
                    }
                });
                if (this.option !== '') {
                    return "" + this.name + this.option + childStr_1 + ";";
                }
                else {
                    return this.name + ": " + childStr_1 + ";";
                }
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
                    defaultFun(ch);
                }
            }
            return compileDeclares;
        };
        return CommandDeclare;
    }());
    exports.CommandDeclare = CommandDeclare;
    var ModuleDeclare = (function () {
        function ModuleDeclare(deep, commandDeclares) {
            if (deep === void 0) { deep = 0; }
            if (commandDeclares === void 0) { commandDeclares = []; }
            this.deep = deep;
            this.childDeclares = commandDeclares;
        }
        ModuleDeclare.prototype.push = function () {
            var _a;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            (_a = this.childDeclares).push.apply(_a, items);
        };
        ModuleDeclare.prototype.toString = function (indent) {
            var _this = this;
            var commandDeclaresLines = [];
            this.childDeclares.forEach(function (commandDeclare) {
                commandDeclaresLines.push(' '.repeat(indent * _this.deep) + commandDeclare.toString(indent));
            });
            return commandDeclaresLines.join('\n');
        };
        ModuleDeclare.compile = function (str, deep) {
            if (deep === void 0) { deep = 0; }
            var root = new ModuleDeclare(deep), stack = [];
            var options = [
                '=', '<', '>', '!'
            ];
            var name = '', content = '', comment = '', curCommand = undefined;
            var quotationMarks = false, isChild = false;
            var defaultFun = function (char) {
                if (curCommand === undefined) {
                    name += char;
                }
                else {
                    content += char;
                }
            };
            var createCurCommand = function (option) {
                if (option === void 0) { option = ''; }
                isChild = true;
                var command = new CommandDeclare(deep + 1, name, option);
                root.push(command);
                name = '';
                return command;
            };
            var lineCommentLock = false;
            for (var i = 0; i < str.length; i++) {
                var ch = str[i];
                var isEnd = i === str.length - 1;
                if (lineCommentLock) {
                    if (!isChild) {
                        if (ch === '\n' || isEnd) {
                            if (isEnd && ch !== '\n') {
                                comment += ch;
                            }
                            root.childDeclares.push(new CommentDeclare(comment));
                            lineCommentLock = false;
                            comment = '';
                        }
                        comment += ch;
                        continue;
                    }
                    else {
                        if (ch === '\n' || isEnd) {
                            lineCommentLock = false;
                        }
                        defaultFun(ch);
                        continue;
                    }
                }
                if (!quotationMarks) {
                    if (i > 0 && ch === '/' && str[i - 1] === '/') {
                        lineCommentLock = true;
                        if (!isChild) {
                            name = name.slice(0, name.length - 1);
                            comment = '';
                            continue;
                        }
                    }
                }
                if (ch === ';' || isEnd) {
                    if (stack.length === 0
                        || (ch === '}' && stack.length === 1)) {
                        if (ch !== ';' && ch !== '\n')
                            defaultFun(ch);
                        if (curCommand === undefined) {
                            curCommand = createCurCommand();
                        }
                        if (content !== '') {
                            curCommand.appendChildren(CommandDeclare.compile(content, deep + 1));
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
                        if (lineCommentLock)
                            defaultFun(ch);
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
                    case '=':
                        if (!isChild && i > 1 && options.indexOf(str[i - 1]) !== -1) {
                            curCommand = createCurCommand(ch);
                        }
                        else {
                            defaultFun(ch);
                        }
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
                        if (ch === ' ' && !quotationMarks && !lineCommentLock) {
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
