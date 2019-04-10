import IValue from '../core/ivalue';
import IFeature from '../core/ifeature';

interface IMathNumberPropertiesFt extends IFeature {
    is_unit(a:IValue):boolean;
    is_even(a:IValue):boolean;
    is_zero(a:IValue):boolean;
    is_odd(a:IValue):boolean;
    is_negative(a:IValue):boolean;
    is_positive(a:IValue):boolean;
    is_prime(a:IValue):boolean;
    is_divisible_by(a:IValue, b:IValue):boolean;
};