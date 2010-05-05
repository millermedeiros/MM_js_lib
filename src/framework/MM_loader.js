/**
 * MM.loader
 * - basic external assets loader
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.3 (2010/05/05)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

/**
 * @namespace
 * @ignore
 */
this.MM = this.MM || {};

//XXX: check if load failed? (not sure if 'onerror' and readyState works properly, maybe will need to check timeout)
//TODO: test if loaded script can really be executed during callback.
//TODO: create a queue system with option to force the load to be synchronous (probably a new Class).

/**
 * Basic external assets loader
 * @namespace
 */
MM.loader = (function(){

	/**
	 * Attach event listeners to elements
	 * @param {Element} target	Element that will hold the external content (e.g. Image, Script)
	 * @param {Function} onLoadCallback	Function called after load complete
	 * @private
	 */
	function _attachLoadListener(target, onLoadCallback){
		if(target.readyState){ //IE
			target.onreadystatechange = function(){
				if (target.readyState == 'loaded' || target.readyState == 'complete'){
					target.onreadystatechange = null;
					setTimeout(onLoadCallback, 1); //ensure that script is ready to execute. (not sure if it really works)
				}
			};
		} else { //other browsers
			target.onload = function(){
				target.onload = null;
				setTimeout(onLoadCallback, 1); //ensure that script is ready to execute. (not sure if it really works)
			};
		}
	}
	
	//public API
	return {
	
		/**
		 * Load external JavaScript file into the current HTML.
		 * @param {String} url Path to the desired file.
		 * @param {Function} [callback]	Function that should be called after script finishes loading.
		 */
		loadScript: function(url, callback){
			var head = document.getElementsByTagName("head")[0], 
				script = document.createElement('script');
			script.type = 'text/javascript';
			_attachLoadListener(script, callback);
			script.src = url;
			head.appendChild(script);
		},
			
		/**
		 * Load external CSS file into the current HTML.
		 * - can't detect if the style sheet finished loading. (Gecko and WebKit don't dispatch the onload event for link nodes)
		 * @param {String} url Path to the desired file.
		 */
		loadStyleSheet: function(url){
			var head = document.getElementsByTagName('head')[0], 
				stylesheet = document.createElement('link');
			stylesheet.rel = 'stylesheet';
			stylesheet.type = 'text/css';
			stylesheet.href = url;
			head.appendChild(stylesheet);
		},
			
		/**
		 * Preload image.
		 * @param {String} url
		 * @param {Function} callback	Function called after load complete, "Image Element" will be passed as parameter to the callback function.
		 */
		preloadImage: function(url, callback){
			var img = new Image();
			_attachLoadListener(img, function(){
				callback(img);
			});
			img.src = url;
		}
	};

})();