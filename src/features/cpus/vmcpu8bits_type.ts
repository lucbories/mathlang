import VMType from '../../../engine/vm/vmtype';
import IFeature from '../../../core/ifeature';
import Cpu8Bits from 'vmcpu8bits';
import VMCpuType from 'vmcpu_type';

const TYPE_NAME:string='Cpu8Bits';
const TYPE_FEATURES:IFeature[]=[];


const TYPE_SINGLETON = new VMCpuType<Cpu8Bits>(TYPE_NAME, TYPE_FEATURES);

export default  TYPE_SINGLETON;