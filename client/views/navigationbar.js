Template.navigationbar.rendered=function() {
	if (navigator.geolocation)
	{
		var pos = navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

function showPosition(position)
{
	// This could be used for geolocation on the full application
	// Log the position with a timer
	//console.log("Latitude: " + position.coords.latitude); 
	//console.log("Longitude: " + position.coords.longitude);	
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