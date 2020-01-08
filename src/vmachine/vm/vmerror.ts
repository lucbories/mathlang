import VMValue from './vmvalue';
import VMErrorType from './vmerror_type';

/**
 * VMError class: error wrapper for VMEngine.run() result.
 */
export default class VMError extends VMValue {
    constructor(private _error_cursor: number, private _error_message:string) {
        super(VMErrorType, undefined);
    }

    public get_error_message() : string { return this._error_message; }
    public get_error_cursor() : number { return this._error_cursor; }

    to_number():number { return this._error_cursor; }
    to_string():string { return this._error_message; }
    
    call_method(method_nane:string, ...operands:VMValue[]):VMValue {
        return undefined;
    }
}