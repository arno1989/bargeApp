activityCollection = new Meteor.Collection("ActivityCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('activityCollection', function (my_mmsi) {
		return activityCollection.find({uniqueresourceid: my_mmsi});
	});
}