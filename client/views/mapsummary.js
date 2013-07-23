L.Icon.Default.imagePath = 'packages/leaflet/images';
var map;
var myPositionMarker;

Template.mapSummary.rendered=function() {

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmLayer = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 14});

  // Create a map with standard location
  map = L.map('map').setView([52.2, 6.5], 9);

  // Ask the user to get their current location and keep following them
  map.locate({setView : true, watch: true});
  // Add the tilelayer to the map
  map.addLayer(osmLayer);
  // Add myPostionMarker to the map
  myPostionMarker = new L.LayerGroup().addTo(map);  

  // Add event listeners
  map.on('locationfound', myPosition);
}

// Map functions
function myPosition(e) {
  // Add marker on my location
  myPostionMarker.clearLayers();
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(myPostionMarker); 
  // Get user information
  var user = bargeUsers.find({}, {limit: 1}).fetch();  
  // Get current time
  var curTimestamp = new Date();
  // Check if the user mmsi already exists in the currentPosition collection
  var position = currentPosition.find({},{limit: 1});
  // If user already exists, update the position. Else insert the position
  if(position.count() != 0) {
    try {
      // Let the server update my position
      Meteor.call('updatePosition', user[0].mmsi, e.latlng.lat, e.latlng.lng, curTimestamp.getTime());
      // Let the server update my weather condition
      Meteor.call('fetchWeatherInfo', user[0].mmsi, e.latlng.lat, e.latlng.lng);
    } catch(e) {}
  } else {
    try {
      currentPosition.insert({mmsi: user[0].mmsi, latitude: e.latlng.lat, longitude: e.latlng.lng, timestamp: curTimestamp.getTime()});
    } catch(e) {}
  }

}
