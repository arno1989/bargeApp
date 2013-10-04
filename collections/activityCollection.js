activityCollection = new Meteor.Collection("ActivityCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('activityCollection', function (my_mmsi) {
		return activityCollection.find({uniqueresourceid: my_mmsi});
	});

	Meteor.methods({
		updateActivity: function(id, location, via, arive, start, end, unload, load, omstuw, fuel, done) {
			console.log('updating activity: ' + id);
			activityCollection.update({_id: id},
			{$set:{
				locationlabel: location,
				vialabel: via,
				callstartdate: arive,
				callbegindate: start,
				callenddate: end,
				unload: unload,
				load: load,
				omstuw: omstuw,
				fuel: fuel,
				done: done
			}});;
		}
	});
}