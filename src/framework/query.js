/**
 * MM.query
 * - utilities for query string manipulation
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1.2 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM? this.MM : {};
	MM.query = MM.query? MM.query : {};
	
	/**
	 * Get full query as string with all special chars decoded.
	 * @return {String}	Query string.
	 */
	MM.query.getQueryString = function(){
		return decodeURIComponent(location.search.substring(1));
	}
	
	/**
	* Get query as Object.
	* @return {Object}	Object with all the query "params => values" pairs.
	*/
	MM.query.getQueryObject = function(){
		var queryArr = MM.query.getQueryString().split('&'),
			n = queryArr.length,
			queryObj = {};
		while(n--){
			queryArr[n] = queryArr[n].split('=');
			queryObj[queryArr[n][0]] = queryArr[n][1];
		}
		return queryObj;
	}
	
	/**
	* Get parameter from query.
	* @return {String}	Parameter value.
	*/
	MM.query.getParam = function(param){
		return MM.query.getQueryObject()[param];
	}

})();