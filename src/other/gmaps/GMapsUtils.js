/**
* Google Maps Utils v0.1 (2009/09/16)
* @author Miller Medeiros (www.millermedeiros.com)
* Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var GMapsUtils = function(){
	
	/**
	* GEO Status Code Descriptions
	*/
	var GEO_STATUS_MSG = [];
	
	// GGeoStatusCode Messages
	GEO_STATUS_MSG[G_GEO_SUCCESS] = "Success";
	GEO_STATUS_MSG[G_GEO_BAD_REQUEST] = "Bad Request: The directions request could not be successfully parsed.";
	GEO_STATUS_MSG[G_GEO_SERVER_ERROR] = "Server Error: The geocoding request could not be successfully processed.";
	GEO_STATUS_MSG[G_GEO_MISSING_QUERY] = "Missing Query: The query parameter was either missing or had no value.";
	GEO_STATUS_MSG[G_GEO_MISSING_ADDRESS] = "Missing Address: The address was either missing or had no value.";
	GEO_STATUS_MSG[G_GEO_UNKNOWN_ADDRESS] = "Unknown Address: No corresponding geographic location could be found for the specified address.";
	GEO_STATUS_MSG[G_GEO_UNAVAILABLE_ADDRESS] = "Unavailable Address: The geocode for the given address cannot be returned due to legal or contractual reasons.";
	GEO_STATUS_MSG[G_GEO_UNKNOWN_DIRECTIONS] = "Unknown Directions: Could not compute directions between the points.";
	GEO_STATUS_MSG[G_GEO_BAD_KEY] = "Bad Key: The API key is either invalid or does not match the domain for which it was given";
	GEO_STATUS_MSG[G_GEO_TOO_MANY_QUERIES] = "Too Many Queries: The daily geocoding quota for this site has been exceeded.";
	
	/**
	* Add marker
	*/
	function addMarker(map, latLng, icon, opts){
		opts = opts || {};
		opts.icon = icon || new GIcon(G_DEFAULT_ICON);
		map.addOverlay(new GMarker(latLng, opts));
	}
	/**
	* Replace marker
	*/
	function replaceMarker(map, marker, icon, opts){
		map.removeOverlay(marker);
		addMarker(map, marker.getLatLng(), icon, opts);
	}
	/**
	* Add default Number Marker (yellow)
	*/
	function addNumberMarker(map, latLng, number, opts){
		addMarker(map, latLng, new GIcon(G_DEFAULT_ICON, 'http://maps.gstatic.com/intl/en_us/mapfiles/marker_yellow'+ number +'.png'), opts);
	}
	/**
	* Add default Letter Marker (green)
	*/
	function addLetterMarker(map, latLng, letter, opts){
		addMarker(map, latLng, new GIcon(G_DEFAULT_ICON, 'http://maps.gstatic.com/intl/en_us/mapfiles/marker_green'+ letter.toUpperCase() + '.png'), opts);
	}
	/**
	* Center map and zoom map to fit bounds
	*/
	function fitToBounds(map, bounds){
		map.setZoom(map.getBoundsZoomLevel(bounds));
		map.setCenter(bounds.getCenter());
	}
	// Public API
	return{
		GEO_STATUS_MSG : GEO_STATUS_MSG,
		addMarker : addMarker,
		addNumberMarker : addNumberMarker,
		addLetterMarker : addLetterMarker,
		replaceMarker : replaceMarker,
		fitToBounds : fitToBounds
	};
}();