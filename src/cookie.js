/**
 * @namespace Utilities for cookie manipulation
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.cookie = {
	
	/**
	 * Sets a Cookie
	 * @param {String} name Cookie name.
	 * @param {String} val Cookie value.
	 * @param {Object} [opt] Cookie options Object {expires:Date, path:String, domain:String, secure:Boolean}.
	 */
	set : function(name, val, opt){
		var str = encodeURIComponent(name) +'='+ encodeURIComponent(val);
		if(opt){
			str += (opt.expires instanceof Date)? '; expires='+ opt.expires.toUTCString() : '';
			str += (opt.path)? '; path='+ opt.path : '';
			str += (opt.domain)? '; domain='+ opt.domain : '';
			str += (opt.secure === true)? '; secure' : '';
		}
		document.cookie = str;
	},
	
	/**
	 * Gets cookie value
	 * @param {String} name Cookie name.
	 * @return {String} Cookie value.
	 */
	getValue : function(name){
		var cObj = this.getCookieAsObject();
		return (cObj[name])? cObj[name] : null;
	},
	
	/**
	 * Gets cookie as an Object (URI decoded)
	 * @return {Object} Cookie as Object {cookieName1: cookieValue1, ...}
	 */
	getCookieAsObject : function(){
		var cArr = document.cookie.replace(/ +/g, '').split(';'), //remove spaces and split each "name=value" pair
			n = cArr.length,
			o = {};
		while(n--){
			cArr[n] = cArr[n].split('='); //split name from value
			o[decodeURIComponent(cArr[n][0])] = decodeURIComponent(cArr[n][1]); 
		}
		return o;
	},
	
	/**
	 * Sets cookie expiration to a past Date removing it
	 * - obs: cookie options should match with the existing cookie to properly unset it.
	 * @param {String} name Cookie Name
	 * @param {Object} [opt] Cookie Options Object {expires:Date, path:String, domain:String, secure:Boolean}
	 */
	unset : function(name, opt){
		opt = opt || {};
		opt.expires = new Date(0); //past date (1970)
		this.set(name, '', opt);
	},
	
	/**
	 * Checks if cookie is set
	 * @return {Boolean} if cookie exist
	 */
	isset : function(name){
		var cObj = this.getCookieAsObject();
		return !!(cObj[name]);
	}
	
};