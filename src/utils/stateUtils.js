define(
    [
        'exports'
    ],
    function (exports) {

        // inpired and borrowed data from Zeh AS3 StateUtils
        // https://github.com/zeh/as3/blob/master/com/zehfernando/utils/standards/StateUtils.as
        // wanted to keep it standalone so avoided using amd-utils methods
        // ---
        // author: Miller Medeiros
        // version: 0.2.1 (2012/08/30)
        // license: MIT

        var _stateList;


        function lazyInit(){
            if (_stateList) return;

            var rawData = [
                [ "AL", "Alabama",              [ 35000, 36999 ] ],
                [ "AK", "Alaska",               [ 99500, 99999 ] ],
                [ "AZ", "Arizona",              [ 85000, 86999 ] ],
                [ "AR", "Arkansas",             [ 71600, 72999 ] ],
                [ "CA", "California",           [ 90000, 96199 ] ],
                [ "CO", "Colorado",             [ 80000, 81999 ] ],
                [ "CT", "Connecticut",          [ 6000, 6389, 6391, 6999 ] ],
                [ "DE", "Delaware",             [ 19700, 19999 ] ],
                [ "FL", "Florida",              [ 32000, 34999 ] ],
                [ "GA", "Georgia",              [ 30000, 31999, 39800, 39899, 39901, 39901 ] ],
                [ "HI", "Hawaii",               [ 96700, 96899 ] ],
                [ "ID", "Idaho",                [ 83200, 83999 ] ],
                [ "IL", "Illinois",             [ 60000, 62999 ] ],
                [ "IN", "Indiana",              [ 46000, 47999 ] ],
                [ "IA", "Iowa",                 [ 50000, 52999 ] ],
                [ "KS", "Kansas",               [ 66000, 67999 ] ],
                [ "KY", "Kentucky",             [ 40000, 42799 ] ],
                [ "LA", "Louisiana",            [ 70000, 71599 ] ],
                [ "ME", "Maine",                [ 3900, 4999 ] ],
                [ "MD", "Maryland",             [ 20600, 21999 ] ],
                [ "MA", "Massachusetts",        [ 1000, 2799 ] ],
                [ "MI", "Michigan",             [ 48000, 49999 ] ],
                [ "MN", "Minnesota",            [ 55000, 56799 ] ],
                [ "MS", "Mississippi",          [ 38600, 39999 ] ],
                [ "MO", "Missouri",             [ 63000, 65999 ] ],
                [ "MT", "Montana",              [ 59000, 59999 ] ],
                [ "NE", "Nebraska",             [ 68000, 69999, 88900, 89999 ] ],
                [ "NV", "Nevada",               [ 89000, 89899 ] ],
                [ "NJ", "New Jersey",           [ 7000, 8999 ] ],
                [ "NH", "New Hampshire",        [ 3000, 3899 ] ],
                [ "NM", "New Mexico",           [ 87000, 88499 ] ],
                [ "NY", "New York",             [ 10000, 14999, 544, 544, 501, 501, 6390, 6390 ] ],
                [ "NC", "North Carolina",       [ 27000, 28999 ] ],
                [ "ND", "North Dakota",         [ 58000, 58999 ] ],
                [ "OH", "Ohio",                 [ 43000, 45999 ] ],
                [ "OK", "Oklahoma",             [ 73000, 74999 ] ],
                [ "OR", "Oregon",               [ 97000, 97999 ] ],
                [ "PA", "Pennsylvania",         [ 15000, 19699 ] ],
                [ "RI", "Rhode Island",         [ 2800, 2999 ] ],
                [ "SC", "South Carolina",       [ 29000, 29999 ] ],
                [ "SD", "South Dakota",         [ 57000, 57999 ] ],
                [ "TN", "Tennessee",            [ 37000, 38599 ] ],
                [ "TX", "Texas",                [ 75000, 79999, 88500, 88599 ] ],
                [ "UT", "Utah",                 [ 84000, 84999 ] ],
                [ "VT", "Vermont",              [ 5000, 5999 ] ],
                [ "VA", "Virginia",             [ 20100, 20199, 22000, 24699 ] ],
                [ "WA", "Washington",           [ 98000, 99499 ] ],
                [ "WV", "West Virginia",        [ 24700, 26999 ] ],
                [ "WI", "Wisconsin",            [ 53000, 54999 ] ],
                [ "WY", "Wyoming",              [ 82000, 83199 ] ],
                // Not real 'states' but used as such
                [ "DC", "District of Columbia", [ 20000, 20099, 20200, 20599, 56900, 56999 ] ],
                [ "PR", "Puerto Rico",          [ 600, 799, 900, 999 ] ],
                [ "VI", "Virgin Islands",       [ 800, 899 ] ],
                [ "AA", "AA",                   [ 34090, 34095, 9000, 9999, 96200, 96699 ] ] // Army bases
            ];

            _stateList = [];

            var state, i = 0;
            while (state = rawData[i++]) {
                _stateList[_stateList.length] = {
                    id : state[0],
                    name : state[1],
                    zipRanges : state[2]
                };
            }

        }


        exports.getStateByZip = function(zipcode){
            zipcode = Number(zipcode);
            lazyInit();

            var state, i = 0;

            while (state = _stateList[i++]) {
                if ( isZipInRanges(zipcode, state.zipRanges) ) {
                    // create a new object every time since objects are passed by reference
                    return {
                        id : state.id,
                        name : state.name
                    };
                }
            }

            return null;
        };


        function isZipInRanges(zipcode, ranges){
            var i = 0,
                n = ranges.length;
            while (i < n) {
                if ( zipcode >= ranges[i] && zipcode <= ranges[i+1] ) {
                    return true;
                }
                i += 2;
            }
            return false;
        }


        exports.getNameById = function(id){
            id = (id || '').toUpperCase();
            lazyInit();
            var state, i = 0;
            while (state = _stateList[i++]) {
                if (state.id === id) {
                    return state.name;
                }
            }
            return '';
        };


        exports.getIdByName = function(name){
            name = (name || '').toLoweCase();
            lazyInit();
            var state, i = 0;
            while (state = _stateList[i++]) {
                if ( state.name.toLowerCase() === name ) {
                    return state.id;
                }
            }
            return '';
        };


        exports.getIdByZip = function(zipcode){
            var state = exports.getStateByZip(zipcode);
            return state? state.id : '';
        };


        exports.getNameByZip = function(zipcode){
            var state = exports.getStateByZip(zipcode);
            return state? state.name : '';
        };


        exports.isValidZip = function(zipcode){
            // hacky solution but works :P
            return !!exports.getStateByZip(zipcode);
        };


        exports.isValidId = function(id){
            return !!exports.getNameById(id);
        };


        exports.isValidName = function(name){
            return !!exports.getIdByName(name);
        };


    }
);
