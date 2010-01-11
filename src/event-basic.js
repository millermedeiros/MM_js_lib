/**
 * MM.event - Basic
 * - Event utilities frequently used.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1.2 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM? this.MM : {};
	MM.event = MM.event? MM.event : {};
	
	/**
	* Add Event Listener
	* @param {Element} elm Element.
	* @param {String} e Event type.
	* @param {Function} fn Listener function.
	*/
	MM.event.addListener = function(elm, e, fn){
		if(elm.addEventListener){
			elm.addEventListener(e, fn, false);
		}else if(elm.attachEvent){
			elm.attachEvent('on' + e, fn);
		}else{
			elm['on' + e] = fn;
		}
	}
	
	/**
	* Remove Event Listener
	* @param {Element} elm Element.
	* @param {String} e Event type.
	* @param {Function} fn Listener function.
	*/
	MM.event.removeListener = function(elm, e, fn){
		if (elm.removeEventListener) {
			elm.removeEventListener(e, fn, false);
		}else if(elm.detachEvent){
			elm.detachEvent('on' + e, fn);
		}else{
			elm['on' + e] = null;
		}
	}
	
})();