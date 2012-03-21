define(['exports', './vendorPrefix'], function (exports, vendorPrefix) {


    /**
     * RequestAnimationFrame and interval based on Paul Irish shim
     * and setInterval like implementation using requestAnimationFrame by Joel
     * Lambert.
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * https://gist.github.com/1002116
     * @author Miller Medeiros
     * @version 0.2.1 (2012/03/21)
     */

    var _win = window,
        _reqAnim = vendorPrefix.dom('requestAnimationFrame', _win),
        _cancelAnim = vendorPrefix.dom('cancelRequestAnimationFrame', _win),
        _supportRequestInterval = _reqAnim && _cancelAnim,
        // Date.now() generates less garbage and is potentially faster
        _now = 'now' in Date? Date.now : function(){
            return +(new Date());
        };


    /**
     * requestAnimationFrame or fallback to setTimeout.
     */
    exports.requestAnimFrame = _reqAnim ?
        function (fn) {
            //chrome needs to run requestAnimationFrame on window context
            //that's why we create a wrapper function...
            return _win[_reqAnim](fn);
        } :
        function (fn) {
            return _win.setTimeout(fn, 1000 / 60);
        };


    /**
     * Similar to window.setInterval but uses requestAnimationFrame.
     * @return {object|number} Reference to the interval, needed for clearing it.
     */
    exports.requestInterval = _supportRequestInterval ?
        function (fn, delay) {
            var startTime = _now(),
                //use object to store intervalId value since it's passed by reference
                intervalId = {},
                loop = function (timestamp) {
                    intervalId.value = exports.requestAnimFrame(loop);
                    if(timestamp - startTime >= delay) {
                        fn.call();
                        startTime = timestamp;
                    }
                };
            intervalId.value = exports.requestAnimFrame(loop);
            return intervalId;
        } :
        function (fn, delay) {
            return _win.setInterval(fn, delay);
        };

    /**
     * Clear requestInterval.
     */
    exports.clearInterval = _supportRequestInterval ?
        function (intervalId) {
            _win[_cancelAnim](intervalId.value);
        } :
        function (intervalId) {
            _win.clearInterval(intervalId);
        };

});
