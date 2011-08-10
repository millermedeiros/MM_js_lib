define(function(){

/**
 * @namespace Extremally basic code minifier
 * @author Miller Medeiros
 * @version 0.0.2 (2011/02/18)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var minifier = {
	
	/**
	 * Compress HTML file (Strip comments, remove tabs and line breaks).
	 * - <strong>IMPORTANT:</strong> comments inside 'script' and 'style' tags may produce undesired output.
	 * @param {string} str
	 * @param {boolean} [preserveComents]
	 * @param {boolean} [preserveLineBreaks]
	 * @param {boolean} [removeMultipleSpaces]
	 * @return {string}
	 */
	minifyHtml : function(str, preserveComents, preserveLineBreaks, removeMultipleSpaces){
		str = str.replace(/\t+/g, ''); //remove tabs
		str = (preserveComents)? str : str.replace(/<!--.*-->/g, ''); //remove HTML comments
		if(! preserveLineBreaks){
			str = str
					.replace(/\r|\n+/g, '') //remove line breaks
					.replace(/<!DOCTYPE[^>]*>/gi, '$&\n') //add line break after doctype
					.replace(/<\?xml[^>]*>/gi, '$&\n'); //add line break after XML
		}
		str = (! removeMultipleSpaces)? str : str.replace(/ {2,}/g, ' '); //convert multiple spaces into single spaces
		return str;
	},
	
	/**
	 * @param {string} str	CSS string.
	 * @return {string} CSS string without comments, line breaks and unnecessary spaces
	 */
	minifyCSS : function(str){
		return str
				.replace(/\/\*[\s\S]+?(?:\*\/)/g, "") //everything between "/* */" (comments)
				.replace(/\t+/g, "") //tabs
				.replace(/ {2,}/g, " ") //multiple spaces
				.replace(/ *([,\{\};\:]) */g, "$1") //spaces around ",;{}:" (should come after multiple spaces regexp)
				.replace(/^\s*\r?\n/gm, "") //empty lines
				.replace(/;\}/g, "}") //";" just before "}"
				.replace(/(\:|\,| |\(|\-)0\./g, "$1.") //remove leading zero on fractional number smaller than 1
				.replace(/[\n\r]+/gm, ""); //remove line breaks
	}
	
};

return minifier;
});