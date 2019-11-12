--------------------------------------------------------------------------------------------- 
STATEMENTS
--------------------------------------------------------------------------------------------- 
program
   : statement+
   | module+
   | function_declaration+
   ;

module_declaration
   : 'module' + ID
   | use_declaration
   | function_declaration
   | exportable_assign_statement
   ;

use_declaration
   : 'use' + ID
   | 'use' + ID + 'as' + ID
   | 'use' + ID + '(' + ID + (',' + ID)* + ')'
   | 'use' + ID + '(' + ID + (',' + ID)* + ')' + 'as' + ID
   ;

function_declaration
   : 'function' function_header_declaration 'return' ID statement+ 'end function'
   | 'exported' 'function' function_header_declaration 'return' ID statement+ 'end function'
   ;

function_header_declaration
   : ID '(' operands_declaration? ')'
   ;

operands_declaration
   : operand_declaration (',' operand_declaration)*
   ;

operand_declaration
   : ID ('is' ID)?
   ;

primary_id
   : ID
   ;

// MODULE EXPORTED FUNCTION OR CONSTANT
module_id
   : primary_id '.' ID
   ;

attribute_id
   : primary_id '#' ID
   | module_id '#' ID
   ;

function

statement
   : 'if' expression 'then' statement+ ('else' statement+)? 'end if'
   | block_statement
   | 'while' expression 'do' statement+ 'end while'
   | 'for'    ID ('is' ID)? 'in'   expression 'do' statement+ 'end for'
   | 'loop'   ID ('is' ID)? 'from' expression 'to' expression 'step' expression 'do' statement+ 'end loop'
   | 'switch' ID ('is' ID)? 'in' ('on' expression 'do' statement 'end do')+ 'end switch'
   | assign_id_declaration '=' ('async')? expression
   | 'return' expression
   | 'wait' ID (',' ID)* 'do' statement+ 'end wait'
   | 'on' ID '(' (ID (',' operands_declaration)? )? ')' 'do' statement+ 'end on'
   | 'emit' ID '(' box_expression_arguments? ')'
   | 'dispose' ID
   ;

block_statement
   : 'begin' statement+ 'end'
   ;

assign_id_declaration
   : ID (dash_id)? ('.' function_header_declaration)?
   | id_expression
   ;



--------------------------------------------------------------------------------------------- 
EXPRESSIONS
--------------------------------------------------------------------------------------------- 
expression
   : binary_expression
   | parenthesis_expression
   ;

parenthesis_expression
   : '(' binary_expression ')'
   ;

binary_expression
   : binary_add_sub_expression (binop_compare binary_add_sub_expression)*
   ;

binary_add_sub_expression
   : binary_mul_div_expression (binop_addsub binary_mul_div_expression)*
   ;

binary_mul_div_expression
   : unary_expression (binop_muldiv binary_mul_div_expression)*
   ;

unary_expression
   : postfix_expression
   | preunop unary_expression
   | primary_expression
   | 'true'
   | 'false'
   | 'null'
   ;

postfix_expression
   : binary_expression (postunop)?
   ;

id_expression
   : ID (dash_id)? (box_expression_arguments)?
   ;

box_expression_arguments
   : '[' expression_arguments ']'
   ;


expression_arguments
   : binary_expression (',' binary_expression)*
   ;

record_expression
   : '[' ID '->' binary_expression (ID '->' binary__expression)* ']'
   ;



---------------------------------------------------------------------------------------------
TERMINAL
---------------------------------------------------------------------------------------------
dash_id
   : '#' ID
   ;

preunop
   : '++' | '--' | '+' | '-' | '!'
   ;

postunop
   : '++' | '--'
   ;

primary_expression
   : STRING_LITERAL
   | INTEGER
   | FLOAT
   | BIGINTEGER
   | BIGFLOAT
   | ARRAY_LITERAL
   | SET_LITERAL
   | MAP_LITERAL
   ;
   
ARRAY_LITERAL
   : '[' primary_expression (',' primary_expression)* ']'
   ;

SET_LITERAL
   : '{' primary_expression (',' primary_expression)* '}'
   ;

MAP_LITERAL
   : 'Map(' ID '=>' primary_expression (',' ID '=>' primary_expression)* ')'
   ;

STRING_LITERAL
   : '(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*'
   ;

ID
   : [a-zA-Z][a-zA-Z0-9_]*
   ;

WS
   : [ \r\n\t] -> skip
   ;



---------------------------------------------------------------------------------------------
ERRORS MANAGEMENT
---------------------------------------------------------------------------------------------
...
f(...) returns TYPE
	...
	emit error('ERROR_NAME', optional args set) 
	...
	on error('ERROR_NAME', ARGS_ARRAY_NAME) do
		...
	end error
end function
on error('ERROR_NAME', ARGS_ARRAY_NAME) do
	...
end error
...








