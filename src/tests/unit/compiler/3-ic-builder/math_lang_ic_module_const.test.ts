import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { ICompilerModule } from '../../../../core/icompiler_module';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang module constants IC builder', () => {
    const compiler = new MathLangCompiler();

    it('Parse module constant (integer)->a=456' , () => {
        compiler.reset();
        const text = 'a=456';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules);

        // TEST IC TEXT
        const expected_ic_source = `symbol constant a:INTEGER = i_inline(456)`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Parse module constant (float)->a=456.99' , () => {
        compiler.reset();
        const text = 'a=456.99';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules);

        // TEST IC TEXT
        const expected_ic_source = `symbol constant a:FLOAT = f_inline(456.99)`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Parse module constant (string)->a=\'hello\'' , () => {
        compiler.reset();
        const text = 'a=\'hello\'';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules);

        // TEST IC TEXT
        const expected_ic_source = `symbol constant a:STRING = s_inline(\'hello\')`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Parse module constant (boolean)->a=true' , () => {
        compiler.reset();
        const text = 'a=true';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules);

        // TEST IC TEXT
        const expected_ic_source = `symbol constant a:BOOLEAN = b_inline(1)`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Parse module constant (boolean)->a=false' , () => {
        compiler.reset();
        const text = 'a=false';
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
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules);

        // TEST IC TEXT
        const expected_ic_source = `symbol constant a:BOOLEAN = b_inline(0)`;
        expect(ic_source).equals(expected_ic_source);
    });
});