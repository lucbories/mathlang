import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../compiler/math_lang_compiler';

import { program_1_source, program_1_ast } from './program_1';
import { program_2_source, program_2_ast } from './program_2';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}



describe('MathLang compiler test', () => {
    const compiler = new MathLangCompiler([]);

    it('Compile a=456' , () => {
        compiler.reset();
        const text = 'a=456';
        const result = compiler.compile(text, 'statement');

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
        const nomembers = <any>undefined;
        const expected_ast = {
            type:'ASSIGN_STATEMENT',
            ic_type: 'INTEGER',
            name:'a',
            is_async: false,
            members:nomembers,
            expression: {
                type:'INTEGER',
                ic_type: 'INTEGER',
                value:'456',
                members:nomembers
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
        expect(errors[0].line).to.be.NaN;
        expect(errors[0].column).to.be.NaN;
        expect(errors[0].src_extract).equals('');
    });


    it('Compile [begin a=12\\na.b=456 end]' , () => {
        const text = 'begin a=12\na.b=456 end';
        const result = compiler.compile(text, 'blockStatement');

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
        const nomembers = <any>undefined;
        const expected_ast = {
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'12',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    is_async: false,
                    members:{
                        type: 'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier: 'b'
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:nomembers
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
        if (errors.length != 4){
            console.log('errors', errors);
            expect(errors.length).equals(4);
            return;
        }
        expect(errors.length).equals(4); // Unknow symbols and unknow symbols types
        
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
        if (errors.length != 10){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(10);
            return;
        }
        expect(errors.length).equals(10); // Unknow symbols and unknow symbols types
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = program_2_ast;
        expect(compiler_ast).eql(expected_ast);
    });
});