******************************************************************************
program         = 1+statement
blockStatement  = 0+statement
statement       = ifStatement | whileStatement | forStatement | loopStatement | assignStatement

ifStatement     = Keyword(if)    + expression + Keyword(then) + blockStatement + ? (Keyword(else) + blockStatement) + Keyword(end if)
whileStatement  = Keyword(while) + expression + Keyword(do) + blockStatement + Keyword(end while)
forStatement    = Keyword(for)   + ID + Keyword(in) + expression + Keyword(do) + blockStatement + Keyword(end for)
loopStatement   = Keyword(loop)  + ID + Keyword(from) + expression + Keyword(to) + expression + Keyword(step) + expression + Keyword(do) + blockStatement + Keyword(end loop)
switchStatement   = Keyword(switch) + ID + Keyword(in) + 1+(Symbol(on) expression + Symbol(do) blockStatement + Keyword(end do)) + Keyword(end switch)

assignStatement = ID + 0+AssignMemberOptionExpression + Symbol(=) + expression

functionStatement = Keyword(function) + functionArguments + Keyword(return) + ID + blockStatement + Keyword(end function)
functionArguments = Symbol('(') + 0+(ID + Symbol(:) + ID) + Symbol(')')
returnStatement   = Keyword(return) + expression

asyncStatement    = ?(ID + Symbol(=)) + Keyword(async) + expression
ou
asyncExpression   = Keyword(async) + expression
waitStatement     = Keyword(wait) + ID + Keyword(do) + blockStatement + Keyword(end wait)

onErrorStatement  = Keyword(on error) + Keyword(do) +  blockStatement + Keyword(end on error)

expression




Dqns une fonction, on ne peut pas avoir d'expression sans instruction cad on doit avoir
soit variable = expression
soit return expression
mais jamais expression seule.
==> pas de procedure a appeler, que des fonctions



exe:	ValueName=[async ]web.get(url, options)[ on error do ... end on error]
    	ValueName=[async ]web.put(url, options)


******************************************************************************
Language:

Objectifs: concis, flexible, one way, quick
Value creation:		ValueName=ValueType(...)
Value deletion:		dispose ValueName
Value update:		ValueName=...
Value operation:	ValueName.ValueOperation(...)
Values operation:	ValueName#CollectionName.all().ValueOperation(...)
Value property:		ValueName#PropertyName

Collections:
	List:
		ex of use: text1.words.filter.begins('a').foreach.remove()
		.append(Value)
		.remove(Value)
		.filter(...):tmp List
		.clear()
		.count()
	Set


**********************************************************************************
USAGES
power		1000=pow(10,3)
exponential	e(i)=1	exp(i)=1
Calculs
*	in:1+2
	out:3 (Number)
*	in:sin(3x+2x)+10*pow(3,4)
	out:sin(5x)+810 (Function)
*	in:t=Text('...').words.stats
	out:	word	count	...		(ListStats)
			a...	23		...
			b...	12		...
*	in:Text('abcd efgh appoo jejji abcd', ' ', '\n').words
	out:	abcd		(List)
			efgh
			appoo
			jejji
			abcd
*	in:Text('abcd efgh appoo\njejji abcd', ' ', '\n').lines
	out:	abcd efgh appoo		(List)
			jejji abcd
*	in:Text('abcd efgh. appoo\njejji abcd', [' '], ['\n'], ['.', '!', '?']).sentences
	out:	abcd efgh		(List)
			appoo
			jejji abcd	
*	in:t=Text('abcd efgh. appooe\njejji abcddde', [' '], ['\n'], ['.', '!', '?'])
	out:Text t is created
*	in:w1=t.words.filter.startsWith('a').endsWith('e')
	out:	appooe		List
			abcddde
*	in:w2=t.words.filter.startsWith('a').endsWith('e').endFilter.append('asoe').sortAlpha()
	===»w2=t.words.applyFuzzy(
			collection=>filter(collection, item=>item.beginsWith('a') || item=>item.endsWith('e') ),
			collection=>append(collection, 'asoe'),
			collection=>sortAlpha(collection)
			)
	===»w2=t.words.apply(
			collection=>sortAlpha(
				append(
					filter(collection, item=>item.beginsWith('a') || item=>item.endsWith('e') ),
					'asoe')
				)
			)
	out:	abcddde	List
			appooe
			asoe
			
*	in:w3=	w3=w2.all.length
			t3=Table(w2.length, 2).fillColumn(1,w2, 'Word').fillColumn(2,w3, 'Chars').appendRow('Total', 0)
			t3Total=t3.colunm(2).sum()
			t3.lastRow.setColumn(2, t3Total)
	out:	Word		Chars
			abcddde		7
			appooe		6
			asoe		4
			Total		17
			
*	in:w3=	w3=Table.column(1, w2).column(2, w2.map.length).appendRow('Total', sum(w2.map.length) )
	out:	Word		Chars
			abcddde		7
			appooe		6
			asoe		4
			Total		17