/**
* Google Maps Custom Directions v0.2 (2009/10/21)
* @author Miller Medeiros (www.millermedeiros.com)
* @requires GMapsUtils v0.1
* @requires GoogleMaps API v2.176 ("did you mean" may not work with newer versions of the Google Maps API because it uses undocumented vars/methods)
*/
var GMapsCustomDirections = function(){
	
	var _directions, // GDirections
		_geocoder, //GClientGeocoder
		_map, //GMap2
		_panel; //Element (div)
	
	/**
	* Configure custom directions (IMPORTANT! should be called before calling other methods)
	*/
	function config(directions, geocoder, map, panel){
		_directions = directions;
		_geocoder = geocoder;
		_map = map;
		_panel = panel;
		GEvent.addListener(_directions, "load", onDirectionsLoad);
		GEvent.addListener(_directions, "error", onDirectionsError);
	}
	
	function load(query, queryOpts){
		clearResults();
		_directions.load(query, parseQueryOpts(queryOpts));
	}
	
	function loadFromWaypoints(waypoints, queryOpts){
		clearResults();
		_directions.loadFromWaypoints(waypoints, parseQueryOpts(queryOpts));
	}
	
	// @private
	function parseQueryOpts(queryOpts){
		if(!queryOpts) queryOpts = {};
		queryOpts.getSteps = true;
		queryOpts.getPolyline  = true;
		return queryOpts;
	}
	// @private
	function parseWaypoints(waypoints, i){
		i = i || 0;
		_geocoder.getLocations(waypoints[i], function(r){
			if(r.Status.code == G_GEO_SUCCESS){
				if(r.Placemark.length != 1){
					buildSuggestions(waypoints, i, r.Placemark);
				}else{
					if(_map) GMapsUtils.addLetterMarker(_map, new GLatLng(r.Placemark[0].Point.coordinates[1], r.Placemark[0].Point.coordinates[0]), String.fromCharCode(97+i).toUpperCase(), {clickable:false});
					if(waypoints.length-1 > i){
						parseWaypoints(waypoints, i+1); //loop
					}else{
						loadFromWaypoints(waypoints); //loop end
					}
				}
			}else{
				alert(GMapsUtils.GEO_STATUS_MSG[r.Status.code]);
			}
		});
	}
	// @private
	function clearResults(){
		if(_map) _map.clearOverlays();
		if (_panel) _panel.innerHTML = '';
	}
	// @private
	function buildDirections(routes){
		var nRoutes = routes.length,
			nSteps,
			curRoute,
			curStep,
			curNum = 0,
			html = '<div id="gmaps_directions">';
		
		html += '<h3>Driving directions to '+ _directions.getGeocode(nRoutes).address +'</h3>';
		html += '<div class="summary">'+ _directions.getSummaryHtml() +'</div>';
		
		for(i=0; i<nRoutes; i++){
			curRoute = routes[i];
			nSteps = curRoute.getNumSteps();
			html += '<div class="waypoint w-'+(i+1)+'">'+ curRoute.getStartGeocode().address +'</div>';
			html += '<table>';
			for(j=0; j<nSteps; j++){
				curNum++;
				curStep = curRoute.getStep(j);
				html += '<tr>';
				html += '<td class="number">'+ curNum +'.</td>';
				html += '<td class="description">'+ curStep.getDescriptionHtml() +'</td>';
				html += '<td class="distance">'+ curStep.getDistance().html +'</td>';
				html += '</tr>';
			}
			html += '</table>';
			if(nRoutes != 1) html += '<div class="timedist">'+ curRoute.getSummaryHtml() +'</div>';
			if(i==nRoutes-1) html += '<div class="waypoint w-'+(i+2)+'">'+ curRoute.getEndGeocode().address +'</div>';
		}
		
		html += '<small class="copyright">'+ _directions.getCopyrightsHtml() +'</small>';
		html += '</div>';
		_panel.innerHTML = html;
		
	}
	// @private
	function buildSuggestions(waypoints, i, placemarks){
		var html = '<div id="gmaps_directions"><h3>Did you mean:</h3><ol>',
			t = (placemarks.length < 10)? placemarks.length : 9,
			u = waypoints.length,
			latLng,
			strWay,
			bounds = new GLatLngBounds();
			
		for(j=0; j<t; j++){
			latLng = new GLatLng(placemarks[j].Point.coordinates[1], placemarks[j].Point.coordinates[0]);
			bounds.extend(latLng);
			waypoints[i] = placemarks[j].address;
			strWay = '';
			for(k=0; k<u; k++){
				strWay += "'"+ waypoints[k];
				strWay += (k<u-1)? "', " : "'";
			}
			html += '<li class="suggestion"><a href="javascript:void(0)" class="s-'+(j+1)+'" onclick="GMapsCustomDirections.loadFromWaypoints(['+ strWay +']); return false;">'+ placemarks[j].address + '</a></li>';
			if(_map) GMapsUtils.addNumberMarker(_map, latLng, (j+1), {clickable:false});
		}
		html += '</ol></div>';
		if(_panel){ _panel.innerHTML = html; }
		if(_map) {
			GMapsUtils.fitToBounds(_map, bounds);
		}
	}
	// @private
	function onDirectionsLoad(e){
		//timeout required
		setTimeout(function() {
			var marker,
				n = e.getNumRoutes(),
				routes = [];
			if(_map) _map.addOverlay(e.getPolyline());
			for(i=0; i<n; i++){
				routes.push(e.getRoute(i));
			}
			if(_panel) buildDirections(routes);
			if(_map){
				++n;
				while(n--){
					marker = e.getMarker(n);
					_map.addOverlay(marker);
				}
				GMapsUtils.fitToBounds(_map, e.getBounds());
			}
		},0);
	}
	// @private
	function onDirectionsError(e){
		var errorCode = _directions.getStatus().code;
		switch(errorCode){
			case G_GEO_UNKNOWN_ADDRESS:
				//ensures that undocumented object e.k exist and that it contains the 'name' property (it can change on future versions)
				if(e.k && e.k.name){
					var waypoints = e.k.name.replace(/from:/,'').split(/ to:/);
					parseWaypoints(waypoints);
					break;
				}
			default:
				alert(GMapsUtils.GEO_STATUS_MSG[errorCode]);
		}
	}
	
	// Public API
	return{
		config : config,
		load : load,
		loadFromWaypoints : loadFromWaypoints
	};
}();