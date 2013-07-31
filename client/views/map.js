var myPositionMarker;
var bargeMarkers;
var featureLayer;
var TimerID;
var routeLayer;
var routeMarkerLayer;
var prevTS = 0;


Template.fullMap.rendered=function() {

  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }

    // Check is the feature is a polygon
    if(feature.geometry.type == "Polygon") {
      // Get the center Coords of a polygon
      var center = layer.getBounds().getCenter();
      switch(feature.properties.style) {
        case 'Terminal':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Terminal.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'Lock':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Lock.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'WaterM': 
          var myIcon = L.icon({iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'Bouy':
          var myIcon = L.icon({iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'Harbor': 
          var myIcon = L.icon({iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'Bridge': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Bridge.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'CarPoint': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'Company': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/Company.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'WaterIntake': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaterPoint.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'PublicLoading': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'PublicMooring': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'TrashP': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
        case 'WaitArea': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/WaitPoint.png'});
          L.marker(center, {icon: myIcon}).addTo(featureLayer);
        break;
      } // end switch
    } else if(feature.geometry.type == "Point"){
      // These are Points
      switch(feature.properties.style) {
        case 'MoorePointLeft': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointLeft.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
        case 'MoorePointRight': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointRight.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
        case 'GasOilPoint': 
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/GasOilPoint.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
        case 'WaitLockPointLeft':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointLeft.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
        case 'WaitLockPointRight':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointRight.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
        case 'WaitLockDangerPointLeft':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointLeft.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
        case 'WaitLockDangerPointRight':
          var myIcon = L.icon({iconUrl: 'http://109.237.211.144/images/InSight/owner/MoorePointRight.png', iconAnchor: [10, 10]});
          layer.setIcon(myIcon);
        break;
      } // end switch
    }// end if/else
  }

	// Create a map with standard location
	map = L.map('map').setView([52, 5.5], 9);
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osm = new L.TileLayer(osmUrl, {minZoom: 3, maxZoom: 16});

  // Ask the user to get their current location
  map.locate({setView : false, watch: true, maximumAge: 2000, enableHighAccuracy: true});
  // Add the tilelayer to the map
  map.addLayer(osm);
  // Add feature layer
  featureLayer = new L.LayerGroup().addTo(map);
  // Add myPostionMarker to the map
  myPostionMarker = new L.LayerGroup().addTo(map);
  // Add bargeMarkers to the map
  bargeMarkers = new L.LayerGroup().addTo(map);
  // Declare routeLayer
  routeLayer = new L.LayerGroup();
  // Declare routeMarkerLayer
  routeMarkerLayer = new L.LayerGroup().addTo(map);

  // Declare the icon
  var shipIcon = L.icon({
    iconUrl: 'shipIcon.png',
    iconAnchor:   [10, 10]
  });

  Deps.autorun(function(){
    if(currentposSubHandler && currentposSubHandler.ready()) {
      // Clear the last positions
      bargeMarkers.clearLayers();
      // Get all positions
      var positionList = currentPosition.find().fetch();
      positionList.forEach(function(currentPosition) {
        // Place a maker for each ship location
        var marker = L.marker([currentPosition.latitude, currentPosition.longitude],{icon: shipIcon, title: currentPosition.mmsi}).addTo(bargeMarkers);
        marker.bindPopup('Dit is barge: ' + currentPosition.mmsi.toString());
      });
    }
  });


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
  }).addTo(featureLayer);

  // Add event listeners
  map.on('locationfound', myPosition);
  map.on('dblclick', addCall);

}

/***************************************/
/** Log the position every 60 seconds **/
/***************************************/
Meteor.setInterval(function() {
  //Need to insert once a minute our location
  //console.log('Inserting position into DB');
  var my_mmsi = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
  var lat = currentPosition.findOne().latitude;
  var lng = currentPosition.findOne().longitude;
  var date = currentPosition.findOne().timestamp;
  //console.log('lat: ' + lat + ' lng: ' + lng + ' date: ' + date);
  //positionLog.insert({mmsi: my_mmsi, timestamp: date, latitude: lat, longitude: lng});
}, 5000);//60000);

// Map functions
function myPosition(e) {
  // Add marker on my location
  var shipIcon = L.icon({
    iconUrl: 'shipIcon.png',
    iconAnchor:   [10, 10]
  });
  myPostionMarker.clearLayers();
  //var marker = L.marker([e.latlng.lat, e.latlng.lng],{icon: shipIcon}).addTo(myPostionMarker); 

  if(bargeSubHandler && bargeSubHandler.ready()) {
    if(currentposSubHandler && currentposSubHandler.ready()) {
      // Get user information
      var user = bargeUsers.findOne({accessID: Meteor.userId()}); 
      // Get current time
      var curTimestamp = new Date();
      // Check if the user mmsi already exists in the currentPosition collection
      var position = currentPosition.findOne({mmsi: user.mmsi});
      //If user already exists, update the position. Else insert the position
      if(position) {
        console.log('Updating Position!');
        // Let the server update my position
        Meteor.call('updatePosition', user.mmsi, e.latlng.lat, e.latlng.lng, e.heading, e.speed, curTimestamp.getTime());
        // Let the server update my weather condition
        Meteor.call('fetchWeatherInfo', user.mmsi, e.latlng.lat, e.latlng.lng);
      } else {
        console.log('We are not known yet in the currentPosition COL. Inserting!');
        currentPosition.insert({mmsi: user.mmsi, latitude: e.latlng.lat, longitude: e.latlng.lng, heading: e.heading, speed: e.speed, timestamp: curTimestamp.getTime()});
      }
    }
  }
}

function addCall(e) {
  $('#myModal').modal('show');
  $('#latitude').val(e.latlng.lat);
  $('#longitude').val(e.latlng.lng);
  // Hide datepicker on changing the date
  $('.datepicker').datepicker().on('changeDate', function(ev){
    $('.datepicker').datepicker('hide');
  });
  // Set the date of today
  $('.datepicker').val(moment().format("DD[-]MM[-]YYYY"));
}


Template.fullMap.events({
  'click .save': function() {
    var givenDate = $('.datepicker').val();
    var givenTime = $('.timepicker').val();
    var givenLocation = $('#inputLocation').val(); 
    var givenType = $('#inputType').val();
    var timestamp = (moment(givenTime + ' ' + givenDate, "HH:mm DD-MM-YYYY").unix() * 1000); 
    var mmsi = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
    var reference = mmsi + ':' + timestamp;

    customCall.insert({
      callreference: reference,
      callstartdate: timestamp,
      locationlabel: givenLocation,
      latitude: $('#latitude').val(),
      longitude: $('#longitude').val(),
      callenddate: 0,
      uniqueresourceid: mmsi,
      calltype: givenType
    });
    $('#myModal').modal('hide');
  },
  'click .traveled': function() {
    drawRoute();
  }
});

function drawRoute() {
//var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
  if(!map.hasLayer(routeLayer)) {
    var route = new Array();
    var totalPoints = positionLog.find().count();
    var cursor = positionLog.find().fetch();
    for(var i=0; i<totalPoints; i++) {
      route[i] = new L.LatLng(cursor[i].latitude, cursor[i].longitude);
    }
    var polyline = L.polyline(route, {color: 'red',weight: 3}).addTo(routeLayer);
    routeLayer.addTo(map);
    TimerID = Meteor.setInterval(routeMarker, 1000);

  } else {
    map.removeLayer(routeLayer);
  }
}

function routeMarker() {
  if(map.hasLayer(routeLayer)) {
    var count = positionLog.find({timestamp: {$gt: prevTS}},{sort: {timestamp: 1}}).count();
    var cursor = positionLog.findOne({timestamp: {$gt: prevTS}},{sort: {timestamp: 1}});

    if(count) {
      prevTS = cursor.timestamp;
      routeMarkerLayer.clearLayers();
      var marker = L.marker([cursor.latitude, cursor.longitude]).addTo(routeMarkerLayer);
    } else {
      console.log('no cursor found');
      Meteor.clearInterval(TimerID);
      routeMarkerLayer.clearLayers();
      map.removeLayer(routeLayer);
    }
  }
}

Template.modalForm.events({
  // On click show datepicker
  'click .datepicker': function() {
    try {
      $('.datepicker').datepicker('show');
    } catch (e) {}
  }
});

Template.modalForm.rendered=function() {
  $('.timepicker').timepicker({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false,
                disableFocus: false
            });
}
