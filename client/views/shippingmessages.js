Meteor.startup( function () {
	getShipMessages();
});

/*******************************************/
/** Get shipping messages every 5 minutes **/
/*******************************************/
Meteor.setInterval(getShipMessages, 300000);

function getShipMessages(){
	console.log('getting new ship messages');
	//call method to retrieve shipping messages
	Meteor.call('fetchShipMessages', function(){
		// Got new messages! Need to re-render template
		$('#shippingMsg').html(Meteor.render(Template.shippingMessages));
	});
}

Template.shippingMessages.getMessages=function() {
	// Return the shipping messages to view on the page
	return shipMessages.find({},{sort: {messageID: -1}});
}