/**
 * @desc   parser.ts
 * @author yijie
 * @date   2021-01-30
 * @note   yijie 2021-01-30 Created the file parser.ts
 */

/*
class module = `
  commandName: {}, {}, ...;
  ...;
`
*/

enum VarDeclareType {
  NUMBER,
  STRING,
  VARIABLE
}

class VarDeclare {
  public type: VarDeclareType | undefined = undefined;
  public content: String = '';

  constructor(content: String, type: VarDeclareType) {
    this.type = type;
    this.content = content;
  }

  toString() {
    if (this.type === VarDeclareType.STRING) {
      return `"${this.content}"`;
    }
    return this.content;
  }

  static compile(str: string): VarDeclare {
    if (/^-?\d+\.?\d*$/.test(str)) {
      return new VarDeclare(str, VarDeclareType.NUMBER);
    } else if (/^\$[\s|\S]+$/.test(str)) {
      return new VarDeclare(str, VarDeclareType.VARIABLE);
    }
    return new VarDeclare(str, VarDeclareType.STRING);
  }
}

class CommandDeclare {
  public deep: number = -1;
  public name: String = '';
  public children: Array<ModuleDeclare| VarDeclare> = [];

  constructor(deep: number, name: String) {
    this.deep = deep;
    this.name = name;
  }

  appendChild(child: ModuleDeclare | VarDeclare) {
    this.children.push(child);
  }

  appendChildren(children: Array<ModuleDeclare | VarDeclare>) {
    this.children.push(...children);
  }

  toString(indent: number) {
    if (this.children.length > 0) {
      let childStr = '';
      this.children.forEach((child, index) => {
        if (child instanceof VarDeclare) {
          childStr += `${child.toString()}`;
        } else {
          childStr += '{\n' +
            child.toString(indent) +
            '\n' + ' '.repeat(indent * (this.deep - 1)) + '}';
        }
        if (index !== this.children.length - 1) {
          childStr += ', '
        }
      });
      return `${this.name}: ${childStr};`;
    } else {
      return `${this.name};`;
    }
  }

  static compile(str: String, deep: number = 0): Array<ModuleDeclare | VarDeclare> {
    const compileDeclares: Array<ModuleDeclare | VarDeclare> = [];
    const stack: Array<String> = [];
    let childStr = '', quotationMarks = false;

    const isVar = (): boolean => {
      return stack.length === 0;
    };
    const inChild = (): boolean => {
      return stack.length > 0;
    };
    const defaultFun = (ch) => {
      childStr += ch;
    };
    const dealVar = (ch, isEnd) => {
      if (isEnd || (!isVar() && ch == ','))
        defaultFun(ch);
      if (childStr === '') return;
      if (isVar()) {
        if (childStr[0] === '"' || childStr[0] == "'") {
          childStr = childStr.slice(1, childStr.length - 1)
        }
        compileDeclares.push(
          VarDeclare.compile(childStr)
        );
        childStr = '';
      }
    }

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const isEnd = i === str.length - 1;
      if (
        !isVar()
        && (ch === '}' || isEnd)
      ) {
        if (stack.length > 1) {
          defaultFun(ch);
        }
        stack.pop();
        if (stack.length === 0) {
          compileDeclares.push(ModuleDeclare.compile(
            childStr, deep
          ));
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
        } else {
          defaultFun(ch);
        }
      } else {
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

class ModuleDeclare {
  deep: number;
  commandDeclares: Array<CommandDeclare>;

  constructor(
    deep: number = 0, commandDeclares: Array<CommandDeclare> = []
  ) {
    this.deep = deep;
    this.commandDeclares = commandDeclares;
  }

  push(...items: CommandDeclare[]) {
    this.commandDeclares.push(...items)
  }

  toString(indent: number) {
    const commandDeclaresLines: string[] = []
    this.commandDeclares.forEach(commandDeclare => {
      commandDeclaresLines.push(
        ' '.repeat(indent * this.deep) + commandDeclare.toString(indent)
      );
    });
    return commandDeclaresLines.join('\n')
  }

  static compile(str: String, deep: number = 0): ModuleDeclare {
    const
      root: ModuleDeclare = new ModuleDeclare(deep)
      , stack: Array<String> = [];
    let name = '', content = '', curCommand: CommandDeclare | undefined = undefined;

    let quotationMarks = false, isChild = false;
    const defaultFun = (char) => {
      if (curCommand === undefined) {
        name += char;
      } else {
        content += char;
      }
    };
    const createCurCommand = (): CommandDeclare => {
      isChild = true;
      const command = new CommandDeclare(deep + 1, name);
      root.push(command);
      name = '';
      return command;
    }

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const isEnd = i === str.length - 1;
      if (ch === ';' || isEnd) {
        if (
          stack.length === 0
          || (ch === '}' && stack.length === 1)
        ) {
          if (ch !== ';' && ch !== '\n') defaultFun(ch);

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
          } else {
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

export default class Parser {
  static compile(str: String, deep: number = 0): ModuleDeclare {
    return ModuleDeclare.compile(str);
  }
}

