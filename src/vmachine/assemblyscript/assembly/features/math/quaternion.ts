/**
 * See: https://github.com/infusion/Quaternion.js/blob/master/quaternion.js
 */


import { float } from './float';
import { Vector3 as vec3 } from './vector3';



/**
 * Calculates log(sqrt(a^2+b^2)) in a way to avoid overflows
 *
 * @param {float} a
 * @param {float} b
 * @returns {float}
 */
function logHypot(a:float, b:float):float {
    var _a = Math.abs(a);
    var _b = Math.abs(b);

    if (a === 0) {
        return Math.log(_b);
    }

    if (b === 0) {
        return Math.log(_a);
    }

    if (_a < 3000 && _b < 3000) {
        return Math.log(a * a + b * b) * 0.5;
    }

    return Math.log(a / Math.cos(Math.atan2(b, a)));
}


export class Quaternion {

  static ZERO = new Quaternion(0, 0, 0, 0); // This is the additive identity Quaternion
  static ONE = new Quaternion(1, 0, 0, 0); // This is the multiplicative identity Quaternion
  static I = new Quaternion(0, 1, 0, 0);
  static J = new Quaternion(0, 0, 1, 0);
  static K = new Quaternion(0, 0, 0, 1);
  static EPSILON = 1e-16;

    public w:float = 1.0;
    public x:float = 0.0;
    public y:float = 0.0;
    public z:float = 0.0;

    /**
    * Adds two quaternions Q1 and Q2
    *
    * @param {float} w real
    * @param {float} x imag
    * @param {float} y imag
    * @param {float} z imag
    * @returns {Quaternion}
    */
    constructor(w:float, x:float, y:float, z:float) {
        this.w = w,
        this.x = x,
        this.y = y,
        this.z = z;
   }


    /**
     * Adds two quaternions Q1 and Q2
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {Quaternion}
     */
    add(w:float, x:float, y:float, z:float):Quaternion {

      // Q1 + Q2 := [w1, v1] + [w2, v2] = [w1 + w2, v1 + v2]

      return new Quaternion(
              this.w + w,
              this.x + x,
              this.y + y,
              this.z + z);
    }


    /**
     * Subtracts a quaternions Q2 from Q1
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {Quaternion}
     */
    sub(w:float, x:float, y:float, z:float):Quaternion {

      // Q1 - Q2 := Q1 + (-Q2)
      //          = [w1, v1] - [w2, v2] = [w1 - w2, v1 - v2]

      return new Quaternion(
              this.w - w,
              this.x - x,
              this.y - y,
              this.z - z);
    }


    /**
     * Calculates the additive inverse, or simply it negates the quaternion
     *
     * @returns {Quaternion}
     */
    neg():Quaternion {

      // -Q := [-w, -v]

      return new Quaternion(-this.w, -this.x, -this.y, -this.z);
    }


    /**
     * Calculates the length/modulus/magnitude or the norm of a quaternion
     *
     * @returns {float}
     */
    norm():float {

      // |Q| := sqrt(|Q|^2)

      // The unit quaternion has |Q| = 1

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      return <float>Math.sqrt(w * w + x * x + y * y + z * z);
    }


    /**
     * Calculates the squared length/modulus/magnitude or the norm of a quaternion
     *
     * @returns {float}
     */
    normSq():float {

      // |Q|^2 := [w, v] * [w, -v]
      //        = [w^2 + dot(v, v), -w * v + w * v + cross(v, -v)]
      //        = [w^2 + |v|^2, 0]
      //        = [w^2 + dot(v, v), 0]
      //        = dot(Q, Q)
      //        = Q * Q'

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      return w * w + x * x + y * y + z * z;
    }


    /**
     * Normalizes the quaternion to have |Q| = 1 as long as the norm is not zero
     * Alternative names are the signum, unit or versor
     *
     * @returns {Quaternion}
     */
    normalize():Quaternion {

      // Q* := Q / |Q|

      // unrolled Q.scale(1 / Q.norm())

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var norm = Math.sqrt(w * w + x * x + y * y + z * z);

      if (norm < Quaternion.EPSILON) {
        return Quaternion.ZERO;
      }

      norm = 1 / norm;

      return new Quaternion(w * norm, x * norm, y * norm, z * norm);
    }


    /**
     * Calculates the Hamilton product of two quaternions
     * Leaving out the imaginary part results in just scaling the quat
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {Quaternion}
     */
    mul(w:float, x:float, y:float, z:float):Quaternion {

      // Q1 * Q2 = [w1 * w2 - dot(v1, v2), w1 * v2 + w2 * v1 + cross(v1, v2)]

      // Not commutative because cross(v1, v2) != cross(v2, v1)!

      var w1 = this.w;
      var x1 = this.x;
      var y1 = this.y;
      var z1 = this.z;

      var w2 = w;
      var x2 = x;
      var y2 = y;
      var z2 = z;

      return new Quaternion(
              w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
              w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
              w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
              w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2);
    }


