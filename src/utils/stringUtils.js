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
    * @name stringUtils
    * @author Miller Medeiros
    * @version 0.2.0 (2011/08/10)
    * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
    */
    var stringUtils = {

        /**
        * Remove white-spaces from beginning and end of string.
        * @example stringUtils.trim('   lorem ipsum   ') -> 'lorem ipsum'
        * @param {string} str
        * @return {string}
        */
        trim : function(str){
            return (str || '').replace(/^\s+|\s+$/g, '');
        },

        /**
        * Remove white-spaces from beginning of string.
        * @example stringUtils.ltrim('   lorem ipsum   ') -> 'lorem ipsum   '
        * @param {string} str
        * @return {string}
        */
        ltrim : function(str){
            return (str || '').replace(/^\s+/g, '');
        },

        /**
        * Remove white-spaces from end of string.
        * @example stringUtils.rtrim('   lorem ipsum   ') -> '   lorem ipsum'
        * @param {string} str
        * @return {string}
        */
        rtrim : function(str){
            return (str || '').replace(/\s+$/g, '');
        },

        /**
        * Limit number of chars.
        *  - ported from Miller Medeiros PHP lib
        * @example stringUtils.crop('lorem ipsum dolor sit amet', 10) -> 'lorem...'
        * @param {string} str
        * @param {number} [maxChars] Default to 125 chars. (including append.length)
        * @param {string} [append] Default to '...'
        * @return {string}
        */
        crop : function(str, maxChars, append){
            maxChars = maxChars || 125;
            append = append || '...';

            str = stringUtils.trim(str);
            if(str.length <= maxChars){
                return str;
            }
            str = str.substr(0, maxChars - append.length + 1);
            str = str.substr(0, str.lastIndexOf(' ')); //crop at last space
            return str + append;
        },

        /**
        * Replaces spaces with hyphens, split camelCase text, remove non-word chars, remove accents and convert to lower case.
        * @example stringUtils.hyphenate('loremIpsum dolor spéçïãl chârs') -> 'lorem-ipsum-dolor-special-chars'
        * @see stringUtils.toSlug
        * @param {string} str
        * @return {string}
        */
        hyphenate : function(str){
            return stringUtils.toSlug( stringUtils.unCamelCase(str) );
        },

        /**
         * Replaces hyphens with spaces. (only hyphens between word chars)
         * @example stringUtils.unHyphenate('lorem-ipsum-dolor') -> 'lorem ipsum dolor'
         * @param {string} str
         * @return {string}
         */
        unHyphenate : function(str){
            return (str || '').replace(/(\w)(-)(\w)/g, '$1 $3'); //convert hyphens between word chars to spaces
        },

        /**
         * Convert to lower case, remove accents, remove non-word chars and
         * replace spaces with hyphens.
         * Only difference from `stringUtils.hyphenate`  is that it doesn't 
         * split camelCase text.
        * - ported from Miller Medeiros Eclipse Monkey Scripts
         * @example stringUtils.toSlug('loremIpsum dolor spéçïãl chârs') -> 'loremipsum-dolor-special-chars'
         * @see stringUtils.hyphenate
         * @param {string} str
         * @return {string}
         */
        toSlug : function(str){
            str = stringUtils.replaceAccents(str);
            str = stringUtils.removeNonWord(str);
            str = stringUtils.trim(str) //should come after removeNonWord
                    .replace(/ +/g, '-') //replace spaces with hyphen
                    .toLowerCase();
            return str;
        },

        /**
        * Convert string to camelCase text.
        * - ported from Miller Medeiros Eclipse Monkey Scripts
        * @example stringUtils.camelCase('my --  awesome-text') -> 'myAwesomeText';
        * @param {string} str
        * @return {string}
        */
        camelCase : function(str){
            str = stringUtils.replaceAccents(str);
            str = stringUtils.removeNonWord(str)
                    .replace(/\-/g, ' ') //convert all hyphens to spaces
                    .replace(/\s[a-z]/g, toUpper) //convert first char of each word to UPPERCASE
                    .replace(/\s+/g, '') //remove spaces
                    .replace(/^[A-Z]/g, toLower); //convert first char to lowercase
            return str;
        },
        
        /**
         * Add space between camelCase text.
         * @example stringUtils.unCamelCase('loremIpsumDolor') -> 'lorem ipsum dolor'
         * @param {string} str
         * @return {string}
         */
        unCamelCase : function(str){
            return (str || '').replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2').toLowerCase(); //add space between camelCase text
        },

        /**
         * UPPERCASE first char of each word.
         * - ported from Miller Medeiros Eclipse Monkey Scripts
         * @example stringUtils.properCase('loRem iPSum') -> 'Lorem Ipsum'
         * @param {string} str
         * @return {string}
         */
        properCase : function(str){
            return toLower(str).replace(/^\w|\s\w/g, toUpper); //replace first char of each word to UPPERCASE
        },

        /**
         * UPPERCASE first char of each sentence and lowercase other chars.
         * - ported from Miller Medeiros Eclipse Monkey Scripts
         * @example stringUtils.sentenceCase('Lorem IpSum DoLOr. maeCeNnas Ullamcor.') -> 'Lorem ipsum dolor. Maecennas ullamcor.'
         * @param {string} str
         * @return {string}
         */
        sentenceCase : function(str){
            return toLower(str).replace(/(^\w)|\.\s+(\w)/gm, toUpper); //replace first char of each sentence (new line or after '.\s+') to UPPERCASE
        },

        /**
         * Group arguments as path segments, if any of the args is `null` it
         * will be ignored from resulting path.
         * @example stringUtils.makePath('lorem', 'ipsum', null, 'dolor') -> 'lorem/ipsum/dolor'
         * @param {...string} args
         * @return {string}
         */
        makePath : function(args){
            args = Array.prototype.slice.call(arguments);
            return args.join('/').replace(/\/+/g, '/');
        },

        /**
        * Replaces all accented chars with regular ones
        * - ported from Miller Medeiros AS3 StringUtils.replaceAccents
        * - only covers Basic Latin and Latin-1 unicode chars.
        * @example stringUtils.replaceAccents('lõrêm ípsûm') -> 'lorem ipsum'
        * @param {string} str
        * @return {string}	formated string
        */
        replaceAccents : function(str){
            str = str || '';
            // verifies if the String has accents and replace them
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
         * @example stringUtils.removeNonWord('lorem! ipsum?') -> 'lorem ipsum'
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
            return (str || '').replace(/[^\x20-\x7E]/g, ''); //matches non-printable ASCII chars - http://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters
        },

        /**
        * Remove HTML tags from string.
        * @example stringUtils.stripHtmlTags('<p><em>lorem</em> <strong>ipsum</strong></p>') -> 'lorem ipsum'
        * @param {string} str
        * @return {string}
        */
        stripHtmlTags : function(str){
            return (str || '').replace(/<[^>]*>/g, '');
        }

    };

    return stringUtils;
});
