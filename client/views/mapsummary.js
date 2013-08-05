// Define leaflet imagepath
L.Icon.Default.imagePath = 'packages/leaflet/images';
var map;

Template.mapSummary.rendered=function() {

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmLayer = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 16});

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
  if(bargeSubHandler && bargeSubHandler.ready) {
    if(currentposSubHandler && currentposSubHandler.ready) {
      if(weatherSubHandler && weatherSubHandler.ready) {
        // Add marker on my location
        myPostionMarker.clearLayers();
        var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(myPostionMarker); 
        // Get user information
        var user = bargeUsers.findOne({accessID: Meteor.userId()}); 
        // Get current time
        var curTimestamp = new Date();
        // Check if the user mmsi already exists in the currentPosition collection
        var position = currentPosition.find({},{limit: 1});
        // If user already exists, update the position. Else insert the position
        if(position.count() != 0) {
          // Let the server update my position
          Meteor.call('updatePosition', user.mmsi, e.latlng.lat, e.latlng.lng, e.heading, e.speed, curTimestamp.getTime());
          // Let the server update my weather condition
          Meteor.call('fetchWeatherInfo', user.mmsi, e.latlng.lat, e.latlng.lng);
        } else {
          currentPosition.insert({mmsi: user.mmsi, latitude: e.latlng.lat, longitude: e.latlng.lng, heading: e.heading, speed: e.speed, timestamp: curTimestamp.getTime()});

        }
        getNearestObstacle();
      }
    }
  }
}
