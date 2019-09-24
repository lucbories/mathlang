import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}



describe('MathLang define module parser', () => {

    it('Parse define module ModuleA' , () => {
        const text = 'module ModuleA function funcA() return INTEGER begin return 12 end';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple string ast expr node', ast_expr_node);

        expect(ast_expr_node.type).equals('STRING');
        expect(ast_expr_node.value).equals('\'\'');
    });
	
    it('Parse define modules ModuleA and ModuleB' , () => {
        const text = 'module ModuleA function funcA() return INTEGER begin return 12 end module ModuleB function funcB() return INTEGER begin return 12 end';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple string ast expr node', ast_expr_node);

        expect(ast_expr_node.type).equals('STRING');
        expect(ast_expr_node.value).equals('\'\'');
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
		...
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
		...
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
		...
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
		...
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
		...
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
		...
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
		...
		// => error with ModuleA exports, miss
    });
});