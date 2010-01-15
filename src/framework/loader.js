/**
 * MM.loader
 * - basic external assets loader (css/js)
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.2 (2010/01/14)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	MM.loader = MM.loader || {};
	
	/**
	 * Load external JavaScript file into the current HTML.
	 * @param {String} url Path to the desired file.
	 * @param {Function} [callback]	Function that should be called after script finishes loading.
	 */
	MM.loader.loadScript = function(url, callback){
		//based on Nicholas Zackas solution (http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/)
		//TODO: check if load failed? (not sure if 'onerror' works and also readyState, maybe will need to check timeout)
		var head = document.getElementsByTagName("head")[0], 
			s = document.createElement('script');
			
		s.type = 'text/javascript';
		
		if(s.readyState){ //IE
			s.onreadystatechange = function(){
				var rs = s.readyState; 
				if(rs === 'loaded' || rs === 'complete'){
					s.onreadystatechange = null;
					callback();
			    }
			};
		}else{ //other browsers
			s.onload = function(){
				s.onload = null;
				callback();
			};
		}
		//start loading
		s.src = url;
		head.appendChild(s);
	}
	
	/**
	 * Load external CSS file into the current HTML.
	 * - can't detect if the style sheet finished loading.
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
