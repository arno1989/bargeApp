callCollection = new Meteor.Collection("CallCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('callCollection', function (my_mmsi) {
		return callCollection.find({uniqueresourceid: my_mmsi}); // alleen mijn mmsi er nog in bouwen
	});
}