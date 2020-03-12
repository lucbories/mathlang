
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value, Boolean, Integer, Float, /*BigInteger, BigFloat,*/ String, List, Stack, Error, Null } from './value';



/**
 * Scope of a program execution into the VM, contains:
 *   - instructions memory
 *   - readonly values memory
 *   - read/write memory
 *   - 
 *   - 
 * 
 * API:
 *
 *  Load one value:
 *   - get_ro_value(offset:i32):Value - get a value and determine its type
 * 
 *  Load atomic values:
 *   - get one Integer
 *   - get one Float
 *   - get one BigInteger
 *   - get one BigFloat
 * 
 *  Load collections of values:
 *   - get one value of an array
 *
 *  Store atomic values:
 *   - set one Integer
 *   - set one Float
 *   - set one BigInteger
 *   - set one BigFloat
 * 
 *  Store collections of values:
 *   - set one array of values
 */
export default class Scope {
    public instructions:Uint8Array;
    private _values:ArrayBuffer;
    private _values_view:DataView;
    private _out_values:ArrayBuffer;

    constructor(arg_instructions:Uint8Array, arg_in_values:ArrayBuffer, arg_out_values:ArrayBuffer) {
        this.instructions = arg_instructions;
        this._values = arg_in_values;
        this._values_view = new DataView(this._values);
        this._out_values = arg_out_values;
    }

    get_i32_at(offset:i32):i32 {
        return offset >= 0 && offset < this._values_view.byteLength ? this._values_view.getInt32(offset) : 0;
    }

    get_value_at(offset:i32):Value {
        return Scope.get_buffer_value_at(this._values_view, offset);
    }

    static get_buffer_value_at(buffer_view:DataView, offset:i32):Value {
        if (offset >= 0 && offset < buffer_view.byteLength) {
            const type:u8 = buffer_view.getUint8(offset);
            switch(type){
                // Simple types
                case Value.BOOLEAN: {
                    const v:u8 = buffer_view.getUint8(offset + 1);
                    return new Boolean(v > 0 ? 1 : 0);
                }
                case Value.INTEGER: {
                    const v:i32 = buffer_view.getInt32(offset + 1);
                    return new Integer(v);
                }
                case Value.FLOAT: {
                    const v:f32 = buffer_view.getFloat32(offset + 1);
                    return new Float(v);
                }
                // case Value.BIGINTEGER: {
                //     const v:i32 = buffer_view.getInt32(offset + 1);
                //     return new Integer(v);
                // }
                // case Value.BIGFLOAT: {
                //     const v:i32 = buffer_view.getInt32(offset + 1);
                //     return new Integer(v);
                // }
                case Value.STRING: {
                    const size:u16 = buffer_view.getUint16(offset + 1);
                    const dv = new DataView(buffer_view.buffer, offset + 3, size * 2);
                    const v:string = dv.toString();
                    return new String(v);
                }

                // Collections
                case Value.LIST: {
                    const size:u16 = buffer_view.getUint16(offset + 1);
                    let i:u16 = 0;
                    let values:Value[] = [];
                    let value_offset:i32 = offset + 1 + 2;
                    let v:Value;
                    while(i < size){
                        v = Scope.get_buffer_value_at(buffer_view, value_offset);
                        value_offset = value_offset + v.bytes; // TODO break for collections
                    }
                    const list:List = new List(values.length);
                    list.set_all(values);
                    return list
                }
                case Value.STACK: {
                    const v:u32 = buffer_view.getUint32(offset + 1);
                    return new Stack(v);
                }

                // Vectors
                // case Value.BVECTOR: {
                //     const size:u32 = buffer_view.getUint32(offset + 1);
                //     return new Float(v);
                // }
                // case Value.IVECTOR: {
                //     const size:u32 = buffer_view.getUint32(offset + 1);
                //     return new Float(v);
                // }
                // case Value.FVECTOR: {
                //     const size:u32 = buffer_view.getUint32(offset + 1);
                //     return new Float(v);
                // }

                // case Value.: {
                //     const v:f32 = buffer_view.getFloat32(offset + 1);
                //     return new Float(v);
                // }
            }
        }
        return new Error(offset, 'Scope.values:bad offset');
    }
}