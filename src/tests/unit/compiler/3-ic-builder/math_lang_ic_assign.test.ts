import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



describe('MathLang assign IC builder', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse assign a=456 statement' , () => {
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
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[456]
none:function-declare-leave main`;
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
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:function-call add INTEGER:[456] INTEGER:[789]
INTEGER:register-set INTEGER:@a INTEGER:FROM_STACK
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
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[12]
none:function-declare-leave main
none:function-declare-enter INTEGER.b
INTEGER:function-return INTEGER:[456]
none:function-declare-leave INTEGER.b`;
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
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[12]
none:function-declare-leave main
none:function-declare-enter INTEGER.b
FLOAT:function-return FLOAT:[456.0]
none:function-declare-leave INTEGER.b`;
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
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[12]
none:function-declare-leave main
none:function-declare-enter INTEGER.b
FLOAT:function-call add FLOAT:@x FLOAT:[456.0]
FLOAT:function-return FLOAT:FROM_STACK
none:function-declare-leave INTEGER.b`;
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
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@b INTEGER:[5]
INTEGER:function-call add_one INTEGER:@b
INTEGER:function-call mul INTEGER:FROM_STACK INTEGER:[8]
INTEGER:function-call add INTEGER:[456] INTEGER:FROM_STACK
INTEGER:register-set INTEGER:@a INTEGER:FROM_STACK
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
        const ic_functions_map = compiler.get_ic_functions_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[12]
INTEGER:register-set INTEGER:@a#b INTEGER:[456]
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });
});