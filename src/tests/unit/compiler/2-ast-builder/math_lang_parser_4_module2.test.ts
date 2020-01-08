import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';


const EMPTY_ARRAY = <any>[];

describe('MathLang module parser: ALIASES', () => {
    const compiler = new MathLangCompiler();

    it('Parse define modules ModuleA and ModuleB which use only funcA1, funcA2 from ModuleA as MA' , () => {
        const text = `module ModuleA
			export function funcA1() return INTEGER
				return 11
			end function
			export function funcA2() return INTEGER
				return 12
			end function
			function funcA3() return INTEGER
				return 13
			end function
			
			module ModuleB
			use ModuleA(funcA1,funcA2) as MA
			function funcB() return INTEGER
				return MA.funcA1() * 2 + MA.funcA2()
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
					uses:[{name:'ModuleA', alias:'MA', imports:['funcA1', 'funcA2']}],
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
												ast_code: AST.EXPR_PRIMARY_INTEGER,
												ic_type: compiler.TYPE_INTEGER,
												value: '2'
											},
											ast_code: AST.EXPR_BINOP_MULTDIV,
											ic_type:compiler.TYPE_INTEGER
										},
										operator: {
											ic_function: 'add',
											ast_code: AST.EXPR_BINOP,
											value: "+"
										},
										rhs: {
											ic_type: compiler.TYPE_INTEGER,
											members: [
												{
													func_name: 'funcA2',
													ic_type: compiler.TYPE_INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													ast_code: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA',
											ast_code: AST.EXPR_MEMBER_FUNC_CALL
										},
										ast_code: AST.EXPR_BINOP_ADDSUB,
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
	
	
	it('Parse define modules ModuleA and ModuleB which use only funcA1 from ModuleA as MA1 and funcA2 from ModuleA as MA2' , () => {
		const text = `
			module ModuleA
			export function funcA1() return INTEGER
				return 11
			end function
			export function funcA2() return INTEGER
				return 12
			end function
			function funcA3() return INTEGER
				return 13
			end function
			
			module ModuleB
			use ModuleA(funcA1) as MA1
			use ModuleA(funcA2) as MA2
			export function funcB() return INTEGER
				return MA1.funcA1() * 2 + MA2.funcA2()
			end function

			module default
			use ModuleB
			function main() return UNKNOW
				return ModuleB.funcB()
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
					functions:[]
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
					uses:[{name:'ModuleA', alias:'MA1', imports:['funcA1']}, {name:'ModuleA', alias:'MA2', imports:['funcA2']}],
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_INTEGER,
							func_name: 'funcB',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									ast_code:AST.STAT_RETURN,
									ic_type:compiler.TYPE_INTEGER,
									expression:{
										lhs: {
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
												name: 'MA1',
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
										},
										operator: {
											ic_function: 'add',
											ast_code: AST.EXPR_BINOP,
											value: "+"
										},
										rhs: {
											ic_type: compiler.TYPE_INTEGER,
											members: [
												{
													func_name: 'funcA2',
													ic_type: compiler.TYPE_INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													ast_code: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA2',
											ast_code: AST.EXPR_MEMBER_FUNC_CALL
										},
										ast_code: AST.EXPR_BINOP_ADDSUB,
										ic_type:compiler.TYPE_INTEGER
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:[
						{
							alias:"ModuleB",
							imports:EMPTY_ARRAY,
							name:'ModuleB'
						}
					],
                    variables:EMPTY_ARRAY,
					functions:[
						{
							ast_code:AST.STAT_FUNCTION,
							ic_type: compiler.TYPE_UNKNOW,
							func_name: 'main',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							statements: [
								{
									expression: {
										ic_type: compiler.TYPE_INTEGER,
										members: [
											{
												"ast_code": "METHOD_CALL_EXPRESSION",
												"func_name": "funcB",
												"ic_type": compiler.TYPE_INTEGER,
												operands_expressions: EMPTY_ARRAY,
												operands_types: EMPTY_ARRAY
											}
									  	],
										name: 'ModuleB',
										ast_code: AST.EXPR_MEMBER_FUNC_CALL
									},
									ic_type: compiler.TYPE_INTEGER,
									ast_code: AST.STAT_RETURN
								}
							]
						}
					]
				}
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
});