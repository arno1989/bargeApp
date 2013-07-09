L.Icon.Default.imagePath = 'packages/leaflet/images';
var map;

Template.mapSummary.rendered=function() {
	// create a map with standard location
	map = L.map('map').setView([52.2, 6.5], 9);
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 14, attribution: osmAttrib});   
  // Ask the user to get their current location
  map.locate({setView : true});
  // Add the tilelayer to the map
  map.addLayer(osm);
  // Add event listeners
  map.on('locationfound', myMarker);
}

// Map functions
function myMarker(e) {
  // Add marker on my location
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

