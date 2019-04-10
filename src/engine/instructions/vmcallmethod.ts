import VMValueIface from '../../core/ivalue';
import VMCustom from './vmcustom';

/**
 * VMMethodCall(3): call a method with 2 operands.
 * The instruction first argument is for the method value instance.
 * 
 */
export default class VMCallMethod extends VMCustom {
    constructor(private _method_name:string, operands_count:number) {
        super(operands_count)
    }

    get_inline_string_1():string { return this._method_name; }
    

    _eval_unsafe(...values:VMValueIface[]):VMValueIface {
        const value = values[0];
        const operands = values.slice(1);
        
        const method = value.get_type().get_method_with_values(this._method_name, operands);
        if (method)
        {
            return method.eval_unsafe(value, operands);
        }

        this.error_bad_method_name();
        return undefined;
    }

    _eval_safe(...values:VMValueIface[]):VMValueIface {
        const value = values[0];
        const operands = values.slice(1);
        
        const method = value.get_type().get_method_with_values(this._method_name, operands);
        if (method)
        {
            return method.eval_safe(value, operands);
        }

        this.error_bad_method_name();
        return undefined;
    }

    _eval_debug(...values:VMValueIface[]):VMValueIface {
        const value = values[0];
        const operands = values.slice(1);
        
        const method = value.get_type().get_method_with_values(this._method_name, operands);
        if (method)
        {
            return method.eval_debug(value, operands);
        }

        this.error_bad_method_name();
        return undefined;
    }

    error_bad_method_name() {
        // ...
    }
}
