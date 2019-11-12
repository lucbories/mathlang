import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;


import MathLangCompiler from '../../../../compiler/math_lang_compiler';


describe('MathLang number parser', () => {
    const compiler = new MathLangCompiler();

    const type_integer = compiler.get_scope().get_available_lang_type('INTEGER');
    const type_biginteger = compiler.get_scope().get_available_lang_type('BIGINTEGER');
    const type_float = compiler.get_scope().get_available_lang_type('FLOAT');
    const type_bigfloat = compiler.get_scope().get_available_lang_type('BIGFLOAT');

    it('Parse positive simple integer' , () => {
        const text = '123';

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
            type:'INTEGER',
            ic_type:type_integer,
            value:text
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse positive big integer' , () => {
        const text = '1234567890145';

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
            type:'BIGINTEGER',
            ic_type:type_biginteger,
            value:text
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse negative simple integer' , () => {
        const text = '-123';

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
            type:'PREUNOP_EXPRESSION',
            ic_type:type_integer,
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'INTEGER',
                ic_type:type_integer,
                value:text.substr(1)
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse negative simple integer' , () => {
        const text = '-123e77';

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
            type:'PREUNOP_EXPRESSION',
            ic_type:type_integer,
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'INTEGER',
                ic_type:type_integer,
                value:text.substr(1)
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse simple float' , () => {
        const text = '123.456';

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
            type:'FLOAT',
            ic_type:type_float,
            value:text
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse simple big float' , () => {
        const text = '123.45678901234';

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
            type:'BIGFLOAT',
            ic_type:type_bigfloat,
            value:text
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse simple big float' , () => {
        const text = '12345678901.1234';

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
            type:'BIGFLOAT',
            ic_type:type_bigfloat,
            value:text
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse complex float' , () => {
        const text = '-123.456e-45';

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
            type:'PREUNOP_EXPRESSION',
            ic_type:type_float,
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'FLOAT',
                ic_type:type_float,
                value:text.substr(1)
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse complex big float' , () => {
        const text = '-123.456e-456';

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
            type:'PREUNOP_EXPRESSION',
            ic_type:type_bigfloat,
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'BIGFLOAT',
                ic_type:type_bigfloat,
                value:text.substr(1)
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse complex big float' , () => {
        const text = '-123.4567890101e-45';

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
            type:'PREUNOP_EXPRESSION',
            ic_type:type_bigfloat,
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'BIGFLOAT',
                ic_type:type_bigfloat,
                value:text.substr(1)
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });
});