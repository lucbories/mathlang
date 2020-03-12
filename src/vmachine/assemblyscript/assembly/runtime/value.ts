
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

export class Text extends Simple<u8> {
    constructor(v:u8) {
        super(v, Value.BOOLEAN, 1);
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

export class Float extends Simple<f32> {
    constructor(v:f32) {
        super(v, Value.FLOAT, 4);
    }
}

export class Complex extends Simple2<f32> {
    constructor(v1:f32, v2:f32) {
        super(v1, v2, Value.FLOAT, 8);
    }
}

export class String extends Simple<string> {
    constructor(v:string) {
        super(v, Value.STRING, 1 + v.length * 2);
    }
}

export class List extends Value {
    private _values:Value[];
    constructor(size:u32) {
        super(Value.LIST, 1);
        this._values = new Array<Value>(size);
        // let i:u32 = 0;
        // while(i < this._values)
    }
    get(index:u32):Value {
        return this._values[index];
    }
    set(index:u32, v:Value):void {
        this._values[index] = v;
    }
    set_all(values:Value[]):void {
        this._values = values;
    }
    size():u32 {
        return this._values.length;
    }
    is_valid_index(index:u32):boolean {
        return index >= 0 && i32(index) < this._values.length;
    }
    is_true():boolean { return true; }
}

export class Stack extends Value {
    private _values:Value[];
    private _top:u32 = 0;
    constructor(size:u32) {
        super(Value.STACK, 1);
        this._values = new Array<Value>(size);
    }
    pop():Value {
        return this._values[this._top--];
    }
    push(v:Value):void {
        ++this._top;
        this._values[this._top] = v;
    }
    size():u32 {
        return this._top + 1;
    }
    is_full():boolean {
        return this._top + 1 == this._values.length;
    }
    is_empty():boolean {
        return this._top < 0;
    }
    is_true():boolean { return true; }
}

export class Error extends Value {
    public value:u32;
    public message:string;
    constructor(v:u32, msg:string) {
        super(Value.ERROR, 1);
        this.value= v;
        this.message = msg;
    }
    is_true():boolean { return true; }
}

export class Null extends Value {
    constructor() {
        super(Value.ERROR, 1);
    }
    is_true():boolean { return true; }
}