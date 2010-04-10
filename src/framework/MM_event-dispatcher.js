/**
 * MM.EventDispatcher
 * - Class used to allow Custom Objects to dispatch events.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/04/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	
	/**
	 * Constructor - creates a new EventDispatcher Object
	 */
	MM.EventDispatcher = MM.EventDispatcher || function(){
		this._handlers = {};
	};
	
	var UNDEF = "undefined",
		prot = MM.EventDispatcher.prototype, //local storage for performance
		doc = document;
	
	/**
	 * Add Event Listener
	 * @param {String} e	Event Type.
	 * @param {Function} fn	Event Handler.
	 */
	prot.addListener = function(e, fn){
		if(typeof this._handlers[e] == UNDEF){
			this._handlers[e] = [];
		}
		this._handlers[e].push(fn);
	};
	
	/**
	 * Remove Event Listener
	 * @param {String} e	Event Type.
	 * @param {Function} fn	Event Handler.
	 */
	prot.removeListener = function(e, fn){
		if(! this._handlers[e]){
			return;
		}
		
		var	typeHandlers = this._handlers[e], //stored for performance
			n = typeHandlers.length;
			
		if(n == 1){
			this._handlers[e] = null; //avoid loop if not necessary
		}else{
			while(n--){ //faster than for
				if(typeHandlers[n] == fn){
					typeHandlers.splice(n, 1);
					break;
				}
			}
		}
	};
	
	/**
	 * Removes all Listeners from the EventDispatcher object.
	 */
	prot.removeAllListeners = function(){
		this._handlers = {};
	};
	
	/**
	 * Checks if the EventDispatcher has any listeners registered for a specific type of event. 
	 * @param {String} e	Event Type.
	 * @return {Boolean}
	 */
	prot.hasListener = function(e){
		return (typeof this._handlers[e] != UNDEF);
	};
	
	/**
	 * Dispatch Event - Call all Event Handlers.
	 * @param {String} e	Event Type.
	 * @param {Object} [context]	Context on which handlers should be called, default value is `this`.
	 */
	prot.dispatch = function(e, context){
		if(typeof this._handlers[e] != UNDEF){
			var typeHandlers = this._handlers[e], //stored for performance
				n = typeHandlers.length,
				context = context || this,
				curHandler;
			
			for(var i=0; i<n; i++){
				curHandler = typeHandlers[i];
				curHandler.call(context);
			}	
		}
	};
	
})();
