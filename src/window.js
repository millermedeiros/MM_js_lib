/**
 * MM.window 
 * - utilities for dealing with the browser window
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	this.MM = this.MM? this.MM : {};
	MM.window = MM.window? MM.window : {};
	
	var doc = document,
		win = window;
	
	/**
	 * Get window innerWidth
	 * @return {int} innerWidth
	 */
	MM.window.getInnerWidth = function(){
		return (win.innerWidth)? win.innerWidth : ((doc.documentElement.clientWidth)? doc.documentElement.clientWidth : doc.body.clientWidth);
	};
	
	/**
	 * Get window innerHeight
	 * @return {int} innerHeight
	 */
	MM.window.getInnerHeight = function(){
		return (win.innerHeight)? win.innerHeight : ((doc.documentElement.clientHeight)? doc.documentElement.clientHeight : doc.body.clientHeight);
	}
	
	/**
	 * Get window scrollTop
	 * @return {int} scrollTop
	 */
	MM.window.getScrollTop = function(){
		return doc.body.scrollTop ? doc.body.scrollTop : (win.pageYOffset ? win.pageYOffset : (doc.body.parentElement ? doc.body.parentElement.scrollTop : 0));
	}
	
	/**
	 * Get window scrollLeft
	 * @return {int} scrollLeft
	 */
	MM.window.getScrollLeft = function(){
		return doc.body.scrollLeft ? doc.body.scrollLeft : (win.pageXOffset ? win.pageXOffset : (doc.body.parentElement ? doc.body.parentElement.scrollLeft : 0));
	}
	
})();