define(
    [
        'signals',
        'amd-utils/object/fillIn'
    ],
    function (signals, fillIn) {

    /**
     * Basic shallow key validation and signal dispatch at each change
     * @version 0.1.0 (2012/03/21)
     * @author Miller Medeiros
     */
    function AbstractModel(defaultData){
        this.setDefaults(defaultData);
        this.changed = new signals.Signal();
    }

    AbstractModel.prototype = {

        get : function(key) {
            if (key in this._data) {
                return this._data[key];
            } else {
                throw new Error('Invalid key: '+ key);
            }
        },

        set : function(key, val) {
            if (key in this._data) {
                this._data[key] = val;
                this.changed.dispatch(key, val);
            } else {
                throw new Error('Invalid key: '+ key);
            }
        },

        reset : function(key) {
            if (key in this._data) {
                this._data[key] = this._defaultData[key];
                this.changed.dispatch(key, this._data[key]);
            } else {
                throw new Error('Invalid key: '+ key);
            }
        },

        resetAll : function(){
            this.setDefaults(this._defaultData);
        },

        setDefaults : function(defaultData) {
            this._defaultData = defaultData;
            this._data = fillIn({}, defaultData);
        },

        dispose : function(){
            if (! this.changed) return;
            this.changed.dispose();
            delete this.changed;
            delete this._data;
            delete this._defaultData;
        }

    };

    return AbstractModel;

});
