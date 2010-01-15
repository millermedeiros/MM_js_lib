/**
 * MM.event - Advance
 * - event utilities not frequently used.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1.2 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	MM.event = MM.event || {};
	
	/**
	 * Prevent Default Behavior
	 * @param {Event} e Event
	 */
	MM.event.preventDefault = function(e){
		e = MM.event.getEvent(e);
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
	}
	
	/**
	 * Stop Event Propagation (Bubbling)
	 * @param {Event} e Event
	 */
	MM.event.stopPropagation = function(e){
		e = MM.event.getEvent(e);
		if (e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
	
	/**
	 * Stop default behavior and propagation
	 * @param {Event} e Event
	 */
	MM.event.halt = function(e){
		stopPropagation(e);
		preventDefault(e);
	}
	
	/**
	 * Get Event
	 * @param {Event} e Event
	 */
	MM.event.getEvent = function(e){
		return e ? e : window.e;
	}
	
	/**
	 * Get Event Target
	 * @param {Event} e Event
	 */
	MM.event.getTarget = function(e){
		e = MM.event.getEvent(e);
		return e.target || e.srcElement;
	}
		
})();