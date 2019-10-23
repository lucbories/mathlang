
CompilerValue
	lang_type:LangType
	data_type:DataType
	data_type_count:int

CompilerDataType:
	int8, int16, int32, int64, int128, int256
	uint8, uint16, uint32, uint64, uint128, uint256
	float32, float64, float128, float256

BinExpr=ComplexExpr or RationalExpr

CompilerLangType:
	PRIMARY
v1		Integer (int* or uint*)
			->isZero()
			->isNegative()
			->isNegativeOrZero()
			->isPositive()
			->isPositiveOrZero()
			->isNegativeInfinite()
			->isPositiveInfinite()
			->setNegativeInfinite()
			->setPositiveInfinite()
v1		Float (float*)
			->isZero()
			->isNegative()
			->isNegativeOrZero()
			->isPositive()
			->isPositiveOrZero()
			->isNegativeInfinite()
			->isPositiveInfinite()
			->setNegativeInfinite()
			->setPositiveInfinite()
v1		Char (int16)
			->encode(encoding:string):Integer
			->decode(encoding:string, code:Integer)
v1		Boolean (int8)
			->isTrue()
			->isFalce()
			->negate()
			->setTrue()
			->setFalse()
		Error
			->getMessage()
		Warning
			->getMessage()
	COMPOSED
v1		Complex (Float, Float) (a [+/- ib] with a,b BinExpr)
v1		Rational (Integer, Integer) (a[/b] with a,b BinExpr)
v1		IntegerRange (Integer, Integer, Integer) (RangeDeclarationExpr= a to b step c with a,b,c IntegerExpr)
v1		FloatRange (Float, Float, Float) (RangeDeclarationExpr= a to b step c with a,b,c FloatExpr)
v2		Iterator (int32:value id, int32:first, int32:next, int32:previous) (IteratorDeclarationExpr=Iterator(id))
v1		Unit (int32:unit id) (UnitDeclarationExpr=Unit(id))
v1		Quantity (Unit, Float:qty) (QuantityDeclarationExpr= Quantity(float, id))
	SPECIAL
v2		TreeNode
v1		String (int16[], int32:length) (StrExpr= '...')
v2		Algebric (Tree of TreeNode) (AlgebraicDeclarationExpr= Algebraic id=AlgebraicExpr)
v1		Sum (Expression, Id, Integer, Integer) (Sum[n from 0 to infinite, 1/(n+1)])
v1		Product (Expression, Id, Integer, Integer) (Product[n from -infinite to infinite, 1/(n+1)])
	COLLECTION
v2		Record
v2		Tree
v1		List
v1		Set
v1		Vector
v1		Matrix
v2		Tensor
	PHYSICS
v3		TIME
v3		ELEMENT
v3		SYSTEM
v3		FORCE
v3		COORDINATE
v3		PLANE
v3		SPACE
v3		TIMESPACE
v4		NSPACE
	MATH
		PROBABILITY

STATEMENTS
	Function
	Loop
	For
	If

EXPRESSIONS
