
/// <reference path="../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import BitArray from '../../../vmachine/assemblyscript/assembly/runtime/bitarray';


describe('VM BitArray', () => {
	const MEMORY_BYTES:i32 = 3;
	
    it('VM Memory: bits array fill with ones or zeros' , () => {
		let i:i32;
		const ba1:BitArray = new BitArray(MEMORY_BYTES);
		
		// FILL WITH ONES
		ba1.fill_with_ones();
		// console.log('fill_with_ones', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			// console.log('fill_with_ones at [' + i + ']=', ba1.get_at(i) );
			expect( ba1.get_at(i) ).is.true;
		}
		
		// FILL WITH ZEROS
		ba1.fill_with_zeros();
		// console.log('fill_with_zeros', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			// console.log('fill_with_zeros at [' + i + ']=' + (ba1.get_at(i) ? '1' : '0') );
			expect( ba1.get_at(i) ).is.false;
		}
	} );
	
	
    it('VM Memory: bits array fill at' , () => {
		let i:i32;
		const ba1:BitArray = new BitArray(MEMORY_BYTES);
		
		// FILL AT
		ba1.set_one_at(7);
		// console.log('set_one_at(7)', ba1.to_string());
		for(i = 0 ; i < 6 ; i++) {
			// console.log('set_one_at(7) at [' + i + ']=' + (ba1.get_at(i) ? '1' : '0') );
			expect( ba1.get_at(i), 'set_one_at(7):false? at [' + i + ']' ).is.false;
		}
		// console.log('set_one_at(7) at [6]=' + (ba1.get_at(6) ? '1' : '0') );
		expect( ba1.get_at(7) ).is.true;
		for(i = 8 ; i < 24 ; i++) {
			expect( ba1.get_at(i), 'set_one_at(7):false? at [' + i + ']' ).is.false;
		}
	} );
	
	
    it('VM Memory: bits array fill in ranges' , () => {
		let i:i32;
		const ba1:BitArray = new BitArray(MEMORY_BYTES);
		
		// FILL WITH ONES IN RANGE (0-7)
		ba1.fill_with_zeros();
		// console.log('fill_with_ones', ba1.to_string());
		ba1.set_one_in_range(0, 7);
		// console.log('set_one_in_range(0, 7)', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			if (i >= 0 && i <= 7) {
				expect( ba1.get_at(i), 'set_one_in_range(0, 7):true? at [' + i + ']' ).is.true;
			} else {
				expect( ba1.get_at(i), 'set_one_in_range(0, 7):false? at [' + i + ']' ).is.false;
			}
		}
		
		// FILL WITH ONES IN RANGE (3-7)
		ba1.fill_with_zeros();
		// console.log('fill_with_ones', ba1.to_string());
		ba1.set_one_in_range(3, 7);
		// console.log('set_one_in_range(3, 7)', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			if (i >= 3 && i <= 7) {
				expect( ba1.get_at(i), 'set_one_in_range(3, 7):true? at [' + i + ']' ).is.true;
			} else {
				expect( ba1.get_at(i), 'set_one_in_range(3, 7):false? at [' + i + ']' ).is.false;
			}
		}
		
		// FILL WITH ONES IN RANGE (0-11)
		ba1.fill_with_zeros();
		// console.log('fill_with_ones', ba1.to_string());
		ba1.set_one_in_range(0, 11);
		// console.log('set_one_in_range(0, 11)', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			if (i >= 0 && i <= 11) {
				expect( ba1.get_at(i), 'set_one_in_range(0, 11):true? at [' + i + ']' ).is.true;
			} else {
				expect( ba1.get_at(i), 'set_one_in_range(0, 11):false? at [' + i + ']' ).is.false;
			}
		}
		
		// FILL WITH ONES IN RANGE (7-21)
		ba1.fill_with_zeros();
		// console.log('fill_with_ones', ba1.to_string());
		ba1.set_one_in_range(7, 21);
		// console.log('set_one_in_rang(7, 21)', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			if (i >= 7 && i <= 21) {
				expect( ba1.get_at(i), 'set_one_in_rang(7, 21):true? at [' + i + ']' ).is.true;
			} else {
				expect( ba1.get_at(i), 'set_one_in_rang(7, 21):false? at [' + i + ']' ).is.false;
			}
		}
		
		// FILL WITH ONES IN RANGE (7-23)
		ba1.fill_with_zeros();
		// console.log('fill_with_ones', ba1.to_string());
		ba1.set_one_in_range(7, 23);
		// console.log('set_one_in_rang(7, 23)', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			if (i >= 7 && i <= 23) {
				expect( ba1.get_at(i), 'set_one_in_rang(7, 23):true? at [' + i + ']' ).is.true;
			} else {
				expect( ba1.get_at(i), 'set_one_in_rang(7, 23):false? at [' + i + ']' ).is.false;
			}
		}
		
		// FILL WITH ONES IN RANGE (22-23)
		ba1.fill_with_zeros();
		// console.log('fill_with_ones', ba1.to_string());
		ba1.set_one_in_range(22, 23);
		// console.log('set_one_in_rang(22, 23)', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			if (i >= 22 && i <= 23) {
				expect( ba1.get_at(i), 'set_one_in_rang(22, 23):true? at [' + i + ']' ).is.true;
			} else {
				expect( ba1.get_at(i), 'set_one_in_rang(22, 23):false? at [' + i + ']' ).is.false;
			}
		}
	} );
} );
