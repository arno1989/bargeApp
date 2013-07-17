if(Meteor.isClient) {
	// Planned call time format: Jul 11 2013 07:30:00 GMT-0000

	Template.upcomingCall.getUpcomingCall=function() {
		var currentTime = new Date;
		var timeString = moment().format('MMM DD YYYY HH:mm:ss [GMT-0000]');
		// Get the next call by getting the the first result after the current time
		var custom = customCall.findOne({timestamp: {$gt: currentTime.getTime()}}, {sort: {timestamp: 1}});
		/*var plannedCall = callCollection.findOne({trackNum: "0", start: $gt: timeString},{sort: {start: 1}});
		console.log(plannedCall);
		// Check which call is first
		try {
			var customTime = new Date(custom.timestamp);
			//var plannedTime = new Date(plannedCall.start);
		} catch(e) {

		}*/
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
		return (date + "/" + month + "/" + year);
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
}
