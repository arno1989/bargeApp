L.Icon.Default.imagePath = 'packages/leaflet/images';
var map;

Template.mapSummary.rendered=function() {
	// create a map with standard location
	map = L.map('map').setView([52.2, 6.5], 9);
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});   
  // Ask the user to get their current location
  map.locate({setView : true});
  map.addLayer(osm);

  var myPos = map.getCenter();
  var marker = L.marker([myPos.lat, myPos.lng]).addTo(map);
}

map.on('click', function(e) {
    alert(e.latlng); // e is an event object (MouseEvent in this case)
});

Template.mapSummary.events({
  'click .findMe': function(e) {
    map.locate({setView : true});
  }
});