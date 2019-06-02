import IType from '../../core/itype';

import { FunctionScope } from './math_lang_function_scope';

import MathLangAstToIcVisitorExpressions from './math_lang_ast_to_ic_builder_expressions';



/**
 * Typed AST Visitor class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIcVisitor extends MathLangAstToIcVisitorExpressions {

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(ast_functions:Map<string,FunctionScope>, types_map:Map<string,IType>) {
        super(ast_functions, types_map);
    }
}