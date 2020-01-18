import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang IC test: module functions part 5 (use module)', () => {
    const compiler = new MathLangCompiler();

    it('Function returns module function call: f()=>module mA export fA() return 20 module mB use mA fB()=>return mA.fA() * 2' , () => {
        compiler.reset();
        const text = 'module mA export function fA() as INTEGER return 20 end function module mB use mA function fB() as INTEGER return mA@fA() * 2 end function';
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
        expect(modules.size).equals(4);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `exported function fA():INTEGER
ebb0()
return i_inline(20)
local function fB():INTEGER
ebb0()
v0:INTEGER = call mA@fA
v1:INTEGER = call mul v0 i_inline(2)
return v1
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Function with missing export (error): f()=>module mA fA() return 20 module mB use mA fB()=>return mA.fA() * 2' , () => {
        compiler.reset();
        const text = 'module mA function fA() as INTEGER return 20 end function module mB use mA function fB() as INTEGER return mA@fA() * 2 end function';
        const result = compiler.compile(text, 'program');

        const errors = compiler.get_errors();
        // console.log('errors', errors);

        expect(errors.length).equals(1);
    });


    it('Function returns module function call (use module as): f()=>module mA export fA() return 20 module mB use mA as m1 fB()=>return m1.fA() * 2' , () => {
        compiler.reset();
        const text = 'module mA export function fA() as INTEGER return 20 end function module mB use mA as m1 function fB() as INTEGER return m1@fA() * 2 end function';
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
        expect(modules.size).equals(4);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `exported function fA():INTEGER
ebb0()
return i_inline(20)
local function fB():INTEGER
ebb0()
v0:INTEGER = call mA@fA
v1:INTEGER = call mul v0 i_inline(2)
return v1
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Function returns local function call: f()=>module mA export fA() f(x is INTEGER)=x*2 return f(20)' , () => {
        compiler.reset();
        const text = 'module mA // example \n export function fA() as INTEGER f(x is INTEGER)=x*2 return f(20) end function';
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
        expect(modules.size).equals(3);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `exported function fA():INTEGER
ebb0()
v0:INTEGER = call mA@f i_inline(20)
return v0
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Function with missing local function (error): f()=>module mA fA() f(x is INTEGER)=x*2 return f(20) module mB use mA fB()=>return mA.f() * 2' , () => {
        compiler.reset();
        const text = 'module mA function fA() as INTEGER f(x is INTEGER)=x*2 return f(20) end function module mB use mA function fB() as INTEGER return mA@f() * 2 end function';
        const result = compiler.compile(text, 'program');

        const errors = compiler.get_errors();
        // console.log('errors', errors);

        expect(errors.length).equals(1);
    });
});