import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { ICompilerModule } from '../../../../core/icompiler_module';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';


function build_module_ic_source(module:ICompilerModule):string {
    let ic_source:string = '';

    const loop_constants = module.get_module_constants();
    expect(loop_constants.size).equals(1);
    loop_constants.forEach(
        (loop_constant)=>{
            const ic_text = 'module const ' + loop_constant.name + ':' + loop_constant.type.get_type_name() + ' = ' + loop_constant.init_value;
            console.log('constant source->', ic_text);
            if (ic_source.length > 0) { ic_source += '\n'; }
            ic_source += ic_text;
        }
    );

    const loop_exp_constants = module.get_exported_constants();
    expect(loop_exp_constants.size).equals(0);
    loop_exp_constants.forEach(
        (loop_constant)=>{
            const ic_text = 'exported const ' + loop_constant.name + ':' + loop_constant.type.get_type_name() + ' = ' + loop_constant.init_value;
            console.log('exported constant source->', ic_text);
            if (ic_source.length > 0) { ic_source += '\n'; }
            ic_source += ic_text;
        }
    );

    const loop_functions = module.get_exported_functions();
    expect(loop_functions.size).equals(0);
    loop_functions.forEach(
        (loop_function)=>{
            const ebbs = loop_function.get_ic_ebb_map();
            ebbs.forEach(
                (ebb, ebb_name)=>console.log(ebb_name, ebb)
            );
        }
    );

    const main_function = module.get_main_function();
    if (main_function){
        const ebbs = main_function.get_ic_ebb_map();
        ebbs.forEach(
            (ebb, ebb_name)=>console.log(ebb_name, ebb)
        );
    }

    return ic_source;
}


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
        let ic_source:string = '';

        modules.forEach(
            (loop_module)=>{
                ic_source += build_module_ic_source(loop_module);
            }
        );

        // TEST IC TEXT
        const expected_ic_source = `module const a:INTEGER = i_inline(456)`;
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
        let ic_source:string = '';

        modules.forEach(
            (loop_module)=>{
                ic_source += build_module_ic_source(loop_module);
            }
        );

        // TEST IC TEXT
        const expected_ic_source = `module const a:FLOAT = f_inline(456.99)`;
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
        let ic_source:string = '';

        modules.forEach(
            (loop_module)=>{
                ic_source += build_module_ic_source(loop_module);
            }
        );

        // TEST IC TEXT
        const expected_ic_source = `module const a:STRING = s_inline(\'hello\')`;
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
        let ic_source:string = '';

        modules.forEach(
            (loop_module)=>{
                ic_source += build_module_ic_source(loop_module);
            }
        );

        // TEST IC TEXT
        const expected_ic_source = `module const a:BOOLEAN = b_inline(1)`;
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
        let ic_source:string = '';

        modules.forEach(
            (loop_module)=>{
                ic_source += build_module_ic_source(loop_module);
            }
        );

        // TEST IC TEXT
        const expected_ic_source = `module const a:BOOLEAN = b_inline(0)`;
        expect(ic_source).equals(expected_ic_source);
    });
});