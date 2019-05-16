LANGUAGES FEATURES		VM		TODO
Boolean Arithmetic		done	.
Number Arithmetic		done	.
Big Arithmetic			done	.
Text ops				done	Add iterable on chars/words/lines
Collection:set, map...	.		Create types and ops for Map,Set,List,FIFO,LIFO,Stack
Dataset:load,query		.		Create Dataset type and ops (see feature)
Image:load,ops			.		Create Image types and ops
Theorem,lemme,fact		.		Create Lexeme/Theorem types and ops
Vector/Matrix			.		Create Vector/Matrix types and ops
Tensor1..6d				.		Create Tensor* types and ops
Geometry				.		Create Geo* types and ops
FSM						.		Create FSM type and ops
Quantity				.		Create Quantity type and ops







-----------------------
COLLECTION feature
-----------------------
Iterable:
	LIST: ordered collection of any value
	STACK: ordered collection of any value
	FIFO: ordered collection of any value
	LIFO: ordered collection of any value
	SET: unordered collection of any value

Iterable an key able:
	MAP: unordered collection of key,value pairs
	
Iterable and n-indexable:
	VECTOR: ordered indexed collection of numerical values (1 dimension) <=> TENSOR1D
	MATRIX: ordered indexed collection of numerical values (2 dimension) <=> TENSOR2D
	TENSOR1D: ordered indexed collection of numerical values (1 dimension)
	...
	TENSOR6D: ordered indexed collection of numerical values (6 dimension)
	

-----------------------
THEOREM feature
-----------------------
http://sites.millersville.edu/bikenaga/math-proof/rules-of-inference/rules-of-inference.html
http://integral-table.com/downloads/logic.pdf
https://www.geeksforgeeks.org/mathematical-logic-rules-inference/

Example 1
	lemme1= A U B 

Logic Proofs
	Premises => Modus ponens
	1	P		(premise)
	2	P->Q	(premise)
	3	Q		(is true)
~		negation
~~		double negation
->		if then						(A^B)->C	if (A^B) is true then C is true
A V B	disjunction
A ^ B	conjunction

Rules:
	~P, P V Q then Q
	~(P V Q) ==> ~P ^ ~Q
	~P ^ ~Q  ==> ~(P V Q)
	~(P ^ Q) ==> ~P V ~Q
	~P V ~Q  ==> ~(P ^ Q)
	~P, P V Q ==> Q
	~P V Q ==> P->Q
	P->Q ==> ~P V Q

Table of Logical Equivalences
	Commutative		p ∧ q ⇐⇒ q ∧ p p ∨ q ⇐⇒ q ∨ p
	Associative		(p ∧ q) ∧ r ⇐⇒ p ∧ (q ∧ r) (p ∨ q) ∨ r ⇐⇒ p ∨ (q ∨ r)
	Distributive	p ∧ (q ∨ r) ⇐⇒ (p ∧ q) ∨ (p ∧ r) p ∨ (q ∧ r) ⇐⇒ (p ∨ q) ∧ (p ∨ r)
	Identity		p ∧ T ⇐⇒ p p ∨ F ⇐⇒ p
	Negation		p∨ ∼ p ⇐⇒ T p∧ ∼ p ⇐⇒ F
	Double Negative	∼ (∼ p) ⇐⇒ p
	Idempotent		p ∧ p ⇐⇒ p p ∨ p ⇐⇒ p
	Universal Bound	p ∨ T ⇐⇒ T p ∧ F ⇐⇒ F
	De Morgan’s		∼ (p ∧ q) ⇐⇒ (∼ p) ∨ (∼ q) ∼ (p ∨ q) ⇐⇒ (∼ p) ∧ (∼ q)
	Absorption		p ∨ (p ∧ q) ⇐⇒ p p ∧ (p ∨ q) ⇐⇒ p
	Conditional		(p =⇒ q) ⇐⇒ (∼ p ∨ q) ∼ (p =⇒ q) ⇐⇒ (p∧ ∼ q)

