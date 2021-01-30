/**
 * @desc   moduleDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file moduleDeclare.js
 */
import CommandDeclare from "@/core/declare/commandDeclare";

export default class ModuleDeclare {
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
