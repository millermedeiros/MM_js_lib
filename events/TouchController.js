define(['signals', '../browser/eventFacade'], function(signals, eventFacade){

    var _isTouch = 'ontouchstart' in window;
    var _startType = _isTouch? 'touchstart' : 'mousedown';
    var _moveType = _isTouch? 'touchmove' : 'mousemove';
    var _endType = _isTouch? 'touchend' : 'mouseup';

    // HELPERS ===============

    function bind(fn, scope){
        return function(){
            return fn.apply(scope, Array.prototype.slice.call(arguments));
        };
    }

    function normalizeEvent(evt){
        return _isTouch? evt.targetTouches[0] : evt;
    }
    
    function getTime(){
        return (new Date()).getTime();
    }

    // TOUCH CONTROLLER ========

    /**
     * Touch events abstraction
     * @version 0.3.0 (2011/07/12)
     * @author Miller Medeiros
     */
    function TouchController(targetElm){
        this._target = targetElm;
        
        //fix scope
        this._touchStartHandler = bind(this._touchStartHandler, this);
        this._touchMoveHandler = bind(this._touchMoveHandler, this);
        this._touchEndHandler = bind(this._touchEndHandler, this);

        this.touchStarted = new signals.Signal();
        this.touchMoved = new signals.Signal();
        this.touchEnded = new signals.Signal();
        
        eventFacade.addListener(targetElm, _startType, this._touchStartHandler);
    }
    
    TouchController.IS_TOUCH_ENABLED = _isTouch; 
    
    TouchController.prototype = {

        _touchStartTime : null,
        _startPos : {x:0,y:0},
        _changePos : {x:0,y:0},
        
        _touchStartHandler : function(evt){
            var e = normalizeEvent(evt);
            
            this._touchStartTime = getTime();
            this._startPos.x = e.pageX;
            this._startPos.y = e.pageY;
            this._changePos.x = this._changePos.y = 0;
            
            eventFacade.addListener(document, _moveType, this._touchMoveHandler);
            eventFacade.addListener(document, _endType, this._touchEndHandler);

            this.touchStarted.dispatch(evt, this._startPos);
        },
        
        _touchMoveHandler : function(evt){
            var e = normalizeEvent(evt),
                lastChange = {
                    x : this._changePos.x,
                    y : this._changePos.y
                };

            this._changePos.x = e.pageX - this._startPos.x;
            this._changePos.y = e.pageY - this._startPos.y;
            
            lastChange.x = this._changePos.x - lastChange.x;
            lastChange.y = this._changePos.y - lastChange.y;
            
            this.touchMoved.dispatch(evt, this._changePos, lastChange);
        },
        
        _touchEndHandler : function(evt){
            var e = normalizeEvent(evt), 
                duration = getTime() - this._touchStartTime,
                momentum = {
                    x : this._changePos.x / duration,
                    y : this._changePos.y / duration
                };
            
            eventFacade.removeListener(document, _moveType, this._touchMoveHandler, false);
            eventFacade.removeListener(document, _endType, this._touchEndHandler, false);

            this.touchEnded.dispatch(evt, this._changePos, momentum, duration);
        },
        
        dispose : function(){
            eventFacade.removeListener(this._target, _startType, this._touchStartHandler);
            eventFacade.removeListener(document, _moveType, this._touchMoveHandler);
            eventFacade.removeListener(document, _endType, this._touchEndHandler);
            this.touchStarted.dispose();
            this.touchMoved.dispose();
            this.touchEnded.dispose();
            this._target = this._changePos = this._startPos = null;
        }
    };
    
    return TouchController;
    
});
