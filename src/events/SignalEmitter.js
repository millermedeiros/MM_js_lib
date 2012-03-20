define(['signals'], function (signals) {

    /**
     * Signal Emitter
     * JS-Signals wrapper to convert it into a regular Event Emitter, which can
     * lister/dispatch arbitrary events.
     * @author Miller Medeiros
     * @version 0.1.1 (2012/01/23)
     * @license WTFPL
     */
    function SignalEmitter(){
        this._signals = {};
    }

    var _proto = SignalEmitter.prototype = {

        addListener : function(id, handler, scope, priority) {
            if (! this._signals[id]) {
                this._signals[id] = new signals.Signal();
            }
            return this._signals[id].add(handler, scope, priority);
        },

        removeListener : function(id, handler) {
            var sig = this._signals[id];
            if (! sig) return;
            sig.remove(handler);
        },

        getSignal : function(id) {
            return this._signals[id];
        },

        dispatch : function(id, args) {
            var sig = this._signals[id];
            if (! sig) return;
            if (args) {
                sig.dispatch.apply(sig, args);
            } else {
                sig.dispatch();
            }
        }

    };

    SignalEmitter.augment = function(target) {
        SignalEmitter.call(target);
        for (var key in _proto) {
            if (_proto.hasOwnProperty(key)) {
                target[key] = _proto[key];
            }
        }
    };

    return SignalEmitter;

});
