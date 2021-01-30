/**
 * @desc   varDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file varDeclare.js
 */

enum VarDeclareType {
  NUMBER,
  STRING,
  VARIABLE
}

export {
  VarDeclareType
}

export default class VarDeclare {
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
