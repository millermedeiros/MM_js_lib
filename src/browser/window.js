define(function(){

/**
 * @namespace Utilities for dealing with the browser window
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.3 (2010/06/15)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var win = {

	/**
	 * Get window innerWidth
	 * @return {int} innerWidth
	 */
	getInnerWidth : function(){
		return (window.innerWidth)? window.innerWidth : ((document.documentElement.clientWidth)? document.documentElement.clientWidth : document.body.clientWidth);
	},

	/**
	 * Get window innerHeight
	 * @return {int} innerHeight
	 */
	getInnerHeight : function(){
		return (window.innerHeight)? window.innerHeight : ((document.documentElement.clientHeight)? document.documentElement.clientHeight : document.body.clientHeight);
	},

	/**
	 * Get window scrollTop
	 * @return {int} scrollTop
	 */
	getScrollTop : function(){
		return document.body.scrollTop ? document.body.scrollTop : (window.pageYOffset ? window.pageYOffset : (document.body.parentElement ? document.body.parentElement.scrollTop : 0));
	},

	/**
	 * Get window scrollLeft
	 * @return {int} scrollLeft
	 */
	getScrollLeft : function(){
		return document.body.scrollLeft ? document.body.scrollLeft : (window.pageXOffset ? window.pageXOffset : (document.body.parentElement ? document.body.parentElement.scrollLeft : 0));
	},

	/**
	 * Get total width of the document
	 * @return {int} document width
	 */
	getDocumentWidth : function(){
		return Math.max(document.documentElement.scrollWidth, this.getInnerWidth());
	},
	
	/**
	 * Get total height of the document
	 * @return {int} document height
	 */
	getDocumentHeight : function(){
		return Math.max(document.documentElement.scrollHeight, this.getInnerHeight());
	}
	
};

return win;
});