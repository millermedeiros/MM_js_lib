//TODO: port other functions from eclipse monkey scripts: https://github.com/millermedeiros/eclipse_monkey_scripts/tree/master/scripts and AS3 lib

define(function(){

    function toLower(str){
        return (str || '').toLowerCase();
    }

    function toUpper(str){
        return (str || '').toUpperCase();
    }

    /**
    * @namespace String Utilities
    * @author Miller Medeiros
    * @version 0.1.7 (2011/07/20)
    * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
    */
    var stringUtils = {
        
        /**
        * Remove white-spaces from beginning and end of string.
        * @param {string} str
        * @return {string}
        */
        trim : function(str){
            return (str || '').replace(/^\s+|\s+$/g, '');
        },
        
        /**
        * Remove white-spaces from beginning of string.
        * @param {string} str
        * @return {string}
        */
        ltrim : function(str){
            return (str || '').replace(/^\s+/g, '');
        },


        /**
        * Remove white-spaces from end of string.
        * @param {string} str
        * @return {string}
        */
        rtrim : function(str){
            return (str || '').replace(/\s+$/g, '');
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
        * @example millermedeiros.stringUtils.hyphenate('lorem ipsum spéçïãl chârs') -> 'lorem-ipsum-special-chars'
        * @param {string} str
        * @return {string}
        */
        hyphenate : function(str){
            str = this.replaceAccents(str);
            str = this.removeNonWord(str)
                    .replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2') //add space between camelCase text
                    .replace(/ +/g, '-') //replace spaces with hyphen
                    .toLowerCase();
            return str;
        },
        
        /**
        * Convert string to camelCase text.
        * - ported from Miller Medeiros Eclipse Monkey Scripts
        * @example stringUtils.camelCase('my awesome text') -> 'myAwesomeText';
        * @param {string} str
        * @return {string}
        */
        camelCase : function(str){
            str = this.replaceAccents(str);
            str = this.removeNonWord(str)
                    .replace(/\-/g, ' ') //convert hyphens to spaces
                    .replace(/\s[a-z]/g, toUpper) //convert first char of each word to UPPERCASE
                    .replace(/\s+/g, '') //remove spaces
                    .replace(/^[A-Z]/g, toLower); //convert first char to lowercase
            return str;
        },
        
        /**
         * UPPERCASE first char of each word.
         * - ported from Miller Medeiros Eclipse Monkey Scripts
         * @param {string} str
         * @return {string}
         */
        properCase : function(str){
            return toLower(str).replace(/^\w|\s\w/g, toUpper); //replace first char of each word to UPPERCASE
        },
        
        /**
         * UPPERCASE first char of each sentence and lowercase other words.
         * - ported from Miller Medeiros Eclipse Monkey Scripts
         * @param {string} str
         * @return {string}
         */
        sentenceCase : function(str){
            return toLower(str).replace(/(^\w)|\.\s+(\w)/gm, toUpper); //replace first char of each sentence (new line or after '.\s+') to UPPERCASE
        },

        /**
        * Replaces all chars with accents to regular ones
        * - ported from Miller Medeiros AS3 StringUtils.replaceAccents
        * @param {string} str
        * @retunr {string}	formated string
        */
        replaceAccents : function(str){
            str = str || '';
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
         * Remove non-word chars.
         * @param {string} str
         * @return {string}
         */
        removeNonWord : function(str){
            return (str || '').replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g, ''); //remove non-word chars
        },

        /**
        * Remove non-printable ASCII chars
        * @param {string} str
        * @return {string}
        */
        removeNonASCII : function(str){
            return (str || '').replace(/[^\x20-\x7E]/, ''); //matches non-printable ASCII chars - http://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters
        },
        
        /**
        * Remove HTML tags from string.
        * @param {string} str
        * @return {string}
        */
        stripHtmlTags : function(str){
            return (str || '').replace(/<[^>]*>/g, '');
        }
        
    };

    return stringUtils;
});
