/**
* StringUtils - v0.2 (2009/11/25)
* @author Miller Medeiros (http://www.millermedeiros.com/)
* Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var StringUtils = function(){
	/**
	* Replace all spaces to hyphen
	* @param {String} str String
	*/
	function hyphenate(str){
		return str.replace(/\s+/g, "-");
	}
	/**
	 * Remove any whitespace char from the beginning and the end of the String
	 * @param {String} str String
	 */
	function trim(str){
		return str.replace(/^\s*|\s*$/g, "");
	}
	//API
	return{
		hyphenate: hyphenate,
		trim: trim
	};
}();