import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../compiler/math_lang_types';
import AST from '../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../features/default_types';

// import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}


const EMPTY_ARRAY = <any>[];

describe('MathLang define module parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse define module ModuleA' , () => {
        const text = 'module ModuleA function funcA() return INTEGER return 12 end function';

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
            type:AST.PROGRAM,
            block:<any>[],
            modules:[
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'12'
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
	
    // it('Parse define modules ModuleA and ModuleB' , () => {
    //     const text = 'module ModuleA function funcA() return INTEGER begin return 12 end module ModuleB function funcB() return INTEGER begin return 12 end';
    // });
});
	

describe('MathLang use module parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);
	
    it('Parse define modules ModuleA and ModuleB which use ModuleA' , () => {
        const text = `module ModuleA
			function funcA() return INTEGER
				return 12
			end function
			
			module ModuleB
			use ModuleA
			function funcB() return INTEGER
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
            type:AST.PROGRAM,
            block:<any>[],
            modules:[
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'12'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'ModuleA', imports:EMPTY_ARRAY}],
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										lhs: {
											ic_type: TYPES.INTEGER,
											members: [
												{
													func_name: 'funcA',
													ic_type: TYPES.INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													type: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'ModuleA',
											type: AST.EXPR_MEMBER_METHOD_CALL
										},
										operator: {
											ic_function: 'mul',
											type: AST.EXPR_BINOP,
											value: "*"
										},
										rhs: {
											ic_type: TYPES.INTEGER,
											type: TYPES.INTEGER,
											value: '2'
										},
										type: AST.EXPR_BINOP_MULTDIV,
										ic_type:TYPES.INTEGER
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
			function funcA() return INTEGER
				return 12
			end function
			
			module ModuleB
			use ModuleA as MA
			function funcB() return INTEGER
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
            type:AST.PROGRAM,
            block:<any>[],
            modules:[
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'12'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'MA', imports:EMPTY_ARRAY}],
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										lhs: {
											ic_type: TYPES.INTEGER,
											members: [
												{
													func_name: 'funcA',
													ic_type: TYPES.INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													type: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA',
											type: AST.EXPR_MEMBER_METHOD_CALL
										},
										operator: {
											ic_function: 'mul',
											type: AST.EXPR_BINOP,
											value: "*"
										},
										rhs: {
											ic_type: TYPES.INTEGER,
											type: TYPES.INTEGER,
											value: '2'
										},
										type: AST.EXPR_BINOP_MULTDIV,
										ic_type:TYPES.INTEGER
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
			export function funcA1() return INTEGER
				return 11
			end function
			function funcA2() return INTEGER
				return 12
			end function
			function funcA3() return INTEGER
				return 13
			end function
			
			module ModuleB
			use ModuleA(funcA1) as MA
			function funcB() return INTEGER
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
            type:AST.PROGRAM,
            block:<any>[],
            modules:[
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA1',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'11'
									}
								}
							]
						},
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA2',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'12'
									}
								}
							]
						},
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA3',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'13'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'MA', imports:['funcA1']}],
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										lhs: {
											ic_type: TYPES.INTEGER,
											members: [
												{
													func_name: 'funcA1',
													ic_type: TYPES.INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													type: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA',
											type: AST.EXPR_MEMBER_METHOD_CALL
										},
										operator: {
											ic_function: 'mul',
											type: AST.EXPR_BINOP,
											value: "*"
										},
										rhs: {
											ic_type: TYPES.INTEGER,
											type: TYPES.INTEGER,
											value: '2'
										},
										type: AST.EXPR_BINOP_MULTDIV,
										ic_type:TYPES.INTEGER
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
            type:AST.PROGRAM,
            block:<any>[],
            modules:[
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA1',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'11'
									}
								}
							]
						},
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA2',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'12'
									}
								}
							]
						},
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA3',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'13'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'MA', imports:['funcA1', 'funcA2']}],
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										lhs: {
											lhs: {
												ic_type: TYPES.INTEGER,
												members: [
													{
														func_name: 'funcA1',
														ic_type: TYPES.INTEGER,
														operands_expressions: EMPTY_ARRAY,
														operands_types: EMPTY_ARRAY,
														type: AST.EXPR_MEMBER_METHOD_CALL
													}
												],
												name: 'MA',
												type: AST.EXPR_MEMBER_METHOD_CALL
											},
											operator: {
												ic_function: 'mul',
												type: AST.EXPR_BINOP,
												value: "*"
											},
											rhs: {
												ic_type: TYPES.INTEGER,
												type: TYPES.INTEGER,
												value: '2'
											},
											type: AST.EXPR_BINOP_MULTDIV,
											ic_type:TYPES.INTEGER
										},
										operator: {
											ic_function: 'add',
											type: AST.EXPR_BINOP,
											value: "+"
										},
										rhs: {
											ic_type: TYPES.INTEGER,
											members: [
												{
													func_name: 'funcA2',
													ic_type: TYPES.INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													type: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA',
											type: AST.EXPR_MEMBER_METHOD_CALL
										},
										type: AST.EXPR_BINOP_ADDSUB,
										ic_type:TYPES.INTEGER
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
			use ModuleA(funcA1) as MA1
			use ModuleA(funcA2) as MA2
			function funcB() return INTEGER
				return MA1.funcA1() * 2 + MA2.funcA2()
			end function
			
			return funcB()
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
            type:AST.PROGRAM,
            block:[
				{
					expression: {
						ic_type: TYPES.INTEGER,
						members: EMPTY_ARRAY,
						name: 'funcB',
						operands_expressions: EMPTY_ARRAY,
						operands_types: EMPTY_ARRAY,
						type: AST.EXPR_MEMBER_FUNC_CALL
					},
					ic_type: TYPES.INTEGER,
					type: AST.STAT_RETURN
				}
		  ],
            modules:[
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleA',
					uses:EMPTY_ARRAY,
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA1',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'11'
									}
								}
							]
						},
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA2',
							is_exported:true,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'12'
									}
								}
							]
						},
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcA3',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										type:AST.EXPR_PRIMARY_INTEGER,
										ic_type:TYPES.INTEGER,
										value:'13'
									}
								}
							]
						}
					],
					variables:EMPTY_ARRAY
				},
				{
					type:AST.STAT_MODULE,
					module_name: 'ModuleB',
					uses:[{name:'ModuleA', alias:'MA1', imports:['funcA1']}, {name:'ModuleA', alias:'MA2', imports:['funcA2']}],
					functions:[
						{
							type:AST.STAT_FUNCTION,
							ic_type: TYPES.INTEGER,
							name: 'funcB',
							is_exported:false,
							operands_types:EMPTY_ARRAY,
							operands_names:EMPTY_ARRAY,
							block: [
								{
									type:AST.STAT_RETURN,
									ic_type:TYPES.INTEGER,
									expression:{
										lhs: {
											lhs: {
												ic_type: TYPES.INTEGER,
												members: [
													{
														func_name: 'funcA1',
														ic_type: TYPES.INTEGER,
														operands_expressions: EMPTY_ARRAY,
														operands_types: EMPTY_ARRAY,
														type: AST.EXPR_MEMBER_METHOD_CALL
													}
												],
												name: 'MA1',
												type: AST.EXPR_MEMBER_METHOD_CALL
											},
											operator: {
												ic_function: 'mul',
												type: AST.EXPR_BINOP,
												value: "*"
											},
											rhs: {
												ic_type: TYPES.INTEGER,
												type: TYPES.INTEGER,
												value: '2'
											},
											type: AST.EXPR_BINOP_MULTDIV,
											ic_type:TYPES.INTEGER
										},
										operator: {
											ic_function: 'add',
											type: AST.EXPR_BINOP,
											value: "+"
										},
										rhs: {
											ic_type: TYPES.INTEGER,
											members: [
												{
													func_name: 'funcA2',
													ic_type: TYPES.INTEGER,
													operands_expressions: EMPTY_ARRAY,
													operands_types: EMPTY_ARRAY,
													type: AST.EXPR_MEMBER_METHOD_CALL
												}
											],
											name: 'MA2',
											type: AST.EXPR_MEMBER_METHOD_CALL
										},
										type: AST.EXPR_BINOP_ADDSUB,
										ic_type:TYPES.INTEGER
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
	
	
// 	it('Parse define modules ModuleA, ModuleB and ModuleC which use ModuleA and ModuleB' , () => {
//         const text = `module ModuleA
// 			function funcA1() return INTEGER
// 			begin
// 				return 11
// 			end
// 			function funcA2() return INTEGER
// 			begin
// 				return 12
// 			end
// 			function funcA3() return INTEGER
// 			begin
// 				return 13
// 			end
			
// 			module ModuleB
// 			use ModuleA(funcA1) as MA1
// 			use ModuleA(funcA2) as MA2
// 			function funcB() return INTEGER
// 			begin
// 				return MA1.funcA1() * 2 + MA2.funcA2()
// 			end
			
// 			module ModuleC
// 			use ModuleA(funcA) as MA
// 			use ModuleB(funcB) as MB
// 			function funcB() return INTEGER
// 			begin
// 				return MA.funcA() * 2 + MB.funcB()
// 			end
			
// 			return funcB()
// 		`;
// 		// ...
//     });
	
	
// 	it('Parse define modules ModuleA, ModuleB and ModuleC which use ModuleA and ModuleB with exports' , () => {
//         const text = `module ModuleA export funcA1
// 			function funcA1() return INTEGER
// 			begin
// 				return 11
// 			end
// 			function funcA2() return INTEGER
// 			begin
// 				return 12
// 			end
// 			function funcA3() return INTEGER
// 			begin
// 				return 13
// 			end
			
// 			module ModuleB export all
// 			use ModuleA(funcA1) as MA1
// 			use ModuleA(funcA2) as MA2
// 			function funcB() return INTEGER
// 			begin
// 				return MA1.funcA1() * 2 + MA2.funcA2()
// 			end
			
// 			module ModuleC
// 			use ModuleA(funcA) as MA
// 			use ModuleB(funcB) as MB
// 			function funcB() return INTEGER
// 			begin
// 				return MA.funcA() * 2 + MB.funcB()
// 			end
			
// 			return funcB()
// 		`;
// 		// ...
// 		// => error with ModuleA exports, miss
//     });
});