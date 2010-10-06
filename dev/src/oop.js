/**
 * @namespace Object Orienteded Utilities. Easier inheritance and scope handling.
 * @author Miller Medeiros <www.millermedeiros.com>
 * @version 0.4 (2010/09/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.oop = {
 	
 	/**
	 * Create a new Object by combining properties from all the objects.
	 * @param {...object} objects	Objects to be combined (0...n objects).
	 * @return {object} Combined Object.
	 */
 	mixIn : function(objects){
		var o = {},
			i = 0, 
			n = arguments.length;
		for(; i<n; i++){
			for(var key in arguments[i]){
				o[key] = arguments[i][key];
			}
		}
		return o;
	},
	
	/**
	 * Inherit prototype from another Object.
	 * - inspired by Nicholas Zackas <http://nczonline.net> Solution
	 * @param {object} child	Child object
	 * @param {object} parent	Parent Object
	 */
	inheritPrototype : function(child, parent){
		var p = this.createObject(parent.prototype);
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
		var o = new F();
		o = this.mixIn(o, props);
		return o;
	},
	
	/**
	 * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the beginning of the arguments collection.
	 * @param {Function} fn	Function.
	 * @param {Object} context	Execution context.
	 * @param {rest} args	Arguments (0...n arguments).
	 * @return {Function} Wrapped Function.
	 */
	bind : function(fn, context, args){
		var argsArr = Array.prototype.slice.call(arguments, 2); //curried args
		return function(){
			return fn.apply(context, argsArr.concat(Array.prototype.slice.call(arguments)));
		};
	},
	
	/**
	 * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the end of the arguments collection.
	 * @param {Function} fn	Function.
	 * @param {Object} context	Execution context.
	 * @param {...*} args	Arguments (0...n arguments).
	 * @return {Function} Wrapped Function.
	 */
	rbind : function(fn, context, args){
		var argsArr = Array.prototype.slice.call(arguments, 2); //curried args
		return function(){
			var innerArgs = Array.prototype.slice.call(arguments);
			return fn.apply(context, innerArgs.concat(argsArr));
		};
	},
	
	/**
	 * Return a Function with default parameters.
	 * @param {object} fn	Base function.
	 * @param {...*} args	Default arguments (1...n arguments).
	 * @return {Function} Curried Function.
	 */
	curry : function(fn, args){
		var argsArr = Array.prototype.slice.call(arguments, 1); //curried args
		return function(){
			return fn.apply(fn, argsArr.concat(Array.prototype.slice.call(arguments)));
		};
	}
	
};