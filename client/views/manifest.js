Template.manifest.getManiInfo=function() {
	return callCollection.findOne();
}

Template.manifest.getStartEnd=function() {
	if(callSubHandler && callSubHandler.ready) {
		var startDate = callCollection.find({},{sort: {callstartdate: 1}}).fetch();
		var endDate = callCollection.find({},{sort: {callenddate: -1}}).fetch();
		return {manifestStart: startDate[0].callstartdate, manifestEnd: endDate[0].callenddate};
	}
}

Template.manifest.convertTime=function(dateStr) {
	return moment(dateStr).format("DD-MM-YYYY H:mm");
}

Template.plannedManifest.getManifest=function() {
	if(callSubHandler && callSubHandler.ready) {
		return callCollection.find({},{sort: {callstartdate: -1}}).fetch();
	}
}

Template.plannedManifest.convertTime=function(dateStr) {
	return moment(dateStr).format("DD-MM-YYYY H:mm");
}

