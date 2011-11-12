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

        function toDomProp(prefix, prop){
            return prefix? prefix + pascalCase(prop) : camelCase(prop);
        }

        /**
         * Add browser specific prefixes based on feature detection.
         * methods will return `null` if property isn't supported.
         * @author Miller Medeiros
         * @version 0.1.0 (2011/10/26)
         */
        var vendorPrefix = {

            dom : function(prop, scope){
                scope = scope || _testEl;

                var i = 0,
                    prefix,
                    prefixed = toDomProp(prop);

                if(prefixed in scope){
                    return prefixed;
                } else if(_prevPrefix){
                    prefixed = toDomProp(_prevPrefix, prop);
                    //no need to test more if already found browser prefix..
                    return (prefixed in scope)? prefixed : null;
                }

                //only loops if never found a prefix before
                while(prefix = _domPrefixes[i++]){
                    prefixed = toDomProp(prefix, prop);
                    if(prefixed in scope ){
                        _prevPrefix = prefix; //cache
                        return prefixed;
                    }
                }

                return null;
            },

            style : function(prop){
                return vendorPrefix.dom(prop, _testStyle);
            },

            css : function(prop){
                var styleProp = vendorPrefix.style(prop),
                    val;

                if(styleProp && styleProp.length === prop.length){
                    val = prop;
                } else if(styleProp && styleProp.length > prop.length){
                    // -ms-, -o-, -webkit-, -moz- follow same pattern..
                    val = '-'+ hyphenate(styleProp);
                }

                return val;
            }

        };

        return vendorPrefix;

    }
);
