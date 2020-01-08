import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import { constants } from 'crypto';



describe('MathLang assign IC builder', () => {
    const compiler = new MathLangCompiler();

    it('Parse assign a=456 statement' , () => {
        compiler.reset();
        const text = 'module default a=456';
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
                const loop_constants = loop_module.get_module_constants();
                expect(loop_constants.size).equals(1);
                loop_constants.forEach(
                    (loop_constant)=>{
                        const ic_text = 'module const ' + loop_constant.name + ':' + loop_constant.type.get_type_name() + ' = ' + loop_constant.init_value;
                        console.log('constant source->', ic_text);
                        if (ic_source.length > 0) { ic_source += '\n'; }
                        ic_source += ic_text;
                    }
                );

                const loop_exp_constants = loop_module.get_exported_constants();
                expect(loop_exp_constants.size).equals(0);
                loop_exp_constants.forEach(
                    (loop_constant)=>{
                        const ic_text = 'exported const ' + loop_constant.name + ':' + loop_constant.type.get_type_name() + ' = ' + loop_constant.init_value;
                        console.log('exported constant source->', ic_text);
                        if (ic_source.length > 0) { ic_source += '\n'; }
                        ic_source += ic_text;
                    }
                );

                const loop_functions = loop_module.get_exported_functions();
                expect(loop_functions.size).equals(0);
                loop_functions.forEach(
                    (loop_function)=>{
                        const ebbs = loop_function.get_ic_ebb_map();
                        ebbs.forEach(
                            (ebb, ebb_name)=>console.log(ebb_name, ebb)
                        );
                    }
                );

                const main_function = loop_module.get_main_function();
                if (main_function){
                    const ebbs = main_function.get_ic_ebb_map();
                    ebbs.forEach(
                        (ebb, ebb_name)=>console.log(ebb_name, ebb)
                    );
                }
            }
        );

        // TEST IC TEXT
        const expected_ic_source = `module const a:INTEGER = f_inline(456)`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Parse assign a=456+789 statement' , () => {
        compiler.reset();
        const text = 'a=456+789';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        // const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        // const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);
        const ic_source = '';


        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:function-call add INTEGER:[456] INTEGER:[789]
INTEGER:register-set INTEGER:@main/a INTEGER:FROM_STACK
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Parse assign begin a=12\na.b()=456 end statement' , () => {
        compiler.reset();
        const text = 'begin a=12\na.b()=456 end';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        // const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        // const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);
        const ic_source = '';


        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
none:function-declare-leave main
INTEGER:function-declare-enter INTEGER.b
INTEGER:function-return INTEGER:[456]
INTEGER:function-declare-leave INTEGER.b`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Parse assign begin a=12\na.b(x is FLOAT)=456.0 end statement' , () => {
        compiler.reset();
        const text = 'begin a=12\na.b(x is FLOAT)=456.0 end';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        // const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        // const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);
        const ic_source = '';


        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
none:function-declare-leave main
FLOAT:function-declare-enter FLOAT.b
FLOAT:function-return FLOAT:[456.0]
FLOAT:function-declare-leave FLOAT.b`;
        expect(ic_source).equals(expected_ic_source);
    });
   

    it('Parse assign begin a=12\na.b(x is FLOAT)=x + 456.0 end statement' , () => {
        compiler.reset();
        const text = 'begin a=12\na.b(x is FLOAT)=x + 456.0 end';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        // const ic_functions_map = compiler.get_ic_functions_map();
        const compiler_scope = compiler.get_scope();
        const modules = compiler_scope.get_new_modules();
        modules.forEach(
            (loop_module)=>{
                const loop_functions = loop_module.get_exported_functions();
                loop_functions.forEach(
                    (loop_function)=>{
                        const ebbs = loop_function.get_ic_ebb_map();
                        ebbs.forEach(
                            (ebb, ebb_name)=>console.log(ebb_name, ebb)
                        )
                    }
                )
            }
        );
        // console.log('ic_functions_map', ic_functions_map);
        // const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);
        const ic_source = '';

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
none:function-declare-leave main
FLOAT:function-declare-enter FLOAT.b
FLOAT:function-call add FLOAT:@FLOAT.b/x FLOAT:[456.0]
FLOAT:function-return FLOAT:FROM_STACK
FLOAT:function-declare-leave FLOAT.b`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Parse assign [b=5 a=456 + (++b*8)] statement' , () => {
        compiler.reset();
        const text = 'b=5 a=456 + (++b*8)';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        // const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        // const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);
        const ic_source = '';


        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/b INTEGER:[5]
INTEGER:function-call add_one INTEGER:@main/b
INTEGER:function-call mul INTEGER:FROM_STACK INTEGER:[8]
INTEGER:function-call add INTEGER:[456] INTEGER:FROM_STACK
INTEGER:register-set INTEGER:@main/a INTEGER:FROM_STACK
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });

    it('Parse assign a=12 a#b=456 statement' , () => {
        compiler.reset();
        const text = 'a=12 a#b=456';
        const result = compiler.compile(text, 'program');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        // const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        // const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);
        const ic_source = '';


        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
INTEGER:register-set INTEGER:@main/a#b INTEGER:[456]
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });
});