define(['./ScrollPane', 'signals'], function(ScrollPane, signals){
    
    /**
     * Dynamic Scroll Pane - fetch/remove panels based on need.
     * @version 0.2.0 (2011/02/04)
     * @author Miller Medeiros
     */
    function DynamicScrollPane(frameElm, contentHolder, numPanes, fetchPaneFn){
        this._scrollPane = new ScrollPane(frameElm, contentHolder, numPanes);
        this._scrollPane.updated.add(this._updatePaneItems, this);
        this._fetchPane = fetchPaneFn;
        this._cachedPanes = [];
        this._prevPanes = [];
        this._contentHolder = contentHolder;
        this.updated = new signals.Signal();
    }
    
    DynamicScrollPane.prototype = {
        
        _getPane : function(index){
            //TODO: add option to avoid caching panes
            var pane = this._cachedPanes[index];
            if(!pane){
                pane = this._fetchPane(index);
                pane.style.position = 'absolute';
                pane.style.left = (this._scrollPane._paneWidth * index) +'px';
                this._cachedPanes[index] = pane;
            }
            return pane;
        },
        
        _updatePaneItems : function(curIndex, xPos){
            var curPanes = [], 
                n;
            
            curPanes.push( this._getPane(curIndex) );
            if(curIndex !== 0) curPanes.push( this._getPane(curIndex-1) );
            if(curIndex !== this._scrollPane.numPanes-1) curPanes.push( this._getPane(curIndex+1) );
            
            if(this._prevPanes){
                n = this._prevPanes.length;
                while(n--) this._contentHolder.removeChild(this._prevPanes[n]); //TODO: change it to only remove not used panes.
            }
            
            n = curPanes.length;
            while(n--) this._contentHolder.appendChild(curPanes[n]);
            
            this._prevPanes = curPanes;
            
            this.updated.dispatch(curIndex, xPos);
        },
        
        goTo : function(index){
            var pane = this._scrollPane;
            
            //avoids blinking non-loaded panes
            pane._content.style.WebkitTransition = '-webkit-transform 0ms linear'; //setting the transition to 0ms looks better than removing the transition on Chrome
            pane._slideTo(index * -pane._paneWidth);
            
            setTimeout(function(){
                pane.goTo(index);
            }, 10);
        },
        
        next : function(){
            this._scrollPane.next();
        },
        
        prev : function(){
            this._scrollPane.prev();
        },
        
        setSpeed : function(multiplierSpeed, fast, slow){
            var pane = this._scrollPane;
            pane.fastSpeed = fast || 250;
            pane.multiplierSpeed = multiplierSpeed || 200;
            pane.slowSpeed = slow || 750; 
        },
        
        lockScroll : function(){
            this._scrollPane.lockScroll = true;
        },
        
        dispose : function(){
            this._scrollPane.dispose();
            this.updated.dispose();
            this._cachedPanes = this._prevPanes = this._contentHolder = this._fetchPane = this._scrollPane = this.updated = null;
        }
        
    };
    
    return DynamicScrollPane;
    
});
