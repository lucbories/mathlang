
import IType from '../core/itype';
import DEFAULT_TYPES from '../features/default_types';
import { math_lang_lexer, math_lang_parser } from './1-cst-builder/math_lang_parser';
import MathLangCstToAstVisitor from './2-ast-builder/math_lang_cst_to_ast_visitor';

import CompilerScope from './0-common/compiler_scope';
import ICompilerModule from '../core/icompiler_module';
import ICompilerType from '../core/icompiler_type';

import AVAILABLE_TYPES from './0-types/index';
import AVAILABLE_RUNTIMES from './0-runtimes/index';
import AVAILABLE_MODULES from './0-modules/index';



export default function(text:string, throw_errors:boolean=true, rule_name:string='program') {
    const compiler_scope = new CompilerScope(AVAILABLE_MODULES, AVAILABLE_TYPES, AVAILABLE_RUNTIMES);

    const lexResult = math_lang_lexer.tokenize(text)

    // setting a new input will RESET the parser instance's state.
    math_lang_parser.input = lexResult.tokens

    // any top level rule may be used as an entry point
    const parser:any = math_lang_parser;
    const cst = parser[rule_name]();
    let math_lang_cst_to_ast_visitor;
    let ast = undefined;

    if (math_lang_parser.errors.length > 0) {
        if (throw_errors) {
            throw Error(
                "Sad sad panda, parsing errors detected!\n" +
                math_lang_parser.errors[0].message
            )
        }
    } else {
        // Build AST
        const types_map = new Map<string,IType>();

        DEFAULT_TYPES.forEach(
            (loop_type)=>types_map.set(loop_type.get_name(), loop_type)
        );

        if (types_map.has('NUMBER')){
            types_map.set('INTEGER', types_map.get('NUMBER'));
            types_map.set('FLOAT', types_map.get('NUMBER'));
        }

        if (types_map.has('BIGNUMBER')){
            types_map.set('BIGINTEGER', types_map.get('BIGNUMBER'));
            types_map.set('BIGFLOAT', types_map.get('BIGNUMBER'));
        }
        
        math_lang_cst_to_ast_visitor = new MathLangCstToAstVisitor(compiler_scope);
        ast = math_lang_cst_to_ast_visitor.visit(cst);
//        const t=1;
    }

    return {
        cst:cst,
        ast:ast,
        ast_scopes_map:math_lang_cst_to_ast_visitor ? math_lang_cst_to_ast_visitor.get_compiler_scope() : undefined,
        // ir_text:'',
        // ir_code:<any>[],
        lexErrors: lexResult.errors,
        parseErrors: math_lang_parser.errors,
        ast_errors: math_lang_cst_to_ast_visitor ? math_lang_cst_to_ast_visitor.get_errors() : []
        // ictErrors:<any>undefined
    }
}