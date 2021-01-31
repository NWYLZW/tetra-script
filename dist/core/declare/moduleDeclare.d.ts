/**
 * @desc   moduleDeclare.js
 * @author yijie
 * @date   2021-01-31
 * @note   yijie 2021-01-31 Created the file moduleDeclare.js
 */
import CommandDeclare from "./commandDeclare";
export default class ModuleDeclare {
    deep: number;
    commandDeclares: Array<CommandDeclare>;
    constructor(deep?: number, commandDeclares?: Array<CommandDeclare>);
    push(...items: CommandDeclare[]): void;
    toString(indent: number): string;
    static compile(str: String, deep?: number): ModuleDeclare;
}
