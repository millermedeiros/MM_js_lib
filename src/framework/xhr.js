/**
 * XML HTTP Request
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/01/14)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM || {};
	
	/**
	 * Create a new XHR Object Instance
	 */
	MM.XHR = function(){
		//scope-safe
		if(this instanceof MM.XHR){
			var _xhr = _createXHR(); //private (store Native XHR Object)
			this._getNativeXHR = function(){
				return _xhr;
			};
		}else{
			return new MM.XHR();
		}
	};
	
	MM.XHR.prototype.constructor = MM.XHR;
	
	//Default Request options
	MM.XHR.prototype.method = 'GET';
	MM.XHR.prototype.url = '';
	MM.XHR.prototype.async = true;
	MM.XHR.prototype.user = null;
	MM.XHR.prototype.password = null;
	MM.XHR.prototype.data = null;
	
	/**
	 * Create XHR Object
	 * - inspired by Nicholas Zackas solution (http://www.nczonline.net/blog/2009/04/04/xpath-in-javascript-part-3/).
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
	 * @param {Object} [o]	XHR Options Object.
	 * @param {Function} [callback]	Callback function (should receive and response Object as parameter {'responseText', 'responseXML', 'status', 'statusText', 'success'})
	 */
	MM.XHR.prototype.send = function(o, callback){
		//TODO: test it properly!
		var xhr = this._getNativeXHR(),
			onStateChange = function(){
				if(xhr.readyState == 4) onComplete(); //readyState 4 == complete
			},
			onComplete = function(){
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
		
		if(o) this.setOptions(o);
		if(this.async) xhr.onreadystatechange = onStateChange; //should come before open.
		
		if(this.user){
			xhr.open(this.method, this.url, this.async, this.user, this.password); //according to jQuery source code passing null to 'user' shows login pop on Opera.
		}else{
			xhr.open(this.method, this.url, this.async);
		}
		xhr.send(this.data);
		
		if(!this.async) onStateChange();
	}
	
	/**
	 * Shortcut for setting XHR properties.
	 * @param {Object} o	XHR Options Object.
	 */
	MM.XHR.prototype.setOptions = function(o){
		this.method = o.method || this.method;
		this.url = o.url || this.url;
		this.async = o.async || this.async;
		this.user = o.user || this.user;
		this.password = o.password || this.password;
		this.data = o.data || this.data;
	}
	
	/**
	 * Shortcut for HTTP GET request.
	 * @param {String} url	Script URL. 
	 * @param {Object|String} [data]	Object containing the data to be sent to the server or query string.
	 * @param {Function} [callback]	Callback function.
	 */
	MM.XHR.prototype.get = function(url, data, callback){
		this.send({
			url: url,
			data: data
		}, callback);
	}
	
	/**
	 * Shortcut for HTTP POST request.
	 * @param {String} url	Script URL. 
	 * @param {Object|String} [data]	Object containing the data to be sent to the server or query string.
	 * @param {Function} [callback]	Callback function.
	 */
	MM.XHR.prototype.post = function(url, data, callback){
		this.send({
			method: 'POST',
			url: url,
			data: data
		}, callback);
	}
	
	/**
	 * Get Response Header.
	 * @param {String} name	Header name.
	 */
	MM.XHR.prototype.getResponseHeader = function(name){
		return this._getNativeXHR().getResponseHeader(name);
	}
	
	/**
	 * Get all Response Headers.
	 */
	MM.XHR.prototype.getAllResponseHeaders = function(){
		return this._getNativeXHR().getAllResponseHeaders(name);
	}
	
	/**
	 * Abort XHR execution.
	 */
	MM.XHR.prototype.abort = function(){
		this._getNativeXHR().abort();
	}
	
})();