    /**
     * Scales a quaternion by a scalar, faster than using multiplication
     *
     * @param {float} s scaling factor
     * @returns {Quaternion}
     */
    scale(s:float):Quaternion {

      return new Quaternion(
              this.w * s,
              this.x * s,
              this.y * s,
              this.z * s);
    }


    /**
     * Calculates the dot product of two quaternions
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {float}
     */
    dot(w:float, x:float, y:float, z:float):float {

      // dot(Q1, Q2) := w1 * w2 + dot(v1, v2)

      return this.w * w + this.x * x + this.y * y + this.z * z;
    }


    /**
     * Calculates the inverse of a quat for non-normalized quats such that
     * Q^-1 * Q = 1 and Q * Q^-1 = 1
     *
     * @returns {Quaternion}
     */
    inverse():Quaternion {

      // Q^-1 := Q' / |Q|^2
      //       = [w / (w^2 + |v|^2), -v / (w^2 + |v|^2)]

      // Proof:
      // Q * Q^-1 = [w, v] * [w / (w^2 + |v|^2), -v / (w^2 + |v|^2)]
      //          = [1, 0]
      // Q^-1 * Q = [w / (w^2 + |v|^2), -v / (w^2 + |v|^2)] * [w, v]
      //          = [1, 0].

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var normSq = w * w + x * x + y * y + z * z;

      if (normSq === 0) {
        return Quaternion.ZERO; // TODO: Is the result zero or one when the norm is zero?
      }

      normSq = 1 / normSq;

      return new Quaternion(w * normSq, -x * normSq, -y * normSq, -z * normSq);
    }


    /**
     * Multiplies a quaternion with the inverse of a second quaternion
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {Quaternion}
     */
    div(w:float, x:float, y:float, z:float):Quaternion {

      // Q1 / Q2 := Q1 * Q2^-1

      var w1 = this.w;
      var x1 = this.x;
      var y1 = this.y;
      var z1 = this.z;

      var w2 = w;
      var x2 = x;
      var y2 = y;
      var z2 = z;

      var normSq = w2 * w2 + x2 * x2 + y2 * y2 + z2 * z2;

      if (normSq === 0) {
        return Quaternion.ZERO; // TODO: Is the result zero or one when the norm is zero?
      }

      normSq = 1 / normSq;

      return new Quaternion(
              (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2) * normSq,
              (x1 * w2 - w1 * x2 - y1 * z2 + z1 * y2) * normSq,
              (y1 * w2 - w1 * y2 - z1 * x2 + x1 * z2) * normSq,
              (z1 * w2 - w1 * z2 - x1 * y2 + y1 * x2) * normSq);
    }


    /**
     * Calculates the conjugate of a quaternion
     *
     * @returns {Quaternion}
     */
    conjugate():Quaternion {

      // Q' = [s, -v]

      // If the quaternion is normalized,
      // the conjugate is the inverse of the quaternion - but faster
      // Q' * Q = Q * Q' = 1

      // Additionally, the conjugate of a unit quaternion is a rotation with the same
      // angle but the opposite axis.

      // Moreover the following property holds:
      // (Q1 * Q2)' = Q2' * Q1'

      return new Quaternion(this.w, -this.x, -this.y, -this.z);
    }


    /**
     * Calculates the natural exponentiation of the quaternion
     *
     * @returns {Quaternion}
     */
    exp():Quaternion {

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var vNorm = Math.sqrt(x * x + y * y + z * z);
      var wExp = Math.exp(w);
      var scale = wExp / vNorm * Math.sin(vNorm);

      if (vNorm === 0) {
        //return new Quaternion(wExp * Math.cos(vNorm), 0, 0, 0);
        return new Quaternion(wExp, 0, 0, 0);
      }

      return new Quaternion(
              wExp * Math.cos(vNorm),
              x * scale,
              y * scale,
              z * scale);
    }


    /**
     * Calculates the natural logarithm of the quaternion
     *
     * @returns {Quaternion}
     */
    log():Quaternion {

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      if (y === 0 && z === 0) {
        return new Quaternion(
                logHypot(w, x),
                Math.atan2(x, w), 0, 0);
      }

      var qNorm2 = x * x + y * y + z * z + w * w;
      var vNorm = Math.sqrt(x * x + y * y + z * z);

      var scale = Math.atan2(vNorm, w) / vNorm;

      return new Quaternion(
              Math.log(qNorm2) * 0.5,
              x * scale,
              y * scale,
              z * scale);
    }


