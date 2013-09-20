locationsCollection = new Meteor.Collection("LocationsCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('locationsCollection', function () {
		return locationsCollection.find({"name": {$gt: ""}});
	});
}