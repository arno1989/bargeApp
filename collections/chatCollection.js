chatCollection = new Meteor.Collection("ChatCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('chatCollection', function () {
		return chatCollection.find({});
	});
}