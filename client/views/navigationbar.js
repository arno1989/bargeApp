Template.navigationbar.events({
	'click .icon-home': function(e) {
		console.log('CLICK! HOME');
		Meteor.render(Template.navigationbar);
	},
	'click .icon-globe': function(e) {
		console.log('CLICK! KAART');
		Meteor.render(Template.navigationbar);
	}
});



Template.navigationbar.active=function(path) {
	var isActive = false;
	if(path == window.location.pathname) {
		isActive = true;
	}
	//console.log('window loc: ' + window.location.pathname);
	//console.log('path: ' + path);
	//console.log('active:' + isActive);
	return isActive;
}
