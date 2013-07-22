Template.shippingMessages.events({
	'click .refresh': function(e) {
		Meteor.call('fetchShipMessages');
	}
});

Template.shippingMessages.getMessages=function() {
	//call method
	Meteor.call('fetchShipMessages');
	return shipMessages.find({},{sort: {messageID: -1}});
}