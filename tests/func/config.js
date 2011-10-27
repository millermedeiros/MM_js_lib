// base config
require = {
    paths : {
        'src' : '../../src/',
        'amd-utils' : '../../lib/amd-utils/src',
        'signals' : '../../lib/signals'
    },
    urlArgs: 'bust=' + (new Date()).getTime(), //cache bust
    waitSeconds: (/(:\/\/localhost|file:\/\/)/.test(document.location.href)? 2 : 45) //fail early if local
};
