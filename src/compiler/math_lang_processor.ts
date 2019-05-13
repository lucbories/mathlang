
import { math_lang_lexer, math_lang_parser } from './1-cst-builder/math_lang_parser';
import MathLangCstToAstVisitor from './2-ast-builder/math_lang_cst_to_ast_visitor';



export default function(text:string, throw_errors:boolean=true, rule_name:string='program') {
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
        math_lang_cst_to_ast_visitor = new MathLangCstToAstVisitor();
        ast = math_lang_cst_to_ast_visitor.visit(cst);
//        const t=1;
    }

    return {
        cst:cst,
        ast:ast,
        ast_scopes_map:math_lang_cst_to_ast_visitor ? math_lang_cst_to_ast_visitor.get_scopes_map() : undefined,
        // ir_text:'',
        // ir_code:<any>[],
        lexErrors: lexResult.errors,
        parseErrors: math_lang_parser.errors,
        ast_errors: math_lang_cst_to_ast_visitor ? math_lang_cst_to_ast_visitor.get_errors() : []
        // ictErrors:<any>undefined
    }
}