/**
 * sectionController + Hasher
 * load/init/end sections based on the hash change.
 * ---
 * sections should implement `init(urlParamsArr)` method or be a constructor.
 * `end()`, `ended:Signal`, `initialized:Signal` will be only used if available.
 * ---
 * @version 0.8.0 (2012/06/20)
 * @author Miller Medeiros
 */
define(
    [
        'hasher',
        './sectionController'
    ],
    function (hasher, sectionController) {

        //note that we are simply editing the sectionController object
        //since it "doesn't make sense" to have multiple section controllers...

        var exports = sectionController;

        exports._afterRoutesSetup = function () {
            hasher.initialized.add(this._onHasherInit, this);
            hasher.changed.add(this._parseHash, this);
            hasher.init();
        };

        exports._parseHash = function(newHash, oldHash) {
            this.router.parse(newHash);
        };

        exports._onHasherInit = function (hash) {
            if(! hash && this.DEFAULT_ROUTE){
                // only replace hash if default route isn't empty, if empty
                // it should parse the hash value (which can be an empty string
                // as well)
                this.initialized.dispatch(this.DEFAULT_ROUTE);
                hasher.replaceHash(this.DEFAULT_ROUTE);
            } else {
                this.initialized.dispatch(hash);
                this.router.parse(hash);
            }
        };

        var oldGoTo = exports.goTo;
        exports.goTo = function (paths) {
            hasher.changed.active = false;
            hasher.setHash.apply(hasher, arguments);
            hasher.changed.active = true;
            oldGoTo.apply(this, arguments);
        };

        return exports;

    }
);
