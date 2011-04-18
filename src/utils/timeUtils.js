/**
 * Utilities for time manipulation
 * @author Miller Medeiros
 * @version 0.0.2 (2011/04/05)
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
define(function(){
	
	function part(ms, unit, mod){
		return Math.floor(ms/unit) % mod;
	}
	
	var timeUtils = {
		//aproximated miliseconds time conversion (using a 365.242199 days year)
		MILISECOND : 1,
		SECOND : 1000,
		MINUTE : 60000,
		HOUR : 3600000,
		DAY : 86400000,
		WEEK : 604800000,
		MONTH : 2629743830,
		YEAR : 31556926000,
		
		split : function(ms){
			var time = {};
			time.miliseconds = part(ms, this.MILISECOND, 1000);
			time.seconds = part(ms, this.SECOND, 60);
			time.minutes = part(ms, this.MINUTE, 60);
			time.hours = part(ms, this.HOUR, 24);
			time.days = part(ms, this.DAY, 365);
			return time;
		}
	};
	
	return timeUtils;
});
