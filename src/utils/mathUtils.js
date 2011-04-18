/**
 * Math utilities
 * @author Miller Medeiros
 * @version 0.0.4 (2011/03/31)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
define({
	
	clamp : function(val, min, max){
		return Math.max(Math.min(val, max), min);
	},
	
	loop : function(val, min, max){
		return (val < min)? max : ((val > max)? min : val);
	},
	
	inRange : function(val, min, max, threshold){
		threshold = threshold || 0;
		return (val + threshold >= min && val - threshold <= max);
	},
	
	lerp : function(start, end, ratio){
		return start + (end - start) * ratio;
	},
	
	lratio : function(val, start, end){
		return (val-start) / (end-start);
	}
	
});