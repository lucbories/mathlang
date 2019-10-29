import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../compiler/math_lang_types';
import AST from '../../compiler/2-ast-builder/old_math_lang_ast';
import MathLangCompiler from '../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../features/default_types';

import VMEngine from '../../engine/vm/vmengine';

import { program_1_source, program_1_ast, program_1_ic, program_1_ic_labels, program_1_run_result } from './program_1';
import { program_2_source, program_2_ast } from './program_2';



const EMPTY_ARRAY = <any>[];

describe('MathLang compiler test', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Compile a=456' , () => {
        compiler.reset();
        const text = 'a=456';
        const result = compiler.compile(text, 'program');
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
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
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
            ]
        };
        expect(compiler_ast).eql(expected_ast);
        
        // GET IC CODE
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[456]
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);

        // RUN
        const program = compiler.get_mc_program();
        const engine = new VMEngine('engine');
        const engine_result = engine.run(program);
        const expected_engine_result:any = undefined;
        expect(engine_result).equal(expected_engine_result);
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
        const result = compiler.compile(text, 'program');
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
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.BLOCK,
                    statements:[
                        {
                            type:AST.STAT_ASSIGN_VARIABLE,
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
                            type:AST.STAT_ASSIGN_ATTRIBUTE,
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
            ]
        };
        expect(compiler_ast).eql(expected_ast);
        
        // GET IC CODE
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
INTEGER:register-set INTEGER:@main/a#b INTEGER:[456]
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Compile Program 1' , () => {
        compiler.reset();
        const text = program_1_source;
        const result = compiler.compile(text, 'program');
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

        expect(errors.length).equals(expected_errors); // Unknow symbols and unknow symbols types
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = program_1_ast;
        expect(compiler_ast).eql(expected_ast);

        // GET IC CODE
        const DEBUG_IC = false;
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, DEBUG_IC);
        const labels_str = compiler.dump_ic_functions_labels(DEBUG_IC);

        // TEST IC TEXT
        const expected_ic_source = program_1_ic;
        const expected_labels_str = program_1_ic_labels;

        expect(ic_source).equals(expected_ic_source);
        expect(labels_str).equals(expected_labels_str);

        // RUN
        const program = compiler.get_mc_program();
        const engine = new VMEngine('engine');
        const engine_result = engine.run(program);
        const expected_engine_result = program_1_run_result.result;
        expect(engine_result).equal(expected_engine_result);
    });


    it('Compile Program 2' , () => {
        compiler.reset();
        const text = program_2_source;
        const result = compiler.compile(text, 'program');
        const errors = compiler.get_errors();

        // ERRORS
        const expected_errors = 13;
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