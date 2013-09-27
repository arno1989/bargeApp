/*****************************************/
/****		ACTIVITY TEMPLATE         ****/
/*****************************************/
Template.logActivity.rendered=function() {
	var arivePicker = $('#ariveTimepicker').data('datetimepicker');
	var startPicker = $('#startTimepicker').data('datetimepicker');
	var departPicker = $('#departTimepicker').data('datetimepicker');

	// Get session vars
	if(Session.get("currentTerm")) {
		$('#terminal').val(Session.get("currentTerm"));
	}
	if(Session.get("currentVia")) {
		$('#via').val(Session.get("currentVia"));
	}

	if(Session.get("currentArive")) {
		$('#ariveTime').val(Session.get("currentArive"));
	}
	if(Session.get("currentStart")) {
		$('#startTime').val(Session.get("currentStart"));
	}
	if(Session.get("currentDepart")) {
		$('#departTime').val(Session.get("currentDepart"));
	}

	if(Session.get("currentUnload")) {
		$('#unload').val(Session.get("currentUnload"));
	}
	if(Session.get("currentLoad")) {
		$('#load').val(Session.get("currentLoad"));
	}
	if(Session.get("currentOmstuw")) {
		$('#omstuw').val(Session.get("currentOmstuw"));
	}
	if(Session.get("currentFuel")) {
		$('#fuel').val(Session.get("currentFuel"));
	}

    $('#ariveTimepicker').datetimepicker({
      language: 'pt-BR'
    });
    $('#startTimepicker').datetimepicker({
      language: 'pt-BR'
    });
    $('#departTimepicker').datetimepicker({
      language: 'pt-BR'
    });


}

Template.logActivity.locations=function() {
	return locationsCollection.find();
}

Template.logActivity.getLastActivity=function() {
	return callCollection.findOne({callstartdate: {$lt: new Date().getTime()}},{sort: {callstartdate: -1}});
}

Template.logActivity.getDate=function(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}

Template.logActivity.futureCalls=function() {
	// Return all calls from the callCollection
	return callCollection.find({callenddate: {$gt: new Date().getTime()}},{sort: {callenddate: -1}}).fetch();
}

Template.logActivity.pastCalls=function() {
	if(callSubHandler && callSubHandler.ready) {
		// Return all calls from the callCollection
		return callCollection.find({callstartdate: {$lt: new Date().getTime()}},{sort: {callstartdate: -1}}).fetch();
	}
}

Template.logActivity.events({
	// Save the activity
	'click #saveAct':function(e) {
		console.log('saving');
		saveActivity();
	},
	'click .moveRow':function(e) {
		moveActivity(this);
		Session.set("currentTerm",  $('#terminal').val());
		Session.set("currentVia",  $('#via').val());
		Session.set("currentArive",  tsmsToStr(this.callstartdate));
		//Session.set("currentStart",  $('#date').val());
		Session.set("currentDepart",  tsmsToStr(this.callenddate));
		Session.set("currentUnload",  $('#unload').val());
		Session.set("currentLoad",  $('#load').val());
		//Session.set("currentOmstuw",  $('#omstuw').val());
		//Session.set("currentFuel",  $('#fuel').val());
	},
	'change #terminal':function(e) {
		Session.set("currentTerm",  $('#terminal').val());
	},
	'change #via':function(e) {
		Session.set("currentVia",  $('#via').val());
	},
	'change #ariveTimepicker':function(e) {
		Session.set("currentArive", $('#ariveTime').val());
	},
	'change #startTimepicker':function(e) {
		Session.set("currentStart", $('#startTime').val());
	},
	'change #departTimepicker':function(e) {
		Session.set("currentDepart", $('#departTime').val());
	},
	'change #unload':function(e) {
		Session.set("currentUnload",  $('#unload').val());
	},
	'change #load':function(e) {
		Session.set("currentLoad",  $('#load').val());
	},
	'change #omstuw':function(e) {
		Session.set("currentOmstuw",  $('#omstuw').val());
	},
	'change #fuel':function(e) {
		Session.set("currentFuel",  $('#fuel').val());
	}
});

