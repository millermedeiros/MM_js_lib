/**
 * @namespace Extremally basic version of Google Analytics (note that it doesn't get all infos)
 * @author Miller Medeiros
 * @version 0.0.2 (2011/01/03)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
milllermedeiros.ga = {
	
	/**
	 * Get blank gif URL used for tracking, very basic implementation of GA.js, similar features than mobile script.
	 * @param {string} accountId	Google Analytics account ID.
	 * @param {string} pageId	URL or string that identify page/event.
	 */
	getPixelUrl : function getPixelUrl(accountId, pageId){
		pageId = pageId || '';
		var url = 'http://www.google-analytics.com/__utm.gif?';
		url += 'utmac='+ accountId;
		url += '&utmn='+ (Math.round(Math.random() * 0x7fffffff));
		url += '&utmr='+ (document.referer || '-');
		url += '&utmdt='+ (encodeURIComponent(document.title) || '-');
		url += '&utmp='+ escape(pageId);
		url += '&guid=ON';
		return url;
	},
	
	/**
	 * track event
	 * @param {string} accountId	GA account ID.
	 * @param {string} pageId	Event/Page ID.
	 */
	track : function(accountId, pageId){
		var src = this.getPixelUrl(accountId, pageId);
		if(typeof Image === 'function'){
			new Image().src = src;
		}else if('Facebook' in document){ //for facebook tabs
			document.createElement('img').setSrc(src);
		}else{
			console.warn('Failed to create tracking pixel.');
		}
	}
	
};