import { IIcNodeKindOf, ICompilerIcNode } from '../../core/icompiler_ic_node'

export default class CompilerAstNode implements ICompilerIcNode {
    constructor(private _kind_of:IIcNodeKindOf, private _type:string){}

	get_node_kindof():IIcNodeKindOf {
        return this._kind_of;
    }

	get_node_type():string {
        return this._type;
    }
}