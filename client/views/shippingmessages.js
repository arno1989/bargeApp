Template.shippingMessages.getMessages=function() {
	//call method to retrieve shipping messages
	Meteor.call('fetchShipMessages');
	// Return the shipping messages to view on the page
	return shipMessages.find({},{sort: {messageID: -1}});
}