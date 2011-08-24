define(function(){
    
    /**
     * Helper methods for WebKit CSS Animations and Transitions
     * @author Miller Medeiros
     * @version 0.0.7 (2011/02/06)
     * @namespace
     */
    var webkitCSSAnim = {
        
        DEFAULT_DURATION : '500ms',
        
        /**
         * Add a CSS @-webkit-keyframes to an element
         * - use this as reference: http://developer.apple.com/library/safari/#documentation/internetweb/conceptual/safarivisualeffectsprogguide/Animations/Animations.html
         * @param {Element} el  Element
         * @param {{name, duration, iterations, delay, callback, easing, fill, direction, state, autoRemove}} props animation properties
         */
        animate : function(el, props){
            var elStyle = el.style,
                duration = (props.duration !== void(0)? props.duration : this.DEFAULT_DURATION),
                hasCallback = typeof props.callback === 'function',
                autoRemove = props.autoRemove;
            
            function onEnd(){
                el.removeEventListener('webkitAnimationEnd', onEnd, false);
                if(hasCallback) props.callback();
                if(autoRemove) elStyle.webkitAnimationName = '';
            }
            
            if(hasCallback || autoRemove) el.addEventListener('webkitAnimationEnd', onEnd, false);
            
            elStyle.webkitAnimationDuration = duration;
            if(props.name) elStyle.webkitAnimationName = props.name;
            if(props.iterations) elStyle.webkitAnimationIterationCount = props.iterations;
            if(props.delay) elStyle.webkitAnimationDelay = props.delay;
            if(props.easing) elStyle.webkitAnimationTimingFunction = props.easing;
            if(props.fill) elStyle.webkitAnimationFillMode = props.fill; //only available after iOS 4.0 and Safari 5.0
            if(props.state) elStyle.webkitAnimationPlayState = props.state;
            if(props.direction) elStyle.webkitAnimationDirection = props.direction;
            
        },
        
        /**
         * Webkit CSS transition - IMPORTANT: for now it only works for `transform` and `opacity`
         * @param {Element} el  Element
         * @param {{duration, opacity, ease, delay, transform, callback, autoHide, autoShow}} props Transition properties
         */
        transition : function(el, props){
            
            //TODO: change the way it works to accept other CSS properties, maybe do like ZTween and split parameters into 2 objects (one for duration/ease/callback and another for css props)
            //TODO: avoid overriding existing -webkit-transition
            //TODO: clear transitioned props
            //TODO: clean this mess...
            
            var hasCallback = (typeof props.callback === 'function'),
                duration = (props.duration !== void(0))? props.duration : this.DEFAULT_DURATION,
                trans = props.transform? '-webkit-transform:'+ props.transform +';' : '';
            
            trans += (props.opacity !== void(0))? 'opacity:'+ props.opacity +';' : '';
            
            function onEnd(){
                el.removeEventListener('webkitTransitionEnd', onEnd, false);
                if(props.autoHide) el.style.display = 'none';
                props.callback();
            }
            
            if(hasCallback) el.addEventListener('webkitTransitionEnd', onEnd, false);
            
            if(props.autoShow) el.style.display = 'block';
            
            //execute on timeout to allow transition of recently changed properties
            setTimeout(function(){
                //-webkit-transform-style:preserve-3d; enables hardware acceleration on iOS
                el.style.cssText += '; -webkit-transform-style:preserve-3d; -webkit-transition:-webkit-transform, opacity '+ duration +','+ duration +' '+ (props.ease||'ease')+' '+ (props.delay||0) +';' + trans;
            }, 1);
            
        }
        
    };
    
    
    return webkitCSSAnim;
    
});
