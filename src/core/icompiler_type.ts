
import ICompilerFunction from './icompiler_function';


export default interface ICompilerType {
    get_type_name():string;
    equals(type:ICompilerType):boolean;

    get_base_type():ICompilerType;

	get_indexes_count():number;
	set_indexes_count(count:number):void;
	get_indexed_type():ICompilerType;
	set_indexed_type(indexed_type:ICompilerType):void;

    add_attribute(attribute_name:string, attribute_type:ICompilerType):void;
    del_attribute(attribute_name:string):void;
    has_attribute(attribute_name:string):boolean;
    get_attribute(attribute_name:string):ICompilerType;

    has_method_with_types_names(method_name:string, operands:string[]):boolean;
    has_method(method_name:string, operands:ICompilerType[]):boolean;
    get_method_with_types_names(method_name:string, operands:string[]):ICompilerFunction
    get_method(method_name:string, operands:ICompilerType[]):ICompilerFunction;
    add_method(method:ICompilerFunction):void
}

/*
ICompilerTypeList:ICompilerType
	-types:ICompilerType[]

ICompilerLambdaType:ICompilerType
	-lambda_left:ICompilerType
	-lambda_right:ICompilerType

Declare an Array
a=Array[3 x 2 x 5]
----> tableau 3 x 2 x 5
---->[ [ [ 111...115], [ 121...125] ], [ [211...215], [221...225] ], [ [311...315], [321...325] ] ]

Loop on Array
a.iter			1=[ [111...115], [121...125] ]
				2=[ [211...215], [221...225] ]
				3=[ [311...315], [321...325] ]

n=a.iter().iter()
n.first()		1=[111...115]
n.next()		2=[121...125]
				3=[211...215]
				4=[221...225]
				5=[311...315]
n.last()		6=[321...325]

n=a.iter().iter().iter()
				1=111
				...
				5=115
				6=121
				...
				10=125
				...

i=a.iter()
j=i.iter()
k=n.iter()
y[i,j,k]=a[i,j,k]*a[i,0,1]

*/