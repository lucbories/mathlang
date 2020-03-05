Bytecode

Instructions: u32 array

Instruction and its operands: 1 or n u32

Instruction:
u8  opcode
u8  returned type index
u8  data: first operand
u8  data: second operand or trigger to next u32 for operands

with data
u8 < 250: one small constant
u8 = 250: get operand from stack
u8 = 251: more than 2 operands, trigger for next u32
u8 = 253: one inline u32 value in next u32
u8 = 254: one inline i32 value in next u32
u8 = 255: one inline f32 value in next u32

next optional u32 datas:
u8 operands count
u8 data: second operand
u8 data: third operand
u8 data: fourth operand or trigger to next u32 for operands



VM KERNEL Features
Program control flow
Memory
	instructions
	read only values
	read write values
Operations
	Integer standard ops
	Float standard ops
	Complex standard ops
	BigInteger standard ops
	BigFloat standard ops
	BigComplex standard ops
	Collections standard ops: List, Stack, Queue, Map, Set, Range
	Vector/Matrix standard ops
	Tensor standard ops
	Graph standard ops

VM KERNEL Features
Math
	Numerical ops
	Statistical ops
	Algebrical ops
	Vector/Matrix complex ops
	Tensor complex ops
	Graph complex ops
Physics
	

