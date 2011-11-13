define(
    [
        'amd-utils/math/clamp',
        'amd-utils/number/toUInt',
        '../browser/animFrame'
    ],
    function (clamp, toUInt, animFrame) {

        /**
         * SpriteSheet Animation Timeline.
         * @author Miller Medeiros
         * @version 0.3.0 (2011/11/12)
         */
        function SpriteAnim (opts) {

            //frames is an array of objects {w,h,x,y,t,l}
            //(wid, hei, x, y, top, left)
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

            this.updateRange(opts.startAt || 1, opts.endAt || opts.frames.length);
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

                var frame = this._frames[n - 1];
                this._sprite.style.width = frame.w +'px';
                this._sprite.style.height = frame.h +'px';
                this._sprite.style.top = frame.t +'px';
                this._sprite.style.left = frame.l +'px';
                this._sprite.style.backgroundPosition = '-'+ frame.x +'px -'+ frame.y +'px';

                this._curFrame = n;
            },

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
                        this.stop();
                    }
                }
            },

            playTo : function (n) {
                n = clamp(n, 1, this._frameCount);
                if (n > this._curFrame) {
                    this._speed = 1;
                    this.updateRange(this._curFrame, n);
                } else {
                    this._speed = -1;
                    this.updateRange(n, this._curFrame);
                }
                this.play();
            },

            _isPlaying : false,

            _speed : 1,

            _getFirstFrame : function () {
                return this._speed > 0? this._startAt : this._endAt;
            },

            getCurrentFrame : function () {
                return this._curFrame;
            },

            updateRange : function (start, end) {
                this._startAt = start;
                this._endAt = end;
                this.goTo( this._getFirstFrame() );
            },

            play : function () {
                if (this._interval) return;
                this._isPlaying = true;
                var self = this;
                this._interval = animFrame.requestInterval(function(){
                    self._onTick();
                }, 1000 / this._fps);
            },

            stop : function () {
                if (! this._interval) return;
                this._isPlaying = false;
                animFrame.clearInterval(this._interval);
                this._interval = null;
            },

            restart : function () {
                this.goTo( this._getFirstFrame() );
                this.play();
            },

            dispose : function () {
                if (! this._wrapper) return;
                this.stop();
                var parent = this._wrapper.parentNode;
                if (parent) {
                    parent.removeChild(this._wrapper);
                }
                this._wrapper = this._sprite = null;
            }

        };

        return SpriteAnim;
    }
);
