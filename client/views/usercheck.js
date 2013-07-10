if(Meteor.isClient) {
	// Call the server function userCheck.
	// This whill check if the user is a valid BargeUser
	Template.usercheck.getUserInfo=function() {
		Meteor.call("userCheck");
	}
}