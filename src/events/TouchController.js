define(['signals', '../browser/eventFacade'], function(signals, eventFacade){

    var _isTouch = 'ontouchstart' in window,
        _startType = _isTouch? 'touchstart' : 'mousedown',
        _moveType = _isTouch? 'touchmove' : 'mousemove',
        _endType = _isTouch? 'touchend' : 'mouseup';

    // HELPERS ===============

    function bind(fn, scope){
        return function(){
            return fn.apply(scope, Array.prototype.slice.call(arguments));
        };
    }

    function normalizeEvent(evt){
        evt = eventFacade.getEvent(evt);
        return _isTouch? evt.targetTouches[0] : evt;
    }

    function getTime(){
        return (new Date()).getTime();
    }

    // TOUCH CONTROLLER ========

    /**
     * Touch events abstraction
     * @version 0.3.3 (2011/12/07)
     * @author Miller Medeiros
     */
    function TouchController(targetElm){
        this._target = targetElm;

        //fix scope
        this._touchStartHandler = bind(_touchStartHandler, this);
        this._touchMoveHandler = bind(_touchMoveHandler, this);
        this._touchEndHandler = bind(_touchEndHandler, this);

        this.touchStarted = new signals.Signal();
        this.touchMoved = new signals.Signal();
        this.touchEnded = new signals.Signal();

        eventFacade.addListener(targetElm, _startType, this._touchStartHandler);
    }

    function _touchStartHandler(evt){
        var e = normalizeEvent(evt);

        this._touchStartTime = getTime();
        this._startPos.x = e.clientX;
        this._startPos.y = e.clientY;
        this._changePos.x = this._changePos.y = 0;

        eventFacade.addListener(document, _moveType, this._touchMoveHandler);
        eventFacade.addListener(document, _endType, this._touchEndHandler);

        this.touchStarted.dispatch(evt, this._startPos);
    }

    function _touchMoveHandler(evt){
        var e = normalizeEvent(evt),
            lastChange = {
                x : this._changePos.x,
                y : this._changePos.y
            };

        this._changePos.x = e.clientX - this._startPos.x;
        this._changePos.y = e.clientY - this._startPos.y;

        lastChange.x = this._changePos.x - lastChange.x;
        lastChange.y = this._changePos.y - lastChange.y;

        this.touchMoved.dispatch(evt, this._changePos, lastChange);
    }

    function _touchEndHandler(evt){
        evt = eventFacade.getEvent(evt);

        var duration = getTime() - this._touchStartTime,
            momentum = {
                x : this._changePos.x / duration,
                y : this._changePos.y / duration
            };

        eventFacade.removeListener(document, _moveType, this._touchMoveHandler, false);
        eventFacade.removeListener(document, _endType, this._touchEndHandler, false);

        this.touchEnded.dispatch(evt, this._changePos, momentum, duration);
    }

    TouchController.IS_TOUCH_ENABLED = _isTouch;

    TouchController.prototype = {

        _touchStartTime : null,
        _startPos : {x:0,y:0},
        _changePos : {x:0,y:0},

        dispose : function(){
            if(! this._target) return;

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
