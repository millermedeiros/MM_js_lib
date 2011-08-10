define(['../events/TouchController', 'signals'], function(TouchController, signals){ 
    
    function clamp(val, min, max){
        return Math.max(Math.min(val, max), min);
    }
    
    /**
     * Scroll Pane - scrollable touch container
     * @version 0.2.2 (2011/07/12)
     * @author Miller Medeiros
     */
    function ScrollPane(frameElm, contentHolder, numPanes){
        this._paneWidth = frameElm.offsetWidth;
        this._frame = frameElm;
        this._content = contentHolder;
        this.numPanes = numPanes;
        this._touchController = new TouchController(this._frame);
        this._setup();
        this.updated = new signals.Signal();
    }
    
    ScrollPane.prototype = {
        
        multiplierSpeed : 200,
        fastSpeed : 250,
        slowSpeed : 750,
        
        currentPane : 0,
        prevPane : null,
        numPanes : 0,
        loop : false,
        lockScroll : false,
        
        _curX : 0,
        _touchStartX : 0,
        
        _setup : function(){
            var tc = this._touchController;
            this._frame.style.cssText += '; overflow:hidden; position:relative; -webkit-user-select:none;';
            //preserve-3d enables hardware acceleration, pointer-events:none to avoid retain of click event by child elements.
            this._content.style.cssText += '; -webkit-transform-style:preserve-3d; width:'+ (this.numPanes * this._paneWidth) +'px; pointer-events:none;';
            tc.touchStarted.add(this._touchStartHandler, this);
            tc.touchMoved.add(this._touchMoveHandler, this);
            tc.touchEnded.add(this._touchEndHandler, this);
        },
        
        _touchStartHandler : function(evt, startPos){
            this._content.style.WebkitTransition = '-webkit-transform 0ms linear'; //setting the transition to 0ms looks better than removing the transition on Chrome
            this._touchStartX = parseInt(this._content.style.WebkitTransform.replace(/(translateX\()(-?[0-9]+)(px\))/, '$2'), 10);
            this.prevPane = this.currentPane;
        },
        
        _touchMoveHandler : function(evt, changePos){
            var cx = changePos.x,
                friction = ((this.currentPane === 0 && cx > 0) || (this.currentPane === this.numPanes - 1 && cx < 0))? 1 - (Math.abs(cx)/this._paneWidth) / 2 : 1;
            this._slideTo(this._touchStartX + cx * friction, false);
            
            if(this.lockScroll){
                evt.preventDefault();
            }
        },
        
        _touchEndHandler : function(evt, changePos, momentum, duration){
            var inc = 0,
                cx = changePos.x,
                mx = momentum.x;
                
            if(Math.abs(cx) < this._paneWidth * 0.4){
                inc = (mx < -0.5)? 1 : ((mx > 0.5)? -1 : 0);
            }else{
                inc = (cx < 0)? 1 : -1;
            }
            this.goTo(this.currentPane + inc);
        },
        
        goTo : function(index){
            var diff;
            index = (index === void(0) || isNaN(index))? 0 : index;
            if(! this.loop){
                index = clamp(index, 0, this.numPanes - 1);
            }else{
                index = (index < 0)? this.numPanes - 1 : ((index >= this.numPanes)? 0 : index); //clamp value
            }
            diff = Math.abs(this.currentPane - index);
            this._content.style.WebkitTransition = '-webkit-transform '+ clamp(diff * this.multiplierSpeed, this.fastSpeed, this.slowSpeed) +'ms ease-out';
            this._slideTo(index * -this._paneWidth, true);
            if(this.prevPane !== this.currentPane){
                this.updated.dispatch(this.currentPane);
            }
            this.prevPane = this.currentPane;
        },
        
        next : function(){
            this.goTo(this.currentPane + 1);
        },
        
        prev : function(){
            this.goTo(this.currentPane - 1);
        },
        
        _slideTo : function(destX, updateCurrent){
            this._content.style.WebkitTransform = 'translateX('+ destX +'px)';
            if(updateCurrent){
                this.currentPane = clamp(Math.round(-destX / this._paneWidth), 0, this.numPanes - 1);
            }
        },
        
        dispose : function(){
            this._touchController.dispose();
            this.updated.dispose();
            this._frame = this._content = this._touchController = this.updated = null;
        }
        
    };
    
    return ScrollPane;
    
});
