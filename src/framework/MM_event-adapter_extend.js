/**
 * MM.event - Adapter Extend
 * - cross-browser event methods.
 * @author Miller Medeiros <http://www.millermedeiros.com>
 * @version 0.1 (2010/01/15)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
/*requires ./event-adapter.js*/
(function(){
	
	this.MM = this.MM || {};
	MM.event = MM.event || {};
	
	/**
	* Get Related Target (`mouseover` or `mouseout` previous target)
	* @param {Event} e Event object
	*/
	MM.event.getRelatedTarget = function(e){
		e = MM.event.getEvent(e);
		if(e.relatedTarget){
			return e.relatedTarget;
		}else if(e.toElement){
			return e.toElement;
		}else if(e.fromElement){
			return e.fromElement;
		}
		return null;
	}
	
	/**
	 * Get pressed mouse button.
	 * @param {Event} e `mouseup` or `mousedown` Event 
	 */
	MM.event.getMouseButton = function(e){
		e = MM.event.getEvent(e);
		var b = e.button;
		return (document.implementation.hasFeature('MouseEvents', '2.0'))? b : ((b === 4)? 1 : ((b === 2 || b === 6)? 2 : 0));
	}
	
	/**
	 * Get char code - only works properly on `keypress` events.
	 * - view <http://www.quirksmode.org/js/keys.html> for more details.
	 * @param {Event} e `keypress` Event
	 */
	MM.event.getCharCode = function(e){
		e = MM.event.getEvent(e);
		return e.charCode || e.keycode;
	}
	
	/**
	 * Get normalized value of the mouse wheel delta
	 * @param {Event} e `mousewheel` Event 
	 */
	MM.event.getWheelDelta = function(e){
		e = MM.event.getEvent(e);
		return (e.wheelDelta)? ((client.engine.opera && client.engine.opera < 9.5)? -e.wheelDelta : e.wheelDelta) : -event.detail * 40;
	}
	
})();
