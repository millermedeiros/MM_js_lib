/**
 * @namespace Extremally basic version of Google Analytics based on GA mobile (doesn't have all the features of desktop GA)
 * @author Miller Medeiros
 * @version 0.0.3 (2011/01/05)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
millermedeiros.ga = {
	
	/**
	 * URI of the GA pixel image, if using mobile GA set it to your ga.php or ga.aspx file otherwise leave it as the default.
	 * @type string
	 */
	GA_PIXEL : 'http://www.google-analytics.com/__utm.gif',
	
	/**
	 * GA account ID
	 * @type string
	 */
	GA_ACCOUNT : '',
	
	/**
	 * Get blank gif URL used for tracking, very basic implementation of GA.js, similar features than mobile script.
	 * @param {string} accountId	Google Analytics account ID.
	 * @param {string} pageId	URL or string that identify page/event.
	 */
	getPixelUrl : function getPixelUrl(accountId, pageId){
		pageId = pageId || '';
		var url = this.GA_PIXEL +'?';
		url += 'utmac='+ accountId;
		url += '&utmn='+ (Math.round(Math.random() * 0x7fffffff));
		url += '&utmr='+ escape(document.referer || '-'); //facebook tabs don't have acces to `encodeURIComponent`
		url += '&utmdt='+ escape(document.title || '-');
		url += '&utmp='+ escape(pageId);
		return url;
	},
	
	/**
	 * track event
	 * @param {string} accountId	GA account ID.
	 * @param {string} pageId	Event/Page ID.
	 */
	track : function(pageId){
		var src = this.getPixelUrl(this.GA_ACCOUNT, pageId);
		if(typeof Image !== 'undefined'){ //on iOS Image is an "object" and on other browsers it is a "function"
			new Image().src = src;
		}else if(typeof Facebook !== 'undefined'){ //for facebook tabs
			document.createElement('img').setSrc(src);
		}else{
			console.warn('Failed to create tracking pixel.');
		}
	}
	
};