/**
 * MM.event - Basic
 * - Event utilities frequently used.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.2 (2010/01/12)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM? this.MM : {};
	MM.event = MM.event? MM.event : {};
	
	var isDOMReady = false,
		isReadyBound = false,
		onReadyFns = [];
	
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
	
	/**
	 * Add an Event Listener that should be triggered after the DOM has loaded.
	 * @param {Function} fn	Function that should be called after the DOM finishes loading.
	 */
	MM.event.addDOMReady = function(fn){
		if(!isDOMReady){
			bindReady();
			onReadyFns.push(fn);
		}else{
			fn();
		}
	}
	
	/**
	 * Call all the functions that were registered to the DOM Ready Event (not a real Event Dispatcher)
	 * @private
	 */
	function dispatchDOMReady(){
		if(isDOMReady) return;
		isDOMReady = true;
		isReadyBound = null;
		//TODO: maybe change the way it works to use the browser native event dispatcher instead of using an array to store all registered methods.
		for(var i=0, n=onReadyFns.length; i<n; i++){
			onReadyFns[i]();
		}
		onReadyFns = null;
	}
	
	/**
	 * Add DOM Ready Event Listener
	 * - based on jQuery (http://jquery.com/) solution.
	 * @private
	 */
	function bindReady(){
		if(isReadyBound) return;
		
		if(document.addEventListener){ //Mozilla, Opera and WebKit
			document.addEventListener('DOMContentLoaded', function(){
				document.removeEventListener('DOMContentLoaded', arguments.callee, false);
				dispatchDOMReady();
			}, false);
		}else if(document.attachEvent){ //IE
			
			//ensure firing before onload. (also works for iframes)
			document.attachEvent('onreadystatechange', function(){
				if(document.readyState === 'complete'){
					document.detachEvent('onreadystatechange', arguments.callee);
					dispatchDOMReady();
				}
			});
			
			//If IE and not an iframe.
			if(document.documentElement.doScroll && window == window.top){
				if(isDOMReady) return;
				(function(){
					//hack based on Diego Perini solution: http://javascript.nwbox.com/IEContentLoaded/
					try{
						document.documentElement.doScroll('left');
					}catch(err){
						setTimeout(arguments.callee, 0);
						return;
					}
					dispatchDOMReady();
				})();
			}
			
		}else{ //fallback for other browser using the Load event.
			MM.event.addListener(window, 'load', function(){
				MM.event.removeListener(window, 'load', fn);
				dispatchDOMReady();
			});
		}
		
		isReadyBound = true;
	}
	
})();