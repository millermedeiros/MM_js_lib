/**
 * Object Oriented Utils
 * @author Miller Medeiros <www.millermedeiros.com>
 * @version 0.3 (2010/01/21)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	//instantiate main objects if they don't exist
	this.MM = this.MM || {};
	MM.oop = MM.oop || {};
	
	/**
	 * Create a new Object by combining properties from all the objects.
	 * @param {rest} objs	Objects to be combined (0...n objects).
	 * @return {Object} Combined Object.
	 */
	MM.oop.mixIn = function(objs){
		var o = {};
		for(var i=0, n=arguments.length; i<n; i++){
			for(var key in arguments[i]){
				o[key] = arguments[i][key];
			}
		}
		return o;
	};
	
	/**
	 * Inherit prototype from another Object.
	 * - inspired by Nicholas Zackas <http://nczonline.net> Solution
	 * @param {Object} child	Child object
	 * @param {Object} parent	Parent Object
	 */
	MM.oop.inheritPrototype = function(child, parent){
		var p = MM.oop.createObject(parent.prototype);
		p.constructor = child;
		child.prototype = p;
	}
	
	/**
	 * Create Object using prototypal inheritance and setting custom properties.
	 * - Mix between Douglas Crockford Prototypal Inheritance <http://javascript.crockford.com/prototypal.html> and the EcmaScript 5 `Object.create()` method.
	 * @param {Object} parent	Parent Object.
	 * @param {Object} props	Object properties.
	 * @return {Object} cloned Object.
	 */
	MM.oop.createObject = function(parent, props){
		function F(){}
		F.prototype = parent;
		var o = new F();
		o = MM.oop.mixIn(o, props);
		return o;
	};
	
	/**
	 * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the beginning of the arguments collection.
	 * @param {Function} fn	Function.
	 * @param {Object} context	Execution context.
	 * @param {rest} args	Arguments (0...n arguments).
	 * @return {Function} Wrapped Function.
	 */
	MM.oop.bind = function(fn, context, args){
		var argsArr = Array.prototype.slice.call(arguments, 2); //curried args
		return function(){
			return fn.apply(context, argsArr.concat(Array.prototype.slice.call(arguments)));
		};
	};
	
	/**
	 * Return a function that will execute in the given context, optionally adding any additional supplied parameters to the end of the arguments collection.
	 * @param {Function} fn	Function.
	 * @param {Object} context	Execution context.
	 * @param {rest} args	Arguments (0...n arguments).
	 * @return {Function} Wrapped Function.
	 */
	MM.oop.rbind = function(fn, context, args){
		var argsArr = Array.prototype.slice.call(arguments, 2); //curried args
		return function(){
			var innerArgs = Array.prototype.slice.call(arguments);
			return fn.apply(context, innerArgs.concat(argsArr));
		};
	};
	
	/**
	 * Return a Function with default parameters.
	 * @param {Object} fn	Base function.
	 * @param {rest} args	Default arguments (1...n arguments).
	 * @return {Function} Curried Function.
	 */
	MM.oop.curry = function(fn, args){
		var argsArr = Array.prototype.slice.call(arguments, 1); //curried args
		return function(){
			return fn.apply(fn, argsArr.concat(Array.prototype.slice.call(arguments)));
		};
	};
	
})();