/**
 * MM.event - Adapter
 * - cross-browser event methods.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.2 (2010/04/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	MM.event = MM.event || {};
	
	var mmevt = MM.event; //local storage for performance improvement
	
	/**
	 * Gets Event
	 * @param {Event} e Event
	 */
	mmevt.getEvent = function(e){
		return e ? e : window.e;
	}
	
	/**
	 * Prevents Default Behavior
	 * @param {Event} e Event
	 */
	mmevt.preventDefault = function(e){
		e = mmevt.getEvent(e);
		if(e.preventDefault) e.preventDefault();
		else e.returnValue = false;
	}
	
	/**
	 * Stops Event Propagation (Bubbling)
	 * @param {Event} e Event
	 */
	mmevt.stopPropagation = function(e){
		e = mmevt.getEvent(e);
		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
	
	/**
	 * Stops default behavior and propagation
	 * @param {Event} e Event
	 */
	mmevt.halt = function(e){
		mmevt.stopPropagation(e);
		mmevt.preventDefault(e);
	}
	
	/**
	 * Gets Event Target
	 * @param {Event} e Event
	 */
	mmevt.getTarget = function(e){
		e = mmevt.getEvent(e);
		return e.target || e.srcElement;
	}
		
})();