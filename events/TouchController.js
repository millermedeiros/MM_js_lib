define(function(){

    //TODO: clean this mess, use signals instead of weird callbacks
    
    function bind(fn, context){
        return function(){
            return fn.apply(context, Array.prototype.slice.call(arguments));
        };
    }
    
    /**
     * Touch events abstraction
     * @version 0.2.1 (2011/05/25)
     * @author Miller Medeiros
     */
    function TouchController(targetElm, scopeCallback){
        this.target = targetElm;
        this._scopeCallback = scopeCallback || this;
        
        this._touchStartHandler = bind(this._touchStartHandler, this);
        this._touchMoveHandler = bind(this._touchMoveHandler, this);
        this._touchEndHandler = bind(this._touchEndHandler, this);
        
        targetElm.addEventListener(TouchController.TOUCH_START, this._touchStartHandler, false);
    }
    
    TouchController.IS_TOUCH_ENABLED = 'ontouchstart' in window;
    TouchController.TOUCH_START = (TouchController.IS_TOUCH_ENABLED)? 'touchstart' : 'mousedown';
    TouchController.TOUCH_MOVE = (TouchController.IS_TOUCH_ENABLED)? 'touchmove' : 'mousemove';
    TouchController.TOUCH_END = (TouchController.IS_TOUCH_ENABLED)? 'touchend' : 'mouseup';
    
    TouchController.prototype = {
        onTouchStart : null,
        onTouchEnd : null,
        onTouchMove : null,
        _touchStartTime : null,
        _startPos : null,
        _changePos : {x:0,y:0},
        
        _touchStartHandler : function(evt){
            var e = (TouchController.IS_TOUCH_ENABLED)? evt.targetTouches[0] : evt;
            
            this._touchStartTime = new Date();
            this._startPos = {
                x : e.pageX,
                y : e.pageY
            };
            this._changePos.x = this._changePos.y = 0;
            
            if(typeof this.onTouchStart === 'function'){
                this.onTouchStart.call(this._scopeCallback, evt, this._startPos);
            }   
            document.addEventListener(TouchController.TOUCH_MOVE, this._touchMoveHandler, false);
            document.addEventListener(TouchController.TOUCH_END, this._touchEndHandler, false);
        },
        
        _touchMoveHandler : function(evt){
            var e = (TouchController.IS_TOUCH_ENABLED)? evt.targetTouches[0] : evt;
            var lastChange = {
                    x : this._changePos.x,
                    y : this._changePos.y
                };
            this._changePos.x = e.pageX - this._startPos.x;
            this._changePos.y = e.pageY - this._startPos.y;
            
            lastChange.x = this._changePos.x - lastChange.x;
            lastChange.y = this._changePos.y - lastChange.y;

            if(typeof this.onTouchMove === 'function'){
                this.onTouchMove.call(this._scopeCallback, evt, this._changePos, lastChange);
            }
        },
        
        _touchEndHandler : function(evt){
            var e = (TouchController.IS_TOUCH_ENABLED)? evt.targetTouches[0] : evt,
                duration = new Date() - this._touchStartTime,
                momentum = {
                x : this._changePos.x / duration,
                y : this._changePos.y / duration
            };
            
            if(typeof this.onTouchEnd === 'function'){
                this.onTouchEnd.call(this._scopeCallback, evt, this._changePos, momentum, duration);
            }
            document.removeEventListener(TouchController.TOUCH_MOVE, this._touchMoveHandler, false);
            document.removeEventListener(TouchController.TOUCH_END, this._touchEndHandler, false);
        },
        
        dispose : function(){
            this.target.removeEventListener(TouchController.TOUCH_START, this._touchStartHandler, false);
            document.removeEventListener(TouchController.TOUCH_MOVE, this._touchMoveHandler, false);
            document.removeEventListener(TouchController.TOUCH_END, this._touchEndHandler, false);
            this.target = this.callbackScope = this.onTouchStart = this.onTouchEnd = this.onTouchMove = this._touchStartTime = this._changePos = this._startPos = this._momentum = null;
        }
    };
    
    return TouchController;
    
});
