define(['signals', './TouchController'], function(signals, TouchController){
    
    /**
     * Helper for swipe gestures
     * @author Miller Medeiros
     * @version 0.0.1 (2011/07/12)
     */
    function SwipeController(targetElm, opts){
        var tc = new TouchController(targetElm),
            thold = {x:30, y:30};

        if(opts && opts.threshold){
            thold.x = (opts.threshold.x !== void(0))? opts.threshold.x : thold.x;
            thold.y = (opts.threshold.y !== void(0))? opts.threshold.y : thold.y;
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

        _endedHandler : function(evt, changePos, momentum, duration){
            var distX = Math.abs(changePos.x),
                distY = Math.abs(changePos.y),
                isVertical = (distY > distX);

            if(isVertical && distY > this.threshold.y){
                if(changePos.y > 0){
                    this.swipedDown.dispatch(changePos, momentum, duration);
                } else {
                    this.swipedUp.dispatch(changePos, momentum, duration);
                }
            } else if(!isVertical && distX >= this.threshold.x) {
                if(changePos.x > 0){
                    this.swipedRight.dispatch(changePos, momentum, duration);
                } else {
                    this.swipedLeft.dispatch(changePos, momentum, duration);
                }
            }
        },

        dispose : function(){
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