    /**
     * Calculates the power of a quaternion raised to a real number or another quaternion
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {Quaternion}
     */
    pow(w:float, x:float, y:float, z:float):Quaternion {

      if (y === 0 && z === 0) {

        if (w === 1 && x === 0) {
          return this;
        }

        if (w === 0 && x === 0) {
          return Quaternion.ONE;
        }

        // Check if we can operate in C
        // Borrowed from complex.js
        if (this.y === 0 && this.z === 0) {

          var a = this.w;
          var b = this.x;

          if (a === 0 && b === 0) {
            return Quaternion.ZERO;
          }

          var arg = Math.atan2(b, a);
          var loh = logHypot(a, b);

          if (x === 0) {

            if (b === 0 && a >= 0) {

              return new Quaternion(Math.pow(a, w), 0, 0, 0);

            } else if (a === 0) {

              switch (w % 4) {
                case 0:
                  return new Quaternion(Math.pow(b, w), 0, 0, 0);
                case 1:
                  return new Quaternion(0, Math.pow(b, w), 0, 0);
                case 2:
                  return new Quaternion(-Math.pow(b, w), 0, 0, 0);
                case 3:
                  return new Quaternion(0, -Math.pow(b, w), 0, 0);
              }
            }
          }

          a = Math.exp(w * loh - x * arg);
          b = x * loh + w * arg;
          return new Quaternion(
                  a * Math.cos(b),
                  a * Math.sin(b), 0, 0);
        }
      }

      // Normal quaternion behavior
      // q^p = e^ln(q^p) = e^(ln(q)*p)
      return this.log().mul(w, x, y, z).exp();
    }


    /**
     * Checks if two quats are the same
     *
     * @param {float} w real
     * @param {float} x imag
     * @param {float} y imag
     * @param {float} z imag
     * @returns {boolean}
     */
    equals(w:float, x:float, y:float, z:float):boolean {

      var eps = Quaternion.EPSILON;

      // maybe check for NaN's here?
      return Math.abs(w - this.w) < eps
              && Math.abs(x - this.x) < eps
              && Math.abs(y - this.y) < eps
              && Math.abs(z - this.z) < eps;
    }


    /**
     * Checks if all parts of a quaternion are finite
     *
     * @returns {boolean}
     */
    isFinite():boolean {

      return isFinite(this.w) && isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
    }


