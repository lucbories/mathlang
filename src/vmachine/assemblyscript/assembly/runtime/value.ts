
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />


function i32(v:i32):i32 { return v; }


export class Value {
    public static ERROR:u8      = 0;
    public static BOOLEAN:u8    = 1;
    public static INTEGER:u8    = 2;
    public static FLOAT:u8      = 3;
    public static BIGINTEGER:u8 = 4;
    public static BIGFLOAT:u8   = 5;
    public static STRING:u8     = 6;
    public static NULL:u8       = 7;

    public static LIST:u8       = 11;
    public static STACK:u8      = 12;

    public static BVECTOR:u8    = 21;
    public static IVECTOR:u8    = 22;
    public static FVECTOR:u8    = 23;
    public static BIVECTOR:u8   = 24;
    public static BFVECTOR:u8   = 25;

    public static BMATRIX:u8    = 31;
    public static IMATRIX:u8    = 32;
    public static FMATRIX:u8    = 33;
    public static BIMATRIX:u8   = 34;
    public static BFMATRIX:u8   = 35;

    public static CUSTOM:u8     = 99;
    public static EMPTY:u8      = 255;
    
    public type:u8;
    public bytes:u32;

    constructor(arg_type:u8, arg_bytes:u32) {
        this.type = arg_type;
        this.bytes = arg_bytes;
    }
    is_true():boolean { return true; }

    public bytes_collection_size():u32 {
        return this.bytes;
    }
}

export class Simple<T> extends Value {
    public value:T;

    constructor(v:T, arg_type:u8, arg_bytes:u32) {
        super(arg_type, arg_bytes);
        this.value = v;
    }

    public is_true():boolean {
        return true;
    }
}

export class Simple2<T> extends Value {
    public value_1:T;
    public value_2:T;

    constructor(v1:T, v2:T, arg_type:u8, arg_bytes:u32) {
        super(arg_type, arg_bytes);
        this.value_1 = v1;
        this.value_2 = v2;
    }

    public is_true():boolean {
        return true;
    }
}

export class Boolean extends Simple<u8> {
    constructor(v:u8) {
        super(v, Value.BOOLEAN, 1);
    }
}

export class Integer extends Simple<i32> {
    constructor(v:i32) {
        super(v, Value.INTEGER, 4);
    }
}

export class Float32 extends Simple<f32> {
    constructor(v:f32) {
        super(v, Value.FLOAT, 4);
    }
}

export class Float extends Simple<f64> {
    constructor(v:f64) {
        super(v, Value.FLOAT, 8);
    }
}

export class Text extends Simple<string> {
    constructor(v:string) {
        super(v, Value.STRING, 1 + v.length * 2);
    }
}

export class List extends Value {
    private _values:Value[];
    constructor(size:u32) {
        super(Value.LIST, 4);
        this._values = new Array<Value>(size);
    }
    public get(index:u32):Value {
        return this._values[index];
    }
    public set(index:u32, v:Value):void {
        this._values[index] = v;
    }
    public set_all(values:Value[]):void {
        this._values = values;
    }
    public size():u32 {
        return this._values.length;
    }
    public bytes_size():u32 {
        // let s:u32 = 4;
        // let i:i32 = 0;
        // let v:Value;
        // while(i < this._values.length){
        //     v = this._values[i];
        //     if (v) {
        //         s += v.bytes_collection_size();
        //     } else {
        //         s += 4;
        //     }
        //     i++;
        // }
        // return s;
        return 4 + this._values.length * 4;
    }
    public is_valid_index(index:u32):boolean {
        return index >= 0 && i32(index) < this._values.length;
    }
    public is_true():boolean { return true; }
}

export class Stack extends Value {
    private _values:Value[];
    private _top:u32 = -1;
    constructor(size:u32) {
        super(Value.STACK, 4);
        this._values = new Array<Value>(size);
    }
    public get(index:u32):Value {
        return this._values[index];
    }
    public pop():Value {
		const v:Value = this._values[this._top--];
        return v;
    }
    public push(v:Value):void {
        ++this._top;
        this._values[this._top] = v;
    }
    public size():u32 {
        return this._values.length;
    }
    public top():u32 {
        return this._top;
    }
    public is_full():boolean {
        return this._top + 1 == this._values.length;
    }
    public is_empty():boolean {
        return this._top < 0;
    }
    public is_true():boolean { return true; }
}

export class Error extends Value {
    public code:i32;
    public message:string;
    constructor(v:i32, msg:string) {
        super(Value.ERROR, 1);
        this.code= v;
        this.message = msg;
    }
    is_true():boolean { return true; }
}

export class Null extends Value {
    constructor() {
        super(Value.NULL, 1);
    }
    is_true():boolean { return true; }
}
