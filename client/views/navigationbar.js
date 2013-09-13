Meteor.startup( function () {
	navigator.geolocation.getCurrentPosition(getPosition, posError);
});
/***************************************/
/** Log the position every 60 seconds **/
/***************************************/
Meteor.setInterval(getGeo, 60000);

function getGeo(){
	navigator.geolocation.getCurrentPosition(getPosition, posError);
}

function posError(error) {
	console.log('position Error');
}

function getPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var hdn = position.coords.heading;
  var spd = position.coords.speed;
  var date = position.timestamp;

  // This could be used for geolocation on the full application
  // Log the position with a timer
  if(bargeSubHandler && bargeSubHandler.ready()) {
    if(currentposSubHandler && currentposSubHandler.ready()) {
      // Need to insert once a minute our location
      var my_mmsi = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
      // Log our position
      positionLog.insert({mmsi: my_mmsi, timestamp: date, latitude: lat, longitude: lng});
      // Check if our position is known in the currentposition collection
      var position = currentPosition.findOne({mmsi: my_mmsi});
      if(position) {
        console.log('Updating Position!');
        // Let the server update my position
        Meteor.call('updatePosition', my_mmsi, lat, lng, hdn, spd, date);
        // Let the server update my weather condition
        Meteor.call('fetchWeatherInfo', my_mmsi, lat, lng, function(){
        	console.log('got new weatherinfo');
        	$('#conditionSummary').html(Meteor.render(Template.conditionSummary));
        });
      } else {
        console.log('We are not known yet in the currentPosition COL. Inserting!');
        currentPosition.insert({mmsi: my_mmsi, latitude: lat, longitude: lng, heading: hdn, speed: spd, timestamp: date});
      }
    }
  }
  getNearestObstacle();
}

Template.navigationbar.rendered=function() {

}

Template.navigationbar.active=function(path) {
	// Return active for the current page
	var isActive = "";
	if(path == window.location.pathname) {
		isActive = "active";
	}
	return isActive;
}

Template.navigationbar.iconColor=function(path) {
	// Return the icon-color white for the active page
	var color = "";
	if(path == window.location.pathname) {
		color = "icon-white"
	}
	return color;
}

// Re-render the navigation bar to show the active tab
Template.navigationbar.events({
	'click .home': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});		
	},
	'click .map': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});
	},
	'click .fuel': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});
	},
	'click .manifest': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});
	},
	'click .meteo': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});
	},
	'click .chat': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});
	},
	'click .profile': function(e) {
		Meteor.defer(function() { // Wait till rendered 
     		$('#naviContainer').html(Meteor.render(Template.navigationbar));
   		});
	}
});