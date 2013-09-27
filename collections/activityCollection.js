activityCollection = new Meteor.Collection("ActivityCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('activityCollection', function (my_mmsi) {
		return activityCollection.find({uniqueresourceid: my_mmsi});
	});

	Meteor.methods({
		updateActivity: function(id, location, via, arive, start, end, unload, load, omstuw, fuel) {
			activityCollection.update({_id: id},{locationlabel: location, vialabel: via, callarivetime: arive,
										callstarttime: start, callendtime: end, unload: unload, load: load,
										omstuw: omstuw, fuel: fuel});
		}
	});
}