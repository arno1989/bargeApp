Template.shippingMessages.getMessages=function() {
	//call method
	Meteor.call('fetchShipMessages');
}