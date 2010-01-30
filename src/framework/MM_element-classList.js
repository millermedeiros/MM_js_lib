/**
 * Element utilities - classList
 * - based on: http://hacks.mozilla.org/2010/01/classlist-in-firefox-3-6/
 * @author Miller Medeiros <www.millermedeiros.com>
 * @version 0.1 (2010/01/29)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function(){
	
	//instantiate main objects if they don't exist
	this.MM = this.MM || {};
	MM.element = MM.element || {};
	
	//stored locally for performance improvement
	var mmelm = MM.element;
	
	//TODO: test!
	
	/**
	 * Check if element has specific class
	 * @param {Element} elm	Element
	 * @param {String} className	Class name
	 */
	mmelm.containsClass = function(elm, className){
		if(document.documentElement.classList){
			mmelm.containsClass = function(elm, className){
				return elm.classList.contains(className);
			}
		} else {
			mmelm.containsClass = function(elm, className){
				if(!elm || !elm.className){
					return false;
				}
				var re = new RegExp('(^|\\s)' + className + '(\\s|$)');
				return elm.className.match(re);
			}
		}
		return mmelm.containsClass(elm, className);
	};
	
	/**
	 * Add class to element
	 * @param {Element} elm	Element
	 * @param {String} className	Class name
	 */
	mmelm.addClass = function(elm, className){
		if(document.documentElement.classList){
			mmelm.addClass = function(elm, className){
				elm.classList.add(className);
			}
		} else {
			mmelm.addClass = function(elm, className){
				if(!elm){
					return false;
				}
				if(!mmelm.containsClass(elm, className)){
					elm.className += (elm.className ? ' ' : '') + className;
				}
			}
		}
		mmelm.addClass(elm, className);
	};
	
	/**
	 * Remove class to element
	 * @param {Element} elm	Element
	 * @param {String} className	Class name
	 */
	mmelm.removeClass = function(elm, className){
		if(document.documentElement.classList){
			mmelm.removeClass = function(elm, className){
				elm.classList.remove(className);
			}
		} else {
			mmelm.removeClass = function(elm, className){
				if(!elm || !elm.className){
					return false;
				}
				var regexp = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
				elm.className = elm.className.replace(regexp, '$2');
			}
		}
		mmelm.removeClass(elm, className);
	};
	
	/**
	 * Toggle class
	 * @param {Element} elm	Element
	 * @param {String} className	Class name
	 */
	mmelm.toggleClass = function(elm, className){
		if(document.documentElement.classList){
			mmelm.toggleClass = function(elm, className){
				return elm.classList.toggle(className);
			}
		} else {
			mmelm.toggleClass = function(elm, className){
				if(mmelm.containsClass(elm, className)){
					mmelm.removeClass(elm, className);
					return false;
				} else {
					mmelm.addClass(elm, className);
					return true;
				}
			}
		}
		return mmelm.toggleClass(elm, className);
	};
	
})();