Rules of Inference
	Modus Ponens	p =⇒ q			p,  ∴q		(p ^ (p->q))->q
	Modus Tollens	p =⇒ q			~q, ∴∼p
	Elimination		p ∨ q			~q, ∴p 
	Transitivity	p =⇒ q			q =⇒ r, ∴p =⇒ r
	Generalization	p =⇒ p ∨ q
					q =⇒ p ∨ q
	Specialization	p ∧ q =⇒ p
					p ∧ q =⇒ q
	Conjunction		p				q, ∴p ∧ q	
	Contradiction Rule ∼p =⇒ F		∴ p

Def
	Sum			P V ~Q
	Product		P ^ ~Q


-----------------------
QUANTITY feature
-----------------------
a = Quantity(12 cm).to(inch)#unit/#magnitude


-----------------------
DATASET feature
-----------------------
data loading: (async, return nothing, emit DatasetLoadError)
	fromCSV(url) 					
	fromJSON(url)
	fromSET(set expression)
	fromMAP(map expression)
	fromVECTOR(vector expression)
	fromMATRIX(matrix expression)
	
data query: (use MS Linq library) (async, return nothing, emit DatasetQueryError)
	select, groupby, orderby...

data stat analyse: (async, return ..., emit DatasetStatError)
	count():INT
	distribution():?
	unique():MAP<column name,column distinct values number>
	avg(numeric column):

EXAMPLES
	IRIS_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"
		_CITATION = """\
		@misc{Dua:2019 ,
		author = "Dua, Dheeru and Graff, Casey",
		year = "2017",
		title = "{UCI} Machine Learning Repository",
		url = "http://archive.ics.uci.edu/ml",
		institution = "University of California, Irvine, School of Information and Computer Sciences"
	https://storage.googleapis.com/openimages/web/index.html


-----------------------
FSM feature
-----------------------
	add/remove state
	add/remove transition
	f = FSM([stateA, stateB, stateC])
	f = FSM([stateA, stateB, stateC], [stateA->stateB, stateA->stateC...])
	f.allowTransition(stateA, stateB)
	f.disallowTransition(stateA, stateB)
	on f#statA(opds) do ... emit f#stateB(datas) end on







Target:
MathLang Online Notebook
	IN[n]:1+2
	OUT[n]:3
Switch between contexts:text,arith,geom,logical



******************************************************************************
Text analyze:
types:
	Text=List of Sentence
	Sentence=List of Word
	Word=List of Char
	Char
Text(sentences_separator, word_separator)
Text.fromString(...)
Text.sentences=List of Sentence
Sentence.words=List of Word
Word.chars:List of Char



******************************************************************************
Logical:
Fact
Boolean:and,or,xor,not,ifthen,ifthenelse
Lemme: List of Fact => List of Fact
Theorem



******************************************************************************
Geometry:

Types:
Point1d
Point2d
Point3d
Point4d

Space1d
Space2d
Space3d
Space4d

Line2d
Circle2d

Curve2d
Curve3d
Curve4d

Sphere3d
Sphere4d

Box2d
Box3d
Box4d

operations:
	union, group, intersect, isInside(geom), isOutside(geom),
	vertices, edges
	rotate, scale, translate




Tools:

https://elshor.github.io/dstools/

https://github.com/R-js/blasjs


LINQ
http://kutyel.github.io/linq.ts/docs/classes/list/index.html#groupby

https://github.com/dzharii/awesome-typescript

https://github.com/AssemblyScript/assemblyscript/blob/master/src/compiler.ts
https://webassembly.org/docs/web/


https://shiffman.net/a2z/text-analysis/
https://github.com/dhowe/RiTaJS
https://www.npmjs.com/package/sentence-tokenizer


Units...
https://github.com/arguiot/TheoremJS

Stats: rich, ts types
https://github.com/simple-statistics/simple-statistics


https://blog.codingbox.io/exploring-javascript-typed-arrays-c8fd4f8bd24f
https://thekevinscott.com/tensors-in-javascript/
https://www.tensorflow.org/probability/
