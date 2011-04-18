/**
 * Extremely basic templating system
 * @author Miller Medeiros
 * @version 0.0.2 (2010/04/18)
 */
define({
	parse : function(template, data){
		function replaceFn(match, prop){
			return (prop in data)? data[prop] : '';
		}
		return template.replace(/\{\{(\w+)\}\}/g, replaceFn);
	}
});