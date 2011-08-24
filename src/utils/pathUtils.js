define(function(){

/**
 * @namespace Utilities for path name handling
 * @author Miller Medeiros
 * @version 0.1 (2010/09/10)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var pathUtils = {
    
    /**
     * Get relative path to a parent folder.
     * - ported from Miller Medeiros PHP library (http://github.com/millermedeiros/MM_php_lib/).
     * @example MillerMedeiros.pathUtils('/lorem/ipsum/dolor/', '/lorem/') -> returns '../../'. 
     * @param {string} currentFolder    Current folder path (ex: '/lorem/ipsum/dolor').
     * @param {string} [baseFolder] Root folder path (ex: '/lorem/').
     * @return {string} Relative path to the `baseFolder`.
     */
    getRelativeRoot : function(currentFolder, baseFolder){
        baseFolder = baseFolder || '';
        
        var relativeRoot = '';
        
        currentFolder = currentFolder
                                    .replace(baseFolder, '')
                                    .replace(/^\/|\/$/, ''); //removes '/' from beginning and end of string
        
        if(currentFolder === ''){
            relativeRoot = './';
        }else if(/^(\.{1,2}\/)+$/.test(currentFolder)){ //check if folder is already a relative path to root ('./', '../', '../../', etc..) 
            relativeRoot = currentFolder;
        }else{
            relativeRoot = currentFolder.replace(/[^\/]+\/?/g, '../'); //add '../' for each path depth
        }
        
        return relativeRoot;
    }
    
};

return pathUtils;
});
