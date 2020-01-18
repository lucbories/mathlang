import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang IC test: module functions part 2 (function operands and variables)', () => {
    const compiler = new MathLangCompiler();

    it('Function returns vars expression: f()=>a=12 b=a * 45 return 123+b*b' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER a=12 b=a * 45 return 123+b*b end function';
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
        expect(modules.size).equals(2);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `local function f():INTEGER
ebb0()
v0:INTEGER = i_inline(12)
v2:INTEGER = call mul v0 i_inline(45)
v1:INTEGER = v2
v3:INTEGER = call mul v1 v1
v4:INTEGER = call add i_inline(123) v3
return v4
`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Function returns opd/vars expression: f(x is INTEGER)=>b=88 * x return 123+b*b' , () => {
        compiler.reset();
        const text = 'function f(x is INTEGER) as INTEGER b=88 * x return 123+b*b end function';
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
        expect(modules.size).equals(2);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `local function f(x:INTEGER):INTEGER
ebb0(v0:INTEGER)
v2:INTEGER = call mul i_inline(88) v0
v1:INTEGER = v2
v3:INTEGER = call mul v1 v1
v4:INTEGER = call add i_inline(123) v3
return v4
`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Function returns 2 opds expression: f(x is INTEGER, y is FLOAT)=>return x/y' , () => {
        compiler.reset();
        const text = 'function f(x is INTEGER, y is FLOAT) as FLOAT return x/y end function';
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
        expect(modules.size).equals(2);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        // TODO: INT/FLOAT should return FLOAT
        const expected_ic_source = `local function f(x:INTEGER,y:FLOAT):FLOAT
ebb0(v0:INTEGER,v1:FLOAT)
v2:FLOAT = call div v0 v1
return v2
`;
        expect(ic_source).equals(expected_ic_source);
    });
});