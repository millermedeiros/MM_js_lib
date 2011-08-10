define(function(){
    
    var MIN_VALUE = 1 << 31;

    /**
    * @name mathUtils
    * @namespace Math utilities
    * @author Miller Medeiros
    * @version 0.1.4 (2011/08/09)
    * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
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
     * Maps a number from one scale to another. 
     * @example map(3, 0, 4, -1, 1) -> 0.5
     */
    map : function(val, min1, max1, min2, max2){
        return mathUtils.lerp( mathUtils.lratio(val, min1, max1), min2, max2 );
    },
    
    /**
     * Gets a random number inside range or snap to min/max values.
     * @param {number} [min] Minimum value. Defaults to -2147483648
     * @param {number} [max] Maximum value. Default to 2147483648
     * @param {boolean} [shouldSnal] If it should snap random number to min/max. 
     */
    random : function(min, max, shouldSnap){
        min = (min != null)? min : MIN_VALUE;
        max = (max != null)? max : -MIN_VALUE;
        var random = Math.random();
        return shouldSnap? (random < 0.5? min : max) : mathUtils.lerp(random, min, max);
    },
    
    /**
     * Gets random integer inside range or snap to min/max values.
     */
    randomInt : function(min, max, shouldSnap){
        return mathUtils.toInt( mathUtils.random(min, max, shouldSnap) );
    },
    
    /**
    * Convert value into an integer. Works like `Math.floor` if val > 0 and `Math.ceil` if val < 0.
    */
    toInt : function(val){
        return val ^ 0; //XOR 0 removes decimal digits.
    },
    
    /**
     * Enforce a specific amount of decimal digits.
     */
    enforcePrecision : function(val, nDecimalDigits){
        return +(val).toFixed(nDecimalDigits);
    }

    };

    return mathUtils;
});
