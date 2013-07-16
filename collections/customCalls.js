customCall = new Meteor.Collection('CustomCalls');

if(Meteor.isServer){
	Meteor.publish('customCall', function (mmsi) {
		return customCall.find({mmsi: mmsi});
	});
}