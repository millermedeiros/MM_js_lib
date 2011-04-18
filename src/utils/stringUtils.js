define(function(){

/**
 * @namespace String Utilities
 * @author Miller Medeiros
 * @version 0.1.5 (2011/04/08)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var stringUtils = {
	
	/**
	 * Remove white-spaces from beginning and end of string.
	 * @param {string} str
	 * @return {string}
	 */
	trim : function(str){
		return str.replace(/^\s+|\s+$/g, '');
	},
	
	/**
	 * Limit number of chars.
	 *  - ported from Miller Medeiros PHP lib
	 */
	crop : function(str, maxChars, append, stripHtml){
		maxChars = maxChars || 125;
		append = append || '...';
		stripHtml = true;
		
		str = stripHtml? this.stripHtmlTags(str) : str;
		if(str.length <= maxChars){
			return str;
		}
		str = str.substr(0, maxChars);
		str = str.substr(0, str.lastIndexOf(' ')); //crop at last space
		return str + append;
	},
	
	/**
	 * Format Title 
	 * @param {array} pathTitles
	 * @param {string}	[defaultTitle]
	 * @param {string}	[separator]	Defaults to ' | '.
	 * @return {string}
	 */
	toTitleFormat : function(pathTitles, defaultTitle, separator){
		separator = separator || ' | ';
		var n = pathTitles.length,
			output = [];
		while(n--){
			output.push(pathTitles[n]);
		}
		if(defaultTitle){
			output.push(defaultTitle);
		}
		return this.stripHtmlTags(output.join(separator));
	},
	
	/**
	 * Replaces spaces with hyphens, split camel case text, remove non-word chars, remove accents and convert to lower case.
	 * - ported from Miller Medeiros Eclipse Monkey Scripts
	 * @example millermedeiros.stringUtils.hyphenate('lorem ipsum sp����l�Ch�rs') -> 'lorem-ipsum-special-chars'
	 * @param {string} str
	 * @return {string}
	 */
	hyphenate : function(str){
		str = str
				.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, '') //remove non-word chars
				.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2') //add space between camelCase text
				.replace(/ +/g, '-') //replace spaces with hyphen
				.toLowerCase();
		return this.replaceAccents(str);
	},
	
	/**
	 * Replaces all chars with accents to regular ones
	 * - ported from Miller Medeiros AS3 StringUtils.replaceAccents
	 * @param {string} str
	 * @retunr {string}	formated string
	 */
	replaceAccents : function(str){
		// verifies if the String has accents and replace accents
		if (str.search(/[\xC0-\xFF]/g) > -1) {
			str = str
					.replace(/[\xC0-\xC5]/g, "A")
					.replace(/[\xC6]/g, "AE")
					.replace(/[\xC7]/g, "C")
					.replace(/[\xC8-\xCB]/g, "E")
					.replace(/[\xCC-\xCF]/g, "I")
					.replace(/[\xD0]/g, "D")
					.replace(/[\xD1]/g, "N")
					.replace(/[\xD2-\xD6\xD8]/g, "O")
					.replace(/[\xD9-\xDC]/g, "U")
					.replace(/[\xDD]/g, "Y")
					.replace(/[\xDE]/g, "P")
					.replace(/[\xE0-\xE5]/g, "a")
					.replace(/[\xE6]/g, "ae")
					.replace(/[\xE7]/g, "c")
					.replace(/[\xE8-\xEB]/g, "e")
					.replace(/[\xEC-\xEF]/g, "i")
					.replace(/[\xF1]/g, "n")
					.replace(/[\xF2-\xF6\xF8]/g, "o")
					.replace(/[\xF9-\xFC]/g, "u")
					.replace(/[\xFE]/g, "p")
					.replace(/[\xFD\xFF]/g, "y");
		}
		return str;
	},
	
	/**
	 * Remove non-printable ASCII chars
	 * @param {string} str
	 * @return {string}
	 */
	removeNonASCII : function(str){
		return str.replace(/[^\x00-\x7E]/, ''); //matches non-printable ASCII chars - http://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters
	},
	
	/**
	 * Remove HTML tags from string.
	 * @param {string} str
	 * @return {string}
	 */
	stripHtmlTags : function(str){
		return str.replace(/<[^>]*>/g, '');
	}
	
};

return stringUtils;
});