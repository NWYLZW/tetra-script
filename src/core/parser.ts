/**
 * @desc   parser.ts
 * @author yijie
 * @date   2021-01-30
 * @note   yijie 2021-01-30 Created the file parser.ts
 */
import ModuleDeclare from "./declare/moduleDeclare";

export default class Parser {
  static compile(str: String, deep: number = 0): ModuleDeclare {
    if (str[str.length - 1] === '\n') {
      str = str.slice(0, str.length - 1);
    }
    return ModuleDeclare.compile(str, deep);
  }
}
