import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/math_lang_types';

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';

import MathLangCompiler from '../../../../compiler/math_lang_compiler';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}



describe('MathLang id expression for right part parser', () => {
    const compiler = new MathLangCompiler();

    const type_unknow = compiler.get_scope().get_available_lang_type('UNKNOW');
    const type_boolean = compiler.get_scope().get_available_lang_type('BOOLEAN');
    const type_string = compiler.get_scope().get_available_lang_type('STRING');
    const type_integer = compiler.get_scope().get_available_lang_type('INTEGER');
    const type_biginteger = compiler.get_scope().get_available_lang_type('BIGINTEGER');
    const type_float = compiler.get_scope().get_available_lang_type('FLOAT');
    const type_bigfloat = compiler.get_scope().get_available_lang_type('BIGFLOAT');

    it('Parse [a]' , () => {
        compiler.reset();
        const text = 'a';
        const result = compiler.compile_ast(text, 'idRight');

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
        const nomembers = <any>[];
        const expected_ast = {
            ast_code:AST.EXPR_MEMBER_ID,
            ic_type: type_unknow,
            name:'a',
            members:nomembers
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b]' , () => {
        compiler.reset();
        const text = 'a#b';
        
        type_unknow.add_attribute('b', type_float);
        const result = compiler.compile_ast(text, 'idRight');
        type_unknow.del_attribute('b');

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
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_float,
                    attribute_name:'b'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c]' , () => {
        compiler.reset();
        const text = 'a#b#c';
        
        type_unknow.add_attribute('b', type_float);
        type_float.add_attribute('c', type_boolean);
        const result = compiler.compile_ast(text, 'idRight');
        type_unknow.del_attribute('b');
        type_float.del_attribute('c');

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
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_float,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_boolean,
                    attribute_name:'c'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a#b#c[12]]' , () => {
        compiler.reset();
        const text = 'a#b#c[12]';

        type_unknow.add_attribute('b', type_float);
        type_float.add_attribute('c', type_string);
        type_string.set_indexes_count(20);
        type_string.set_indexed_type(type_integer);
        const result = compiler.compile_ast(text, 'idRight');
        type_unknow.del_attribute('b');
        type_float.del_attribute('c');
        type_float.set_indexes_count(0);
        type_float.set_indexed_type(type_unknow);

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
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_float,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_string,
                    attribute_name:'c'
                },
                {
                    ast_code:AST.EXPR_MEMBER_INDEXED,
                    ic_type:type_integer,
                    indexes_expressions:[
                        {
                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                            ic_type:type_integer,
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

        type_unknow.add_attribute('b', type_float);
        type_float.add_attribute('c', type_string);
        type_string.set_indexes_count(20);
        type_string.set_indexed_type(type_integer);
        type_integer.add_attribute('d', type_boolean);
        const result = compiler.compile_ast(text, 'idRight');
        type_unknow.del_attribute('b');
        type_float.del_attribute('c');
        type_float.set_indexes_count(0);
        type_float.set_indexed_type(type_unknow);
        type_integer.del_attribute('d');

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
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_float,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_string,
                    attribute_name:'c'
                },
                {
                    ast_code:AST.EXPR_MEMBER_INDEXED,
                    ic_type:type_integer,
                    indexes_expressions:[
                        {
                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                            ic_type:type_integer,
                            value:'12'
                        }
                    ],
                    member_index:2
                },
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_boolean,
                    attribute_name:'d'
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
   

   
    it('Parse [a()]' , () => {
        compiler.reset();
        const text = 'a()';
        const result = compiler.compile_ast(text, 'idRight');

        // ERRORS
        const expected_errors = 1;
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
            ast_code:AST.EXPR_MEMBER_FUNC_CALL,
            ic_type: type_unknow,
            name:'a',
            members:<any>[],
            operands_types:<any>[],
            operands_expressions:<any>[]
        }
        expect(compiler_ast).eql(expected_ast);
    });
   

   
    it('Parse [a(x)]' , () => {
        compiler.reset();
        const text = 'a(x)';
        const result = compiler.compile_ast(text, 'idRight');

        // ERRORS
        const expected_errors = 1;
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
            ast_code:AST.EXPR_MEMBER_FUNC_CALL,
            ic_type: type_unknow,
            name:'a',
            members:<any>[],
            operands_types:[type_unknow],
            operands_expressions:[
                {
                    ast_code:AST.EXPR_MEMBER_ID,
                    ic_type: type_unknow,
                    name:'x',
                    members:<any>[]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a.b()]' , () => {
        compiler.reset();
        const text = 'a.b()';
        const result = compiler.compile_ast(text, 'idRight');

        // ERRORS
        const expected_errors = 1;
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
            ast_code:AST.EXPR_MEMBER_UNKNOW,
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_CALL,
                    ic_type:type_unknow,
                    func_name:'b',
                    operands_types:<any>[],
                    operands_expressions:<any>[]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a.b(c)]' , () => {
        compiler.reset();
        const text = 'a.b(c)';
        const result = compiler.compile_ast(text, 'idRight');

        // ERRORS
        const expected_errors = 1;
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
            ast_code:AST.EXPR_MEMBER_UNKNOW,
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_CALL,
                    ic_type:type_unknow,
                    func_name:'b',
                    operands_types:[type_unknow],
                    operands_expressions:[
                        {
                            ast_code:AST.EXPR_MEMBER_ID,
                            ic_type: type_unknow,
                            name:'c',
                            members:<any>[]
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a.b(x,y)]' , () => {
        compiler.reset();
        const text = 'a.b(x,y)';
        const result = compiler.compile_ast(text, 'idRight');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
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
            ast_code:AST.EXPR_MEMBER_UNKNOW,
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_CALL,
                    ic_type:type_unknow,
                    func_name:'b',
                    operands_types:[type_unknow, type_unknow],
                    operands_expressions:[
                        {
                            ast_code:AST.EXPR_MEMBER_ID,
                            ic_type: type_unknow,
                            name:'x',
                            members:<any>[]
                        },
                        {
                            ast_code:AST.EXPR_MEMBER_ID,
                            ic_type: type_unknow,
                            name:'y',
                            members:<any>[]
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
    

    it('Parse [a#b.c()]' , () => {
        compiler.reset();
        const text = 'a#b.c()';

        type_unknow.add_attribute('b', type_float);
        const result = compiler.compile_ast(text, 'idRight');
        type_unknow.del_attribute('b');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
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
            ast_code:AST.EXPR_MEMBER_UNKNOW,
            ic_type: type_unknow,
            name:'a',
            members:[
                {
                    ast_code:AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type:type_float,
                    attribute_name:'b'
                },
                {
                    ast_code:AST.EXPR_MEMBER_METHOD_CALL,
                    ic_type:type_unknow,
                    func_name:'c',
                    operands_expressions:<any>[],
                    operands_types:<any>[]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
});