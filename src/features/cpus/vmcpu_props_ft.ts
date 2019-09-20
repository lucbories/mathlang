
import VMMethod from '../../../engine/vm/vmmethod';
import VMFeature from '../../../engine/vm/vmfeature';

import {
	bool_cpu_method,
    bool_cpu_string_method,
    number_cpu_method,
    string_cpu_method
    uint8array_cpu_method
} from './vmcpu_helpers';

import CPU_TYPE from './vmcpu_type';

import TYPE_CONVERTERS from './vmcpu_converters';

type VMCpu = CPU_TYPE.CpuType;


// RETURNS BOOLEAN
const cpu_compile           = bool_cpu_string_method("CpuCompile",     (a:VMCpu, b:string):boolean=>a.compile(b) );
const cpu_run               = bool_cpu_method("CpuRun",                (a:VMCpu):boolean=>a.run() );

// RETURNS NUMBER
const cpu_index             = number_cpu_method("CpuIndex",            (a:VMCpu):number=>a.index() );
const cpu_bits              = number_cpu_method("CpuBits",             (a:VMCpu):number=>a.bits());
const cpu_instructions_size = number_cpu_method("CpuInstructionsSize", (a:VMCpu):number=>a.instructions_size());
const cpu_memory_size       = number_cpu_method("CpuMemorySize",       (a:VMCpu):number=>a.memory_size());
const cpu_registers_size    = number_cpu_method("CpuRegistersSize",    (a:VMCpu):number=>a.registers_size());
const cpu_status_code       = number_cpu_method("CpuStatusCode",       (a:VMCpu):number=>a.status_code() );

// RETURNS STRING
const cpu_label             = string_cpu_method("CpuLabel",            (a:VMCpu):string=>a.label());
const cpu_status_label      = string_cpu_method("CpuStatusLabel",      (a:VMCpu):string=>a.status_label() );

// RETURNS UINT8ARRAY
const cpu_instructions      = uint8array_cpu_method("CpuInstructions", (a:VMCpu):string=>a.instructions());
const cpu_memory            = uint8array_cpu_method("CpuMemory",       (a:VMCpu):string=>a.memory());
const cpu_registers         = uint8array_cpu_method("CpuRegisters",    (a:VMCpu):string=>a.registers());


const TYPE_LOGIC_METHODS:VMMethod[]=[
    // RETURNS NUMBER
    cpu_index, cpu_bits, cpu_instructions_size, cpu_memory_size, cpu_registers_size, cpu_status_code,

    // RETURNS STRING
    cpu_label, cpu_status_label,

    // RETURNS UINT8ARRAY
    cpu_instructions, cpu_memory, cpu_registers
];


class CpuPropsFeature extends VMFeature {
    constructor(){
        super("CpuProperties", TYPE_LOGIC_METHODS, TYPE_CONVERTERS);
    }
}

const TYPE_FEATURE_SINGLETON = new CpuPropsFeature();

export default TYPE_FEATURE_SINGLETON;