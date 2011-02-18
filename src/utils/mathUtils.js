/**
 * @namespace Math utilities
 * @author Miller Medeiros
 * @version 0.0.3 (2011/01/14)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.mathUtils = {
	
	/**
	 * Clamp value inside range
	 * @return {number}
	 */
	clamp : function(val, min, max){
		return Math.max(Math.min(val, max), min);
	},
	
	/**
	 * Check if value is inside range
	 * @return {boolean}
	 */
	inRange : function(val, min, max, threshold){
		threshold = threshold || 0;
		return (val + threshold >= min && val - threshold <= max);
	},
	
	/**
	 * Linear Interpolation
	 * @return {number} 
	 */
	lerp : function(start, end, ratio){
		return start + (end - start) * ratio;
	},
	
	/**
	 * @return {number} Ratio of value inside range
	 */
	lratio : function(val, start, end){
		return (val-start) / (end-start);
	}
	
};