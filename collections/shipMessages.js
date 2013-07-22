shipMessages = new Meteor.Collection("ShipMessages");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('shipMessages', function () {
		return shipMessages.find(); // alleen mijn mmsi er nog in bouwen
	});
}