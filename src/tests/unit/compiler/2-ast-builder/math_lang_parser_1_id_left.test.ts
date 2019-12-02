import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';



const EMPTY_ARRAY = <any>[];

describe('MathLang id expression for left part parser', () => {
    const compiler = new MathLangCompiler();

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
            ast_code:AST.EXPR_MEMBER_ID,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:EMPTY_ARRAY
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b]' , () => {
        compiler.reset();
        const text = 'a#b';

        compiler.TYPE_UNKNOW.add_attribute('b', compiler.TYPE_FLOAT);
        const result = compiler.compile_ast(text, 'idLeft');
        compiler.TYPE_UNKNOW.del_attribute('b');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        // console.log('errors', errors);
        expect(result).equals(true);
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
            ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_FLOAT,
                    attribute_name:'b'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c]' , () => {
        compiler.reset();
        const text = 'a#b#c';

        compiler.TYPE_UNKNOW.add_attribute('b', compiler.TYPE_FLOAT);
        compiler.TYPE_FLOAT.add_attribute('c', compiler.TYPE_BOOLEAN);
        const result = compiler.compile_ast(text, 'idLeft');
        compiler.TYPE_UNKNOW.del_attribute('b');
        compiler.TYPE_FLOAT.del_attribute('c');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        // console.log('errors', errors);
        expect(result).equals(true);
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
            ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_FLOAT,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_BOOLEAN,
                    attribute_name:'c'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c[12]]' , () => {
        compiler.reset();
        const text = 'a#b#c[12]';

        compiler.TYPE_UNKNOW.add_attribute('b', compiler.TYPE_FLOAT);
        compiler.TYPE_FLOAT.add_attribute('c', compiler.TYPE_STRING);
        compiler.TYPE_STRING.set_indexes_count(20);
        compiler.TYPE_STRING.set_indexed_type(compiler.TYPE_INTEGER);
        const result = compiler.compile_ast(text, 'idLeft');
        compiler.TYPE_UNKNOW.del_attribute('b');
        compiler.TYPE_FLOAT.del_attribute('c');
        compiler.TYPE_FLOAT.set_indexes_count(0);
        compiler.TYPE_FLOAT.set_indexed_type(compiler.TYPE_UNKNOW);

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(true);
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
            ast_code:AST.EXPR_MEMBER_INDEXED,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_FLOAT,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_STRING,
                    attribute_name:'c'
                },
                {
                    ast_code:AST.EXPR_MEMBER_INDEXED,
                    ic_type:compiler.TYPE_INTEGER,
                    indexes_expressions:[
                        {
                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                            ic_type:compiler.TYPE_INTEGER,
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

        compiler.TYPE_UNKNOW.add_attribute('b', compiler.TYPE_FLOAT);
        compiler.TYPE_FLOAT.add_attribute('c', compiler.TYPE_STRING);
        compiler.TYPE_STRING.set_indexes_count(20);
        compiler.TYPE_STRING.set_indexed_type(compiler.TYPE_INTEGER);
        compiler.TYPE_INTEGER.add_attribute('d', compiler.TYPE_BOOLEAN);
        const result = compiler.compile_ast(text, 'idLeft');
        compiler.TYPE_UNKNOW.del_attribute('b');
        compiler.TYPE_FLOAT.del_attribute('c');
        compiler.TYPE_FLOAT.set_indexes_count(0);
        compiler.TYPE_FLOAT.set_indexed_type(compiler.TYPE_UNKNOW);
        compiler.TYPE_INTEGER.del_attribute('d');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(true);
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
            ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_FLOAT,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_STRING,
                    attribute_name:'c'
                },
                {
                    ast_code:AST.EXPR_MEMBER_INDEXED,
                    ic_type:compiler.TYPE_INTEGER,
                    indexes_expressions:[
                        {
                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                            ic_type:compiler.TYPE_INTEGER,
                            value:'12'
                        }
                    ],
                    member_index:2
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_BOOLEAN,
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
            ast_code:AST.EXPR_MEMBER_FUNC_DECL,
            ic_type: compiler.TYPE_UNKNOW,
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
            ast_code:AST.EXPR_MEMBER_FUNC_DECL,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:<any>[],
            operands_types:[compiler.TYPE_INTEGER],
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
            ast_code:AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_DECL,
                    ic_type:compiler.TYPE_UNKNOW,
                    func_name:'b',
                    operands_types:EMPTY_ARRAY,
                    operands_names:EMPTY_ARRAY
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
            ast_code:AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_DECL,
                    ic_type:compiler.TYPE_UNKNOW,
                    func_name:'b',
                    operands_types:[compiler.TYPE_INTEGER],
                    operands_names:['c']
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
            ast_code:AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_DECL,
                    ic_type:compiler.TYPE_UNKNOW,
                    func_name:'b',
                    operands_types:[compiler.TYPE_INTEGER, compiler.TYPE_FLOAT],
                    operands_names:['x', 'y']
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
            ast_code:AST.EXPR_MEMBER_ID,
            ic_type: compiler.TYPE_UNKNOW,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:compiler.TYPE_UNKNOW,
                    attribute_name:'b'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });*/
});