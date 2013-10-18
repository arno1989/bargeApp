/**
 * Global variables only usable for chatroom.js
 **/
var showConv = false;
var chatOwner = Meteor.userId();
var chatRecv = "Global";
var msgTime = new Date(0);

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
		// Dont return my own ID
		return bargeUsers.find({accessID: { $not: Meteor.userId()}});
	}
}

Template.conversations.events({
	'click .conv': function(event) {
		console.log(this);
		showConv = true;			// Show the conversation on rerender
		/*** check the users ***/
		// If the owner is me
		if(this.owner == Meteor.userId()) {
			chatOwner = this.owner;		// Set chat owner
			chatRecv = this.receiver;	// Set the chat receiver
		} else if(this.receiver == Meteor.userId()) {
			chatOwner = this.receiver;
			chatRecv = this.owner;
		}
		/*** ***/
		console.log('owner: ' + chatOwner + ' Recv: ' + chatRecv);
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
	if(chatRecv == "Global") {
		return chatCollection.find({receiver: chatRecv},{sort: {date: -1}});
	} else {
		return chatCollection.find(
				{ $or: [
						{$and: [{owner: chatOwner}, {receiver: chatRecv}]},
						{$and: [{owner: chatRecv}, {receiver: chatOwner}]}
						]
				},{sort: {date: -1}});
	}
}

Template.chatMessages.passTime=function(timestamp) {
	// Convert timestamp to readable time: 18:30
	return moment(timestamp).format('H:mm');
}

Template.chatMessages.today=function() {
	// Return the date of today
	return moment().format('DD MMM YYYY');
}

/** 
 * This function check if the message is on a new day
 **/
Template.chatMessages.dateBarCheck=function(timestamp) {
	var day = msgTime.getDate();
	var month = msgTime.getMonth()+1;
	var year = msgTime.getFullYear();
	msgTime = new Date(timestamp);
	currentTime = new Date();

	if(msgTime.getFullYear() < year || msgTime.getFullYear() > year) {
		return true;
	} else if(msgTime.getMonth()+1 < month || msgTime.getMonth()+1 > month) {
		return true;
	} else if(msgTime.getDate() < day || msgTime.getDate() > day) {
		return true;
	} else {
		return false;
	}
}

Template.chatMessages.getDateBar=function(timestamp) {
	return moment(timestamp).format('DD MMM YYYY');
}

/**
 * This function inserts the message into the DB
 **/
function sendMsg() {
	var msgVal = $('.msg').val();
	var timestamp = new Date().getTime();
	var user = Meteor.users.findOne();
	if(msgVal.length > 0) {
		// Insert if message is not empty
		chatCollection.insert({
			msg: msgVal,
			date: timestamp,
			name: user.profile.name,
			owner: Meteor.userId(),
			receiver: chatRecv
		});
		// Check if this conversation already exists
		console.log('Receiver is: ' + chatRecv);
		var exist;
		if(chatRecv == "Global") {
			exist = conversationsCol.find({receiver: chatRecv},{sort: {date: -1}});
		} else {
			exist = conversationsCol.find(
					{ $or: [{$and: [{owner: Meteor.userId()}, {receiver: chatRecv}]},
							{$and: [{owner: chatRecv}, {receiver: Meteor.userId()}]}
							]
					}).count();
		}
		if(exist == 0) {
			// No active conversation yet! Insert into DB
			conversationsCol.insert({
				msg: msgVal,
				date: timestamp,
				name: user.profile.name,
				owner: Meteor.userId(),
				receiver: chatRecv
			});
		} else {
			// There is already a conversation, update latest message
			var found;
			if(chatRecv == "Global") {
				found = conversationsCol.findOne({receiver: chatRecv});
			} else {
				found = conversationsCol.findOne(
					{ $or: [
							{$and: [{owner: Meteor.userId()}, {receiver: chatRecv}]},
							{$and: [{owner: chatRecv}, {receiver: Meteor.userId()}]}
							]
					}
				);
			}
			console.log(found);
			conversationsCol.update({_id: found._id}, {$set: {
				msg: msgVal,
				date: timestamp,
				name: user.profile.name,
				owner: Meteor.userId(),
				receiver: chatRecv				
			}});
		}
	}
	// Reset the textarea
	$('.msg').val('');
	msgTime = new Date(0);
	$('#messContainer').html(Meteor.render(Template.chatMessages));
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
