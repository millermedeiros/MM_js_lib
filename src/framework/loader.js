/**
 * MM.loader
 * - basic external assets loader (css/js)
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM? this.MM : {};
	MM.loader = MM.loader? MM.loader : {};
	
	/**
	 * Load external JavaScript file into the current HTML.
	 * @param {String} url Path to the desired file.
	 */
	MM.loader.loadScript = function(url){
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = url;
		document.body.appendChild(s);
	}
	
	/**
	 * Load external CSS file into the current HTML. 
	 * @param {String} url Path to the desired file.
	 * @param {String} [media] Stylesheet media type (default = 'screen').
	 */
	MM.loader.loadStyleSheet = function(url, media){
		var head = document.getElementsByTagName('head')[0],
			l = document.createElement('link');
		l.rel = 'stylesheet';
		l.type = 'text/css';
		l.media = media || 'screen';
		l.href = url;
		head.appendChild(l);
	}
	
	//TODO: Maybe add callback function or event dispatching after script/css loading. 
	
	/*
		# Information copied from YUI3 `get.js` file
		# used for reference if I decide to implement loadComplete functionality in the future.
	
		IE supports the readystatechange event for script and css nodes
		Opera only for script nodes.  Opera support onload for script
		nodes, but this doesn't fire when there is a load failure.
		The onreadystatechange appears to be a better way to 
		respond to both success and failure.
		
		Safari 3.x supports the load event for script nodes (DOM2)
		
		Firefox and Opera support onload (but not DOM2 in FF) handlers for
		script nodes. Opera, but not FF, supports the onload event for link
		nodes.
	*/
	
})();
