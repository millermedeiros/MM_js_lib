/**
 * sectionController + Hasher
 * load/init/end sections based on the hash change.
 * ---
 * sections should implement `init(urlParamsArr)` method.
 * `end()`, `ended:Signal`, `initialized:Signal` will be only used if available.
 * ---
 * @version 0.6.0 (2011/11/22)
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

        var exports = sectionController,
            _router = exports.router;

        exports._afterRoutesSetup = function () {
            hasher.initialized.add(onHasherInit);
            hasher.changed.add(_router.parse, _router);
            hasher.init();
        };

        function onHasherInit(hash) {
            if(! hash){
                hasher.replaceHash(exports.DEFAULT_HASH || '');
            } else {
                _router.parse(hash);
            }
        }

        exports.goTo = function (paths) {
            hasher.setHash.apply(hasher, arguments);
        };

        return exports;

    }
);
