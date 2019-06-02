import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



describe('MathLang If IC builder', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    const src_code_1 = 't=12 if t == 13 then a=456 end if b=789.0';
    it('Parse [' + src_code_1 + '] statement' , () => {
        compiler.reset();
        const result = compiler.compile(src_code_1, 'program');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
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
        const labels_str = compiler.dump_ic_functions_labels(false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@t INTEGER:[12]
BOOLEAN:function-call equal INTEGER:@t INTEGER:[13]
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then LABEL:[main_label_0] LABEL:[main_label_2]
INTEGER:register-set INTEGER:@a INTEGER:[456]
FLOAT:register-set FLOAT:@b FLOAT:[789.0]
none:function-declare-leave main`;

        const expected_labels_str = `ICFunction:main labels:
0:main_label_0=5
1:main_label_1=6
2:main_label_2=6
`;

        expect(ic_source).equals(expected_ic_source);
        expect(labels_str).equals(expected_labels_str);
    });


    const src_code_2 = 't=12 if t == 13 then a=456 else a=654 end if b=789.0';
    it('Parse [' + src_code_2 + '] statement' , () => {
        compiler.reset();
        const result = compiler.compile(src_code_2, 'program');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
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
        const labels_str = compiler.dump_ic_functions_labels(false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@t INTEGER:[12]
BOOLEAN:function-call equal INTEGER:@t INTEGER:[13]
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then-else LABEL:[main_label_0] LABEL:[main_label_1] LABEL:[main_label_2]
INTEGER:register-set INTEGER:@a INTEGER:[456]
UNKNOW:goto LABEL:[main_label_2]
INTEGER:register-set INTEGER:@a INTEGER:[654]
FLOAT:register-set FLOAT:@b FLOAT:[789.0]
none:function-declare-leave main`;

const expected_labels_str = `ICFunction:main labels:
0:main_label_0=5
1:main_label_1=6
2:main_label_2=8
`;

        expect(ic_source).equals(expected_ic_source);
        expect(labels_str).equals(expected_labels_str);
    });


    const src_code_3 = 't=12 if t == 13 then a=456 a=789 a=123 else a=654 a=987 end if b=789.0';
    it('Parse [' + src_code_3 + '] statement' , () => {
        compiler.reset();
        const result = compiler.compile(src_code_3, 'program');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
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
        const labels_str = compiler.dump_ic_functions_labels(false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@t INTEGER:[12]
BOOLEAN:function-call equal INTEGER:@t INTEGER:[13]
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then-else LABEL:[main_label_0] LABEL:[main_label_1] LABEL:[main_label_2]
INTEGER:register-set INTEGER:@a INTEGER:[456]
INTEGER:register-set INTEGER:@a INTEGER:[789]
INTEGER:register-set INTEGER:@a INTEGER:[123]
UNKNOW:goto LABEL:[main_label_2]
INTEGER:register-set INTEGER:@a INTEGER:[654]
INTEGER:register-set INTEGER:@a INTEGER:[987]
FLOAT:register-set FLOAT:@b FLOAT:[789.0]
none:function-declare-leave main`;

const expected_labels_str = `ICFunction:main labels:
0:main_label_0=5
1:main_label_1=8
2:main_label_2=11
`;

        expect(ic_source).equals(expected_ic_source);
        expect(labels_str).equals(expected_labels_str);
    });
});