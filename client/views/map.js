Template.fullMap.rendered=function() {

  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
  }


	// Create a map with standard location
	map = L.map('map').setView([52.2, 6.5], 9);
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osm = new L.TileLayer(osmUrl, {minZoom: 3, maxZoom: 14});   
  // Ask the user to get their current location
  map.locate({setView : true});
  // Add the tilelayer to the map
  map.addLayer(osm);

  // Add geoJSON to layers
  L.geoJson(myFeatures, {
    onEachFeature: onEachFeature,
    style: myStyle
  }).addTo(map);

  // Add event listeners
  map.on('locationfound', myMarker);
}

// Map functions
function myMarker(e) {
  // Add marker on my location
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}