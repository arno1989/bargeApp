Template.fullMap.rendered=function() {
	// Create a map with standard location
	map = L.map('map').setView([52.2, 6.5], 9);
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osm = new L.TileLayer(osmUrl, {minZoom: 3, maxZoom: 14});   
  // Ask the user to get their current location
  map.locate({setView : true});
  // Add the tilelayer to the map
  map.addLayer(osm);

  var geoJsonLayer = new L.GeoJSON(states);
  geoJsonLayer.setStyle({color: '#666'});

  map.addLayer(geoJsonLayer);

  //L.geoJson('json_file').addTo(map);

  // Add event listeners
  map.on('locationfound', myMarker);
}

// Map functions
function myMarker(e) {
  // Add marker on my location
  //var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}