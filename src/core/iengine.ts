import IValue from '../core/ivalue';
import IProgram from '../core/iprogram';



/**
 * VMEngine interface is the runtime of VMPrograms.
 * 
 */
export default interface IEngine {
    get_engine_name():string;

    has_error():boolean;
    get_error_message():string;
    get_error_cursor():number;

    run(program: IProgram):IValue;
}