/**
 * see https://github.com/matthiasferch/tsm/blob/master/src/Vector4.ts
 * 
 */

import { Matrix4 as mat4 } from './matrix4';

import { epsilon } from './constants'


export class Vector4 {

    get x(): number {
        return this.values[0]
    }

    get y(): number {
        return this.values[1]
    }

    get z(): number {
        return this.values[2]
    }

    get w(): number {
        return this.values[3]
    }

    get xy(): [number, number] {
        return [
            this.values[0],
            this.values[1],
        ]
    }

    get xyz(): [number, number, number] {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
        ]
    }

    get xyzw(): [number, number, number, number] {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
            this.values[3],
        ]
    }

    set x(value: number) {
        this.values[0] = value
    }

    set y(value: number) {
        this.values[1] = value
    }

    set z(value: number) {
        this.values[2] = value
    }

    set w(value: number) {
        this.values[3] = value
    }

    set xy(values: [number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
    }

    set xyz(values: [number, number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
        this.values[2] = values[2]
    }

    set xyzw(values: [number, number, number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
        this.values[2] = values[2]
        this.values[3] = values[3]
    }

    get r(): number {
        return this.values[0]
    }

    get g(): number {
        return this.values[1]
    }

    get b(): number {
        return this.values[2]
    }

    get a(): number {
        return this.values[3]
    }

    get rg(): [number, number] {
        return [
            this.values[0],
            this.values[1],
        ]
    }

    get rgb(): [number, number, number] {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
        ]
    }

    get rgba(): [number, number, number, number] {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
            this.values[3],
        ]
    }

    set r(value: number) {
        this.values[0] = value
    }

    set g(value: number) {
        this.values[1] = value
    }

    set b(value: number) {
        this.values[2] = value
    }

    set a(value: number) {
        this.values[3] = value
    }

    set rg(values: [number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
    }

    set rgb(values: [number, number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
        this.values[2] = values[2]
    }

    set rgba(values: [number, number, number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
        this.values[2] = values[2]
        this.values[3] = values[3]
    }

    constructor(values?: [number, number, number, number]) {
        if (values !== undefined) {
            this.xyzw = values
        }
    }

    private values = new Float32Array(4)

    static readonly zero = new Vector4([0, 0, 0, 1])
    static readonly one = new Vector4([1, 1, 1, 1])

    at(index: number): number {
        return this.values[index]
    }

    reset(): void {
        this.x = 0
        this.y = 0
        this.z = 0
        this.w = 0
    }

    copy(dest?: Vector4): Vector4 {
        if (!dest) { dest = new Vector4() }

        dest.x = this.x
        dest.y = this.y
        dest.z = this.z
        dest.w = this.w

        return dest
    }

    negate(dest?: Vector4): Vector4 {
        if (!dest) { dest = this }

        dest.x = -this.x
        dest.y = -this.y
        dest.z = -this.z
        dest.w = -this.w

        return dest
    }

    equals(vector: Vector4, threshold = epsilon): boolean {
        if (Math.abs(this.x - vector.x) > threshold) {
            return false
        }

        if (Math.abs(this.y - vector.y) > threshold) {
            return false
        }

        if (Math.abs(this.z - vector.z) > threshold) {
            return false
        }

        if (Math.abs(this.w - vector.w) > threshold) {
            return false
        }

        return true
    }

    length(): number {
        return Math.sqrt(this.squaredLength())
    }

    squaredLength(): number {
        const x = this.x
        const y = this.y
        const z = this.z
        const w = this.w

        return (x * x + y * y + z * z + w * w)
    }

    add(vector: Vector4): Vector4 {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
        this.w += vector.w

        return this
    }

    subtract(vector: Vector4): Vector4 {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
        this.w -= vector.w

        return this
    }

    multiply(vector: Vector4): Vector4 {
        this.x *= vector.x
        this.y *= vector.y
        this.z *= vector.z
        this.w *= vector.w

        return this
    }

    divide(vector: Vector4): Vector4 {
        this.x /= vector.x
        this.y /= vector.y
        this.z /= vector.z
        this.w /= vector.w

        return this
    }

    scale(value: number, dest?: Vector4): Vector4 {
        if (!dest) { dest = this }

        dest.x *= value
        dest.y *= value
        dest.z *= value
        dest.w *= value

        return dest
    }

    normalize(dest?: Vector4): Vector4 {
        if (!dest) { dest = this }

        let length = this.length()

        if (length === 1) {
            return this
        }

        if (length === 0) {
            dest.x *= 0
            dest.y *= 0
            dest.z *= 0
            dest.w *= 0

            return dest
        }

        length = 1.0 / length

        dest.x *= length
        dest.y *= length
        dest.z *= length
        dest.w *= length

        return dest
    }

    multiplyMat4(matrix: mat4, dest?: Vector4): Vector4 {
        if (!dest) { dest = this }

        return matrix.multiplyVec4(this, dest)
    }

    static mix(vector: Vector4, vector2: Vector4, time: number, dest?: Vector4): Vector4 {
        if (!dest) { dest = new Vector4() }

        dest.x = vector.x + time * (vector2.x - vector.x)
        dest.y = vector.y + time * (vector2.y - vector.y)
        dest.z = vector.z + time * (vector2.z - vector.z)
        dest.w = vector.w + time * (vector2.w - vector.w)

        return dest
    }

    static sum(vector: Vector4, vector2: Vector4, dest?: Vector4): Vector4 {
        if (!dest) { dest = new Vector4() }

        dest.x = vector.x + vector2.x
        dest.y = vector.y + vector2.y
        dest.z = vector.z + vector2.z
        dest.w = vector.w + vector2.w

        return dest
    }

    static difference(vector: Vector4, vector2: Vector4, dest?: Vector4): Vector4 {
        if (!dest) { dest = new Vector4() }

        dest.x = vector.x - vector2.x
        dest.y = vector.y - vector2.y
        dest.z = vector.z - vector2.z
        dest.w = vector.w - vector2.w

        return dest
    }

    static product(vector: Vector4, vector2: Vector4, dest?: Vector4): Vector4 {
        if (!dest) { dest = new Vector4() }

        dest.x = vector.x * vector2.x
        dest.y = vector.y * vector2.y
        dest.z = vector.z * vector2.z
        dest.w = vector.w * vector2.w

        return dest
    }

    static quotient(vector: Vector4, vector2: Vector4, dest?: Vector4): Vector4 {
        if (!dest) { dest = new Vector4() }

        dest.x = vector.x / vector2.x
        dest.y = vector.y / vector2.y
        dest.z = vector.z / vector2.z
        dest.w = vector.w / vector2.w

        return dest
    }
}