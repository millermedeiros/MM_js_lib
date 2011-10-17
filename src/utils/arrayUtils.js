define(function(){

    var _aProto = Array.prototype,
        _idxOf = _aProto.indexOf,
        _forEach = _aProto.forEach,
        _filter = _aProto.filter;


    /**
    * Basic array utilities, for more features check underscore.js
    * @exports mm/utils/arrayUtils
    * @author Miller Medeiros
    * @version 0.1.0 (2011/10/17)
    * Released under the MIT License
    */
    var arrayUtils = {

        /**
         * ES5 indexOf (since it doesn't work on IE 6-8 natively)
         */
        indexOf : function(arr, item, fromIndex){
            fromIndex = fromIndex || 0;
            if(_idxOf && arr.indexOf === _idxOf){
                return arr.indexOf(item, fromIndex);
            } else {
                for(var i = fromIndex, n = arr.length; i < n; i += 1){
                    if(arr[i] === item) return i;
                }
                return -1;
            }
        },

        /**
         * ES5 forEach
         */
        forEach : function(arr, callback, thisObj){
            if(_forEach && arr.forEach === _forEach){
                arr.forEach(callback, thisObj);
            } else {
                for(var i = 0, n = arr.length, item; i < n; i++){
                    item = arr[i];
                    //according to spec callback should only be called for
                    //existing items
                    if(typeof item !== 'undefined'){
                        callback.call(thisObj, item, i, arr);
                    }
                }
            }
        },

        /**
         * ES5 filter: Creates a new array with all elements that pass the callback test.
         * @return {array}
         */
        filter : function(arr, callback, thisObj){
            if(_filter && arr.filter === _filter){
                return arr.filter(callback, thisObj);
            } else {
                var results = [];
                arrayUtils.forEach(arr, function(val, i, arr){
                    if(callback.call(thisObj, val, i, arr)){
                        results.push(val);
                    }
                });
                return results;
            }
        },

        /**
         * Remove a single item from the array.
         * (it won't remove duplicates, just a single item)
         */
        remove : function(arr, item){
            var idx = arrayUtils.indexOf(arr, item);
            arr.splice(idx, 1);
        },

        /**
         * @return {array} Array of unique items
         */
        unique : function(arr){
            return arrayUtils.filter(arr, isUnique);
        }

    };

    function isUnique(item, i, arr){
        return arrayUtils.indexOf(arr, item, i+1) === -1;
    }

    return arrayUtils;
});
