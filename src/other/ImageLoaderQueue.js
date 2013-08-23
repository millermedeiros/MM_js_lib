define(
    [
       'signals',
       'mout/lang/toArray',
       'mout/array/append'
    ],
    function(Signal, toArray, append){

        var _noop = function(){};

        /**
         * very basic image loader queue
         * @author Miller Medeiros
         * @version 0.2.0 (2012/09/25)
         */
        function ImageLoaderQueue(){
            this._items = [];
            this._cache = {};
            this.on = {
                complete : new Signal(),
                progress : new Signal(),
                error : new Signal()
            };
            this.on.complete.memorize = true;
        }

        ImageLoaderQueue.prototype = {

            add : function(var_args){
                var items;
                if (arguments.length === 1 && typeof arguments[0] !== 'string') {
                    // if array-like add multiple items
                    items = toArray( arguments[0] );
                } else {
                    // if strings push to array
                    items = toArray(arguments);
                }
                append(this._items, items);
            },

            _numLoaded : 0,

            isComplete : function(){
                return this._numLoaded >= this._items.length;
            },

            loadAll : function(){
                var i, img,
                    numTotal = this._items.length,
                    self = this,
                    src;

                if ( this.isComplete() ) {
                    return;
                }

                function registerLoad(evt){
                    evt = evt || window.event; //IE fix
                    var img = evt.target || evt.srcElement; //IE fix
                    if(img){
                        // try/catch for IE7
                        try {
                            delete img.onload;
                            delete img.onerror;
                        } catch(err) {
                            img.onload = _noop;
                            img.onerror = _noop;
                        }
                    }
                    if (evt.type === 'error') {
                        self.on.error.dispatch(self, evt);
                    } else {
                        self.on.progress.dispatch(self, evt);
                    }
                    self._numLoaded += 1;
                    if(self.isComplete()){
                        self.on.complete.dispatch(self);
                    }
                }

                for(i = 0; i < numTotal; i++){
                    src = this._items[i];
                    // request same image only once
                    if ( !(src in self._cache) ) {
                        img = new Image();
                        img.onload = img.onerror = registerLoad;
                        img.src = src;
                        self._cache[src] = img;
                    }
                }
            },

            getProgress : function(){
                return this._numLoaded / this._items.length;
            },

            getImg : function(src){
                return this._cache[src];
            },

            dispose : function(){
                delete this._cache;
                delete this._items;
            }

        };

        return ImageLoaderQueue;
    }
);
