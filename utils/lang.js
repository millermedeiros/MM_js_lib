define(function(){

    function slice(arr, offset){
        return Array.prototype.slice.call(arr, offset || 0);
    }

    /**
    * @name utils.lang
    * @namespace Language Utilities. Easier inheritance and scope handling.
    * @author Miller Medeiros <www.millermedeiros.com>
    * @version 0.5.0 (2011/09/08)
    * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
    */
    var lang = {
        
        /**
        * Combine properties from all the objects into first one.
        * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
        * @param {object} target    Target Object
        * @param {...object} objects	Objects to be combined (0...n objects).
        * @return {object} Target Object.
        */
        mixIn : function(target, objects){
            var i = 1, 
                n = arguments.length,
                key, cur;
            while(cur = arguments[i++]){
                for(key in cur){
                    if(cur.hasOwnProperty(key)){
                        target[key] = cur[key];
                    }
                }
            }
            return target;
        },
        
        /**
        * Inherit prototype from another Object.
        * - inspired by Nicholas Zackas <http://nczonline.net> Solution
        * @param {object} child	Child object
        * @param {object} parent	Parent Object
        */
        inheritPrototype : function(child, parent){
            var p = lang.createObject(parent.prototype);
            p.constructor = child;
            child.prototype = p;
        },
        
        /**
        * Create Object using prototypal inheritance and setting custom properties.
        * - Mix between Douglas Crockford Prototypal Inheritance <http://javascript.crockford.com/prototypal.html> and the EcmaScript 5 `Object.create()` method.
        * @param {object} parent	Parent Object.
        * @param {object} props	Object properties.
        * @return {object} cloned Object.
        */
        createObject : function(parent, props){
            function F(){}
            F.prototype = parent;
            return lang.mixIn(new F(), props);
        },
        
        /**
        * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the beginning of the arguments collection.
        * @param {Function} fn	Function.
        * @param {object} context	Execution context.
        * @param {rest} args	Arguments (0...n arguments).
        * @return {Function} Wrapped Function.
        */
        bind : function(fn, context, args){
            var argsArr = slice(arguments, 2); //curried args
            return function(){
                return fn.apply(context, argsArr.concat(slice(arguments)));
            };
        }
        
    };

    return lang;
});
