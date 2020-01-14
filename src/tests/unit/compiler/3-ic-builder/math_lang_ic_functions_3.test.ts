import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang IC test: module functions part 3 (function with if)', () => {
    const compiler = new MathLangCompiler();

    it('Function returns vars expression: f()=>if (true) then return 1 else return 2' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER if (true) then return 1 else return 2 end if end function';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }

        // GET IC CODE
        const compiler_scope = compiler.get_scope();
        const modules = compiler_scope.get_new_modules();
        expect(modules.size).equals(1);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
if_true b_inline(1) ebb2
jump ebb3
ebb1()
ebb2()
return i_inline(1)
ebb3()
return i_inline(2)
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Function returns vars expression: f()=>if (15+59>89) then return 10 return 20' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER if (15+59>89) then return 10 end if return 20 end function';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }

        // GET IC CODE
        const compiler_scope = compiler.get_scope();
        const modules = compiler_scope.get_new_modules();
        expect(modules.size).equals(1);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:INTEGER = call add i_inline(15) i_inline(59)
v1:BOOLEAN = call sup v0 i_inline(89)
if_true v1 ebb2
jump ebb1
ebb1()
return i_inline(20)
ebb2()
return i_inline(10)
`;
        expect(ic_source).equals(expected_ic_source);
    });
});