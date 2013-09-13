var myPositionMarker;
var bargeMarkers;
var featureLayer;
var TimerID;
var routeLayer;
var routeMarkerLayer;
var prevTS = 0;
var animatedMarker;

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
  map.locate({setView : false, maximumAge: 2000, enableHighAccuracy: true});
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

  // Autorun to detect updates for all user positions
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

  if(featSubHandler && featSubHandler.ready) {
    var featureDB = featureCollection.find().fetch();
    // Add geoJSON to layers from the feature collection
    L.geoJson(myFeatures, { // ! Change myFeatures to featureDB to use the database
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
  }

  // Add event listeners
  map.on('locationfound', myPosition);
  map.on('dblclick', addCall);

  /*********** DEMO ANIMATED ROUTE **************/
  /*var demoLine = new L.polyline([[52.09334850, 6.15765770],[52.09343620, 6.15693860],[52.09389590, 6.15686210],[52.09377570,6.15578620],[52.09439050,6.155626100000001],[52.09410480,6.1520850],[52.10759330,6.16153020],[52.10845020,6.16745840],[52.14077560,6.184667999999999],[52.14358930,6.18943790],[52.14347440,6.19040450],[52.13864620,6.1922270],[52.138820,6.19451540],[52.13938690,6.19482410],[52.13969470000001,6.196525299999999],[52.13985430,6.19543380]],{color: 'red'}).addTo(map);

  animatedMarker = L.animatedMarker(demoLine.getLatLngs(), {
    autoStart: false,
    distance: 300,  // meters
    interval: 1000, // milliseconds
  });

  map.addLayer(animatedMarker);
  /*********************************************/
}

// Map functions
function myPosition(e) {
  // Add marker on my location
/*  var shipIcon = L.icon({
    iconUrl: 'shipIcon.png',
    iconAnchor:   [10, 10]
  });
  myPostionMarker.clearLayers();

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
  }*/
}

// db-Click the map to show the add call input form
function addCall(e) {
  $('#myModal').modal('show');
  // Set the hidden input types witht the lat/lng values
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
  // When clicked on the save button
  'click .save': function() {
    // Get the form values
    var givenDate = $('.datepicker').val();
    var givenTime = $('.timepicker').val();
    var givenLocation = $('#inputLocation').val(); 
    var givenType = $('#inputType').val();
    var timestamp = (moment(givenTime + ' ' + givenDate, "HH:mm DD-MM-YYYY").unix() * 1000);
    // Get the user MMSI
    var mmsi = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
    // Create the unique callreference
    var reference = mmsi + ':' + timestamp;
    // Insert the data
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
    // Hide the modal
    $('#myModal').modal('hide');
  },
  'click .traveled': function() {
    //animatedMarker.start(); //<-- DEMO
    drawRoute();
  }
});

function drawRoute() {
  // If the drawRoute button is clicked
  if(!map.hasLayer(routeLayer)) {
    var route = new Array();
    // Get all logged coordinates
    var totalPoints = positionLog.find().count();
    var cursor = positionLog.find().fetch();
    for(var i=0; i<totalPoints; i++) {
      route[i] = new L.LatLng(cursor[i].latitude, cursor[i].longitude);
    }
    // Draw a polyline along the route
    var polyline = L.polyline(route, {color: 'red',weight: 3}).addTo(routeLayer);
    routeLayer.addTo(map);
    // Move a marker over the coordinates
    TimerID = Meteor.setInterval(routeMarker, 500);
  } else {
    // If the route is already shown, remove it
    map.removeLayer(routeLayer);
  }
}

function routeMarker() {
  if(map.hasLayer(routeLayer)) {
    // Find the next position by using the timestamp 'prevTS'
    var count = positionLog.find({timestamp: {$gt: prevTS}},{sort: {timestamp: 1}}).count();
    var cursor = positionLog.findOne({timestamp: {$gt: prevTS}},{sort: {timestamp: 1}});
    // If there is a position log
    if(count) {
      prevTS = cursor.timestamp; // Sets the timestamp of this position.
      routeMarkerLayer.clearLayers(); //Reset layer mask
      // Add the marker to the layer
      var marker = L.marker([cursor.latitude, cursor.longitude]).addTo(routeMarkerLayer);
    } else {
      // No position found, reset timer,prevTS and layers.
      console.log('no cursor found');
      Meteor.clearInterval(TimerID);
      prevTS = 0;
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
  // Init timepicker
  $('.timepicker').timepicker({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false,
                disableFocus: false
            });
}
