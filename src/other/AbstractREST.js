define(['jquery'], function($){

    /**
     * Abstract REST service model. Used to cache Ajax responses and to
     * organize Ajax calls.
     * check: https://gist.github.com/1230246 for usage example.
     * @author Miller Medeiros
     * @version 0.1.0 (2011/09/21)
     * @param {object} [services] Services
     * @see AbstractREST.services
     * @constructor
     */
    function AbstractREST(services){
        /**
         * Object that contains info about ajax calls
         * `normalize` is a function that gets called after data is loaded
         * `params` is an alias to jquery.ajax.data (since data is a bad name)
         * it accepts all settings of a $.ajax() call.
         * @type {id:string, {url:string [, normalize:function, dataType:string, type:string, params:(object|string)]}}
         */
        this.services = services;
        this._deferreds = {}; //cache deferreds and consequently the data as well
    }

    AbstractREST.DEFAULT_DATA_TYPE = 'json';

    AbstractREST.prototype = {

        /**
         * Make an ajax request and
         * @param {string} serviceId ID of the service that should be called.
         * @param {object|string} [params] Request parameters (will overwrite service.params)
         * @return {$.Deferred}
         */
        loadData : function(serviceId, params){
            var uid = this._uid(serviceId, params),
                dfd = this._getDeferred(uid),
                service = this.services[serviceId],
                settings;

            if(! dfd.isResolved()){ //only load if data not cached yet
                settings = $.extend({}, service, {
                    dataType : service.dataType || AbstractREST.DEFAULT_DATA_TYPE,
                    data : params || service.params || service.data
                });
                $.ajax(settings).done(function(info){
                    info = service.normalize? service.normalize(info) : info;
                    dfd.resolve(info);
                });
            }

            return dfd.promise();
        },

        _uid : function(id, params){
            params = params || '';
            params = (typeof params === 'object')? $.param(params) : params;
            return id +'-'+ params;
        },

        _getDeferred : function(id){
            return (this._deferreds[id] = this._deferreds[id] || new $.Deferred());
        },

        /**
         * Search items by matching a property with a value.
         * @param {array} items Haystack.
         * @param {string} propName Property to search for (e.g. 'id', 'name')
         * @param {*} val Value to match against.
         */
        find : function(items, propName, val){
            var i = 0, n = items.length, cur;
            while(i < n){
                cur = items[i++];
                if(cur[propName] === val){
                    return cur;
                }
            }
        }

    };

    return AbstractREST;

});
