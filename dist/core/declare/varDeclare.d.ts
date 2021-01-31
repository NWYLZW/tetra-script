declare enum VarDeclareType {
    NUMBER = 0,
    STRING = 1,
    VARIABLE = 2
}
export { VarDeclareType };
export default class VarDeclare {
    type: VarDeclareType | undefined;
    content: String;
    constructor(content: String, type: VarDeclareType);
    toString(): String;
    static compile(str: string): VarDeclare;
}
