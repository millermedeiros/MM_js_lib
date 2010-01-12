/**
 * StyleSheetUtils
 * - obs: usually this methods shouldn't be used. Use 'element.style.cssText' or load an external CSS when possible.
 * - translated to Singleton Pattern from some really old tests.
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.1 (2010/01/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var StyleSheetUtils = function(){
	/**
	 * Get element computed style.
	 * @param {Object} elm Element
	 * @return {Object} computed style
	 */
	function getComputedStyle(elm){
		if(document.defaultView && document.defaultView.getComputedStyle){
			return document.defaultView.getComputedStyle(elm);
		}else if(elm.currentStyle){
			return elm.currentStyle;
		}
	}
	/**
	 * Get Style Sheet rules.
	 * @param {CSSStyleSheet} s CSS Style Sheet (ex: document.styleSheets[0]).
	 * @return {CSSRule} Object containing all the CSS rules.
	 */
	function getRules(s){
		return s.cssRules || s.rules;
	}
	/**
	 * Insert new rule into the style sheet.
	 * @param {CSSStyleSheet} s	Style sheet.
	 * @param {String} sel	CSS Selector.
	 * @param {String} style CSS Declaration.
	 * @param {int} [i]	Rule index position (default = 0).
	 */
	function insertRule(s, sel, style, i){
		i = i || 0;
		if(s.insertRule) s.insertRule(sel + '{'+ style +'}', i);
		else s.addRule(sel, style, i);
	}
	/**
	 * Remove rule from style sheet.
	 * @param {CSSStyleSheet} s	Style Sheet.
	 * @param {int} i	Rule index position.
	 */
	function deleteRule(s, i){
		if(s.deleteRule) s.deleteRule(i);
		else s.removeRule(i);
	}
	//Public API
	return{
		getComputedStyle : getComputedStyle,
		getRules : getRules,
		insertRule : insertRule,
		deleteRule : deleteRule
	}
}();
