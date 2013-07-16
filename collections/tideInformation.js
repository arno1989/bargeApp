tideInformation = new Meteor.Collection('TideInformation');

if(Meteor.isServer) {
	Meteor.publish('tideInformation', function (my_mmsi) {
		return tideInformation.find();
	});
}