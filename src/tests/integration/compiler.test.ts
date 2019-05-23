import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../compiler/3-program-builder/math_lang_types';
import AST from '../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../features/default_types';

import { program_1_source, program_1_ast } from './program_1';
import { program_2_source, program_2_ast } from './program_2';



const EMPTY_ARRAY = <any>[];

describe('MathLang compiler test', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Compile a=456' , () => {
        compiler.reset();
        const text = 'a=456';
        const result = compiler.compile(text, 'statement');
        const errors = compiler.get_errors();

        // ERRORS
        const expected_errors = 0;
        if (errors.length != expected_errors){
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
            type:'ASSIGN_STATEMENT',
            ic_type: 'INTEGER',
            name:'a',
            is_async: false,
            members:EMPTY_ARRAY,
            expression: {
                type:'INTEGER',
                ic_type: 'INTEGER',
                value:'456'
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Compile error ++456' , () => {
        compiler.reset();
        const text = '++456';
        const result = compiler.compile(text, 'statement');

        expect(result).equals(false);
        const errors = compiler.get_errors();
        
        // console.log('errors', errors);
        
        expect(errors.length).equals(1);
        expect(errors[0].step).equals(1);
        expect(errors[0].line).equals(1);
        expect(errors[0].column).equals(1);
        expect(errors[0].src_extract).equals('++');
    });


    it('Compile error [begin a=12\\na.b=456]' , () => {
        compiler.reset();
        const text = 'begin a=12\na.b=456';
        const result = compiler.compile(text, 'blockStatement');

        expect(result).equals(false);
        const errors = compiler.get_errors();
        
        // console.log('errors', errors);

        expect(errors.length).equals(1);
        expect(errors[0].step).equals(1);
        expect(errors[0].line).equals(2);
        expect(errors[0].column).equals(4);
        expect(errors[0].src_extract).equals('=');
    });


    it('Compile [begin a=12\\na#b=456 end]' , () => {
        const text = 'begin a=12\na#b=456 end';
        const result = compiler.compile(text, 'blockStatement');
        const errors = compiler.get_errors();

        // ERRORS
        const expected_errors = 0;
        if (errors.length != expected_errors){
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
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'12'
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:[
                        {
                            type: AST.EXPR_MEMBER_ATTRIBUTE,
                            ic_type: TYPES.INTEGER,
                            attribute_name: 'b'
                        }
                    ],
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'456'
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Compile Program 1' , () => {
        compiler.reset();
        const text = program_1_source;
        const result = compiler.compile(text, 'program');
        const errors = compiler.get_errors();

        // ERRORS
        const expected_errors = 3;
        if (errors.length != expected_errors){
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }

        expect(errors.length).equals(expected_errors); // Unknow symbols and unknow symbols types
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = program_1_ast;
        expect(compiler_ast).eql(expected_ast);
    });


    it('Compile Program 2' , () => {
        compiler.reset();
        const text = program_2_source;
        const result = compiler.compile(text, 'program');
        const errors = compiler.get_errors();

        // ERRORS
        const expected_errors = 11;
        if (errors.length != expected_errors){
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }

        expect(errors.length).equals(expected_errors); // Unknow symbols and unknow symbols types
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = program_2_ast;
        expect(compiler_ast).eql(expected_ast);
    });
});