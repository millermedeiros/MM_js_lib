define([
       'amd-utils/string/pascalCase',
       'amd-utils/string/camelCase',
       'amd-utils/string/hyphenate'
    ],
    function(pascalCase, camelCase, hyphenate){

        var _domPrefixes = 'Webkit Moz O ms'.split(' '),
            _testEl = document.createElement('mmtest'), //avoid issues with query selector, html5 supports custom tags..
            _testStyle = _testEl.style,
            _prevPrefix;

        function toDomProp(prefix, prop, isStyle){
            prop = prefix? prefix +' '+ prop : prop;
            return isStyle && prefix? pascalCase(prop) : camelCase(prop);
        }

        /**
         * Add browser specific prefixes based on feature detection.
         * methods will return `null` if property isn't supported.
         * @author Miller Medeiros
         * @version 0.2.1 (2011/11/13)
         */
        var vendorPrefix = {

            dom : function(prop, scope, isStyle){
                scope = scope || _testEl;

                var i = 0,
                    prefix,
                    prefixed = toDomProp(null, prop, isStyle);

                if(prefixed in scope){
                    return prefixed;
                } else if(_prevPrefix){
                    prefixed = toDomProp(_prevPrefix, prop, isStyle);
                    //no need to test more if already found browser prefix..
                    return (prefixed in scope)? prefixed : null;
                }

                //only loops if never found a prefix before
                while(prefix = _domPrefixes[i++]){
                    prefixed = toDomProp(prefix, prop, isStyle);
                    if(prefixed in scope ){
                        _prevPrefix = prefix; //cache
                        return prefixed;
                    }
                }

                return null;
            },

            style : function(prop){
                return vendorPrefix.dom(prop, _testStyle, true);
            },

            css : function(prop){
                var styleProp = vendorPrefix.style(prop),
                    camelProp = camelCase(prop),
                    hyphenStyle = hyphenate(styleProp),
                    val;

                if(styleProp && styleProp.length === camelProp.length){
                    //no prefix
                    val = hyphenStyle;
                } else if(styleProp && styleProp.length > camelProp.length){
                    // -ms-, -o-, -webkit-, -moz- follow same pattern..
                    val = '-'+ hyphenStyle;
                }

                return val;
            }

        };

        return vendorPrefix;

    }
);
