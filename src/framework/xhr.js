/**
 * XML HTTP Request Object 
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.2 (2010/01/15)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	
	/**
	 * Creates a new XHR Object Instance
	 * @param {String} [url]	Request URL
	 * @param {String} [method]	Request Method (default: 'GET')
	 * @param {Boolean} [async]	If the Request should be sent Asynchronously (default: true)
	 * @class
	 * @constructor
	 */
	MM.XHR = function(url, method, async){
		//scope-safe
		if(this instanceof MM.XHR){
			/**
			 * Store native XHR object
			 * @scope private
			 * @type {XMLHttpRequest|ActiveXObject}
			 */
			var _xhr = _createXHR();		
			
			this.method = method || this.method;
			this.url = url || this.url;
			this.async = async || this.async;
			
			/**
			 * Gets native XHR object (XMLHttpRequest|ActiveXObject)
			 * @scope public
			 * @private
			 */
			this._getNativeXHR = function(){
				return _xhr;
			};
		}else{
			return new MM.XHR();
		}
	};
	
	MM.XHR.prototype.constructor = MM.XHR;
	
	/* Default Request Options */
	MM.XHR.prototype.method = 'GET';
	MM.XHR.prototype.url = '';
	MM.XHR.prototype.async = true;
	MM.XHR.prototype.user = null;
	MM.XHR.prototype.password = null;
	MM.XHR.prototype.data = null;
	MM.XHR.prototype.useCacheBuster = false;
	
	/**
	 * Create XHR Object
	 * - inspired by Nicholas Zackas solution (http://www.nczonline.net/blog/2009/04/04/xpath-in-javascript-part-3/).
	 * @return {XMLHttpRequest|ActiveXObject} XHR Object
	 * @private
	 */
	function _createXHR(){
		//Lazy Loaded and only checked once (for better performance) 
		if(typeof XMLHttpRequest != 'undefined'){ //IE7+, Firefox, Chrome, Opera, Safari
			_createXHR = function(){
				return new XMLHttpRequest();
			};
		}else if(typeof ActiveXObject != 'undefined'){ //IE6
			var versions = ['Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0', 'MSXML2.DOMDocument'],
				tmp;
			for(var i=0, n=versions.length; i<n; i++){
				try{
					tmp = new ActiveXObject(versions[i]); //check if exist
					tmp = null;
					_createXHR = function(){
						return new ActiveXObject(versions[i]);
					};
				}catch(err){
					//skip
				}
			}
		}else{
			_createXHR = function(){
				throw new Error('No XHR object available.');
			};
		}
		return _createXHR();
	}
	
	/**
	 * Send Request.
	 * @param {String} [data]	Request Data.
	 * @param {Function} [callback]	Callback function (should receive and response Object as parameter {'responseText', 'responseXML', 'status', 'statusText', 'success'})
	 */
	MM.XHR.prototype.send = function(data, callback){
		//TODO: test it properly!
		var xhr = this._getNativeXHR(),
			_onStateChange = function(){
				if(xhr.readyState == 4) _onComplete(); //readyState 4 == complete
			},
			_onComplete = function(){
				xhr.onreadystatechange = null;
				if(!callback) return;
				callback({
					responseText: xhr.responseText,
					responseXML: xhr.responseXML,
					status: (xhr.status != 1223)? xhr.status : 204, //normalize IE value
					statusText: xhr.statusText,
					success: (((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 1223) || (!xhr.status && location.protocol === 'file:')) //1223 is for IE
				});
			};
		
		this.data = data || this.data;
		this.method = this.method.toUpperCase();
		
		//force content to not be cached by the browser
		if(this.useCacheBuster && this.method === 'GET'){
			var cacheBuster = '_cachebuster='+ new Date().getTime();
			this.url += (this.data)? '?'+ cacheBuster : '&'+ cacheBuster; 
		} 
		
		if(this.async) xhr.onreadystatechange = _onStateChange; //should come before open.
		
		if(this.user){ //according to jQuery source code passing null to 'user' shows login pop on Opera.
			xhr.open(this.method, this.url, this.async, this.user, this.password); 
		}else{
			xhr.open(this.method, this.url, this.async);
		}
		
		//set request headers if exists (should come after `open` and before `send`)
		if(this._requestHeaders){
			var rh = this._requestHeaders;
				n = rh.length;
			while(n--){
				xhr.setRequestHeader(rh[n][0], rh[n][1]);
			}
		}
		
		xhr.send(this.data);
		
		if(!this.async) _onStateChange();
	};
	
	/**
	 * Sets XHR Request Header.
	 * @param {String} name	Header name
	 * @param {String} value	Header value	
	 */
	MM.XHR.prototype.setRequestHeader = function(name, value){
		if(!this._requestHeaders) this._requestHeaders = [];
		this._requestHeaders.push([name, value]);
	};
	
	/**
	 * Get Response Header.
	 * @param {String} name	Header name.
	 */
	MM.XHR.prototype.getResponseHeader = function(name){
		return this._getNativeXHR().getResponseHeader(name);
	};
	
	/**
	 * Get all Response Headers.
	 */
	MM.XHR.prototype.getAllResponseHeaders = function(){
		return this._getNativeXHR().getAllResponseHeaders();
	};
	
	/**
	 * Abort XHR execution.
	 */
	MM.XHR.prototype.abort = function(){
		this._getNativeXHR().abort();
	};
	
})();
