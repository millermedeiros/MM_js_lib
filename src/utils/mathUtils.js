/**
 * @namespace Math utilities
 * @author Miller Medeiros
 * @version 0.0.1 (2010/12/15)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.mathUtils = {
	
	/**
	 * Clamp value inside range
	 */
	clamp : function(val, min, max){
		return Math.max(Math.min(val, max), min);
	}
	
};