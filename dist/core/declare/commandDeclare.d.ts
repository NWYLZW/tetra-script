/**
 * @desc   commandDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file commandDeclare.js
 */
import VarDeclare from "./varDeclare";
import ModuleDeclare from "./moduleDeclare";
export default class CommandDeclare {
    deep: number;
    name: String;
    children: Array<ModuleDeclare | VarDeclare>;
    constructor(deep: number, name: String);
    appendChild(child: ModuleDeclare | VarDeclare): void;
    appendChildren(children: Array<ModuleDeclare | VarDeclare>): void;
    toString(indent: number): string;
    static compile(str: String, deep?: number): Array<ModuleDeclare | VarDeclare>;
}
