define([
       'signals',
       '../events/TouchController',
       '../browser/vendorPrefix',
       'amd-utils/math/clamp',
       'amd-utils/math/loop'
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
         * @version 0.3.0 (2011/10/26)
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
                this._content.style.cssText += '; '+ (transformStyle? transformStyle +':preserve-3d;' : '') +' width:'+ Math.ceil(this.numPanes * this._paneWidth) +'px; pointer-events:none; position:absolute;';
                tc.touchStarted.add(this._touchStartHandler, this);
                tc.touchMoved.add(this._touchMoveHandler, this);
                tc.touchEnded.add(this._touchEndHandler, this);
            },

            _touchStartHandler : function(evt, startPos){
                var x;
                if(_supportCSSTransition){
                    x = this._content.style[_transformProperty].replace(/(translateX\()(-?[0-9]+)(px\))/, '$2');
                } else {
                    x = this._content.style.left;
                }
                this._touchStartX = parseInt(x, 10);
                this.prevPane = this.currentPane;
            },

            _touchMoveHandler : function(evt, changePos){
                var cx = changePos.x,
                    friction = ((this.currentPane === 0 && cx > 0) || (this.currentPane === this.numPanes - 1 && cx < 0))? 1 - (Math.abs(cx)/this._paneWidth) / 2 : 1;

                this._slideTo(this._touchStartX + cx * friction, false, 0);

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

                var dest = destX +'px';

                if(_supportCSSTransition){
                    this._content.style[_transitionProperty] = vendorPrefix.css('transform') +' '+ duration +'ms ease-out';
                    this._content.style[_transformProperty] = 'translateX('+ dest +')';
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
