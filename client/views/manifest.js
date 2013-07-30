Template.manifest.getManiInfo=function() {
	return callCollection.findOne();
}

Template.manifest.getStartEnd=function() {
	try {
		var startDate = callCollection.find({},{sort: {callstartdate: 1}}).fetch();
		var endDate = callCollection.find({},{sort: {callenddate: -1}}).fetch();
		return {manifestStart: startDate[0].callstartdate, manifestEnd: endDate[0].callenddate};
	} catch (e) {
		// Not ready yet
	}
}

Template.manifest.convertTime=function(dateStr) {
	var date = new Date(dateStr);
	// 18:30 12-03-2013 
	var hours = date.getHours().toString();	// extract relevant info
	var min = date.getMinutes().toString();
	var day = date.getDate().toString();
	var month = (date.getMonth() + 1).toString(); // month is 0 based
	var year = date.getFullYear().toString();

	if(hours.length == 1) {
		hours = '0' + hours;
	}
	if(min.length == 1) {
		min = '0' + min;
	}
	if(day.length == 1) {
		day = '0' + day;
	}
	if(month.length == 1) {
		month = '0' + month;
	}
	return (day + '-' + month + '-' + year + '  ' + hours + ':' + min)
}

Template.plannedManifest.getManifest=function() {
	try {
		return callCollection.find({},{sort: {callstartdate: -1}}).fetch();
	} catch(e) {

	}
}

Template.plannedManifest.convertTime=function(dateStr) {
	var date = new Date(dateStr);
	// 18:30 12-03-2013 
	var hours = date.getHours().toString();	// extract relevant info
	var min = date.getMinutes().toString();
	var day = date.getDate().toString();
	var month = (date.getMonth() + 1).toString(); // month is 0 based
	var year = date.getFullYear().toString();

	if(hours.length == 1) {
		hours = '0' + hours;
	}
	if(min.length == 1) {
		min = '0' + min;
	}
	if(day.length == 1) {
		day = '0' + day;
	}
	if(month.length == 1) {
		month = '0' + month;
	}
	return (day + '-' + month + '-' + year + '  ' + hours + ':' + min)
}

