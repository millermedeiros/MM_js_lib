define(['src/utils/mathUtils'], function(mathUtils){

    describe('utils/mathUtils: Math utilities', function(){


        describe('mathUtils.clamp()', function(){
            
            var clamp = mathUtils.clamp;

            it('should return max if val bigger than max', function(){
                expect( clamp(10, 1, 10) ).toEqual(10);
                expect( clamp(11, 1, 10) ).toEqual(10);
                expect( clamp(12, 1, 10) ).toEqual(10);
                expect( clamp(9999, 1, 10) ).toEqual(10);
                expect( clamp(Number.MAX_VALUE, 1, 10) ).toEqual(10);

                expect( clamp(-2, -10, -2) ).toEqual(-2);
                expect( clamp(-1, -10, -2) ).toEqual(-2);
                expect( clamp(0, -10, -2) ).toEqual(-2);
                expect( clamp(10, -10, -2) ).toEqual(-2);
            });

            it('should return min if val smaller than min', function(){
                expect( clamp(1, 1, 10) ).toEqual(1);
                expect( clamp(-11, 1, 10) ).toEqual(1);
                expect( clamp(0, 1, 10) ).toEqual(1);
                expect( clamp(-9999, 1, 10) ).toEqual(1);
                expect( clamp(- Number.MAX_VALUE, 1, 10) ).toEqual(1);

                expect( clamp(- Number.MAX_VALUE, -10, -2) ).toEqual(-10);
                expect( clamp(-12, -10, -2) ).toEqual(-10);
                expect( clamp(-11, -10, -2) ).toEqual(-10);
                expect( clamp(-10, -10, -2) ).toEqual(-10);
            });

            it('should return val if inside range', function(){
                expect( clamp(6, 1, 10) ).toEqual(6);
                expect( clamp(55, 1, 100) ).toEqual(55);
                expect( clamp(0, -50, 50) ).toEqual(0);
                expect( clamp(-6, -10, -2) ).toEqual(-6);

                expect( clamp(10, - Number.MAX_VALUE, Number.MAX_VALUE) ).toEqual(10);
                expect( clamp(1234567890, - Number.MAX_VALUE, Number.MAX_VALUE) ).toEqual(1234567890);
            });

        });

        describe('mathUtils.loop()', function(){
                
            var loop = mathUtils.loop;

            it('should return `min` if `val` is bigger than `max`', function(){
                expect( loop(11, 0, 10) ).toEqual(0);
                expect( loop(9999999, 999, 9999) ).toEqual(999);
                expect( loop(-500, -1000, -750) ).toEqual(-1000);
            });

            it('should return `max` if `val` is smaller than `min`', function(){
                expect( loop(-1, 0, 10) ).toEqual(10);
                expect( loop(99, 999, 9999) ).toEqual(9999);
                expect( loop(-1005, -1000, -750) ).toEqual(-750);
            });

            it('should return val if inside range', function(){
                expect( loop(6, 1, 10) ).toEqual(6);
                expect( loop(55, 1, 100) ).toEqual(55);
                expect( loop(0, -50, 50) ).toEqual(0);
                expect( loop(-6, -10, -2) ).toEqual(-6);

                expect( loop(10, - Number.MAX_VALUE, Number.MAX_VALUE) ).toEqual(10);
                expect( loop(1234567890, - Number.MAX_VALUE, Number.MAX_VALUE) ).toEqual(1234567890);
            });

        });

        describe('mathUtils.inRange()', function(){
            
            var inRange = mathUtils.inRange;

            it('should return true if val is inside range', function(){
                expect( inRange(6, 1, 10) ).toEqual(true);
                expect( inRange(55, 1, 100) ).toEqual(true);
                expect( inRange(0, -50, 50) ).toEqual(true);
                expect( inRange(-6, -10, -2) ).toEqual(true);

                expect( inRange(10, - Number.MAX_VALUE, Number.MAX_VALUE) ).toEqual(true);
                expect( inRange(1234567890, - Number.MAX_VALUE, Number.MAX_VALUE) ).toEqual(true);
            });

            it('should return false if val is outside range', function(){
                expect( inRange(-6, 1, 10) ).toEqual(false);
                expect( inRange(555, 1, 100) ).toEqual(false);
                expect( inRange(51, -50, 50) ).toEqual(false);
                expect( inRange(-11, -10, -2) ).toEqual(false);
            });
            
            it('should tolerate threshold', function(){
                expect( inRange(12, 1, 10, 2) ).toEqual(true);
                expect( inRange(500, 1, 100, 400) ).toEqual(true);
                expect( inRange(12, 1, 10, 1) ).toEqual(false);
                expect( inRange(500, 1, 100, 300) ).toEqual(false);

                expect( inRange(10.5, 1, 10, 0.5) ).toEqual(true);
                expect( inRange(10.5, 1, 10, 0.25) ).toEqual(false);
            });

        });



        describe('mathUtils.isNear()', function(){

            var isNear = mathUtils.isNear;

            it('should return true if val is close to target +/- threshold', function(){
                expect( isNear(10.5, 10, 0.5) ).toEqual(true);
                expect( isNear(9.5, 10, 0.5) ).toEqual(true);
                expect( isNear(9.9, 10, 0.5) ).toEqual(true);
                expect( isNear(10.1, 10, 0.5) ).toEqual(true);
                expect( isNear(10, 10, 0.5) ).toEqual(true);
            });

            it('should return true if val is not close to target +/- threshold', function(){
                expect( isNear(10.51, 10, 0.5) ).toEqual(false);
                expect( isNear(9.45, 10, 0.5) ).toEqual(false);
                expect( isNear(9.1, 10, 0.5) ).toEqual(false);
                expect( isNear(10.9, 10, 0.5) ).toEqual(false);
                expect( isNear(8, 10, 0.5) ).toEqual(false);
            });

        });

    //=====

    });

});
