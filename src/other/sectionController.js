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
 * @version 0.11.0 (2012/02/03)
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

        // SIGNALS ---

        exports.initializedChange = new signals.Signal();
        exports.endedPrevSection = new signals.Signal();
        exports._loadedDestSection = new signals.Signal();
        exports._endedAndLoaded = new CompoundSignal(exports.endedPrevSection, exports._loadedDestSection);
        exports.initializedDestSection = new signals.Signal();

        exports._endedAndLoaded.memorize = false;
        exports._endedAndLoaded.unique = false;


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


        // OTHER ----

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
            this._descriptor = descriptor;
            this._setupRoutes();
            this._afterRoutesSetup();
        };

        //make it easier to overwrite behavior
        exports._afterRoutesSetup = function () {
            this.goTo(this.DEFAULT_ROUTE);
        };

        exports.goTo = function (paths) {
            this.router.parse( makePath.apply(null, arguments) );
        };


        exports.router = crossroads.create();
        exports.router.shoulTypecast = false;
        exports.router.normalizeFn = function (req, vals) {
            //will dispatch a single parameter (Array) with all the values.
            return [vals.vals_];
        };

        // ---


        exports._setupRoutes = function () {

            var n = this._descriptor.length,
                sec, route, binding;

            while (sec = this._descriptor[--n]) {
                route = this.router.addRoute(sec.route == null? sec.id : sec.route, null, sec.priority);
                route.rules = sec.rules;
                route.greedy = !!(sec.greedy);
                binding = route.matched.add(this._changeSection, this);
                binding.params = [sec.id];
            }
        };

        exports._getSectionDescriptionById = function(id) {
            var n = this._descriptor.length,
                sec;
            while(sec = this._descriptor[--n]){
                if(sec.id === id) return sec;
            }
        };

        exports._uid = function(sectionId, params) {
            return sectionId + ((params && params.length)? '-'+ params.join('-') : '');
        };

        /**
         * @private
         * @param {string} sectionId Path to section
         * @param {array} params Params that will be passed to constructor
         */
        exports._changeSection = function (sectionId, params) {

            if (this._prevUid === this._uid(sectionId, params)) {
                return;
            }

            this.initializedChange.dispatch(sectionId, params);

            var destDescription = this._getSectionDescriptionById(sectionId),
                defaultParams = destDescription.params || [],
                destModuleId = destDescription.moduleId || makePath(this.DEFAULT_PATH, sectionId, this.DEFAULT_MODULE_NAME);

            this._destParams = defaultParams.concat(params);

            this._resetLoadState();

            if (destModuleId !== this._destModuleId || typeof this._prevModule === 'function') {
                // if it is a constructor it should always dispose previous
                // section before creating a new instance to avoid conflicts.
                this._destId = sectionId;
                this._destModuleId = destModuleId;

                if ( this._isAsyncChange(destDescription) ) {
                    this._loadedDestSection.addOnce(this._initDestSection, this);
                } else {
                    this._endedAndLoaded.addOnce(this._initDestSection, this);
                }

                this._endPrevSection();

            } else {
                // in case destSection didn't finished loading yet or it is
                // trying to load the same main module e.g. sub-section logic
                // is handled by `init()` by passing different params.
                this._loadedDestSection.addOnce(this._initDestSection, this);
            }

            this._loadSection(destModuleId);
        };

        exports._resetLoadState = function() {
            this._endedAndLoaded.remove(this._initDestSection);
            this._loadedDestSection.remove(this._initDestSection);
            this._endedAndLoaded.reset();
        };

        exports._isAsyncChange = function (description) {
            return 'isAsync' in description? description.isAsync : this.DEFAULT_ASYNC;
        };

        exports._loadSection = function (moduleId) {
            require([moduleId], function(){
                //only dispatch if loaded section is same as destination
                if(moduleId === exports._destModuleId){
                    exports._loadedDestSection.dispatch();
                }
            });
        };

        exports._initDestSection = function () {
            //module is already available since it was previously required by loadSection
            //better since it simplify logic and decouple methods
            var mod = require(this._destModuleId),
                initializedParams = [this._destId, this._destParams],
                section;

            if (typeof mod === 'function') {
                //treat functions as constructors
                section = ctorApply(mod, this._destParams);
                //if ctor can only listen for signal after instantiation so
                //make sure to set `memorize = true`
                this._listenInit(section, initializedParams);
            } else {
                section = mod;
                this._listenInit(section, initializedParams);
                section.init.apply(section, this._destParams);
            }
            this._prevSection = section;
            this._prevModule = mod;

            this._prevUid = this._uid(this._destId, this._destParams);
        };

        exports._listenInit = function(section, initializedParams) {
            if (section.initialized) {
                var initializedBinding = section.initialized.addOnce(this.initializedDestSection.dispatch, this.initializedDestSection);
                initializedBinding.params = initializedParams;
                // make sure to forget after first dispatch.. avoid issues with
                // subsequent dispatches. (construtors should set
                // `initialized.memorize = true` since signal will only be
                // created during instantiation and it may be dispatched before
                // listener is attached)
                section.initialized.addOnce(section.initialized.forget, section.initialized);
            } else {
                this.initializedDestSection.dispatch.apply(this.initializedDestSection, initializedParams);
            }
        };

        exports._endPrevSection = function () {
            if (this._prevSection) {
                if (this._prevSection.ended) {
                    this._prevSection.ended.addOnce(this.endedPrevSection.dispatch, this.endedPrevSection, Infinity);
                }
                if (this._prevSection.end) {
                    this._prevSection.end();
                }
            } else {
                //ensure it will always dispatch signal
                this.endedPrevSection.dispatch();
            }
            this._prevSection = this._prevModule = this._prevUid = null;
        };

    }
);