    /**
     * Checks if any of the parts of the quaternion is not a number
     *
     * @returns {boolean}
     */
    isNaN():boolean {

      return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.z);
    }


    /**
     * Gets the Quaternion as a well formatted string
     *
     * @returns {string}
     */
    // toString():Quaternion {

    //   var w = this.w;
    //   var x = this.x;
    //   var y = this.y;
    //   var z = this.z;
    //   var ret = '';

    //   if (isNaN(w) || isNaN(x) || isNaN(y) || isNaN(z)) {
    //     return 'NaN';
    //   }

    //   // Alternative design?
    //   // '(%f, [%f %f %f])'

    //   ret = numToStr(w, '', ret);
    //   ret += numToStr(x, 'i', ret);
    //   ret += numToStr(y, 'j', ret);
    //   ret += numToStr(z, 'k', ret);

    //   if ('' === ret)
    //     return '0';

    //   return ret;
    // }


    /**
     * Returns the real part of the quaternion
     *
     * @returns {float}
     */
    real():float {

      return this.w;
    }


    /**
     * Returns the imaginary part of the quaternion as a 3D vector / array
     *
     * @returns {Array<float>}
     */
    imag():Array<float> {

      return [this.x, this.y, this.z];
    }


    /**
     * Gets the actual quaternion as a 4D vector / array
     *
     * @returns {Array<float>}
     */
    toVector():Array<float> {

      return [this.w, this.x, this.y, this.z];
    }


    /**
     * Calculates the 3x3 rotation matrix for the current quat
     *
     * @ //param {boolean} d2
     * @see https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion
     * @returns {Array<float>}
     */
    toMatrix(/*d2:boolean*/):Array<float> {

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var n = w * w + x * x + y * y + z * z;
      var s = n === 0 ? 0 : 2 / n;
      var wx = s * w * x, wy = s * w * y, wz = s * w * z;
      var xx = s * x * x, xy = s * x * y, xz = s * x * z;
      var yy = s * y * y, yz = s * y * z, zz = s * z * z;

    //   if (d2) {
    //     return [
    //       [1 - (yy + zz), xy - wz, xz + wy],
    //       [xy + wz, 1 - (xx + zz), yz - wx],
    //       [xz - wy, yz + wx, 1 - (xx + yy)]];
    //   }

      return [
        1 - (yy + zz), xy - wz, xz + wy,
        xy + wz, 1 - (xx + zz), yz - wx,
        xz - wy, yz + wx, 1 - (xx + yy)];
    }


    /**
     * Calculates the homogeneous 4x4 rotation matrix for the current quat
     *
     * @ //param {boolean} d2
     * @returns {Array<float>}
     */
    toMatrix4(/*d2:boolean*/):Array<float> {

      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var n = w * w + x * x + y * y + z * z;
      var s = n === 0 ? 0 : 2 / n;
      var wx = s * w * x, wy = s * w * y, wz = s * w * z;
      var xx = s * x * x, xy = s * x * y, xz = s * x * z;
      var yy = s * y * y, yz = s * y * z, zz = s * z * z;

    //   if (d2) {
    //     return [
    //       [1 - (yy + zz), xy - wz, xz + wy, 0],
    //       [xy + wz, 1 - (xx + zz), yz - wx, 0],
    //       [xz - wy, yz + wx, 1 - (xx + yy), 0],
    //       [0, 0, 0, 1]];
    //   }

      return [
        1 - (yy + zz), xy - wz, xz + wy, 0,
        xy + wz, 1 - (xx + zz), yz - wx, 0,
        xz - wy, yz + wx, 1 - (xx + yy), 0,
        0, 0, 0, 1];
    }


    /**
     * Clones the actual object
     *
     * @returns {Quaternion}
     */
    clone():Quaternion {

      return new Quaternion(this.w, this.x, this.y, this.z);
    }


    /**
     * Rotates a vector according to the current quaternion
     *
     * @param {Array} v The vector to be rotated
     * @returns {Array}
     */
    rotateVector(v:Array<float>):Array<float>{

      // [0, v'] = Q * [0, v] * Q'

      // Q
      var w1 = this.w;
      var x1 = this.x;
      var y1 = this.y;
      var z1 = this.z;

      // [0, v]
      var w2 = 0;
      var x2 = v[0];
      var y2 = v[1];
      var z2 = v[2];

      // Q * [0, v]
      var w3 = /*w1 * w2*/ -x1 * x2 - y1 * y2 - z1 * z2;
      var x3 = w1 * x2 + /*x1 * w2 +*/ y1 * z2 - z1 * y2;
      var y3 = w1 * y2 + /*y1 * w2 +*/ z1 * x2 - x1 * z2;
      var z3 = w1 * z2 + /*z1 * w2 +*/ x1 * y2 - y1 * x2;

      var w4 = w3 * w1 + x3 * x1 + y3 * y1 + z3 * z1;
      var x4 = x3 * w1 - w3 * x1 - y3 * z1 + z3 * y1;
      var y4 = y3 * w1 - w3 * y1 - z3 * x1 + x3 * z1;
      var z4 = z3 * w1 - w3 * z1 - x3 * y1 + y3 * x1;

      return [x4, y4, z4];
    }


    /*slerp(w:float, x:float, y:float, z:float):function {

      // slerp(Q1, Q2, t) := Q1(Q1^-1 Q2)^t

      var w1 = this.w;
      var x1 = this.x;
      var y1 = this.y;
      var z1 = this.z;

      var w2 = w;
      var x2 = x;
      var y2 = y;
      var z2 = z;

      var cosTheta0 = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

      if (cosTheta0 < 0) {
        w1 = -w1;
        x1 = -x1;
        y1 = -y1;
        z1 = -z1;
        cosTheta0 = -cosTheta0;
      }

      if (cosTheta0 > 0.9995) { // DOT_THRESHOLD
        return function(pct) {
          return new Quaternion(
                  w1 + pct * (w2 - w1),
                  x1 + pct * (x2 - x1),
                  y1 + pct * (y2 - y1),
                  z1 + pct * (z2 - z1))['normalize']();
        };
      }

      var Theta0 = Math.acos(cosTheta0);
      var sinTheta0 = Math.sin(Theta0);

      return function(pct) {

        var Theta = Theta0 * pct;
        var sinTheta = Math.sin(Theta);
        var cosTheta = Math.cos(Theta);

        var s0 = cosTheta - cosTheta0 * sinTheta / sinTheta0;
        var s1 = sinTheta / sinTheta0;

        return new Quaternion(
                s0 * w1 + s1 * w2,
                s0 * x1 + s1 * x2,
                s0 * y1 + s1 * y2,
                s0 * z1 + s1 * z2);
      }
    }*/
    multiplyVec3(vector: vec3, dest?: vec3): vec3 {
      if (!dest) { dest = new vec3() }

      const x = vector.x
      const y = vector.y
      const z = vector.z

      const qx = this.x
      const qy = this.y
      const qz = this.z
      const qw = this.w

      const ix = qw * x + qy * z - qz * y
      const iy = qw * y + qz * x - qx * z
      const iz = qw * z + qx * y - qy * x
      const iw = -qx * x - qy * y - qz * z

      dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy
      dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz
      dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx

      return dest
  }
}


