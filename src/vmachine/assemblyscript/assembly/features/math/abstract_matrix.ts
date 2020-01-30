/**
 * see https://github.com/matthiasferch/tsm/blob/master/src/Matrix2.ts
 * 
 */

import { IMatrix } from './imatrix';
import { Vector2 as vec2 } from './vector2';

import { epsilon } from './constants';

import { integer } from './integer';
import { float, FloatArrayCreate } from './float';


export abstract class Matrix<TValue, TVector> implements IMatrix<integer, TValue, TVector> {

    constructor(values?: TValue[]) {
        if (values !== undefined) {
            this.init(values)
        }
    }

    private _default_value:TValue;
    private _size_rows:integer;
    private _size_cols:integer;
    private _values:TValue[];

    // static readonly identity = new Matrix().setIdentity();

    at(index: integer): TValue {
        return this._values[index];
    }

    init(values: TValue[]): IMatrix<integer, TValue, TVector> {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i] = values[i];
        }

        return this;
    }

    reset(): void {
        for (let i = 0; i < this._values.length; i++) {
            this._values[i] = this._default_value;
        }
    }

    // copy(dest?: Matrix<TValue, TVector>): Matrix<TValue, TVector> {
    //     if (!dest) { dest = new Matrix(); }

    //     for (let i = 0; i < 4; i++) {
    //         dest._values[i] = this._values[i];
    //     }

    //     return dest;
    // }

    all(): TValue[] {
        const data: TValue[] = [];
        for (let i = 0; i < this._values.length; i++) {
            data[i] = this._values[i];
        }

        return data;
    }

    row(index: integer): TValue[] {
        return [
            this._values[index * 2 + 0],
            this._values[index * 2 + 1],
        ]
    }

    col(index: integer): TValue[] {
        return [
            this._values[index],
            this._values[index + 2],
        ]
    }

    // equals(matrix: Matrix<TValue, TVector>, threshold = epsilon): boolean {
    //     for (let i = 0; i < 4; i++) {
    //         if (Math.abs(this._values[i] - matrix.at(i)) > threshold) {
    //             return false;
    //         }
    //     }

    //     return true;
    // }

    // determinant(): TValue {
    //     return this._values[0] * this._values[3] - this._values[2] * this._values[1];
    // }

    // setIdentity(): Matrix<TValue, TVector> {
    //     this._values[0] = 1;
    //     this._values[1] = 0;
    //     this._values[2] = 0;
    //     this._values[3] = 1;

    //     return this;
    // }

    transpose(): Matrix<TValue, TVector> {
        const temp = this._values[1];

        this._values[1] = this._values[2];
        this._values[2] = temp;

        return this;
    }

    // inverse(): Matrix<TValue, TVector>|undefined {
    //     let det = this.determinant();

    //     if (!det) { return undefined; }

    //     det = 1.0 / det;

    //     const a11 = this._values[0];

    //     this._values[0] = det * (this._values[3]);
    //     this._values[1] = det * (-this._values[1]);
    //     this._values[2] = det * (-this._values[2]);
    //     this._values[3] = det * a11;

    //     return this;
    // }

    // multiply(matrix: Matrix2): Matrix2 {
    //     const a11 = this._values[0];
    //     const a12 = this._values[1];
    //     const a21 = this._values[2];
    //     const a22 = this._values[3];

    //     this._values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
    //     this._values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
    //     this._values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
    //     this._values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);

    //     return this;
    // }

    // rotate(angle: number): Matrix2 {
    //     const a11 = this._values[0];
    //     const a12 = this._values[1];
    //     const a21 = this._values[2];
    //     const a22 = this._values[3];

    //     const sin = Math.sin(angle);
    //     const cos = Math.cos(angle);

    //     this._values[0] = a11 * cos + a12 * sin;
    //     this._values[1] = a11 * -sin + a12 * cos;
    //     this._values[2] = a21 * cos + a22 * sin;
    //     this._values[3] = a21 * -sin + a22 * cos;

    //     return this;
    // }

    // multiplyVec2(vector: vec2, result: vec2): vec2 {
    //     const x = vector.x;
    //     const y = vector.y;

    //     if (result) {
    //         result.xy = [
    //             x * this._values[0] + y * this._values[1],
    //             x * this._values[2] + y * this._values[3],
    //         ]

    //         return result;
    //     } else {
    //         return new vec2([
    //             x * this._values[0] + y * this._values[1],
    //             x * this._values[2] + y * this._values[3],
    //         ]);
    //     }
    // }

    // scale(vector: vec2): Matrix2 {
    //     const a11 = this._values[0];
    //     const a12 = this._values[1];
    //     const a21 = this._values[2];
    //     const a22 = this._values[3];

    //     const x = vector.x;
    //     const y = vector.y;

    //     this._values[0] = a11 * x;
    //     this._values[1] = a12 * y;
    //     this._values[2] = a21 * x;
    //     this._values[3] = a22 * y;

    //     return this;
    // }

    // from_rotation(rad_angle:float):Matrix2
    // {
    //     let s:float = Math.sin(rad_angle);
    //     let c:float = Math.cos(rad_angle);
    //     this._values[0] = c;
    //     this._values[1] = s;
    //     this._values[2] = -s;
    //     this._values[3] = c;
    //     return this;
    // }

    // static product(m1: Matrix2, m2: Matrix2, result: Matrix2): Matrix2 {
    //     const a11 = m1.at(0);
    //     const a12 = m1.at(1);
    //     const a21 = m1.at(2);
    //     const a22 = m1.at(3);

    //     if (result) {
    //         result.init([
    //             a11 * m2.at(0) + a12 * m2.at(2),
    //             a11 * m2.at(1) + a12 * m2.at(3),
    //             a21 * m2.at(0) + a22 * m2.at(2),
    //             a21 * m2.at(1) + a22 * m2.at(3),
    //         ]);

    //         return result;
    //     } else {
    //         return new Matrix2([
    //             a11 * m2.at(0) + a12 * m2.at(2),
    //             a11 * m2.at(1) + a12 * m2.at(3),
    //             a21 * m2.at(0) + a22 * m2.at(2),
    //             a21 * m2.at(1) + a22 * m2.at(3),
    //         ]);
    //     }
    // }

}