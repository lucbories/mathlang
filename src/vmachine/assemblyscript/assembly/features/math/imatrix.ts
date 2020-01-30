/**
 * see https://github.com/matthiasferch/tsm/blob/master/src/IMatrix<TIndex, TValue, TVector>.ts
 * 
 */

import { float, FloatArrayCreate } from './float';

export interface IMatrix<TIndex, TValue, TVector> {
    init(values: TValue[]): IMatrix<TIndex, TValue, TVector>;
    reset(): void;
    copy(dest?: IMatrix<TIndex, TValue, TVector>): IMatrix<TIndex, TValue, TVector>;
    equals(matrix: IMatrix<TIndex, TValue, TVector>, threshold:TValue): boolean;

    all(): TValue[];
    row(index: TIndex): TValue[];
    col(index: TIndex): TValue[];
    at(index: TIndex): TValue;

    determinant(): TValue;
    set_identity(): IMatrix<TIndex, TValue, TVector>;

    transpose(): IMatrix<TIndex, TValue, TVector>;
    inverse(): IMatrix<TIndex, TValue, TVector>|undefined;
    negate(): IMatrix<TIndex, TValue, TVector>|undefined;
    multiply(matrix: IMatrix<TIndex, TValue, TVector>): IMatrix<TIndex, TValue, TVector>;
    divide(matrix: IMatrix<TIndex, TValue, TVector>): IMatrix<TIndex, TValue, TVector>;
    add(matrix: IMatrix<TIndex, TValue, TVector>): IMatrix<TIndex, TValue, TVector>;
    substract(matrix: IMatrix<TIndex, TValue, TVector>): IMatrix<TIndex, TValue, TVector>;
    multiply_vector(vector: TVector, result: TVector): TVector;
    divide_vector(vector: TVector, result: TVector): TVector;
    add_vector(vector: TVector, result: TVector): TVector;
    substract_vector(vector: TVector, result: TVector): TVector;
    adjugate(matrix: IMatrix<TIndex, TValue, TVector>): IMatrix<TIndex, TValue, TVector>;

    rotate(angle: TValue): IMatrix<TIndex, TValue, TVector>;
    scale(vector: TValue): IMatrix<TIndex, TValue, TVector>;
    from_rotation(rad_angle:float): IMatrix<TIndex, TValue, TVector>;
    from_scale(scale:float): IMatrix<TIndex, TValue, TVector>;
}

/*

export function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 *
export function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
  }
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 *
export function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 *
export function multiplyScalarAndAdd(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
  }
  
**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 *
export function frob(a) {
    return(Math.hypot(a[0],a[1],a[2],a[3]))
}

fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}

*/