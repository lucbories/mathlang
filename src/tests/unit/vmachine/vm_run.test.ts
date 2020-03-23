import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

/// <reference path="../../../../node_modules/assemblyscript/std/portable/index.d.ts" />


import Scope from '../../../vmachine/assemblyscript/assembly/runtime/scope';
import Program from '../../../vmachine/assemblyscript/assembly/runtime/program';
import ProgramOptions from '../../../vmachine/assemblyscript/assembly/runtime/program_options';
import VM from '../../../vmachine/assemblyscript/assembly/runtime/vm';
import OPCODES from '../../../vmachine/assemblyscript/assembly/runtime/opcodes';
import { Value, Integer } from '../../../vmachine/assemblyscript/assembly/runtime/value';



// const fs = require("fs");
// const compiled = new WebAssembly.Module(fs.readFileSync(__dirname + "../../../vmachine/build/vm_runtime.wasm"));
// const imports = {
//   env: {
//     abort(_msg:any, _file:any, line:any, column:any) {
//        console.error("abort called at index.ts:" + line + ":" + column);
//     }
//   }
// };
// Object.defineProperty(module, "exports", {
//   get: () => new WebAssembly.Instance(compiled, imports).exports
// });

// 'use strict';
// const fs = require('fs');
// const { WASI } = require('wasi');
// const wasi = new WASI({
//   args: process.argv,
//   env: process.env,
//   preopens: {
//     '/sandbox': '/datas/GITHUB/mathlang/dist'
//   }
// });
// const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

// const importObject = {}

// (async () => {
//   const wasm = await WebAssembly.compile(fs.readFileSync('../../../vmachine/build/vm_runtime.wasm'));
//   const wasm = fs.readFileSync('src/vmachine/assemblyscript/assembly/build/vm_runtime.wasm');
//   const wasmBytes = fs.readFileSync(
//     path.resolve(__dirname, `../../build/${moduleName}.wasm`)
//   );
//   const wasmInstance = WebAssembly.instantiate(wasm, importObject);

//   console.log('wasmInstance', wasmInstance.exports);
// })();


describe('VM run test: programs 1', () => {
    const vm = new VM('vm1');

    it('1+2 => 3 (instructions only)' , () => {
        const instructions = new Uint8Array(10);
        const immutable_memory = new ArrayBuffer(10);
        const mutable_memory = new ArrayBuffer(10);
        const scope = new Scope(instructions, immutable_memory, mutable_memory);
        const program_options = new ProgramOptions();
        const program = new Program(scope, program_options);

        let opdtype:u8 = Value.INTEGER;
        let opd1:u8 = 1;
        let opd2:u8 = 2;

        program.set_instruction(0, OPCODES.I_ADD, opdtype, opd1, opd2);
        program.set_instruction(4, OPCODES.EXIT, opdtype, 0, 0);
        // console.log('instructions', scope.instructions);
        
        const result:Value = vm.run(program);
        console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(3);
    });


    it('1000+2111 => 3111 (instructions only)' , () => {
        const instructions = new Uint8Array(20);
        const immutable_memory = new ArrayBuffer(10);
        const mutable_memory = new ArrayBuffer(10);
        const scope = new Scope(instructions, immutable_memory, mutable_memory);
        const program_options = new ProgramOptions();
        const program = new Program(scope, program_options);

        let opdtype:u8 = Value.INTEGER;
        let opd1:u8 = OPCODES.LIMIT_OPD_INLINE;
        let opd2:u8 = OPCODES.LIMIT_OPD_INLINE;

        program.set_instruction(0, OPCODES.I_ADD, opdtype, opd1, opd2);
        program.set_instruction_i32(4, 1000);
        program.set_instruction_i32(8, 2111);
        program.set_instruction(12, OPCODES.EXIT, opdtype, 0, 0);
        // console.log('instructions', scope.instructions);
        
        const result:Value = vm.run(program);
        console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(3111);
    });


    it('1000+2111 => 3111 (instructions and registers)' , () => {
        const instructions = new Uint8Array(20);
        const immutable_memory = new ArrayBuffer(10);
        const mutable_memory = new ArrayBuffer(10);
        const scope = new Scope(instructions, immutable_memory, mutable_memory);
        const program_options = new ProgramOptions();
        const program = new Program(scope, program_options);

        let opdtype:u8 = Value.INTEGER;
        let opd1:u8 = OPCODES.LIMIT_OPD_REGISTER;
        let opd2:u8 = OPCODES.LIMIT_OPD_REGISTER;

        program.set_instruction(0, OPCODES.I_ADD, opdtype, opd1, opd2);
        program.set_instruction_i32(4, 0);
        program.set_instruction_i32(8, 1);
        program.set_instruction(12, OPCODES.EXIT, opdtype, 0, 0);
        
        program.set_register_value(0, new Integer(11) );
        program.set_register_value(1, new Integer(22) );
        const result:Value = vm.run(program);
        console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(33);
    });
});