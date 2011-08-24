/**
 * DOM utilities for w3c browsers.
 * @author Miller Medeiros
 * @version 0.0.1 (2011/02/18)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
define(function(){
    
    function delegate(targetElm, selector, evtType, callback){
        if(! targetElm) return;
        
        var elms = [].slice.call(targetElm.querySelectorAll(selector));
        
        function delegateHandler(evt){
            var node = evt.target;
            while(node && elms.indexOf(node)<0){
                node = node.parentNode;
            }
            if(node && node !== targetElm){
                callback.call(node, evt);
            }
        }
        targetElm.addEventListener(evtType, delegateHandler, false);
    }
    
    return{
        delegate : delegate     
    };
    
});
