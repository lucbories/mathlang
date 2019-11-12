import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';


const EMPTY_ARRAY = <any>[];

describe('MathLang call parser', () => {
    const compiler = new MathLangCompiler();

    const type_unknow = compiler.get_scope().get_available_lang_type('UNKNOW');
    const type_boolean = compiler.get_scope().get_available_lang_type('BOOLEAN');
    const type_string = compiler.get_scope().get_available_lang_type('STRING');
    const type_integer = compiler.get_scope().get_available_lang_type('INTEGER');
    const type_biginteger = compiler.get_scope().get_available_lang_type('BIGINTEGER');
    const type_float = compiler.get_scope().get_available_lang_type('FLOAT');
    const type_bigfloat = compiler.get_scope().get_available_lang_type('BIGFLOAT');

    it('Parse f() statement' , () => {
        compiler.reset();
        const text = 'f()';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 1;
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
            type:AST.EXPR_MEMBER_FUNC_CALL,
            ic_type: type_unknow,
            name:'f',
            members:EMPTY_ARRAY,
            operands_expressions:EMPTY_ARRAY,
            operands_types:EMPTY_ARRAY
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse fx(23) statement' , () => {
        compiler.reset();
        const text = 'fx(23)';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 1;
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
            type:AST.EXPR_MEMBER_FUNC_CALL,
            ic_type: type_unknow,
            name:'fx',
            members:EMPTY_ARRAY,
            operands_expressions:[
                {
                    type:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:type_integer,
                    value:'23'
                }
            ],
            operands_types:[type_integer]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse fx(,) statement' , () => {
        compiler.reset();
        const text = 'fx(,)';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);
        }
        expect(errors.length).equals(expected_errors);
    });


    it('Parse fx(,23) statement' , () => {
        compiler.reset();
        const text = 'fx(,23)';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);
        }
        expect(errors.length).equals(expected_errors);
    });


    it('Parse fx(23,) statement' , () => {
        compiler.reset();
        const text = 'fx(23,)';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);
        }
        expect(errors.length).equals(expected_errors);
    });


    it('Parse fx(23, efg) statement' , () => {
        compiler.reset();
        const text = 'fx(23, efg)';
        const result = compiler.compile_ast(text, 'expression');

        // ERRORS
        const expected_errors = 1;
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
            type:AST.EXPR_MEMBER_FUNC_CALL,
            ic_type: type_unknow,
            name:'fx',
            members:EMPTY_ARRAY,
            operands_expressions:[
                {
                    type:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:type_integer,
                    value:'23'
                },
                {
                    type:AST.EXPR_MEMBER_ID,
                    ic_type:type_unknow,
                    name:'efg',
                    members:EMPTY_ARRAY
                }
            ],
            operands_types:[type_integer, type_unknow]
        }
        expect(compiler_ast).eql(expected_ast);
    });
});