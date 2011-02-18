/**
 * Basic external assets loader
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.3.4 (2011/01/14)
 * @namespace
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.loader = (function(){

	//XXX: check if load failed? (not sure if 'onerror' and readyState works properly, maybe will need to check timeout)
	//TODO: test if loaded script can really be executed during callback.
	//TODO: create a queue system with option to force the load to be synchronous (probably a new Class).
	//XXX: maybe just keep it simple and use RequireJS if need something more robust.
	
	/**
	 * Attach onload event listeners to elements
	 * @param {Element} target	Element that will hold the external content (e.g. Image, Script)
	 * @param {Function} onLoadCallback	Function called after load complete
	 * @private
	 */
	function _attachLoadListener(target, onLoadCallback){
		if(typeof onLoadCallback !== 'function') return;
		
		if('readyState' in target){ //IE
			target.onreadystatechange = function(){
				if (target.readyState === 'loaded' || target.readyState === 'complete'){
					target.onreadystatechange = millermedeiros.noop;
					setTimeout(onLoadCallback, 1); //ensure that script is ready to execute. (not sure if it really works)
				}
			};
		} else { //other browsers
			target.onload = function(){
				target.onload = millermedeiros.noop;
				setTimeout(onLoadCallback, 1); //ensure that script is ready to execute. (not sure if it really works)
			};
		}
	}
	
	/**
	 * Inject node into DOM before first `script` tag.
	 * - based on Google Analytics Async (http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html)
	 * @param {Element} elm	Element
	 */
	function _inject(elm){
		var sibling = document.getElementsByTagName('script')[0];
		sibling.parentNode.insertBefore(elm, sibling);
	}
	
	//==== Public (API) ====//
	return {
	
		/**
		 * Load external JavaScript file into the current HTML.
		 * @param {string} url Path to the desired file.
		 * @param {Function} [callback]	Function that should be called after script finishes loading.
		 */
		loadScript: function(url, callback){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			if(typeof callback === 'function') _attachLoadListener(script, callback);
			script.src = url;
			_inject(script);
		},
			
		/**
		 * Load external CSS file into the current HTML.
		 * - can't detect if the style sheet finished loading. (Gecko and WebKit don't dispatch the onload event for link nodes)
		 * @param {string} url Path to the desired file.
		 */
		loadStyleSheet: function(url){
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;
			_inject(link);
		},
			
		/**
		 * Load image.
		 * - used the name `preloadImage` on previous versions because of Dreamweaver `MM_preloadImages` lol, changed to `loadImage` to keep consistency.
		 * @param {string} url	Image URL.
		 * @param {Function} [callback]	Function called after load complete, "Image Element" will be passed as parameter to the callback function.
		 * @return {Image}	Image Element
		 */
		loadImage: function(url, callback){
			var img = new Image();
			if(typeof callback === 'function'){
				_attachLoadListener(img, function(){
					callback(img);
				});
			}
			img.src = url;
			return img;
		}
	};

})();