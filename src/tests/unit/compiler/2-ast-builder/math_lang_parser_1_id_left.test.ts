import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



const EMPTY_ARRAY = <any>[];

describe('MathLang id expression for left part parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse [a]' , () => {
        compiler.reset();
        const text = 'a';
        const result = compiler.compile_ast(text, 'idLeft');

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
            type:AST.EXPR_MEMBER_ID,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:EMPTY_ARRAY
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b]' , () => {
        compiler.reset();
        const text = 'a#b';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        const expected_errors = 2;
        const errors = compiler.get_errors();
        expect(result).equals(false);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_ATTRIBUTE,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'b'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c]' , () => {
        compiler.reset();
        const text = 'a#b#c';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        const expected_errors = 4;
        const errors = compiler.get_errors();
        expect(result).equals(false);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_ATTRIBUTE,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'b'
                },
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'c'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c[12]]' , () => {
        compiler.reset();
        const text = 'a#b#c[12]';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        const expected_errors = 5;
        const errors = compiler.get_errors();
        expect(result).equals(false);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_INDEXED,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'b'
                },
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'c'
                },
                {
                    type:AST.EXPR_MEMBER_INDEXED,
                    ic_type:TYPES.UNKNOW,
                    indexes_expressions:[
                        {
                            type:TYPES.INTEGER,
                            ic_type:TYPES.INTEGER,
                            value:'12'
                        }
                    ],
                    member_index:2
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c[12]#d]' , () => {
        compiler.reset();
        const text = 'a#b#c[12]#d';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        const expected_errors = 7;
        const errors = compiler.get_errors();
        expect(result).equals(false);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_ATTRIBUTE,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'b'
                },
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'c'
                },
                {
                    type:AST.EXPR_MEMBER_INDEXED,
                    ic_type:TYPES.UNKNOW,
                    indexes_expressions:[
                        {
                            type:TYPES.INTEGER,
                            ic_type:TYPES.INTEGER,
                            value:'12'
                        }
                    ],
                    member_index:2
                },
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'d'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
   

   
    it('Parse [a()]' , () => {
        compiler.reset();
        const text = 'a()';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_FUNC_DECL,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:<any>[],
            operands_types:<any>[],
            operands_names:<any>[]
        }
        expect(compiler_ast).eql(expected_ast);
    });
   

   
    it('Parse [a(x)]' , () => {
        compiler.reset();
        const text = 'a(x)';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_FUNC_DECL,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:<any>[],
            operands_types:[TYPES.INTEGER],
            operands_names:['x']
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a.b()]' , () => {
        compiler.reset();
        const text = 'a.b()';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_METHOD_DECL,
                    ic_type:TYPES.UNKNOW,
                    func_name:'b',
                    operands_types:EMPTY_ARRAY,
                    operands_expressions:EMPTY_ARRAY
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a.b(c)]' , () => {
        compiler.reset();
        const text = 'a.b(c)';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_METHOD_DECL,
                    ic_type:TYPES.UNKNOW,
                    func_name:'b',
                    operands_types:[TYPES.INTEGER],
                    operands_expressions:['c']
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a.b(x,y is FLOAT)]' , () => {
        compiler.reset();
        const text = 'a.b(x,y is FLOAT)';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_METHOD_DECL,
                    ic_type:TYPES.UNKNOW,
                    func_name:'b',
                    operands_types:[TYPES.INTEGER, TYPES.FLOAT],
                    operands_expressions:['x', 'y']
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
    

    /*it('Parse [a#b.c()]' , () => {
        compiler.reset();
        const text = 'a#b.c()';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.EXPR_MEMBER_ID,
            ic_type: TYPES.UNKNOW,
            name:'a',
            members:[
                {
                    type:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:TYPES.UNKNOW,
                    attribute_name:'b'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });*/
});