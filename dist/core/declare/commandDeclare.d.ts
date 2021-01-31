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
