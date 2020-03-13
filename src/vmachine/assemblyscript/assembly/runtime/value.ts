
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

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
}

export class Simple<T> extends Value {
    public value:T;

    constructor(v:T, arg_type:u8, arg_bytes:u32) {
        super(arg_type, arg_bytes);
        this.value = v;
    }

    public is_true() {
        return this.value || false;
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
    constructor(v:Value[]|u32) {
        super(Value.LIST, 1);
        this._values = v instanceof Array ? v : new Array<Value>(v);
        // let i:u32 = 0;
        // while(i < this._values)
    }
    get(index:u32) {
        return this._values[index];
    }
    set(index:u32, v:Value) {
        this._values[index] = v;
    }
    size() {
        return this._values.length;
    }
    is_valid_index(index:u32) {
        return index > 0 && index < this._values.length;
    }
}

export class Stack extends Value {
    private _values:Value[];
    private _top:u32 = 0;
    constructor(size:u32) {
        super(Value.STACK, 1);
        this._values = new Array<Value>(size);
    }
    pop() {
        return this._values[this._top--];
    }
    push(v:Value) {
        ++this._top;
        this._values[this._top] = v;
    }
    size() {
        return this._top + 1;
    }
    is_full() {
        return this._top + 1 == this._values.length;
    }
    is_empty() {
        return this._top < 0;
    }
}

export class Error extends Value {
    public value:i32;
    public message:string;
    constructor(v:i32, msg:string) {
        super(Value.ERROR, 1);
        this.value= v;
        this.message = msg;
    }
}

export class Null extends Value {
    constructor() {
        super(Value.NULL, 1);
    }
}