import IValue from '../../core/ivalue';
import IInstruction from '../../core/iinstruction';

import VMEngine from '../../engine/vm/vmengine';
import VMProgramOptions from '../../engine/vm/vmprogramoptions';
import VMProgram from '../../engine/vm/vmprogram';


export type IInstructionRecord = {instruction:IInstruction, label:string|undefined};


export function test_simple_program(values:IValue[], main_instr:IInstruction, instructions?:IInstructionRecord[]):IValue {
  const program1_options = new VMProgramOptions();
  program1_options.entry_label = 'main';
  program1_options.registers = 10;
  program1_options.stack = 10;
  program1_options.instructions = 20;
  
  
  const program1 = new VMProgram("program1", program1_options);

  // SET VALUES
  let value:IValue;
  for(value of values.reverse()) {
    program1.push_value(value);
  }
  
  // SET INSTRUCTIONS
  if (main_instr && ! instructions) {
    program1.set_instruction(0, main_instr, 'main');
  } else if (instructions) {
    let instr_record:IInstructionRecord;
    for(instr_record of instructions) {
      program1.add_instruction(instr_record.instruction, instr_record.label);
    }
  } else {
    console.error('test_simple_program: bad instructions');
    return undefined;
  }

  const engine = new VMEngine('engine');
  const result1 = engine.run(program1);
  
  return result1;
}