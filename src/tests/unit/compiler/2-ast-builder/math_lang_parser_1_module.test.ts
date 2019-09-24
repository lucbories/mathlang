import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';

// import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}


const EMPTY_ARRAY = <any>[];

describe('MathLang define module parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse define module ModuleA' , () => {
        const text = 'module ModuleA function funcA() return INTEGER begin return 12 end';

        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 9;
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
					type:AST.STAT_USE,
                    ic_type: TYPES.STRING,
                    name: 'ModuleA'
				},
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: TYPES.INTEGER,
                    name: 'funcA',
                    operands_types:EMPTY_ARRAY,
                    operands_names:EMPTY_ARRAY,
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:TYPES.INTEGER,
                            expression:{
                                type:AST.EXPR_PRIMARY_INTEGER,
                                ic_type:TYPES.INTEGER,
                                value:12
                            }
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
	
    it('Parse define modules ModuleA and ModuleB' , () => {
        const text = 'module ModuleA function funcA() return INTEGER begin return 12 end module ModuleB function funcB() return INTEGER begin return 12 end';
    });
});
	

describe('MathLang use module parser', () => {
	
    it('Parse define modules ModuleA and ModuleB which use ModuleA' , () => {
        const text = `module ModuleA
			function funcA() return INTEGER
			begin
				return 12
			end
			
			module ModuleB
			use ModuleA
			function funcB() return INTEGER
			begin
				return ModuleA.funcA() * 2
			end
		`;
		// ...
    });
	
	
	it('Parse define modules ModuleA and ModuleB which use ModuleA as MA' , () => {
        const text = `module ModuleA
			function funcA() return INTEGER
			begin
				return 12
			end
			
			module ModuleB
			use ModuleA as MA
			function funcB() return INTEGER
			begin
				return MA.funcA() * 2
			end
		`;
		// ...
    });
	
	
	it('Parse define modules ModuleA and ModuleB which use only funcA1 from ModuleA as MA' , () => {
        const text = `module ModuleA
			function funcA1() return INTEGER
			begin
				return 11
			end
			function funcA2() return INTEGER
			begin
				return 12
			end
			function funcA3() return INTEGER
			begin
				return 13
			end
			
			module ModuleB
			use ModuleA(funcA1) as MA
			function funcB() return INTEGER
			begin
				return MA.funcA1() * 2
			end
		`;
		// ...
    });
	
	
	it('Parse define modules ModuleA and ModuleB which use only funcA1, funcA2 from ModuleA as MA' , () => {
        const text = `module ModuleA
			function funcA1() return INTEGER
			begin
				return 11
			end
			function funcA2() return INTEGER
			begin
				return 12
			end
			function funcA3() return INTEGER
			begin
				return 13
			end
			
			module ModuleB
			use ModuleA(funcA1,funcA2) as MA
			function funcB() return INTEGER
			begin
				return MA.funcA1() * 2 + MA.funcA2()
			end
		`;
		// ...
    });
	
	
	it('Parse define modules ModuleA and ModuleB which use only funcA1 from ModuleA as MA1 and funcA2 from ModuleA as MA2' , () => {
        const text = `module ModuleA
			function funcA1() return INTEGER
			begin
				return 11
			end
			function funcA2() return INTEGER
			begin
				return 12
			end
			function funcA3() return INTEGER
			begin
				return 13
			end
			
			module ModuleB
			use ModuleA(funcA1) as MA1
			use ModuleA(funcA2) as MA2
			function funcB() return INTEGER
			begin
				return MA1.funcA1() * 2 + MA2.funcA2()
			end
			
			return funcB()
		`;
		// ...
    });
	
	
	it('Parse define modules ModuleA, ModuleB and ModuleC which use ModuleA and ModuleB' , () => {
        const text = `module ModuleA
			function funcA1() return INTEGER
			begin
				return 11
			end
			function funcA2() return INTEGER
			begin
				return 12
			end
			function funcA3() return INTEGER
			begin
				return 13
			end
			
			module ModuleB
			use ModuleA(funcA1) as MA1
			use ModuleA(funcA2) as MA2
			function funcB() return INTEGER
			begin
				return MA1.funcA1() * 2 + MA2.funcA2()
			end
			
			module ModuleC
			use ModuleA(funcA) as MA
			use ModuleB(funcB) as MB
			function funcB() return INTEGER
			begin
				return MA.funcA() * 2 + MB.funcB()
			end
			
			return funcB()
		`;
		// ...
    });
	
	
	it('Parse define modules ModuleA, ModuleB and ModuleC which use ModuleA and ModuleB with exports' , () => {
        const text = `module ModuleA export funcA1
			function funcA1() return INTEGER
			begin
				return 11
			end
			function funcA2() return INTEGER
			begin
				return 12
			end
			function funcA3() return INTEGER
			begin
				return 13
			end
			
			module ModuleB export all
			use ModuleA(funcA1) as MA1
			use ModuleA(funcA2) as MA2
			function funcB() return INTEGER
			begin
				return MA1.funcA1() * 2 + MA2.funcA2()
			end
			
			module ModuleC
			use ModuleA(funcA) as MA
			use ModuleB(funcB) as MB
			function funcB() return INTEGER
			begin
				return MA.funcA() * 2 + MB.funcB()
			end
			
			return funcB()
		`;
		// ...
		// => error with ModuleA exports, miss
    });
});