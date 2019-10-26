import { IAstNodeKindOf, ICompilerAstNode } from '../../core/icompiler_ast_node'

export default class CompilerAstNode implements ICompilerAstNode {
    constructor(private _kind_of:IAstNodeKindOf, private _type:string){}

	get_node_kindof():IAstNodeKindOf {
        return this._kind_of;
    }

	get_node_type():string {
        return this._type;
    }
}