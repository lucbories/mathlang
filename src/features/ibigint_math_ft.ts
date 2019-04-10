import VMValueIface from '../core/ivalue';

interface MathNumberProperties {
    is_unit(a:VMValueIface):boolean;
    is_even(a:VMValueIface):boolean;
    is_zero(a:VMValueIface):boolean;
    is_odd(a:VMValueIface):boolean;
    is_negative(a:VMValueIface):boolean;
    is_positive(a:VMValueIface):boolean;
    is_prime(a:VMValueIface):boolean;
    is_divisible_by(a:VMValueIface, b:VMValueIface):boolean;
};

interface MathNumberTest {
    gcd(a:VMValueIface, b:VMValueIface):VMValueIface;
    lcm(a:VMValueIface, b:VMValueIface):VMValueIface;
    max(a:VMValueIface, b:VMValueIface):VMValueIface;
    min(a:VMValueIface, b:VMValueIface):VMValueIface;
    compare(a:VMValueIface, b:VMValueIface):VMValueIface;
    compare_to(a:VMValueIface, b:VMValueIface):VMValueIface;
    compare_abs(a:VMValueIface, b:VMValueIface):VMValueIface;
    equals(a:VMValueIface, b:VMValueIface):boolean;
    greater(a:VMValueIface, b:VMValueIface):boolean;
    gt_or_equals(a:VMValueIface, b:VMValueIface):boolean;
    lesser(a:VMValueIface, b:VMValueIface):boolean;
    ls_or_equals(a:VMValueIface, b:VMValueIface):boolean;
    is_divisible_by(a:VMValueIface, b:VMValueIface):boolean;
    is_divisible_by(a:VMValueIface, b:VMValueIface):boolean;
    is_divisible_by(a:VMValueIface, b:VMValueIface):boolean;
};

interface MathNumberBits {
    and(a:VMValueIface, b:VMValueIface):VMValueIface;
    or(a:VMValueIface, b:VMValueIface):VMValueIface;
    xor(a:VMValueIface, b:VMValueIface):VMValueIface;
    min(a:VMValueIface, b:VMValueIface):VMValueIface;
    shift_left(a:VMValueIface, b:VMValueIface):VMValueIface;
    shift_right(a:VMValueIface, b:VMValueIface):VMValueIface;
    not(a:VMValueIface):VMValueIface;
    bit_length(a:VMValueIface):VMValueIface;
};

interface MathNumberArith {
    abs(a:VMValueIface):VMValueIface;
    square(a:VMValueIface):VMValueIface;
    next(a:VMValueIface):VMValueIface;
    prev(a:VMValueIface):VMValueIface;
    negate(a:VMValueIface):VMValueIface;
    add(a:VMValueIface, b:VMValueIface):VMValueIface;
    div(a:VMValueIface, b:VMValueIface):VMValueIface;
    sub(a:VMValueIface, b:VMValueIface):VMValueIface;
    mul(a:VMValueIface):VMValueIface;
    pow(a:VMValueIface):VMValueIface;
    div_mod(a:VMValueIface):VMBigIntDivMod;
    mod(a:VMValueIface):VMValueIface;
    mod_inv(a:VMValueIface):VMValueIface;
    mod_pow(a:VMValueIface):VMValueIface;
};

type VMBigIntDivMod = { quotient:VMValueIface, remainder:VMValueIface };
type VMBigIntFeatureIface = MathNumberProperties | MathNumberTest | MathNumberBits | MathNumberArith;

export default VMBigIntFeatureIface;
