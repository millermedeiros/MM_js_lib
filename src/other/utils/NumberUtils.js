/**
* NumberUtils - v0.2 (2009/09/25)
* @author Miller Medeiros (http://www.millermedeiros.com/)
* Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var NumberUtils = function(){
	/**
	* Crop number to a specific number of digits and add '0' if current number of digits is smaller than needed
	* - Ex: crop(1234, 2) returns 12  /  crop(1234, 2, true) returns 34
	* - Ex2: crop(1234, 5) returns 12340  /  crop(1234, 5, true) returns 01234
	* @param {Boolean} isLeft 	If starts from right to left
	* @return {String}
	*/
	function crop(num, digits, isLeft){
		var str = String(num),
			diff = digits - str.length;
		//remove digits
		if(str.length > digits) {
			var init = (isLeft)? -digits : 0;
			str = str.substr(init, digits);
		}
		//return 'n' zeros
		function getZeros(n){
			var z = '';
			while(n--){ z += '0'; }
			return z;
		}
		//add zeros
		if(diff > 0) {
			str = (!isLeft)? str+ getZeros(diff) : getZeros(diff) + str;
		}
		return str;
	}
	/**
	 * Limit Number precision
	 * - Ex: NumberUtils.limitPrecision(5.12345, 2) returns 5.12
	 * - Ex2: NumberUtils.limitPrecision(5.1, 2) returns 5.1
	 * @param {Number} n	Number to be formated
	 * @param {int} maxPrecision	Maximum number of digits after dot
	 * @return	Number without any trailing zeroes and with a maximum number of decimal digits
	 */
	function limitPrecision(n, maxPrecision){
		return parseFloat(n.toFixed(maxPrecision));
	}
	//API
	return{
		crop : crop,
		limitPrecision : limitPrecision
	};
}();