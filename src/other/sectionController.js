/**
 * sectionController: load/init/end sections based on routes change.
 * ============================================================================
 *
 * sections should implement `init(urlParamsArr)` method or be a constructor
 * `end()`, `ended:Signal`, `initialized:Signal` will be only used if
 * available.  be sure to set `memorize = true` if section is a Constructor
 *
 * ============================================================================
 *
 * Sections are only loaded/initialized/ended if it matches a different route
 * than the current one of if it captures different parameters. Multiple
 * consecutive `goTo` passing  same value will have the same effect as calling
 * it only once.
 *
 * Constructors
 * ------------
 * if module is a function it will be treated as a constructor. Notice that the
 * constructor function will be called each time a new parameter matches the
 * route and it will dispose previous object.
 *
 * Objects
 * -------
 * if module is an object it needs to implement the method `init()`.
 * `init()` will get called multiple times if matching same route passing
 * different parameters..
 *
 * ============================================================================
 *
 * @version 0.9.1 (2011/12/08)
 * @author Miller Medeiros
 */
define(
    [
        'require',
        'exports',
        'signals',
        'crossroads',
        'CompoundSignal',
        'amd-utils/string/makePath',
        'amd-utils/lang/ctorApply'
    ],
    function (require, exports, signals, crossroads, CompoundSignal, makePath, ctorApply) {

        var _initializedChange = new signals.Signal(),
            _endedPrevSection = new signals.Signal(),
            _loadedDestSection = new signals.Signal(),
            _endedAndLoaded = new CompoundSignal(_endedPrevSection, _loadedDestSection),
            _initializedDestSection = new signals.Signal();

        _endedAndLoaded.memorize = false;
        _endedAndLoaded.unique = false;


        var _descriptor,
            _prevUid,
            _destId,
            _destModuleId,
            _destParams,
            _prevSection,
            _prevModule;


        // ---


        function setupRoutes() {

            var n = _descriptor.length,
                sec, route, binding;

            while (sec = _descriptor[--n]) {
                route = exports.router.addRoute(sec.route == null? sec.id : sec.route, null, sec.priority);
                route.rules = sec.rules;
                route.greedy = !!(sec.greedy);
                binding = route.matched.add(changeSection);
                binding.params = [sec.id];
            }
        }

        function getSectionDescriptionById(id) {
            var n = _descriptor.length,
                sec;
            while(sec = _descriptor[--n]){
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

            _initializedChange.dispatch(sectionId, params);

            var destDescription = getSectionDescriptionById(sectionId),
                defaultParams = destDescription.params || [],
                destModuleId = destDescription.moduleId || makePath(exports.DEFAULT_PATH, sectionId, exports.DEFAULT_MODULE_NAME);

            _destParams = defaultParams.concat(params);

            resetLoadState();

            if (destModuleId !== _destModuleId || typeof _prevModule === 'function') {
                // if it is a constructor it should always dispose previous
                // section before creating a new instance to avoid conflicts.
                _destId = sectionId;
                _destModuleId = destModuleId;

                if ( isAsyncChange(destDescription) ) {
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

        function resetLoadState() {
            _endedAndLoaded.remove(initDestSection);
            _loadedDestSection.remove(initDestSection);
            _endedAndLoaded.reset();
        }

        function isAsyncChange(description) {
            return 'isAsync' in description? description.isAsync : exports.DEFAULT_ASYNC;
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
                initializedParams = [_destId, _destParams],
                section;

            if (typeof mod === 'function') {
                //treat functions as constructors
                section = ctorApply(mod, _destParams);
                //if ctor can only listen for signal after instantiation so
                //make sure to set `memorize = true`
                listenInit(section, initializedParams);
            } else {
                section = mod;
                listenInit(section, initializedParams);
                section.init.apply(section, _destParams);
            }
            _prevSection = section;
            _prevModule = mod;

            _prevUid = uid(_destId, _destParams);
        }

        function listenInit(section, initializedParams) {
            if (section.initialized) {
                var initializedBinding = section.initialized.addOnce(_initializedDestSection.dispatch, _initializedDestSection);
                initializedBinding.params = initializedParams;
                // make sure to forget after first dispatch.. avoid issues with
                // subsequent dispatches. (construtors should set
                // `initialized.memorize = true` since signal will only be
                // created during instantiation and it may be dispatched before
                // listener is attached)
                section.initialized.addOnce(section.initialized.forget, section.initialized);
            } else {
                _initializedDestSection.dispatch.apply(_initializedDestSection, initializedParams);
            }
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
            _prevSection = _prevModule = null;
        }


        // API ===================

        // SETTINGS ---

        /**
         * If `true` it will NOT wait the previous section to end before
         * starting the next one.
         * It will be overwritten by the section descriptor.
         */
        exports.DEFAULT_ASYNC = false;

        /**
         * Default route.
         */
        exports.DEFAULT_ROUTE = '';

        /**
         * If section doesn't have a `moduleId` property it will load a module
         * with the id = "DEFAULT_PATH + section.id + DEFAULT_MODULE_NAME".
         */
        exports.DEFAULT_PATH = 'sections';
        exports.DEFAULT_MODULE_NAME = 'main';

        // METHODS ---

        /**
         * @param {Array} descriptor Array with sections description.
         * Options
         * -------
         * - id:String => Used internally to get proper section or as a route
         *   (if route is the same as ID)
         * - [params]:Array => Arguments passed to `section.init()` or `new
         *   Section()` by default
         *
         * Route related:
         * - [route]:(String|RegExp) => See `crossroads.addRoute()` documentation.
         *   sectionController will use "id" as route if not present.
         * - [rules]:Object => see crossroads Route.rules.
         * - [priority]:Number => Route priority (see `crossroads.addRoute`).
         * - [greedy]:Boolean => crossroads Route.greedy.
         *
         * Behavior:
         * - [moduleId]:String => Path to module. It will load the module at
         *   given path if provided. Only use it if you want to override the
         *   normal id-to-module path resolution. (useful when you want
         *   multiple routes to load same module just passing different
         *   parameters)
         * - [isAsync]:Boolean => If section init()/constructor should NOT wait
         *   previous section end(), it will override
         *   `sectionController.DEFAULT_ASYNC`
         */
        exports.init = function (descriptor) {
            if (! descriptor) {
                throw new Error('"descriptor" is a required argument.');
            }
            _descriptor = exports._descriptor = descriptor;
            setupRoutes();
            exports._afterRoutesSetup();
        };

        //make it easier to overwrite behavior
        exports._afterRoutesSetup = function () {
            exports.goTo(exports.DEFAULT_ROUTE);
        };

        exports.goTo = function (paths) {
            exports.router.parse( makePath.apply(null, arguments) );
        };

        // SIGNALS ---

        exports.initializedChange = _initializedChange;
        exports.endedPrevSection = _endedPrevSection;
        exports.initializedDestSection = _initializedDestSection;

        // OTHER ---

        exports.router = crossroads.create();
        exports.router.shoulTypecast = false;
        exports.router.normalizeFn = function (req, vals) {
            //will dispatch a single parameter (Array) with all the values.
            return [vals.vals_];
        };

    }
);
