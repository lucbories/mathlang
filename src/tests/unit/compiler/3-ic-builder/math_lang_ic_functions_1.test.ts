import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang IC test: module functions part 1 (function constants)', () => {
    const compiler = new MathLangCompiler();

    it('Function returns constant: f()=>return 123' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return 123 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
return i_inline(123)
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns an addition of 2 int constants: f()=>return 123+456' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return 123+456 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:INTEGER = call add i_inline(123) i_inline(456)
return v0
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns an addition of 2 float constants: f()=>return 123.78+456.987458e-15' , () => {
        compiler.reset();
        const text = 'function f() as FLOAT return 123.78+456.987458e-15 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:FLOAT = call add f_inline(123.78) f_inline(456.987458e-15)
return v0
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns an addition of 2 bigfloat constants: f()=>return 1234567890123.78+456.987458e-1545' , () => {
        compiler.reset();
        const text = 'function f() as BIGFLOAT return 1234567890123.78+456.987458e-1545 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:BIGFLOAT = call add bf_inline(1234567890123.78) bf_inline(456.987458e-1545)
return v0
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns an addition of 2 bigint constants: f()=>return 1234567890123+45678965432198' , () => {
        compiler.reset();
        const text = 'function f() as BIGINTEGER return 1234567890123+45678965432198 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:BIGINTEGER = call add bi_inline(1234567890123) bi_inline(45678965432198)
return v0
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns two additions of 3 int constants: f()=>return 123+456+789' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return 123+456+789 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:INTEGER = call add i_inline(123) i_inline(456)
v1:INTEGER = call add v0 i_inline(789)
return v1
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns two additions and one mult of 4 int constants: f()=>return 123+456*654+789' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return 123+456*654+789 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:INTEGER = call mul i_inline(456) i_inline(654)
v1:INTEGER = call add i_inline(123) v0
v2:INTEGER = call add v1 i_inline(789)
return v2
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns two additions and one mul of 4 int constants: f()=>return (123+456)*654+789' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return (123+456)*654+789 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:INTEGER = call add i_inline(123) i_inline(456)
v1:INTEGER = call mul v0 i_inline(654)
v2:INTEGER = call add v1 i_inline(789)
return v2
`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Function returns one add, one div and one mul of 4 int constants: f()=>return (123+456)*654/789' , () => {
        compiler.reset();
        const text = 'function f() as INTEGER return (123+456)*654/789 end function';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

        // TEST IC TEXT
        const expected_ic_source = `ebb0()
v0:INTEGER = call add i_inline(123) i_inline(456)
v1:FLOAT = call div i_inline(654) i_inline(789)
v2:FLOAT = call mul v0 v1
return v2
`;
        expect(ic_source).equals(expected_ic_source);
    });
});