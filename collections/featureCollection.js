featureCollection = new Meteor.Collection('FeatureCollection');

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('featureCollection', function () {
		return featureCollection.find();
	});
}