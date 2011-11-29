define(
    [
        'signals',
        'amd-utils/math/clamp',
        'amd-utils/number/toUInt',
        '../browser/animFrame'
    ],
    function (signals, clamp, toUInt, animFrame) {

        /**
         * SpriteSheet Animation Timeline.
         * @author Miller Medeiros
         * @version 0.7.0 (2011/11/29)
         */
        function SpriteAnim (opts) {

            //frames is an array of objects {w,h,x,y,t,l}
            this._frames = opts.frames;
            //original frame size {w,h}
            this._frameSize = opts.frameSize;

            this._fps = opts.fps || 12;
            this.playMode = opts.playMode || SpriteAnim.NORMAL;

            this._createElements();

            var basePath = 'basePath' in opts? opts.basePath : SpriteAnim.basePath,
                sheetUrl =  basePath? (basePath +'/'+ opts.spriteSheet).replace(/\/+/, '/') : opts.spriteSheet;

            this._sprite.style.background = 'url('+ sheetUrl +') no-repeat';

            if (opts.container) {
                opts.container.appendChild( this._wrapper );
            }

            this._originalStartAt = opts.startAt || 1;
            this._originalEndAt = opts.endAt || opts.frames.length;

            //array with cue points {start,end}
            this._scenes = opts.scenes || [{start:opts.startAt, end:opts.endAt}];

            //events
            this.on = {
                play : new signals.Signal(),
                pause : new signals.Signal(),
                frame : new signals.Signal()
            };

            this.restart();
        }

        SpriteAnim.basePath = '';

        //playMode
        SpriteAnim.NORMAL = 1;
        SpriteAnim.LOOP = 2;
        SpriteAnim.ALTERNATE = 3;

        SpriteAnim.prototype = {

            _createElements : function () {
                var wrapper = document.createElement('div'),
                    sprite = document.createElement('div');

                wrapper.style.width = this._frameSize.w +'px';
                wrapper.style.height = this._frameSize.h +'px';
                wrapper.style.position = 'relative';
                wrapper.className = 'spriteAnim-frame';

                sprite.className = 'spriteAnim-sprite';
                sprite.style.position = 'absolute';
                wrapper.appendChild(sprite);

                this._wrapper = wrapper;
                this._sprite = sprite;
            },

            getElement : function () {
                return this._wrapper;
            },

            goTo : function (n) {
                n = clamp(n, this._startAt, this._endAt);

                var frame = this._frames[n - 1],
                    spriteStyle = this._sprite.style;

                spriteStyle.width = frame.w +'px';
                spriteStyle.height = frame.h +'px';
                spriteStyle.top = frame.t +'px';
                spriteStyle.left = frame.l +'px';
                spriteStyle.backgroundPosition = '-'+ frame.x +'px -'+ frame.y +'px';

                this._curFrame = n;
                this.on.frame.dispatch(n);
            },

            _speed : 1,

            _onTick : function(){
                var n = toUInt( this._curFrame + this._speed );

                if (  (this._speed > 0 && n <= this._endAt) || (this._speed < 0 && n >= this._startAt) ) {
                    this.goTo(n);
                } else {
                    if (this.playMode === SpriteAnim.ALTERNATE) {
                        this.playTo( this._getFirstFrame() );
                    } else if (this.playMode === SpriteAnim.LOOP) {
                        this.goTo( this._getFirstFrame() );
                    } else {
                        this.pause();
                    }
                }
            },

            playTo : function (n) {
                n = clamp(n, 1, this._frameCount);
                if (n > this._curFrame) {
                    this._speed = 1;
                    this._endAt = n;
                } else {
                    this._speed = -1;
                    this._startAt = n;
                }
                this.play();
            },

            playToFirst : function () {
                this.playTo( this._originalStartAt );
            },

            playToLast : function () {
                this.playTo( this._originalEndAt );
            },

            playToScene : function (idx) {
                idx = clamp(idx || 0, 0, this._scenes.length - 1);
                this.playTo( this._scenes[idx].end );
            },

            _getFirstFrame : function () {
                return this._speed > 0? this._startAt : this._endAt;
            },

            getCurrentFrame : function () {
                return this._curFrame;
            },

            _resetRange : function () {
                this._startAt = this._originalStartAt;
                this._endAt = this._originalEndAt;
            },

            _isPlaying : false,

            isPlaying : function () {
                return _isPlaying;
            },

            play : function () {
                if (this._interval) return;
                this._resetRange();
                this._isPlaying = true;
                var self = this;
                this._interval = animFrame.requestInterval(function(){
                    self._onTick();
                }, 1000 / this._fps);
                this.on.play.dispatch();
            },

            pause : function () {
                if (! this._interval) return;
                this._isPlaying = false;
                animFrame.clearInterval(this._interval);
                this._interval = null;
                this.on.pause.dispatch();
            },

            restart : function () {
                this._resetRange();
                this._speed = 1;
                this.goTo( this._getFirstFrame() );
            },

            dispose : function () {
                if (! this._wrapper) return;
                this.pause();
                var parent = this._wrapper.parentNode;
                if (parent) {
                    parent.removeChild(this._wrapper);
                }
                this._wrapper = this._sprite = this._scenes = null;
                this.on.play.dispose();
                this.on.pause.dispose();
                this.on.frame.dispose();
                delete this.on;
            }

        };

        return SpriteAnim;
    }
);
