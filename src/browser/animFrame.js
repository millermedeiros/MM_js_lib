define(['exports', './vendorPrefix'], function (exports, vendorPrefix) {


    /**
     * RequestAnimationFrame and interval based on Paul Irish shim
     * and setInterval like implementation using requestAnimationFrame by Joel
     * Lambert.
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * https://gist.github.com/1002116
     * @author Miller Medeiros
     * @version 0.1.0 (2011/11/13)
     */

    var _win = window,
        _reqAnim = vendorPrefix.dom('requestAnimationFrame', _win),
        _cancelAnim = vendorPrefix.dom('cancelRequestAnimationFrame', _win),
        _supportRequestInterval = _reqAnim && _cancelAnim;


    exports.requestAnimFrame = _reqAnim ? _win[_reqAnim] : function (callback, element) {
                                _win.setTimeout(callback, 1000 / 60);
                            };

    function getTime(){
        return +(new Date());
    }

    exports.requestInterval = function (fn, delay) {

        //Firefox 5 doesn't support cancelRequestAnimationFrame
        if (! _supportRequestInterval) {
            return _win.setInterval(fn, delay);
        }

        var startTime = getTime(),
            //use object to store value since it's passed by reference
            intervalId = {};

        function loop() {
            if(getTime() - startTime >= delay) {
                fn.call();
                startTime = getTime();
            }
            intervalId.value = exports.requestAnimFrame.call(_win, loop);
        }

        //chrome needs to run requestAnimationFrame on window context
        intervalId.value = exports.requestAnimFrame.call(_win, loop);
        return intervalId;
    };

    exports.clearInterval = function (intervalId) {
        if (_supportRequestInterval) {
            _win[_cancelAnim](intervalId.value);
        } else {
            clearInterval(intervalId);
        }
    };

});
