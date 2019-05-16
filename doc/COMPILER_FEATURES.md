
LANGUAGES SYNTAX		LEXEMES	CST		AST		IC		IC->VM	VM	TODO
Compiler				done	done	done	ec		.		N/A

EXPRESSION
parenthesis expression	done	done	done	done	N/A		.	.
true,false,null symbols	done	done	done	done	.		.	.
primary values str,...	done	done	done	done	.		.	.
record,array,set		done	done	done	done	.		.	.
pre unary operators		done	done	done	done	.		.	.
post unary operators	done	done	done	done	.		.	.
binary operators		done	done	done	done	.		.	.
simple identifier		done	done	done	done	.		.	.
id#attribute			done	done	done	done	.		.	.
id.method				done	done	done	done	.		.	.
id(#attribute)(.method)	done	done	done	.		.		.	IC get_id(id,accessors=[...])
attribute_id[args]		done	done	done	.		.		.	IC get_id(id,accessors=[...])
function call			done	done	done	.		.		.	call id (args)
method call				done	done	done	.		.		.	IC call get_id(id,accessors) (args)

STATEMENTS
program					done	done	done	N/A		N/A		.	.
function declaration	done	done	done	done	.		.	.
block					done	done	done	N/A		N/A		.	.
assign					done	done	done	done	.		.	.
async assign			done	done	done	.		.		.	.
if then else			done	done	done	.		.		.	.
loop from to step		done	done	done	.		.		.	.
for of					done	done	done	.		.		.	add iterable flag and operators on VMValues
while 					done	done	done	.		.		.	.
switch					done	done	done	.		.		.	optimize IC
function return			done	done	done	.		.		.	.
emit, on ... do			done	done	done	.		.		.	.
wait					done	done	done	.		.		.	.
const declaration		.		.		.		.		.		N/A	.
var declaration			done	done	done	done	.		.	.	(auto declaration with assign)



MathLang text->lexemes->CST-> AST -> IC -> VMInstructions
					                    -> WASM