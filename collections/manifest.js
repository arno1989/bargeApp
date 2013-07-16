manifestInfo = new Meteor.Collection("ManifestInformation");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('manifestInfo', function (my_mmsi) {
		return manifestInfo.find({mmsi: my_mmsi}); // alleen mijn mmsi er nog in bouwen
	});
}