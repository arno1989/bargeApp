customCall = new Meteor.Collection('customcalls');

if(Meteor.isServer){
	Meteor.publish('customCall', function (mmsi) {
		return customCall.find({mmsi: mmsi});
	});
}