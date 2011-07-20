/**
 * @license RequireJS plugin for loading files without adding the JS extension.
 * <https://gist.github.com/1057913>
 * useful for JSONP services and any other kind of resource that already contain 
 * a file extension or that shouldn't have one (like dynamic scripts).
 * @author Miller Medeiros 
 * @version 0.1 (2011/06/10) 
 * Released under the WTFPL <http://sam.zoy.org/wtfpl/> 
 */
define(function(){
    //API
    return {
    
        load : function(name, req, onLoad, config){
            var url = req.toUrl(name);
            //load proper file without js extension
            req([url], function(val){
                onLoad(val);
            });
        }

    };
});
