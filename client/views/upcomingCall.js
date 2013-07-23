var cntr = 0;

Template.upcomingCall.rendered=function() {
	//Meteor.setInterval(Template.upcomingCall.getLetter, 5000);
	//Meteor.autorun(Template.upcomingCall.getUpcomingCall);
}

Template.upcomingCall.getUpcomingCall=function() {
	// Get the next call by getting the the first result after the current time
	var curTime = moment().unix()*1000;
	var custom = customCall.findOne({callstartdate: {$gt: curTime}}, {sort: {callstartdate: 1}});
	var planned = callCollection.findOne({callstartdate: {$gt: curTime}}, {sort: {callstartdate: 1}});

	try {
		// Check if a call is found & if both found check which one is the first to come
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
	}catch(e){}
}

/**
 * Return a readable date in format dd/mm/yyyy 
 */
Template.upcomingCall.stampToReadableDate=function(timestamp) {
	var readableTime =  new Date(timestamp);
	var date = readableTime.getDate();
	var month = readableTime.getMonth() + 1; // Months are 0 based
	var year = readableTime.getFullYear();
	
	date = date.toString();// Convert date into string
	if(date.length == 1) { // If date < 10
		date = '0' + date; // Prepend the data with a '0'
	}
	month = month.toString();// Convert month into string
	if(month.length == 1) {  // If month < 10
		month = '0' + month; // Prepend the month with a '0'
	}
	return (date + "-" + month + "-" + year);
}

/**
 * Returns a readable time in format hh:mm from timestamp
 */
Template.upcomingCall.stampToReadableTime=function(timestamp) {
	var readableTime =  new Date(timestamp);
	var hour = readableTime.getHours();
	var minutes = readableTime.getMinutes();

	minutes = minutes.toString(); // Convert minutes into string
	if(minutes.length == 1) {     // If minutes < 10
		minutes = '0' + minutes;  // Prepend the minutes with a '0'
	}
	return (hour + ":" + minutes);
}
