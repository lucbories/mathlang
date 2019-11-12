import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';


const EMPTY_ARRAY = <any>[];

describe('MathLang string parser', () => {
    const compiler = new MathLangCompiler();
    const type_string = compiler.get_scope().get_available_lang_type('STRING');

    it('Parse emty string' , () => {
        compiler.reset();
        const text = '\'\'';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_PRIMARY_STRING,
            ic_type: type_string,
            value:'\'\''
        }
        expect(compiler_ast).eql(expected_ast);
    });
    

    it('Parse simple string' , () => {
        compiler.reset();
        const text = '\'hello\'';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_PRIMARY_STRING,
            ic_type: type_string,
            value:'\'hello\''
        }
        expect(compiler_ast).eql(expected_ast);
    });
});