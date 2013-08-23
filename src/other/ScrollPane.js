define([
       'signals',
       '../events/TouchController',
       '../browser/vendorPrefix',
       'mout/math/clamp',
       'mout/math/loop'
    ],
    function(signals, TouchController, vendorPrefix, clamp, loop){

        var _transformProperty = vendorPrefix.style('transform'),
            _transitionProperty = vendorPrefix.style('transition'),
            _supportCSSTransition = _transformProperty && _transitionProperty,
            //fallback to jQuery if CSS transition/transform isn't available,
            //not a dependency tho, only used for animation, will snap to
            //position if not available.
            $ = (typeof jQuery !== 'undefined')? jQuery : null,
            _jqEasing = ($ && 'easeOutExpo' in $.easing)? 'easeOutExpo' : 'swing';


        /**
         * Scroll Pane - scrollable touch container
         * it will use CSS transforms if available or fallback to jQuery
         * @version 0.3.3 (2013/08/23)
         * @author Miller Medeiros
         */
        function ScrollPane(frameElm, contentHolder, numPanes){
            this._paneWidth = frameElm.offsetWidth;
            this._frame = frameElm;
            this._content = contentHolder;
            if(!_supportCSSTransition && $){
                this.$_content = $(contentHolder); //cache jquery object..
            }
            this.numPanes = numPanes;
            this._maxX = this._paneWidth / 2;
            this._minX = (this.numPanes - 1) * -this._paneWidth - this._maxX;
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
                var tc = this._touchController,
                    userSelect = vendorPrefix.css('user-select'),
                    transformStyle = vendorPrefix.css('transform-style');

                this._frame.style.cssText += '; overflow:hidden; position:relative; '+ (userSelect? userSelect +':none;' : '');
                //preserve-3d enables hardware acceleration, pointer-events:none to avoid retain of click event by child elements. position-absolute in case not using transforms
                this._content.style.cssText += '; '+ (transformStyle? transformStyle +':preserve-3d;'+ _transformProperty +':translate3d(0,0,0);' : '') +' width:'+ Math.ceil(this.numPanes * this._paneWidth) +'px; pointer-events:none; position:absolute;';
                tc.touchStarted.add(this._touchStartHandler, this);
            },

            _touchStartHandler : function(evt, startPos){
                var x;
                if(_supportCSSTransition){
                    x = this._content.style[_transformProperty].replace(/(translate3d\(\s*)(-?[0-9]+)((?:px)?.+)/, '$2');
                } else {
                    x = this._content.style.left;
                }
                this._touchStartX = x? parseInt(x, 10) : 0; //parseInt('') === NaN
                this.prevPane = this.currentPane;

                this.lockScroll = false;
                this._touchController.touchMoved.add(this._touchMoveHandler, this);
            },

            _touchMoveHandler : function(evt, changePos){
                var cx = changePos.x,
                    friction = 1;

                if ((this.currentPane === 0 && cx < this._paneWidth) || (this.currentPane === this.numPanes - 1 && cx > -this._paneWidth)) {
                    friction = ((this.currentPane === 0 && cx > 0) || (this.currentPane === this.numPanes - 1 && cx < 0))? 1 - (Math.max(Math.abs(cx),this._paneWidth) / this._paneWidth) / 4 : 1;
                }

                if (!this.lockScroll){
                    // this should only be triggered at the first move
                    if (Math.abs(changePos.y) < Math.abs(changePos.x)) {
                        this.lockScroll = true;
                    } else {
                        this._touchController.touchMoved.remove(this._touchMoveHandler, this);
                        this._touchController.touchEnded.remove(this._touchEndHandler, this);
                        this.lockScroll = false;
                        return;
                    }
                }

                if(this.lockScroll){
                    evt.preventDefault();
                    this._slideTo(this._touchStartX + cx * friction, false, 0);
                    this._touchController.touchEnded.add(this._touchEndHandler, this);
                }
            },

            _touchEndHandler : function(evt, changePos, duration){
                var inc = 0,
                    cx = changePos.x,
                    mx = cx / duration;

                if(Math.abs(cx) < this._paneWidth * 0.4){
                    inc = (mx < -0.5)? 1 : ((mx > 0.5)? -1 : 0);
                }else{
                    inc = (cx < 0)? 1 : -1;
                }
                this.goTo(this.currentPane + inc);
                this.lockScroll = false;
                this._touchController.touchEnded.remove(this._touchEndHandler, this);
            },

            goTo : function(index){
                index = (typeof index === 'undefined' || isNaN(index))? 0 : index;

                index = this.loop? loop(index, 0, this.numPanes - 1) : clamp(index, 0, this.numPanes - 1);

                var diff = Math.abs(this.currentPane - index),
                    duration = clamp(diff * this.multiplierSpeed, this.fastSpeed, this.slowSpeed);

                this._slideTo(index * -this._paneWidth, true, duration);

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

            _slideTo : function(destX, updateCurrent, duration){
                duration = duration || 0;
                destX = clamp(destX, this._minX, this._maxX);

                var dest = destX +'px';

                if(_supportCSSTransition){
                    this._content.style[_transitionProperty] = vendorPrefix.css('transform') +' '+ duration +'ms ease-out';
                    this._content.style[_transformProperty] = 'translate3d('+ dest +', 0, 0)';
                } else if(duration && $) {
                    //fallback to jquery only for animation
                    this.$_content.animate({'left': dest}, duration, _jqEasing);
                } else {
                    //no jquery, no problem.. just no animation..
                    this._content.style.left = dest;
                }

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

    }
);
