Template.manifest.getManiInfo=function() {
	return manifestInfo.findOne();
}

Template.manifest.getStartEnd=function() {
	try {
		var startDate = callCollection.find({},{sort: {start: 1}}).fetch();
		var endDate = callCollection.find({},{sort: {end: -1}}).fetch();
		return {manifestStart: startDate[0].start, manifestEnd: endDate[0].end};
	} catch (e) {
		// Not ready yet
	}
}

Template.plannedManifest.getManifest=function() {
	try {
		return callCollection.find({trackNum: "0"},{sort: {start: -1}}).fetch();
	} catch(e) {

	}
}

