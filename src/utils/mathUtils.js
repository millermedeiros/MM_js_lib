define(['./numberUtils'], function(numberUtils){

    /**
    * @exports mm/utils/mathUtils
    * @author Miller Medeiros
    * @version 0.2.0 (2011/08/30)
    * Released under the MIT License
    */
    var mathUtils = {

        /**
        * Clamps value inside range.
        */
        clamp : function(val, min, max){
            return val < min? min : (val > max? max : val);
        },

        /**
        * Loops value inside range.
        */
        loop : function(val, min, max){
            return val < min? max : (val > max? min : val);
        },

        /**
        * Checks if value is inside the range.
        */
        inRange : function(val, min, max, threshold){
            threshold = threshold || 0;
            return (val + threshold >= min && val - threshold <= max);
        },

        /**
        * Check if value is close to target.
        */
        isNear : function(val, target, threshold){
            return (Math.abs(val - target) <= threshold);
        },

        /**
        * Linear interpolation.
        * IMPORTANT:will return `Infinity` if numbers overflow Number.MAX_VALUE
        */
        lerp : function(ratio, start, end){
            return start + (end - start) * ratio;
        },

        /**
        * Linear ratio. Gets normalized ratio of value inside range.
        */
        lratio : function(val, start, end){
            return (val - start) / (end - start);
        },

        /**
        * Snap value to full steps.
        */
        snap : function(val, step){
            return mathUtils.countSteps(val, step) * step;
        },

        /**
        * Count number of full steps.
        */
        countSteps : function(val, step){
            return Math.floor(val / step);
        },

        /**
        * Normalize. Maps a number from one scale to another.
        * @example mathUtils.norm(3, 0, 4, -1, 1) -> 0.5
        */
        norm : function(val, min1, max1, min2, max2){
            return mathUtils.lerp( mathUtils.lratio(val, min1, max1), min2, max2 );
        },

        /**
        * @param {number} [min] Minimum value. Defaults to `numberhUtils.MIN_INT`
        * @param {number} [max] Maximum value. Default to `numberUtils.MAX_INT`
        * @param {boolean} [shouldSnap] If it should snap random number to min/max.
        * @return {number} random number inside range or snap to min/max values.
        */
        random : function(min, max, shouldSnap){
            min = (min != null)? min : numberUtils.MIN_INT;
            max = (max != null)? max : numberUtils.MAX_INT;
            var rnd = Math.random();
            return shouldSnap? (rnd < 0.5? min : max) : mathUtils.lerp(rnd, min, max);
        },

        /**
        * Gets random integer inside range or snap to min/max values.
        */
        randomInt : function(min, max, shouldSnap){
            return numberUtils.toInt( mathUtils.random(min, max, shouldSnap) );
        }

    };

    return mathUtils;
});
