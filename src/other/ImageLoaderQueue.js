define(function(){
	
	/**
	 * very basic image loader queue
	 * @author Miller Medeiros
	 * @version 0.0.4 (2011/08/09)
	 */
    function ImageLoaderQueue(items){
		this._items = items;
	}
	
	ImageLoaderQueue.prototype = {
		
		_numLoaded : 0,

        _cache : {},
		
		isComplete : function(){
			return this._numLoaded >= this._items.length;
		},
		
		loadAll : function(callback){
			var i = 0,
				img,
				numTotal = this._items.length,
				hasCallback = (typeof callback === 'function'),
				self = this,
                src;
			
			if(hasCallback && this.isComplete()){
				callback();
				return;
			}
			
			function registerLoad(evt){
                evt = evt || window.event; //IE fix
                var img = evt.target || evt.srcElement; //IE fix
                if(img){
                    delete img.onload;
                    delete img.onerror;
                }
				self._numLoaded += 1;
				if(self.isComplete()){
					callback();
				}
            }
			
			for(; i < numTotal; i++){
				img = new Image();
                src = this._items[i];
				if(hasCallback){
					img.onload = img.onerror = registerLoad;
				}
				img.src = src;
                self._cache[src] = img;
			}
		},

        getImg : function(src){
            return self._cache[src];
        },

        dispose : function(){
            delete this._cache;
            delete this._items;
        }
		
	};
	
	return ImageLoaderQueue;
});
