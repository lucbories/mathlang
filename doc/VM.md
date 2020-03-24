MathLang is a language for mathematical and science uses.

It provide many usefull features in its core.

It is a compiled language as it targets many runtimes: WebAssembly virtual machine in browser, Typescript/Javascript on nodejs (with platforms optimization).

So MathLang compiler produces an intermediate code which and then a bytecode program.

The bytecode program is run in a virtual machine runtime developped in AssemblyScript: the same runtime can run with Typescript/Javascript or with WebAssembly.


The Virtual Machine capabilities are:
 * buil-in common operations
 * all values inherits a Value class
 * runable in WebAssembly and TypeScript
 * unlimited number of Value registers
 * simple values are inlined into the instructions bytecode

The Virtual Machine has a running loop with a Program as input which consists of:
 * an array of instructions and inline simple values (instructions)
 * an array of mutable values (registers)
 * a stack of calls contexts (context stack)
 * a stack of values for operations (values stack)

The Program registers values are initialized with a binary memory structure (for WebAssembly target) or a List of values.



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
	

