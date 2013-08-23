// base config
require = {
    paths : {
        'src' : '../../../src/',
        'lib' : '../../../lib',
        'mout' : '../../../lib/mout/src',
        'signals' : '../../../lib/signals',
        'json' : '../../../lib/requirejs-plugins/src/json',
        'text' : '../../lib/requirejs/text'
    },
    urlArgs: 'bust=' + (new Date()).getTime(), //cache bust
    waitSeconds: (/(:\/\/localhost|file:\/\/)/.test(document.location.href)? 2 : 45) //fail early if local
};
