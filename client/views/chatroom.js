Template.chatroom.getUsers=function() {
	if(bargeSubHandler && bargeSubHandler.ready()) {
		return bargeUsers.find({accessID: { $not: Meteor.userId()}});
	}
}

Template.chatMessages.msgs=function() {
	var rcvr = $('.chatWith').val();
	if(rcvr == null) {
		rcvr = "Global"
	}
	return chatCollection.find({owner: Meteor.userId(), receiver: rcvr},{sort: {date: -1}});
}

Template.chatMessages.passTime=function(timestamp) {
	// Convert timestamp to readable time: 18:30
	var time = new Date(timestamp);
	var hours = time.getHours(); // get hours
	var min = time.getMinutes(); // get minutes
	hours = hours.toString();	 // convert to string
	if(hours.length == 1) {
		hours = '0' + hours;	 // prepend '0' if length = 1
	}
	min = min.toString();
	if(min.length == 1) {
		min = '0' + min;
	}
	return hours + ':' + min;
}


Template.chatMessages.events({
	'click .msg-send': function() {
		var msgVal = $('.msg').val();
		var timestamp = new Date().getTime();
		var user = Meteor.users.findOne();
		var rcvr = $('.chatWith').val();
		chatCollection.insert({
			msg: msgVal,
			date: timestamp,
			name: user.profile.name,
			owner: Meteor.userId(),
			receiver: rcvr
		});
		$('.msg').val('');
	}
});

Template.chatroom.events({
	'change .chatWith': function() {
		var rcvr = $('.chatWith').val();
		if(rcvr == null) {
			rcvr = "Global"
		}
		//console.log(rcvr);
		//MSGS = chatCollection.find({owner: Meteor.userId(), receiver: rcvr},{sort: {date: -1}});
		//Template.chatMessages.msgs();
		//$('#messContainer').html(Meteor.render(Template.chatMessages));
	}
});
