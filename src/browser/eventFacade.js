define(function(){

/**
 * @name eventFacade
 * @namespace DOM Event Listener Facade
 * @author Miller Medeiros <http://www.millermedeiros.com/>
 * @version 0.4.0 (2011/08/09)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var eventFacade = {

    /**
    * Adds DOM Event Listener
    * @param {Element} elm Element.
    * @param {string} eType Event type.
    * @param {Function} fn Listener function.
    */
    addListener : function(elm, eType, fn){
        if(elm.addEventListener){
            elm.addEventListener(eType, fn, false);
        }else if(elm.attachEvent){
            elm.attachEvent('on' + eType, fn);
        }else{
            elm['on' + eType] = fn;
        }
    },
    
    /**
    * Removes DOM Event Listener
    * @param {Element} elm Element.
    * @param {string} eType Event type.
    * @param {Function} fn Listener function.
    */
    removeListener : function(elm, eType, fn){
        if(elm.removeEventListener){
            elm.removeEventListener(eType, fn, false);
        }else if(elm.detachEvent){
            elm.detachEvent('on' + eType, fn);
        }else{
            elm['on' + eType] = null;
        }
    },
    
    /**
     * @param {Event} [evt] Event
     * @return {Event} Normalized Event object since IE doesn't pass Event as
     * parameter to handler.
     */
    getEvent : function(evt){
        return evt || window.event; //fix IE
    },
    
    /**
     * Get event target, normalize value across browsers (IE doesn't have
     * event.target)
     * @param {Event} [evt] Event
     * @return {HTMLElement} Event target
     */
    getTarget : function(evt){
        evt = eventFacade.getEvent(evt);
        return evt.target || evt.srcElement; //normalize value on IE 
    },
    
    /**
     * Prevents event default behavior
     * @param {Event} [evt] Event
     */
    preventDefault : function(evt){
        evt = eventFacade.getEvent(evt);
        if('preventDefault' in evt){
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    },
    
    /**
     * Stops event bubbling
     * @param {Event} [evt] Event
     */
    stopPropagation : function(evt){
        evt = eventFacade.getEvent(evt);
        if('stopPropagation' in evt){
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    },
    
    /**
     * Stops event bubbling and default behavior (alias to `stopPropagation`
     * and `preventDefault`)
     * @param {Event} [evt] Event
     */
    halt : function(evt){
        eventFacade.stopPropagation(evt);
        eventFacade.preventDefault(evt);
    }
    
};

return eventFacade;
});
