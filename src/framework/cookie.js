/**
 * MM.cookie
 * - utilities for cookie manipulation
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	MM.cookie = MM.cookie || {};
	
	//TODO: add subcookies support
	
	/**
	 * Set a Cookie
	 * @param {String} name Cookie name.
	 * @param {String} val Cookie value.
	 * @param {Object} [opt] Cookie options Object {expires:Date, path:String, domain:String, secure:Boolean}.
	 */
	MM.cookie.set = function(name, val, opt){
		var str = encodeURIComponent(name) +'='+ encodeURIComponent(val);
		if(opt){
			str += (opt.expires instanceof Date)? '; expires='+ opt.expires.toUTCString() : '';
			str += (opt.path)? '; path='+ opt.path : '';
			str += (opt.domain)? '; domain='+ opt.domain : '';
			str += (opt.secure === true)? '; secure' : '';
		}
		document.cookie = str;
	};
	
	/**
	 * Get cookie value
	 * @param {String} name Cookie name.
	 * @return {String} Cookie value.
	 */
	MM.cookie.getValue = function(name){
		var cObj = MM.cookie.getCookieObject();
		return (cObj[name])? cObj[name] : null;
	};
	
	/**
	 * Get cookie as an Object (URI decoded)
	 * @return {Object} Cookie as Object {cookieName1: cookieValue1, ...}
	 */
	MM.cookie.getCookieObject = function(){
		var cArr = document.cookie.replace(/ +/g, '').split(';'), //remove spaces and split each "name=value" pair
			n = cArr.length,
			o = {};
		while(n--){
			cArr[n] = cArr[n].split('='); //split name from value
			o[decodeURIComponent(cArr[n][0])] = decodeURIComponent(cArr[n][1]); 
		}
		return o;
	}
	
	/**
	 * Set cookie expiration to a past Date removing it
	 * - obs: cookie options should match to properly unset.
	 * @param {String} name Cookie Name
	 * @param {Object} [opt] Cookie Options Object {expires:Date, path:String, domain:String, secure:Boolean}
	 */
	MM.cookie.unset = function(name, opt){
		opt = opt || {};
		opt.expires = new Date(0); //past date (1970)
		MM.cookie.set(name, '', opt);
	};
	
	/**
	 * Check if cookie is set
	 * @return {Boolean} if cookie exist
	 */
	MM.cookie.isset = function(name){
		var cObj = MM.cookie.getCookieObject();
		return !!(cObj[name]);
	}
	
})();