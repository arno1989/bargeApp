L.Icon.Default.imagePath = 'packages/leaflet/images';
var map;

Template.mapSummary.rendered=function() {
	// Create a map with standard location
	map = L.map('map').setView([52.2, 6.5], 9);
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 14});   
  // Ask the user to get their current location
  map.locate({setView : true});
  // Add the tilelayer to the map
  map.addLayer(osm);
  /*console.log('going to get json file...')
  $.getJSON("/Users/Arno/MeteorWorkspace/bargeApp/lib/map/Features.geojson", function(data) {
    console.log("geojson file loaded");
    //When GeoJSON is loaded
    var geojsonLayer = new L.GeoJSON(data);   //New GeoJSON layer
    map.addLayer(geojsonLayer);     //Add layer to map  
  });*/
  //map.zoom(6);
  // Add event listeners
  map.on('locationfound', myPosition);
}

// Map functions
function myPosition(e) {
  // Add marker on my location
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  // Get user information
  var user = bargeUsers.find({}, {limit: 1}).fetch();  
  // Get current time
  var curTimestamp = new Date();
  // Check if the user mmsi already exists in the currentPosition collection
  var position = currentPosition.find({},{limit: 1});
  console.log('found: ' + position.count());
  // If user already exists, update the position. Else insert the position
  console.log('position count: ' + position.count());
  if(position.count() != 0) {
    console.log('Updating position');
    // Let the server update my position
    Meteor.call('updatePosition', user[0].mmsi, e.latlng.lat, e.latlng.lng, curTimestamp.getTime());
    // Let the server update my weather condition
    Meteor.call('fetchWeatherInfo', user[0].mmsi, e.latlng.lat, e.latlng.lng);
  } else {
    console.log('Inserting position');
    currentPosition.insert({mmsi: user[0].mmsi, latitude: e.latlng.lat, longitude: e.latlng.lng, timestamp: curTimestamp.getTime()});
  }

}

