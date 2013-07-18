Template.chatroom.msgs=function() {
	return chatCollection.find();
}

Template.chatroom.events({
	'click .msg-send': function() {
		var msgVal = $('.msg').val();
		var user = Meteor.users.findOne();
		console.log(Meteor.users.findOne()['profile']);
		chatCollection.insert({
			action: 'zegt',
			msg: msgVal,
			owner: user.profile.name
		});
	}
});