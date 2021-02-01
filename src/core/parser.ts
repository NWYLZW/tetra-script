/**
 * @desc   parser.ts
 * @author yijie
 * @date   2021-01-30
 * @note   yijie 2021-01-30 Created the file parser.ts
 */
import { ModuleDeclare } from "./declare";

export default class Parser {
  static compile(str: String, deep: number = 0): ModuleDeclare {
    str = str.trim();
    return ModuleDeclare.compile(str, deep);
  }
}
