/**
 * Object Oriented Utils
 * @author Miller Medeiros <www.millermedeiros.com>
 * @version 0.2.2 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	//TODO: Refactor all methods. Find better names for `inherit` and `aggregate` also remove `abstractBind`.
	
	//instantiate main objects if it doesn't exist
	this.MM = this.MM || {};
	MM.oop = MM.oop || {};
	
	/**
	 * Copy properties from one Object to another
	 * @param {Object} obj Object to be extended.
	 * @param {Object} xo Extension Object.
	 * @return {Object} Extended Object.
	 */
	MM.oop.aggregate = function(obj, xo){
		for (var k in (xo || {})) obj[k] = xo[k];
		return obj;
	};
	
	/**
	 * Inherit prototype from another Object
	 * @param {Object} sub SubType
	 * @param {Object} sup SuperType
	 */
	MM.oop.inherit = function(sub, sup){
		var p = object(sup.prototype);
		p.constructor = sub;
		sub.prototype = p;
	}
	
	/**
	 * Shortcut for Bind
	 * @param {Function} fn Function.
	 * @param {Object} context Execution context.
	 * @param {Array} argsArr Array with arguments.
	 * @private
	 */
	function abstractBind(fn, context, argsArr){
		return function(){
			return fn.apply(context, argsArr.concat(Array.prototype.slice.call(arguments)));
		};
	};
	
	/**
	 * Call a function in the given context
	 * @param {Function} fn Function.
	 * @param {Object} context Execution context.
	 * @param {Object} [args] Arguments (0...n arguments).
	 * @return {Function} Wrapped Function.
	 */
	MM.oop.bind = function(fn, context, args){
		var args = Array.prototype.slice.call(arguments, 2);
		return abstractBind(fn, context, args);
	};
	
	/**
	 * Create a Function with default parameters
	 * @param {Object} fn Base function.
	 * @param {Object} args Default arguments (1...n arguments).
	 * @return {Function} Curried Function.
	 */
	MM.oop.curry = function(fn, args){
		var args = Array.prototype.slice.call(arguments, 1);
		return abstractBind(fn, null, args);
	};
	
})();