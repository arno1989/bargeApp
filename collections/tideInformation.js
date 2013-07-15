tideInformation = new Meteor.Collection('TideInformation');

if(Meteor.isServer) {
	Meteor.publish('tideInformation', function (userId) {
		return tideInformation.find();
	});
}