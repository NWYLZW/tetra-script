import CommandDeclare from "./commandDeclare";
export default class ModuleDeclare {
    deep: number;
    commandDeclares: Array<CommandDeclare>;
    constructor(deep?: number, commandDeclares?: Array<CommandDeclare>);
    push(...items: CommandDeclare[]): void;
    toString(indent: number): string;
    static compile(str: String, deep?: number): ModuleDeclare;
}
