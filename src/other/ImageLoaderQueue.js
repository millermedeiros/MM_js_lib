define(function(){
	
	/**
	 * very basic image loader queue
	 * - if you are using RequireJS favor require/image plugin.
	 * @author Miller Medeiros
	 * @version 0.0.2 (2011/02/13)
	 */
	var ImageLoaderQueue = function(items){
		this._items = items;
	};
	
	ImageLoaderQueue.prototype = {
		
		numLoaded : 0,
		
		isComplete : function(){
			return this.numLoaded >= this._items.length;
		},
		
		load : function(callback){
			var i = 0,
				img,
				numTotal = this._items.length,
				hasCallback = (typeof callback === 'function'),
				self = this;
			
			if(this.isComplete()){
				callback();
				return;
			}
			
			function registerLoad(evt){
				delete evt.target.onload;
				self.numLoaded += 1;
				if(self.isComplete()){
					callback();
				}
			}
			
			for(; i < numTotal; i++){
				img = new Image();
				if(hasCallback){
					img.onload = registerLoad;
				}
				img.src = this._items[i];
			}
		}
		
	};
	
	return ImageLoaderQueue;
});
