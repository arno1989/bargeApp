/**
 * Check upcoming call every 10 seconds and rerender the template
 * to show the next upcoming call
 **/
Meteor.setInterval(function() {
	Template.upcomingCall.getUpcomingCall();
	$('#nextCall').html(Meteor.render(Template.upcomingCall));
},10000);

Template.upcomingCall.getUpcomingCall=function() {
	if(cmCallSubHandler && cmCallSubHandler.ready) {
		if(callSubHandler && callSubHandler) {
			// Get the next call by getting the the first result after the current time
			var curTime = moment().unix()*1000;
			var custom = customCall.findOne({callstartdate: {$gt: curTime}}, {sort: {callstartdate: 1}});
			var planned = callCollection.findOne({callstartdate: {$gt: curTime}}, {sort: {callstartdate: 1}});

			// Check if a call is found & if both found, check which one is the first to come
			if(custom != null && planned != null) {
				if(custom.callstartdate < planned.callstartdate) {
					// Custom call is first to come
					return custom;
				} else {
					// Planned call is first to come
					return planned;
				}
			} else if(planned != null) {
				// Only planned is found
				return planned;
			} else if(custom != null) {
				// Only custom is found
				return custom;
			} // Else return nothing		
		}
	}
}

/**
 * Return a readable date in format dd-mm-yyyy 
 */
Template.upcomingCall.stampToReadableDate=function(timestamp) {
	return moment(timestamp).format("DD[-]MM[-]YYYY");
}

/**
 * Returns a readable time in format hh:mm from timestamp
 */
Template.upcomingCall.stampToReadableTime=function(timestamp) {
	return moment(timestamp).format("H:mm");
}
