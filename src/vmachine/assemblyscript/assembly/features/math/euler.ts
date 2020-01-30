/**
 * See https://github.com/mrdoob/three.js/blob/dev/src/math/Euler.d.ts
 * See https://github.com/mrdoob/three.js/blob/dev/src/math/Euler.js
 */

import { float } from './float';

import { Matrix4 } from './matrix4';
import { Quaternion } from './quaternion';
// import { Vector3 } from './Vector3';




function clamp(value:float, min:float, max:float):float {

    return Math.max( min, Math.min( max, value ) );

}


export class Euler {
    static RotationOrders: string[] = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];
    static DefaultOrder: string = 'XYZ';

    public x: float;
    public y: float;
    public z: float;
    public order: string;

	private _onChangeCallback: Function;
    private _matrix = new Matrix4();
    private _quaternion = Quaternion.ONE;

	constructor( x: float, y: float, z: float, order: string ) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.order = order || Euler.DefaultOrder;
    }


	set( x: float, y: float, z: float, order?: string ): Euler {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.order = order || this.order;
        
        this._onChangeCallback();

		return this;
    }

	clone(): Euler {
        return new Euler( this.x, this.y, this.z, this.order );
    }

	copy( euler: Euler ): this {
        this.x = euler.x;
		this.y = euler.y;
		this.z = euler.z;
		this.order = euler.order;

		this._onChangeCallback();

		return this;
    }

	setFromRotationMatrix( m: Matrix4, order: string, update:boolean): Euler {
		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements();
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this.order;

		if ( order === 'XYZ' ) {

			this.y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.9999999 ) {

				this.x = Math.atan2( - m23, m33 );
				this.z = Math.atan2( - m12, m11 );

			} else {

				this.x = Math.atan2( m32, m22 );
				this.z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this.x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.9999999 ) {

				this.y = Math.atan2( m13, m33 );
				this.z = Math.atan2( m21, m22 );

			} else {

				this.y = Math.atan2( - m31, m11 );
				this.z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this.x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.9999999 ) {

				this.y = Math.atan2( - m31, m33 );
				this.z = Math.atan2( - m12, m22 );

			} else {

				this.y = 0;
				this.z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this.y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.9999999 ) {

				this.x = Math.atan2( m32, m33 );
				this.z = Math.atan2( m21, m11 );

			} else {

				this.x = 0;
				this.z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this.z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.9999999 ) {

				this.x = Math.atan2( - m23, m22 );
				this.y = Math.atan2( - m31, m11 );

			} else {

				this.x = 0;
				this.y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this.z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.9999999 ) {

				this.x = Math.atan2( m32, m22 );
				this.y = Math.atan2( m13, m11 );

			} else {

				this.x = Math.atan2( - m23, m33 );
				this.y = 0;

			}

		} else {

			// console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order );

		}

		this.order = order;

		if ( update !== false ) this._onChangeCallback();

		return this;

    }
    
	setFromQuaternion( q: Quaternion, order: string, update:boolean ): Euler {

		this._matrix.make_rotation_from_quaternion( q );

		return this.setFromRotationMatrix( this._matrix, order, update );

    }
    
	// setFromVector3( v: Vector3, order?: string ): Euler;
	// reorder( newOrder: string ): Euler;
	// equals( euler: Euler ): boolean;
	// fromArray( xyzo: any[] ): Euler;
	// toArray( array?: float[], offset?: float ): float[];
	// toVector3( optionalResult?: Vector3 ): Vector3;
	// _onChange( callback: Function ): this;
}