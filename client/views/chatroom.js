/**
 * Global variables only usable for chatroom.js
 **/
var CLIENTID = Meteor.userId();
var CONVERSATION = "Global";
var CONVERSATIONTITLE = "Alle gesprekken";
var USERGROUP = new Array();
msgTime = new Date(0);

$('.msg').attr("disabled", true);

/********************************************
** Conversations -
** This is about creating and receiving 
** conversation groups.
/********************************************/

/**
 * Return any known conversations
 **/
Template.conversations.getActiveConv=function() {
	return conversationsCol.find({},{sort: {lastmessagets: -1}});
}

/**
 * This function checks the length of the last message and
 * will slice if it's to long
 **/
Template.conversations.sliceText=function(message) {
	var tmp_msg = message;
	if(tmp_msg.length > 30)
	{
		tmp_msg = tmp_msg.slice(0,30);
		tmp_msg += '...';
	}
	return tmp_msg;
}

/**
 * This function return the conversation name
 **/
Template.conversations.getConvName=function() {
	return getConversationTitle(this);
}

/**
 * This function returns the bargeUsers to chat with
 **/
Template.conversations.getUsers=function() {
	// Dont return my own ID
	return bargeUsers.find({accessID: { $not: CLIENTID}});
}

Template.conversations.events({
	'click #all': function(e) {
		CONVERSATION = "Global";
		CONVERSATIONTITLE = "Alle gesprekken";
		$('#chatroom').html(Meteor.render(Template.chatroom));
	},
	'click .conv': function(e) {
		// this = selected conversation
		CONVERSATION = this.conversationname;
		CONVERSATIONTITLE = getConversationTitle(this);
		$('#chatroom').html(Meteor.render(Template.chatroom));
	},
	'click .newConv': function(e) {
		// On-click show the user list
		$('#newConvModal').modal('show');
	},
	'click .startNewConv': function(e) {
		// On-click start a conversation with the selected user (this)
		CONVERSATIONTITLE = this.name;
		$('#newConvModal').modal('hide');
		createConversation(this);
		$('#chatroom').html(Meteor.render(Template.chatroom));
	},
	'click .newGrp':function(e) {
		// On-click show group modal
		$('#newGrpModal').modal('show');
	},
	'click .addUser':function(e) {
		// this = selected user
		modifyUserGroup(this);
	},
	'click #createGrpConv':function(e) {
		$('#newGrpModal').modal('hide');
		createConversationGroup();
		$('#chatroom').html(Meteor.render(Template.chatroom));
	}
});

function createConversation(selectedUser) {
	// Check if there is user data
	if(selectedUser) {
		// Create the 2 possible conversation names and init values
		var convName1 = CLIENTID + ':' + selectedUser.accessID;
		var convName2 = selectedUser.accessID + ':' + CLIENTID;
		var lastMsg = "";
		var lastMsgTS = 0;
		var lastMsgOwner = "";
		// Check if the conversation doesn't exist
		if(conversationsCol.find({$or: [{conversationname: convName1},{conversationname: convName2}]}).count() == 0) {
			conversationsCol.insert({
				conversationname: convName1,
				lastmessage: lastMsg,
				lastmessagets: lastMsgTS,
				lastmessageowner: lastMsgOwner,
				users: [CLIENTID, selectedUser.accessID]
			});
			console.log('created new conversation');
			// Set the global conversation name
			CONVERSATION = convName1;
		} else {
			console.log('conversation already exists');
			// The conversation does already exist, set global conversation name
			CONVERSATION = conversationsCol.findOne({$or: [{conversationname: convName1},{conversationname: convName2}]}).conversationname;
		}
	}
	console.log('conversation: ' + CONVERSATION);
}

function modifyUserGroup(userInfo) {
	// Check if the user is already added
	var index = USERGROUP.indexOf(userInfo.accessID);
	console.log(index);
	// If not add the user to the group
	if(index < 0) {
		USERGROUP[USERGROUP.length] = userInfo.accessID;
		// Add to the list view
		$("#selectedUsers").append('<li id="' + userInfo.accessID + '">' + userInfo.name + '</li>');
	} else {
		// Remove the user from the group
		USERGROUP.splice(index, 1);
		// Remove from the shown list
		var id = '#' + userInfo.accessID;
		$(id).remove();
	}
}

