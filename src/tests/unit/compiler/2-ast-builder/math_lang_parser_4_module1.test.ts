import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';


const EMPTY_ARRAY = <any>[];

describe('MathLang module parser', () => {
    const compiler = new MathLangCompiler();

    it('Parse define module ModuleA' , () => {
        const text = 'module ModuleA function funcA() as INTEGER return 12 end function';

        const result = compiler.compile_ast(text, 'program');

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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
					functions:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcA',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										ast_code:AST.EXPR_PRIMARY_INTEGER,
										ic_type:compiler.TYPE_INTEGER,
										value:'12'
									}
								}
							]
						}
					]
				}
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
	
    // it('Parse define modules ModuleA and ModuleB' , () => {
    //     const text = 'module ModuleA function funcA() as INTEGER begin return 12 end module ModuleB function funcB() as INTEGER begin return 12 end';
    // });
});
	

describe('MathLang module parser: USE', () => {
    const compiler = new MathLangCompiler();
	
    it('Parse define modules ModuleA and ModuleB which use ModuleA' , () => {
        const text = `module ModuleA
			export function funcA() as INTEGER
				return 12
			end function
			
			module ModuleB
			use ModuleA
			function funcB() as INTEGER
				return ModuleA.funcA() * 2
			end function
		`;

        const result = compiler.compile_ast(text, 'program');

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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
					functions:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcA',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										ast_code:AST.EXPR_PRIMARY_INTEGER,
										ic_type:compiler.TYPE_INTEGER,
										value:'12'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'ModuleA', imports:EMPTY_ARRAY}],
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										lhs: {
											ic_type: compiler.TYPE_INTEGER,
											members: [
												{
													func_name: 'funcA',
													ic_type: compiler.TYPE_INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													ast_code: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'ModuleA',
											ast_code: AST.EXPR_MEMBER_FUNC_CALL
										},
										operator: {
											ic_function: 'mul',
											ast_code: AST.EXPR_BINOP,
											value: "*"
										},
										rhs: {
											ast_code: AST.EXPR_PRIMARY_INTEGER,
											ic_type: compiler.TYPE_INTEGER,
											value: '2'
										},
										ast_code: AST.EXPR_BINOP_MULTDIV,
										ic_type:compiler.TYPE_INTEGER
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				}
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
	
	
	it('Parse define modules ModuleA and ModuleB which use ModuleA as MA' , () => {
        const text = `module ModuleA
			export function funcA() as INTEGER
				return 12
			end function
			
			module ModuleB
			use ModuleA as MA
			function funcB() as INTEGER
				return MA.funcA() * 2
			end function
		`;
		

        const result = compiler.compile_ast(text, 'program');

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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
					functions:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcA',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										ast_code:AST.EXPR_PRIMARY_INTEGER,
										ic_type:compiler.TYPE_INTEGER,
										value:'12'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'MA', imports:EMPTY_ARRAY}],
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										lhs: {
											ic_type: compiler.TYPE_INTEGER,
											members: [
												{
													func_name: 'funcA',
													ic_type: compiler.TYPE_INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													ast_code: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA',
											ast_code: AST.EXPR_MEMBER_FUNC_CALL
										},
										operator: {
											ic_function: 'mul',
											ast_code: AST.EXPR_BINOP,
											value: "*"
										},
										rhs: {
											ic_type: compiler.TYPE_INTEGER,
											ast_code: AST.EXPR_PRIMARY_INTEGER,
											value: '2'
										},
										ast_code: AST.EXPR_BINOP_MULTDIV,
										ic_type:compiler.TYPE_INTEGER
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				}
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
	
	
	it('Parse define modules ModuleA and ModuleB which use only exported funcA1 from ModuleA as MA' , () => {
        const text = `module ModuleA
			export function funcA1() as INTEGER
				return 11
			end function
			function funcA2() as INTEGER
				return 12
			end function
			function funcA3() as INTEGER
				return 13
			end function
			
			module ModuleB
			use ModuleA(funcA1) as MA
			function funcB() as INTEGER
				return MA.funcA1() * 2
			end function
		`;
		

        const result = compiler.compile_ast(text, 'program');

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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
					functions:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcA1',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										ast_code:AST.EXPR_PRIMARY_INTEGER,
										ic_type:compiler.TYPE_INTEGER,
										value:'11'
									}
								}
							]
						},
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcA2',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										ast_code:AST.EXPR_PRIMARY_INTEGER,
										ic_type:compiler.TYPE_INTEGER,
										value:'12'
									}
								}
							]
						},
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcA3',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										ast_code:AST.EXPR_PRIMARY_INTEGER,
										ic_type:compiler.TYPE_INTEGER,
										value:'13'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					ast_code:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'MA', imports:['funcA1']}],
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										lhs: {
											ic_type: compiler.TYPE_INTEGER,
											members: [
												{
													func_name: 'funcA1',
													ic_type: compiler.TYPE_INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													ast_code: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA',
											ast_code: AST.EXPR_MEMBER_FUNC_CALL
										},
										operator: {
											ic_function: 'mul',
											ast_code: AST.EXPR_BINOP,
											value: "*"
										},
										rhs: {
											ic_type: compiler.TYPE_INTEGER,
											ast_code: AST.EXPR_PRIMARY_INTEGER,
											value: '2'
										},
										ast_code: AST.EXPR_BINOP_MULTDIV,
										ic_type:compiler.TYPE_INTEGER
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				}
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
});