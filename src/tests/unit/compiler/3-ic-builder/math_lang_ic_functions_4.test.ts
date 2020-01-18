import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang IC test: module functions part 4 (function call)', () => {
    const compiler = new MathLangCompiler();

    it('Function returns call expression: f()=>return 20 g()=>return f() * 2' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return 20 end function function g() as INTEGER return f() * 2 end function';
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
return i_inline(20)
local function g():INTEGER
ebb0()
v0:INTEGER = call default@f
v1:INTEGER = call mul v0 i_inline(2)
return v1
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Function returns recursive call expression: fib(number is INTEGER)=>if (number <= 0) then return 0 if (number <= 2) then return 1 return fib(number -1) + fib(number -2)' , () => {
        compiler.reset();
        const text = 'function fib(number is INTEGER) as INTEGER if (number <= 0) then return 0 end if if (number <= 2) then return 1 end if return fib(number -1) + fib(number -2) end function';
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
        const expected_ic_source = `local function fib(number:INTEGER):INTEGER
ebb0(v0:INTEGER)
v1:BOOLEAN = call inf_equal v0 i_inline(0)
if_true v1 ebb2
jump ebb1
ebb1()
v3:BOOLEAN = call inf_equal v0 i_inline(2)
if_true v3 ebb4
jump ebb3
ebb2()
return i_inline(0)
ebb3()
v5:INTEGER = call sub v0 i_inline(1)
v6:INTEGER = call default@fib v5
v7:INTEGER = call sub v0 i_inline(2)
v8:INTEGER = call default@fib v7
v9:INTEGER = call add v6 v8
return v9
ebb4()
return i_inline(1)
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Function returns recursive call expression (exported): export fib(number is INTEGER)=>if (number <= 0) then return 0 if (number <= 2) then return 1 return fib(number -1) + fib(number -2)' , () => {
        compiler.reset();
        const text = 'export function fib(number is INTEGER) as INTEGER if (number <= 0) then return 0 end if if (number <= 2) then return 1 end if return fib(number -1) + fib(number -2) end function';
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
        const expected_ic_source = `exported function fib(number:INTEGER):INTEGER
ebb0(v0:INTEGER)
v1:BOOLEAN = call inf_equal v0 i_inline(0)
if_true v1 ebb2
jump ebb1
ebb1()
v3:BOOLEAN = call inf_equal v0 i_inline(2)
if_true v3 ebb4
jump ebb3
ebb2()
return i_inline(0)
ebb3()
v5:INTEGER = call sub v0 i_inline(1)
v6:INTEGER = call default@fib v5
v7:INTEGER = call sub v0 i_inline(2)
v8:INTEGER = call default@fib v7
v9:INTEGER = call add v6 v8
return v9
ebb4()
return i_inline(1)
`;
        expect(ic_source).equals(expected_ic_source);
    });
});