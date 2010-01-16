/**
 * MM.event - Adapter
 * - cross-browser event methods.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1.2 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	MM.event = MM.event || {};
	
	//TODO: maybe change the structure to a custom Event Object that abstracts the DOM Events instead of an Adapter (I think it's a better approach - easier to use and will be more similar to the W3C standard)
	
	/**
	 * Prevents Default Behavior
	 * @param {Event} e Event
	 */
	MM.event.preventDefault = function(e){
		e = MM.event.getEvent(e);
		if(e.preventDefault) e.preventDefault();
		else e.returnValue = false;
	}
	
	/**
	 * Stops Event Propagation (Bubbling)
	 * @param {Event} e Event
	 */
	MM.event.stopPropagation = function(e){
		e = MM.event.getEvent(e);
		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
	
	/**
	 * Stops default behavior and propagation
	 * @param {Event} e Event
	 */
	MM.event.halt = function(e){
		stopPropagation(e);
		preventDefault(e);
	}
	
	/**
	 * Gets Event
	 * @param {Event} e Event
	 */
	MM.event.getEvent = function(e){
		return e ? e : window.e;
	}
	
	/**
	 * Gets Event Target
	 * @param {Event} e Event
	 */
	MM.event.getTarget = function(e){
		e = MM.event.getEvent(e);
		return e.target || e.srcElement;
	}
		
})();