define(['signals', './TouchController'], function(signals, TouchController){

    /**
     * Helper for swipe gestures
     * @author Miller Medeiros
     * @version 0.1.1 (2012/04/15)
     */
    function SwipeController(targetElm, opts){
        var tc = new TouchController(targetElm),
            thold = {x:30, y:30}; //default threshold

        if(opts && opts.threshold){
            thold.x = ('x' in opts.threshold)? opts.threshold.x : thold.x;
            thold.y = ('y' in opts.threshold)? opts.threshold.y : thold.y;
        }

        this.swipedUp = new signals.Signal();
        this.swipedDown = new signals.Signal();
        this.swipedLeft = new signals.Signal();
        this.swipedRight = new signals.Signal();

        tc.touchEnded.add(this._endedHandler, this);

        this.threshold = thold;
        this._touchController = tc;
    }

    SwipeController.prototype = {

        _endedHandler : function(evt, changePos, duration){
            var distX = Math.abs(changePos.x),
                distY = Math.abs(changePos.y),
                isVertical = (distY > distX),
                signal;

            if(isVertical && distY > this.threshold.y){
                signal = (changePos.y > 0)? this.swipedDown : this.swipedUp;
            } else if(!isVertical && distX >= this.threshold.x) {
                signal = (changePos.x > 0)? this.swipedRight : this.swipedLeft;
            }

            if(signal){
                signal.dispatch.call(signal, changePos, duration);
            }
        },

        dispose : function(){
            if(! this._touchController) return;
            this._touchController.dispose();
            this.swipedUp.dispose();
            this.swipedDown.dispose();
            this.swipedLeft.dispose();
            this.swipedRight.dispose();
            this._touchController = null;
        }

    };

    SwipeController.IS_TOUCH_ENABLED = TouchController.IS_TOUCH_ENABLED;

    return SwipeController;

});
