/**
 * @desc   commandDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file commandDeclare.js
 */
import VarDeclare from "./varDeclare";
import ModuleDeclare from "./moduleDeclare";

export default class CommandDeclare {
  public deep: number = -1;
  public name: String = '';
  public children: Array<ModuleDeclare | VarDeclare> = [];

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
