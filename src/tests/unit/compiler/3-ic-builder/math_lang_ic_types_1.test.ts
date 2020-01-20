import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../../compiler/0-common/compiler_ic_builder'


describe('MathLang IC test: types', () => {
    const compiler = new MathLangCompiler();

    it('Type declaration: module ABC type type1 extends INTEGER' , () => {
        compiler.reset();
        const text = 'type type1 extends INTEGER end type';
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
        const expected_ic_source = ``;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Type declaration -> module mA type type1 extends INTEGER module mB use mA use std function main() as mA@type1 return std@New(\'type1\') end function' , () => {
        compiler.reset();
        const text = 'module mA type type1 extends INTEGER end type module mB use mA use std function main() as mA@type1 return std@New(\'type1\') end function';
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
        const expected_ic_source = `local function main():mA@type1
ebb0()
v0:GENERIC = call std@New s_inline('type1')
return v0
`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Type declaration -> properties, attribute, method' , () => {
        compiler.reset();
        const text = `module mA
type type1 extends INTEGER
  is_scalar = true
  is_textual = false
  is_collection = false
  value is INTEGER
  add(a is mA@type1, b is INTEGER) as INTEGER = a#value + b
end type

module mB
use mA
use std
function main() as mA@type1 return std@New(\'type1\') end function
`;
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

        // TEST TYPE
        const type1 = compiler.get_scope().get_module('mA').get_module_type('mA@type1');
        expect(type1.is_scalar()).is.true;
        expect(type1.is_textual()).is.false;
        expect(type1.is_collection()).is.false;
        expect(type1.has_attribute('value')).is.true;
        expect(type1.get_attribute('value').get_type_name()).equals('INTEGER');
        expect(type1.has_method_with_types_names('add', ['mA@type1', 'INTEGER'])).is.true;
        expect(type1.get_method_with_types_names('add', ['mA@type1', 'INTEGER']).get_returned_type().get_type_name()).equals('INTEGER');

        // TEST IC TEXT
        const expected_ic_source = `local function main():mA@type1
ebb0()
v0:GENERIC = call std@New s_inline('type1')
return v0
`;
        expect(ic_source).equals(expected_ic_source);

        const t = modules.get('mA').get_module_type('mA@type1');
        const method_add = t.get_method('add', [t, compiler.TYPE_INTEGER]);
        expect(method_add.get_returned_type().get_type_name()).equals('INTEGER');
        expect(method_add.get_symbols_opds_ordered_list().length).equals(2);
    });


    
//     it('Type declaration and local use: main()=>t1=std@NewType("type1", "INTEGER", true, false, false) f() as t1' , () => {
//         compiler.reset();
//         const text = 'module mA type type1 extends INTEGER module mB use mA use std function main() as UNKNOW t1=std@NewType(\'type1\', \'INTEGER\', true, false, false) f(x is type1)=x + 1 end function';
//         const result = compiler.compile(text, 'program');

//         // ERRORS
//         if (! result){
//             const errors = compiler.get_errors();
//             console.log('errors', errors);

//             expect(errors.length).equals(0);
//             return;
//         }

//         // GET IC CODE
//         const compiler_scope = compiler.get_scope();
//         const modules = compiler_scope.get_new_modules();
//         expect(modules.size).equals(2);
//         const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, true);

//         // TEST IC TEXT
//         const expected_ic_source = `local function main():UNKNOW
// ebb0()
// v1:TYPE = call std@NewType s_inline('type1', 'INTEGER') b_inline(1) b_inline(0) b_inline(0)
// v0:TYPE = v1
// `;
//         expect(ic_source).equals(expected_ic_source);
//     });

});