/**
   * Creates quaternion by a rotation given as axis-angle orientation
   *
   * @param {Array} axis The axis around which to rotate
   * @param {number} angle The angle in radians
   * @returns {Quaternion}
   */
// Quaternion['fromAxisAngle'] = function(axis, angle) {

// // Q = [cos(angle / 2), v * sin(angle / 2)]

// var halfAngle = angle * 0.5;

// var a = axis[0];
// var b = axis[1];
// var c = axis[2];

// var sin_2 = Math.sin(halfAngle);
// var cos_2 = Math.cos(halfAngle);

// var sin_norm = sin_2 / Math.sqrt(a * a + b * b + c * c);

// return new Quaternion(cos_2, a * sin_norm, b * sin_norm, c * sin_norm);
// };

/**
 * Calculates the quaternion to rotate one vector onto the other
 *
 * @param {Array} u
 * @param {Array} v
 */
// Quaternion['fromBetweenVectors'] = function(u, v) {

// var a = u[0];
// var b = u[1];
// var c = u[2];

// var x = v[0];
// var y = v[1];
// var z = v[2];

// var dot = a * x + b * y + c * z;
// var w1 = b * z - c * y;
// var w2 = c * x - a * z;
// var w3 = a * y - b * x;

// return new Quaternion(
//         dot + Math.sqrt(dot * dot + w1 * w1 + w2 * w2 + w3 * w3),
//         w1,
//         w2,
//         w3
//         ).normalize();
// };


/**
   * Creates a quaternion by a rotation given by Euler angles
   *
   * @param {number} phi
   * @param {number} theta
   * @param {number} psi
   * @param {string=} order
   * @returns {Quaternion}
   */
//   Quaternion['fromEuler'] = function(phi, theta, psi, order) {

//     var _x = theta * 0.5;
//     var _y = psi * 0.5;
//     var _z = phi * 0.5;

//     var cX = Math.cos(_x);
//     var cY = Math.cos(_y);
//     var cZ = Math.cos(_z);

//     var sX = Math.sin(_x);
//     var sY = Math.sin(_y);
//     var sZ = Math.sin(_z);

//     if (order === undefined || order === 'ZXY') {
//       return new Quaternion(
//               cX * cY * cZ - sX * sY * sZ,
//               sX * cY * cZ - cX * sY * sZ,
//               cX * sY * cZ + sX * cY * sZ,
//               cX * cY * sZ + sX * sY * cZ);
//     }

//     if (order === 'XYZ') {
//       return new Quaternion(
//               cX * cY * cZ - sX * sY * sZ,
//               sX * cY * cZ + cX * sY * sZ,
//               cX * sY * cZ - sX * cY * sZ,
//               cX * cY * sZ + sX * sY * cZ);
//     }

//     if (order === 'YXZ') {
//       return new Quaternion(
//               cX * cY * cZ + sX * sY * sZ,
//               sX * cY * cZ + cX * sY * sZ,
//               cX * sY * cZ - sX * cY * sZ,
//               cX * cY * sZ - sX * sY * cZ);
//     }

//     if (order === 'ZYX') {
//       return new Quaternion(
//               cX * cY * cZ + sX * sY * sZ,
//               sX * cY * cZ - cX * sY * sZ,
//               cX * sY * cZ + sX * cY * sZ,
//               cX * cY * sZ - sX * sY * cZ);
//     }

//     if (order === 'YZX') {
//       return new Quaternion(
//               cX * cY * cZ - sX * sY * sZ,
//               sX * cY * cZ + cX * sY * sZ,
//               cX * sY * cZ + sX * cY * sZ,
//               cX * cY * sZ - sX * sY * cZ);
//     }

//     if (order === 'XZY') {
//       return new Quaternion(
//               cX * cY * cZ + sX * sY * sZ,
//               sX * cY * cZ - cX * sY * sZ,
//               cX * sY * cZ - sX * cY * sZ,
//               cX * cY * sZ + sX * sY * cZ);
//     }
//     return null;
//   };

  