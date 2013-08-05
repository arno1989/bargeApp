Template.profile.getInformation=function() {
	try {
		// Return profile information
		return Meteor.users.findOne()['profile'];
	} catch(e) {}
}

Template.profile.getMMSI=function() {
	// Return the user MMSI
	if(bargeSubHandler && bargeSubHandler.ready) {
		return bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
	}
}

Template.profile.getToken=function() {
	try {
		// Return my generated user Token
		return Meteor.userId();
	} catch(e) {}
}