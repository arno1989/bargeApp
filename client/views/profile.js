Template.profile.getInformation=function() {
	try {
		return Meteor.users.findOne()['profile'];
	} catch(e) {}
}

Template.profile.getMMSI=function() {
	try {
		return bargeUsers.findOne().mmsi;
	} catch(e) {}
}

Template.profile.getToken=function() {
	try {
		return Meteor.userId();
	} catch(e) {}
}