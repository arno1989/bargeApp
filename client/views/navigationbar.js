Template.navigationbar.active=function(path) {
	var isActive = "";
	if(path == window.location.pathname) {
		isActive = "active";
	}
	return isActive;
}

Template.navigationbar.iconColor=function(path) {
	var color = "";
	if(path == window.location.pathname) {
		color = "icon-white"
	}
	return color;
}

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