import VMType from '../../../engine/vm/vmtype';
import IFeature from '../../../core/ifeature';


const TYPE_NAME:string='CPU';
const TYPE_FEATURES:=[];


export default class VMCpuType<TCpu> extends VMType {
	
	protected _instances:TCpu[] = [];
	protected _instances_by_label:Map<string,TCpu> = new Map<string,TCpu>();
	
    constructor(type_name:string, features:IFeature[]) {
        super(type_name, features);
    }

    create(protected label:string, bits_size:number, instructions_size:number, memory_size:number, register_size:number):any {
		let index = 1;
		while (this._instances_by_label.has(label)) {
			label += index;
			index++;
		}
		
		let cpu:TCpu = new TCpu(label, instructions_size, memory_size, register_size);
		this._instances.push(cpu);
		this._instances_by_label.set(label, cpu);
		
		return cpu;
	}

    to_number(cpu_value:TCpu):number {
        try {
            return cpu_value.index();
        } catch (e) {
            return -1;
        }
    }
	
    to_string(value:TCpu):string {
        try {
            return cpu_value.label();
        } catch (e) {
            return -1;
        }
    }

    from_number(number_value:number):TCpu {
		if (number_value < 0 || number_value >= this._instances.length) {
			return undefined;
		}
		return this._instances[number_value];
	}
	
    from_string(str_value:string):TCpu {
		return this.instances_by_label.get(str_value);
	}
}