function moveActivity(data) {
	var arivePicker = $('#ariveTimepicker').data('datetimepicker');
	var departPicker = $('#departTimepicker').data('datetimepicker');

	$('#terminal').val(data.locationlabel);
	//$('#via').val();
	arivePicker.setDate(new Date(data.callstartdate + (2*1000*60*60)));
	departPicker.setDate(new Date(data.callenddate + (2*1000*60*60)));

	$('#unload').val(data.unload);
	$('#load').val(data.load);
	//$('#omstuw').val()
	//$('#fuel').val()
}

function saveActivity() {
	console.log('test');
	var uniqueID = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
	var location = document.getElementById("terminal").value;
	var via = document.getElementById("via").value;
	// calc arive timestamp
	var callarivetime = document.getElementById("ariveTime").value;
	var arive_timestamp = moment(callarivetime, "DD-MM-YYYY HH:mm").unix();
	// calc start timestamp
	var callstarttime = document.getElementById("startTime").value;
	var start_timestamp = moment(callstarttime, "DD-MM-YYYY HH:mm").unix();

	// calc end timestamp
	var callendtime = document.getElementById("departTime").value;
	var end_timestamp = moment(callendtime, "DD-MM-YYYY HH:mm").unix();

	var unload = document.getElementById("unload").value;
	var load = document.getElementById("load").value;
	var omstuw = document.getElementById("omstuw").value;
	var fuel = document.getElementById("fuel").value;
	var activityData = "{\"uniqueresourceid\":\"" + uniqueID + "\",\"locationlabel\":\"" + location
						+ "\",\"vialabel\":\"" + via + "\",\"callarivetime\":" + arive_timestamp
						+ ",\"callstarttime\":" + start_timestamp + ",\"callendtime\":" + end_timestamp 
						+ ",\"unload\":" + unload + ",\"load\":" + load + ",\"omstuw\":" + omstuw
						+ ",\"fuel\":" + fuel + "}";
	var jsonobject = JSON.parse(activityData);

	activityCollection.insert(jsonobject);
}

/*****************************************/
/****		HISTORY  TEMPLATE         ****/
/*****************************************/
Template.logHistory.rendered=function() {
    $('#editAriveTimepicker').datetimepicker({
      language: 'pt-BR'
    });
    $('#editStartTimepicker').datetimepicker({
      language: 'pt-BR'
    });
    $('#editDepartTimepicker').datetimepicker({
      language: 'pt-BR'
    });
}

Template.logHistory.events({
	'click .editRow':function(e) {
		moveHistoryActivity(this);
		//Meteor.call("updateActivity", );
	},
	'click .saveRow':function(e) {

	}
});

Template.logHistory.locations=function() {
	return locationsCollection.find();
}

function moveHistoryActivity(data) {
	var arivePicker = $('#editAriveTimepicker').data('datetimepicker');
	var startPicker = $('#editStartTimepicker').data('datetimepicker');
	var departPicker = $('#editDepartTimepicker').data('datetimepicker');

	$('#editTerminal').val(data.locationlabel);
	$('#editVia').val(data.vialabel);

	$('#editAriveTime').val(tsToStr(data.callarivetime));
	$('#editStartTime').val(tsToStr(data.callstarttime));
	$('#editDepartTime').val(tsToStr(data.callendtime));

	$('#editUnload').val(data.unload);
	$('#editLoad').val(data.load);
	$('#editOmstuw').val(data.omstuw);
	$('#editFuel').val(data.fuel);
}


Template.logHistory.getHistory=function() {
	return activityCollection.find({},{sort: {callarivetime: -1}});
}

Template.logHistory.getDate=function(timestamp) {
	return moment.unix(timestamp).format("DD-MM-YYYY HH:mm");
}

function tsToStr(timestamp) {
	return moment.unix(timestamp).format("DD-MM-YYYY HH:mm");
}

function tsmsToStr(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}