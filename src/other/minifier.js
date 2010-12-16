/**
 * @namespace Extremally basic code minifier
 * @author Miller Medeiros
 * @version 0.0.1 (2010/09/17)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.minifier = {
	
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
	}
	
};
