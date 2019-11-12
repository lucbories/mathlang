import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import { AST_SWITCH_SRC_1, AST_SWITCH_JSON_1 } from './math_lang_parser_3_switch_code_1.test';


const EMPTY_ARRAY = <any>[];

describe('MathLang switch parser', () => {
    const compiler = new MathLangCompiler();

    const src_code_1 = AST_SWITCH_SRC_1;
    it('Parse [' + src_code_1 + '] statement' , () => {
        compiler.reset();
        const text = src_code_1;
        const result = compiler.compile_ast(text, 'blockStatement');

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
        // compiler.dump_tree('ast', compiler_ast);

        // TEST AST
        const expected_ast = AST_SWITCH_JSON_1(compiler);
        expect(compiler_ast).eql(expected_ast);
    });


    // const src_code_2 = AST_SWITCH_SRC_2;
    // it('Parse [' + src_code_2 + '] statement' , () => {
    //     compiler.reset();
    //     const text = src_code_2;
    //     const result = compiler.compile_ast(text, 'blockStatement');

    //     // ERRORS
    //     const expected_errors = 0;
    //     const errors = compiler.get_errors();
    //     if (errors.length != expected_errors){
    //         const errors = compiler.get_errors();
    //         console.log('errors', errors);

    //         // GET AST
    //         const compiler_ast = compiler.get_ast();
    //         compiler.dump_tree('ast', compiler_ast);

    //         expect(errors.length).equals(expected_errors);
    //         return;
    //     }
        
    //     // GET AST
    //     const compiler_ast = compiler.get_ast();
    //     // console.log('compiler_ast', compiler_ast);
    //     // compiler.dump_tree('ast', compiler_ast);

    //     // TEST AST
    //     const compiler_ast_json = JSON.stringify(compiler_ast);
    //     const compiler_ast_json_parsed = JSON.parse(compiler_ast_json);
    //     const expected_ast = JSON.parse(AST_SWITCH_JSON_2)
    //     expect(compiler_ast_json_parsed).eql(expected_ast);
    // });
});