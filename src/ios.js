/**
 * @namespace utilities for iOS
 * @version 0.1 (2010/12/15)
 * @author Miller Medeiros
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.ios = {
	
	_hasReadyFix : false,
	
	/**
	 * Specify a method to be called after DOM is "ready" (fully loaded). 
	 * @param {function()} fn
	 */
	onReady : function(fn){
		if(! this._hasReadyFix){
			//fix back-forward button on browsers that caches JS state (iOS4, FF 1.5+) - see: https://developer.mozilla.org/En/Using_Firefox_1.5_caching
			window.addEventListener('unload', millermedeiros.noop, false); //prevents page from caching since `pageshow` doesn't solve problem on the iPhone (iOS4).
			this._hasReadyFix = true;
		}
		
		if(document.readyState === 'complete'){ //if the document already loaded
			fn();
		}else{
			document.addEventListener('DOMContentLoaded', function(){
				document.removeEventListener('DOMContentLoaded', arguments.callee, false);
				fn();
			}, false);
		}
	}
	
};