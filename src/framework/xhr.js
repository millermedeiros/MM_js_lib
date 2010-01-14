/**
 * XML HTTP Request
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.0.1 (2010/01/14)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	
	/**
	 * Create a new XHR Object
	 */
	MM.XHR = function(){
		//scope-safe
		if (this instanceof MM.XHR) {
			this._xhr = _createXHR();
		}else{
			return new MM.XHR();
		}
	};
	
	/**
	 * Create XHR Object
	 * - based on Nicholas Zackas <http://www.nczonline.net> solution.
	 * @private
	 */
	function _createXHR(){
		//Lazy Loading - only checked once 
		if(typeof XMLHttpRequest != 'undefined'){ //IE7+, Firefox, Chrome, Opera, Safari
			createXHR = function(){
				return new XMLHttpRequest();
			}
		}else if(typeof ActiveXObject != 'undefined'){ //IE6
			//TODO: improve IE XMLHTTP Object.
			createXHR = function(){
				return new ActiveXObject('Microsoft.XMLHTTP');
			}
		}else{
			throw new Error('No XHR object available.');
		}
		return createXHR();
	}
	
	/**
	 * Send Request.
	 * @param {Object} o	Request Options.
	 * @param {Function} callback	Callback function (should receive and response Object as parameter {'responseText', 'responseXML', 'status', 'statusText'})
	 */
	function _send(o, callback){
		//TODO: implement xhr.send().
		console.log('xhr.send()');
		_onComplete(callback);
	}
	
	/**
	 * Shortcut for HTTP GET request.
	 * @param {String} url	Script URL. 
	 * @param {Object|String} data	Object containing the data to be sent to the server or query string.
	 * @param {Function} callback	Callback function.
	 */
	function _get(url, data, callback){
		_send(_toOptionObj('GET', url, data), callback);
	}
	
	/**
	 * Shortcut for HTTP POST request.
	 * @param {String} url	Script URL. 
	 * @param {Object|String} data	Object containing the data to be sent to the server or query string.
	 * @param {Function} callback	Callback function.
	 */
	function _post(url, data, callback){
		_send(_toOptionObj('POST', url, data), callback);
	}
	
	/**
	 * Convert parameters into Object
	 * @param {String} method
	 * @param {String} url
	 * @param {Object|String} data
	 * @private
	 */
	function _toOptionObj(method, url, data){
		return {
			method : method,
			url : url,
			data : data
		};
	}
	
	/**
	 * Called after request complete.
	 * @param {Function} fn	Callback function.
	 */
	function _onComplete(fn){
		if(!fn) return;
		//only executed if callback exist.
		var x = this._xhr, 
			r = {
				responseText: xhr.responseText,
				responseXML: xhr.responseXML,
				status: xhr.status,
				statusText: xhr.statusText
			};
		fn(r);
	}
	
	/**
	 * Get Response Header.
	 * @param {String} name	Header name.
	 */
	function _getResponseHeader(name){
		return this._xhr.getResponseHeader(name);
	}
	
	/**
	 * Get all Response Headers.
	 */
	function _getAllResponseHeaders(){
		return this._xhr.getAllResponseHeaders(name);
	}
	
	/**
	 * Abort XHR execution.
	 */
	function _abort(){
		this._xhr.abort();
	}
	
	//PUBLIC API
	MM.XHR.prototype = {
		constructor : MM.XHR,
		send : _send,
		get : _get,
		post : _post,
		abort : _abort,
		getResponseHeader : _getResponseHeader,
		getAllResponseHeaders : _getAllResponseHeaders
	};
	
})();
