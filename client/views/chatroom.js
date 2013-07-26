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
	if(rcvr == "Global") {
		return chatCollection.find({receiver: rcvr},{sort: {date: -1}});
	}else{
		return chatCollection.find(
				{ $or: [
						{$and: [{owner: Meteor.userId()}, {receiver: rcvr}]},
						{$and: [{owner: rcvr}, {receiver: Meteor.userId()}]}
						]
				});
	}

	//return chatCollection.find({$or: [{owner: Meteor.userId()}, {receiver: Meteor.userId()}] });
	//return chatCollection.find({owner: Meteor.userId(), receiver: rcvr},{sort: {date: -1}});
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

Template.chatMessages.getDelButton=function(owner) {
	if(owner == Meteor.userId()) {
		// It's our message
		return true;
	} else {
		return false;
	}
}


Template.chatroom.events({
	'click .msg-send': function() {
		sendMsg();
	},
	'click .icon-trash': function() {
		chatCollection.remove({_id: this._id});
	},
	'keypress textarea': function(event) {
		if(event.keyCode == 13 && event.shiftKey) {
	       var content = $('.msg').val();
	       var caret = getCaret(this);
	       this.value = content.substring(0,caret)+
	                     "\n"+content.substring(caret,content.length);
	       event.stopPropagation();
		} else if(event.charCode == 13) {
        	// prevent new line
        	event.preventDefault();
        	// Send msg
        	sendMsg();
        }
    },
	'change .chatWith': function() {
		var rcvr = $('.chatWith').val();
		if(rcvr == null) {
			rcvr = "Global"
		}
		$('#messContainer').html(Meteor.render(Template.chatMessages));
	}
});

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
	}
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

Template.conversations.getActiveConv=function() {
	//chatCollection.find({});
}

