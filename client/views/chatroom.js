/**
 * Global variables only usable for chatroom.js
 **/
var showConv = false;
var chatOwner = Meteor.userId();
var chatRecv = "Global";
var msgTime = new Date();

/** 
 * Return whether the conversation should be visable
 **/
Template.chatroom.show=function() {
	return showConv;
}

/**
 * Return any started conversations
 **/
Template.conversations.getActiveConv=function() {
	return conversationsCol.find({},{sort: {date: -1}});
}

/**
 * This function return the person's name
 **/
Template.conversations.getConvName=function() {
	if(this.receiver == "Global") {
		return "Iedereen";
	} else {
		if(bargeSubHandler && bargeSubHandler.ready()) {
			if(this.owner == Meteor.userId()) {
				return bargeUsers.findOne({accessID: this.receiver}).name;
			} else {
				return bargeUsers.findOne({accessID: this.owner}).name;
			}
		}
	}	
}

/**
 * This function returns the bargeUsers to chat with
 **/
Template.conversations.getUsers=function() {
	if(bargeSubHandler && bargeSubHandler.ready()) {
		return bargeUsers.find({accessID: { $not: Meteor.userId()}});
	}
}

Template.conversations.events({
	'click .conv': function(event) {
		showConv = true;			// Show the conversation on rerender
		chatOwner = this.owner;		// Set chat owner
		chatRecv = this.receiver;	// Set the chat receiver
		$('#chatroom').html(Meteor.render(Template.chatroom)); // Rerender template
	},
	'click .newConv': function() {
		// On-click show the user list
		$('#newConvModal').modal('show');
	},
	'click .startNewConv': function() {
		// On-click start a conversation with the selected user
		$('#newConvModal').modal('hide');
		chatOwner = Meteor.userId();
		chatRecv = this.accessID;
		showConv = true;
		$('#chatroom').html(Meteor.render(Template.chatroom));
	}
});

/**
 * This function returns the person's name
 **/
Template.conversation.getConvName=function() {
	if(chatRecv == "Global") {
		return "Iedereen"
	} else {
		if(bargeSubHandler && bargeSubHandler.ready()) {
			if(chatOwner == Meteor.userId()) {
				return bargeUsers.findOne({accessID: chatRecv}).name;
			} else {
				return bargeUsers.findOne({accessID: chatOwner}).name;
			}
		}
	}
}

Template.conversation.events({
	'click .msg-send': function() {
		sendMsg();
	},
	'click .icon-trash': function() {
		// Remove the selected message
		chatCollection.remove({_id: this._id});

		// Find the latest message
		var latestMsg = chatCollection.findOne(
			{ $or: [
					{$and: [{owner: chatOwner}, {receiver: chatRecv}]},
					{$and: [{owner: chatRecv}, {receiver: chatOwner}]}
					]
			},{sort: {date: -1}});

		// Find the conversation information 
		var found = conversationsCol.findOne(
				{ $or: [
						{$and: [{owner: Meteor.userId()}, {receiver: chatRecv}]},
						{$and: [{owner: chatRecv}, {receiver: Meteor.userId()}]}
						]
				}
			);
		// Update the conversation with the previous message
		conversationsCol.update({_id: found._id}, {$set: {
			msg: latestMsg.msg,
			date: latestMsg.timestamp,
			name: latestMsg.name,
			owner: latestMsg.owner,
			receiver: latestMsg.receiver				
		}});
	},
	'keypress textarea': function(event) {
		// When shift + enter key is pressed add new line
		if(event.keyCode == 13 && event.shiftKey) {
	       var content = $('.msg').val();
	       var caret = getCaret(this);
	       this.value = content.substring(0,caret)+
	                     "\n"+content.substring(caret,content.length);
	       event.stopPropagation();
        // When the enter key is pressed, send message
		} else if(event.charCode == 13) {
        	// prevent new line
        	event.preventDefault();
        	// Send msg
        	sendMsg();
        }
    },
	'click .ret': function() {
		// Show all conversations again
		showConv = false;
		$('#chatroom').html(Meteor.render(Template.chatroom));
	}
});

/**
 * This function returns the chat messages for the current selected user
 **/
Template.chatMessages.msgs=function() {
	return chatCollection.find(
			{ $or: [
					{$and: [{owner: chatOwner}, {receiver: chatRecv}]},
					{$and: [{owner: chatRecv}, {receiver: chatOwner}]}
					]
			},{sort: {date: -1}});
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

/** 
 * This function check if the message is on a new day
 **/
Template.chatMessages.getDateBar=function(timestamp) {
	msgTime = new Date(timestamp);
	console.log('msgTime = 0 and now' + msgTime)

}

Template.chatMessages.getDelButton=function(owner) {
	if(owner == Meteor.userId()) {
		// It's our message
		return true;
	} else {
		return false;
	}
}

/**
 * This function inserts the message into the DB
 **/
function sendMsg() {
	var msgVal = $('.msg').val();
	var timestamp = new Date().getTime();
	var user = Meteor.users.findOne();
	var rcvr = $('.chatWith').val();
	if(msgVal.length > 0) {
		// Insert if message is not empty
		chatCollection.insert({
			msg: msgVal,
			date: timestamp,
			name: user.profile.name,
			owner: Meteor.userId(),
			receiver: rcvr
		});

		var exist = conversationsCol.find(
				{ $or: [{$and: [{owner: Meteor.userId()}, {receiver: rcvr}]},
						{$and: [{owner: rcvr}, {receiver: Meteor.userId()}]}
						]
				}).count();

		if( exist == 0) {
			// No active conversation yet! Insert into DB
			conversationsCol.insert({
				msg: msgVal,
				date: timestamp,
				name: user.profile.name,
				owner: Meteor.userId(),
				receiver: rcvr
			});
		} else {
			// There is already a conversation, update latest message
			var found = conversationsCol.findOne(
				{ $or: [
						{$and: [{owner: Meteor.userId()}, {receiver: rcvr}]},
						{$and: [{owner: rcvr}, {receiver: Meteor.userId()}]}
						]
				}
			);
			conversationsCol.update({_id: found._id}, {$set: {
				msg: msgVal,
				date: timestamp,
				name: user.profile.name,
				owner: Meteor.userId(),
				receiver: rcvr				
			}});
		}
	}
	// Reset the textarea
	$('.msg').val('');
}

/**
 * This function detects and inserts a new line on the textarea
 **/
function getCaret(el) {
  if (el.selectionStart) {
     return el.selectionStart;
  } else if (document.selection) {
     el.focus();

   var r = document.selection.createRange();
   if (r == null) {
    return 0;
   }

    var re = el.createTextRange(),
    rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);

    return rc.text.length;
  }  
  return 0;
}
