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

})();
