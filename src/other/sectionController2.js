/**
 * sectionController + Hasher
 * load/init/end sections based on the hash change.
 * ---
 * sections should implement `init(urlParamsArr)` method or be a constructor.
 * `end()`, `ended:Signal`, `initialized:Signal` will be only used if available.
 * ---
 * @version 0.6.2 (2011/12/07)
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
            hasher.initialized.add(onHasherInit);
            hasher.changed.add(exports.router.parse, exports.router);
            hasher.init();
        };

        function onHasherInit(hash) {
            if(! hash){
                hasher.replaceHash(exports.DEFAULT_ROUTE || '');
            } else {
                exports.router.parse(hash);
            }
        }

        exports.goTo = function (paths) {
            hasher.setHash.apply(hasher, arguments);
        };

        return exports;

    }
);
