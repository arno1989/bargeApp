var first = new Date();

Template.manifest.getManiInfo=function() {
	// Return a call for the uniqueresourceid
	return callCollection.findOne();
}

Template.manifest.getStartEnd=function() {
	if(callSubHandler && callSubHandler.ready) {
		// Extract the start and end date from the callCollection
		var startDate = callCollection.find({},{sort: {callstartdate: 1}}).fetch();
		var endDate = callCollection.find({},{sort: {callenddate: -1}}).fetch();
		return {manifestStart: startDate[0].callstartdate, manifestEnd: endDate[0].callenddate};
	}
}

Template.manifest.convertTime=function(dateStr) {
	// Convert timestamp into readable format
	return moment(dateStr).format("DD-MM-YYYY H:mm");
}

Template.plannedManifest.getManifest=function() {
	if(callSubHandler && callSubHandler.ready) {
		// Return all calls from the callCollection
		return callCollection.find({},{sort: {callstartdate: -1}}).fetch();
	}
}

Template.plannedManifest.checkActive=function(startTime, endTime) {
	var currentTime = new Date().getTime();
	if(currentTime < endTime) {
		return true;
	} else {
		return false;
	}
}

Template.plannedManifest.convertTime=function(dateStr) {
	// Convert timestamp into readable format
	return moment(dateStr).format("DD-MM-YYYY H:mm");
}

