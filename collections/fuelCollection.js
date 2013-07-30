fuelCollection = new Meteor.Collection("FuelCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('fuelCollection', function (my_mmsi) {
		return fuelCollection.find({mmsi: my_mmsi});
	});
}