function createConversationGroup() {
	var groupName = $('#groupName').val();
	var timestamp = new Date().getTime();
	// Append own ID
	USERGROUP[USERGROUP.length] = CLIENTID;
	// Create json obj
	var jsonObj = {};
	jsonObj.conversationname = groupName;
	jsonObj.lastmessage = "";
	jsonObj.lastmessagets = 0;
	jsonObj.lastmessageowner = "";
	jsonObj.users = USERGROUP;

	// Check for empty values
	if(groupName != null && USERGROUP.length > 2)
	{
		// Check if the conversation doesn't exist ON GROUPNAME!
		// Need to add timestamp to groupname? (like: 'groupname|timestamp'?)
		if(conversationsCol.find({conversationname: groupName}).count() == 0) {
			conversationsCol.insert(jsonObj);
			console.log('created new group conversation');
			// Set the global conversation name
			CONVERSATION = groupName;
			CONVERSATIONTITLE = groupName;
		}
	}
}

function getConversationTitle(conversation) {
	// this = the selected conversation
	var singleConv = conversation.conversationname.split(":");
	var title;
	// Check if we can split this conversationname
	if(singleConv.length == 2) {
		// This is a conversation between 2 users
		if(singleConv[0] == CLIENTID) {
			title = bargeUsers.findOne({accessID: singleConv[1]}).name;
		} else {
			title = bargeUsers.findOne({accessID: singleConv[0]}).name;
		}
	} else {
		// This is a group conversation
		console.log('change conv for grp title');
		title = conversation.conversationname;
	}
	return title;
}

/********************************************
** Conversation -
** This is about the actual conversation
** between the users.
/********************************************/

/**
 * This function returns the person's name
 **/
Template.conversation.getConvName=function() {
	return CONVERSATIONTITLE;
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
		$('#chatroom').html(Meteor.render(Template.chatroom));
	}
});

/**
 * This function returns the chat messages for the current selected user
 **/
Template.chatMessages.msgs=function() {
	return chatCollection.find({conversation: CONVERSATION}, {sort: {timestamp: -1}});
}

Template.chatMessages.global=function() {
	console.log(CONVERSATION);
	if(CONVERSATION == "Global")
		return true;
	else
		return false;
}

/**
 * This function returns all recent messages 
 **/
Template.chatMessages.allMsgs=function() {
	var subMessages = new Array();
	var messages = new Array();
	// Find all my conversations
	var myConversations = conversationsCol.find({},{sort: {lastmessagets: -1}}).fetch();
	for(var i=0;i<myConversations.length;i++)
	{
		subMessages[subMessages.length] = chatCollection.find({conversation: myConversations[i].conversationname},{sort: {timestamp: -1}}).fetch();
	}
	// Go through all the messages in my conversations and add them to an array
	for(var i=0;i<subMessages.length;i++) {
		for(var j=0;j<subMessages[i].length;j++) {
			messages[messages.length] = subMessages[i][j];
		}
	}
	// Sort all the messages on timestamp - descending
	messages.sort(function (a,b){return b.timestamp - a.timestamp});
	// Return only the recent 30
	if(messages.length > 30)
	{
		messages.splice(30, messages.length);
	}
	return messages;
}

Template.chatMessages.groupTitle=function(conversation) {
	var singleConv = conversation.split(":");
	var title;
	// Check if we can split this conversationname
	if(singleConv.length == 2) {
		// This is a conversation between 2 users
		if(singleConv[0] == CLIENTID) {
			title = bargeUsers.findOne({accessID: singleConv[1]}).name;
		} else {
			title = bargeUsers.findOne({accessID: singleConv[0]}).name;
		}
	} else {
		// This is a group conversation
		title = conversation;
	}
	return title;
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
	// Init message values
	var msgVal = $('.msg').val();
	var timestamp = new Date().getTime();
	var clientInfo = Meteor.users.findOne();
	// If there is user information
	if(clientInfo != null)
	{
		// If there is actually something to send
		if(msgVal.length > 0) {
			// Insert the message into the collection
			chatCollection.insert({
				conversation: CONVERSATION,
				message: msgVal,
				timestamp: timestamp,
				owner: clientInfo.profile.name
			});
			// Update the conversation in the collection
			var currentConv = conversationsCol.findOne({conversationname: CONVERSATION})._id;
			conversationsCol.update({_id: currentConv}, {$set: {lastmessage: msgVal, lastmessagets: timestamp, lastmessageowner: clientInfo.profile.name}})
		}
	} else {
		console.log('error: no user information')
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
