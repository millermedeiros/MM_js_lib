/**
 * sectionController: load/init/end sections based on routes change.
 * ---
 * sections should implement `init(urlParamsArr)` method.
 * `end()`, `ended:Signal`, `initialized:Signal` will be only used if available.
 * ---
 * @version 0.6.1 (2011/11/22)
 * @author Miller Medeiros
 */
define(
    [
        'require',
        'exports',
        'signals',
        'crossroads',
        'CompoundSignal',
        'amd-utils/string/makePath'
    ],
    function (require, exports, signals, crossroads, CompoundSignal, makePath) {


        var _initializedChange = new signals.Signal(),
            _endedPrevSection = new signals.Signal(),
            _loadedDestSection = new signals.Signal(),
            _endedAndLoaded = new CompoundSignal(_endedPrevSection, _loadedDestSection),
            _initializedDestSection = new signals.Signal();

        _endedAndLoaded.memorize = false;
        _endedAndLoaded.unique = false;


        var _sections,
            _router = crossroads.create(),
            _prevUid,
            _destId,
            _destModuleId,
            _destParams,
            _prevSection;


        // ---

        /**
         * @param {Array} sections Array with sections description.
         * Available Section options:
         *   - id:String => Used internally to get proper section.
         *   - route:(String|RegExp) => See `crossroads.addRoute()` documentation.
         *   - [params]:Array => SignalBinding.params.
         *   - [rules]:Object => Route.rules.
         *   - [moduleId]:String => Path to module. It will load the module at given path
         *       if provided. Only use it if you wan't to override the normal
         *       id-to-module path resolution. (useful when you want multiple routes to
         *       load same module just passing different parameters)
         *   - [isAsync]:Boolean => If section init() should NOT wait previous section
         *       end(), it will override `sectionController.DEFAULT_ASYNC`.
         */
        function init(sections) {
            if (! sections) {
                throw new Error('"sections" is a required argument.');
            }
            _sections = exports._sections = sections;
            setupRoutes();
            exports._afterRoutesSetup();
        }

        //make it easier to overwrite behavior
        exports._afterRoutesSetup = function(){
            exports.goTo(exports.DEFAULT_HASH);
        };

        function setupRoutes() {
            _router.shoulTypecast = false;
            _router.normalizeFn = function (req, vals) {
                //will dispatch a single parameter (Array) with all the values.
                return [vals.vals_];
            };

            var n = _sections.length,
                sec, route, binding;

            while (sec = _sections[--n]) {
                route = _router.addRoute(sec.route);
                route.rules = sec.rules;
                binding = route.matched.add(changeSection);
                binding.params = [sec.id];
            }
        }

        function getSectionById(id) {
            var n = _sections.length,
                sec;
            while(sec = _sections[--n]){
                if(sec.id === id) return sec;
            }
        }

        function uid(sectionId, params) {
            return sectionId + ((params && params.length)? '-'+ params.join('-') : '');
        }

        /**
         * @private
         * @param {string} sectionId Path to section
         * @param {array} params Params that will be passed to constructor
         */
        function changeSection(sectionId, params) {

            if (_prevUid === uid(sectionId, params)) {
                return;
            }

            var destSection = getSectionById(sectionId),
                defaultParams = destSection.params || [],
                destModuleId = destSection.moduleId || makePath(exports.DEFAULT_PATH, sectionId, exports.DEFAULT_MODULE_NAME);

            _destParams = defaultParams.concat(params);

            _initializedChange.dispatch(sectionId, params);

            //safe-guard against current changes
            _endedAndLoaded.remove(initDestSection);
            _loadedDestSection.remove(initDestSection);
            _endedAndLoaded.reset();

            if (destModuleId !== _destModuleId) {
                _destId = sectionId;
                _destModuleId = destModuleId;

                var isAsync = 'isAsync' in destSection? destSection.isAsync : exports.DEFAULT_ASYNC;

                if (isAsync) {
                    _loadedDestSection.addOnce(initDestSection);
                } else {
                    _endedAndLoaded.addOnce(initDestSection);
                }

                endPrevSection();

            } else {
                // in case destSection didn't finished loading yet or it is
                // trying to load the same main module e.g. sub-section logic
                // is handled by `init()` by passing different params.
                _loadedDestSection.addOnce(initDestSection);
            }

            loadSection(destModuleId);
        }

        function loadSection(moduleId) {
            require([moduleId], function(){
                //only dispatch if loaded section is same as destination
                if(moduleId === _destModuleId){
                    _loadedDestSection.dispatch();
                }
            });
        }

        function initDestSection() {
            //module is already available since it was previously required by loadSection
            //better since it simplify logic and decouple methods
            var mod = require(_destModuleId),
                initializedParams = [_destId, _destParams];

            if (mod.initialized) {
                var initializedBinding = mod.initialized.addOnce(_initializedDestSection.dispatch, _initializedDestSection);
                initializedBinding.params = initializedParams;
            } else {
                _initializedDestSection.dispatch.apply(_initializedDestSection, initializedParams);
            }

            mod.init.apply(mod, _destParams);
            _prevSection = mod;

            _prevUid = uid(_destId, _destParams);
        }

        function endPrevSection() {
            if (_prevSection && _prevSection.ended) {
                _prevSection.ended.addOnce(_endedPrevSection.dispatch, _endedPrevSection);
            } else {
                //ensure it will always dispatch signal
                _endedPrevSection.dispatch();
            }
            if (_prevSection && _prevSection.end) {
                _prevSection.end();
            }
            _prevSection = null;
        }

        function goTo(paths) {
            _router.parse( makePath.apply(null, arguments) );
        }


        // API ===================

        // SETTINGS ---

        /**
         * If `true` it will NOT wait the previous section to end before
         * starting the next one.
         */
        exports.DEFAULT_ASYNC = false;

        /**
         * Default hash value, added to URL during init if no hash found.
         */
        exports.DEFAULT_HASH = '';

        /**
         * If section doesn't have a `moduleId` property it will load a module
         * with the id = "DEFAULT_PATH + section.id + DEFAULT_MODULE_NAME".
         */
        exports.DEFAULT_PATH = 'sections';
        exports.DEFAULT_MODULE_NAME = 'main';

        // METHODS ---

        exports.init = init;
        exports.goTo = goTo;

        // SIGNALS ---

        exports.initializedChange = _initializedChange;
        exports.endedPrevSection = _endedPrevSection;
        exports.initializedDestSection = _initializedDestSection;

        // OTHER ---

        exports.router = _router;

    }
);
