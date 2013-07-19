Template.fullMap.rendered=function() {

  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
    // Check is the feature is a polygon
    if(feature.geometry.coordinates[0].length > 1) {
      var coords = [feature.geometry.coordinates[0][0][1],feature.geometry.coordinates[0][0][0]];
      switch(feature.properties.style) {
        case 'Terminal':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Terminal.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'Lock':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Lock.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'WaterM': 
          var myIcon = L.icon({iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'Bouy':
          var myIcon = L.icon({iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'Harbor': 
          var myIcon = L.icon({iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'Bridge': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Bridge.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'CarPoint': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'Company': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Company.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'WaterIntake': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaterPoint.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'PublicLoading': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'PublicMooring': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'TrashP': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
            L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'WaitArea': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
      } // end switch
    } else {
      // These are Points
      var coords = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]];
      switch(feature.properties.style) {
        case 'MoorePointLeft': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointLeft.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'MoorePointRight': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointRight.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'GasOilPoint': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/GasOilPoint.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'WaitLockDangerPointLeft':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointLeft.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
        case 'WaitLockDangerPointRight':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointRight.png'});
          L.marker(coords, {icon: myIcon}).addTo(map);
        break;
      } // end switch
    }// end if/else
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
    style: function(feature) {
      //console.log('coords: ' + feature.geometry.coordinates.length);
      switch(feature.properties.style) {
        case 'Terminal': return {color: '#f88735', fillOpacity: 0.65};
        case 'Lock': return {color: '#27a93b', fillOpacity: 0.65};
        case 'WaterM': return {color: '#ff7f31', fillOpacity: 0.65};
        case 'Bouy': return {color: '#ff7f31', fillOpacity: 0.65};
        case 'Harbor': return {color: '#ff7f31', fillOpacity: 0.65};
        case 'MoorePointLeft': return {color: '#fff000', fillOpacity: 0.65};
        case 'Bridge': return {color: '#ffff00', fillOpacity: 0.65};
        case 'Carpoint': return {color: '#fff000', fillOpacity: 0.65};
        case 'Company': return {color: '#3636e0', fillOpacity: 0.65};
        case 'WaterIntake': return {color: '#fff000', fillOpacity: 0.65};
        case 'GasOilPoint': return {color: '#fff000', fillOpacity: 0.65};
        case 'PublicLoading': return {color: '#ffff00', fillOpacity: 0.65};
        case 'PublicMooring': return {color: '#ffff00', fillOpacity: 0.65};
        case 'TrashP': return {color: '#fff000', fillOpacity: 0.65};
        case 'MoorePointRight': return {color: '#fff000', fillOpacity: 0.65};
        case 'WaitLLt': return {color: '#fff000', fillOpacity: 0.65};
        case 'WaitLRt': return {color: '#fff000', fillOpacity: 0.65};
        case 'WaitLockDangerPointLeft': return {color: '#fff000', fillOpacity: 0.65};
        case 'WaitLockDangerPointRight': return {color: '#fff000', fillOpacity: 0.65};
        case 'WaitArea': return {color: '#fff000', fillOpacity: 0.65};
      }
    }
  }).addTo(map);

  // Add event listeners
  map.on('locationfound', myMarker);
  map.on('dblclick', addCall);
}

// Map functions
function myMarker(e) {
  // Add marker on my location
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
}

function addCall(e) {
  console.log("Map clicked!");
  $('#myModal').modal('show');
}