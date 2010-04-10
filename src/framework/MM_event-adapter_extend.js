/**
 * MM.event - Adapter Extend
 * - cross-browser event methods.
 * @author Miller Medeiros <http://www.millermedeiros.com>
 * @version 0.2 (2010/04/10)
 * @requires event-adapter.js
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	MM.event = MM.event || {};
	
	var mmevent = MM.event; //local storage for performance improvement
	
	/**
	* Get Related Target (`mouseover` or `mouseout` previous target)
	* @param {Event} e Event object
	*/
	mmevent.getRelatedTarget = function(e){
		e = mmevent.getEvent(e);
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
	 * Get normalized pressed mouse button.
	 * @param {Event} e `mouseup` or `mousedown` Event 
	 */
	mmevent.getMouseButton = function(e){
		e = mmevent.getEvent(e);
		var btn = e.button;
		return (document.implementation.hasFeature('MouseEvents', '2.0'))? btn : ((btn === 4)? 1 : ((btn === 2 || btn === 6)? 2 : 0)); // 0,1,3,5,7 = 0; 4 = 1; 2,6 = 2; 
	}
	
	/**
	 * Get char code - only works properly on `keypress` events.
	 * - view <http://www.quirksmode.org/js/keys.html> for more details.
	 * @param {Event} e `keypress` Event
	 */
	mmevent.getCharCode = function(e){
		e = mmevent.getEvent(e);
		return e.charCode || e.keycode;
	}
	
	/**
	 * Get normalized value of the mouse wheel delta
	 * - based on Nicholas Zackas Solution <http://nczonline.net>
	 * @param {Event} e `mousewheel` Event 
	 */
	mmevent.getWheelDelta = function(e){
		e = mmevent.getEvent(e);
		return (e.wheelDelta)? ((client.engine.opera && client.engine.opera < 9.5)? -e.wheelDelta : e.wheelDelta) : -event.detail * 40;
	}
	
})();
