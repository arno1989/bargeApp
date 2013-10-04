var savingObject;
var editingObject;
var activeRow;
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

Template.logActivity.getDate=function(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}

Template.logActivity.futureCalls=function() {
	// Return all calls from the activityCollection which are not done
	return activityCollection.find({done: false});
}

Template.logActivity.checkActive=function(data) {
	if(data._id == activeRow) {
		return "success";
	} else {
		return "active";
	}
}

Template.logActivity.events({
	// Save the activity
	'click #saveAct':function(e) {
		saveActivity(savingObject);
	},
	'click .moveRow':function(e) {
		savingObject = this;
		moveActivity(this);
		activeRow = this._id;
		Session.set("currentTerm",  $('#terminal').val());
		Session.set("currentVia",  $('#via').val());
		Session.set("currentArive",  tsmsToStr(this.callstartdate));
		//Session.set("currentStart",  $('#date').val());
		Session.set("currentDepart",  tsmsToStr(this.callenddate));
		Session.set("currentUnload",  $('#unload').val());
		Session.set("currentLoad",  $('#load').val());
		//Session.set("currentOmstuw",  $('#omstuw').val());
		//Session.set("currentFuel",  $('#fuel').val());

		// Re-render
		$('#activeContainer').html(Meteor.render(Template.logActivity));
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

function saveActivity(data) {
	var done = true;
	var arive_timestamp = 0;
	var start_timestamp = 0;
	var end_timestamp = 0;

	//var uniqueID = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
	var location = document.getElementById("terminal").value;
	var via = document.getElementById("via").value;
	// calc arive timestamp
	var callarivetime = document.getElementById("ariveTime").value;
	if(callarivetime) {
		arive_timestamp = moment(callarivetime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}	
	// calc start timestamp
	var callstarttime = document.getElementById("startTime").value;
	if(callstarttime) {
		start_timestamp = moment(callstarttime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}
	// calc end timestamp
	var callendtime = document.getElementById("departTime").value;
	if(callendtime) {
		end_timestamp = moment(callendtime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}
	
	var unload = document.getElementById("unload").value;
	var load = document.getElementById("load").value;
	var omstuw = document.getElementById("omstuw").value;
	var fuel = document.getElementById("fuel").value;

	// Reset input values
	$('#terminal').val('');
	$('#via').val('');

	$('#ariveTime').val('');
	$('#startTime').val('');
	$('#departTime').val('');

	$('#unload').val('');
	$('#load').val('');
	$('#omstuw').val('');
	$('#fuel').val('');

	// If the user selected an existing call
	if(data) {
		Meteor.call('updateActivity', data._id, location, via, arive_timestamp,
			start_timestamp, end_timestamp, unload, load, omstuw, fuel, done);
	}
	// Else it is a custom call


	/* --> Could be used for custom calls <--
	var activityData = "{\"uniqueresourceid\":\"" + uniqueID + "\",\"locationlabel\":\"" + location
						+ "\",\"vialabel\":\"" + via + "\",\"callarivetime\":" + arive_timestamp
						+ ",\"callstarttime\":" + start_timestamp + ",\"callendtime\":" + end_timestamp 
						+ ",\"unload\":" + unload + ",\"load\":" + load + ",\"omstuw\":" + omstuw
						+ ",\"fuel\":" + fuel + ",\"done\":" + done "}";
	var jsonobject = JSON.parse(activityData);*/

	// Reset the saving object
	savingObject = null;
	activeRow = "";
	// Reset session values
	Session.set("editTerm",  $('#editTerminal').val());
	Session.set("editVia",  $('#editVia').val());
	Session.set("editArive",  $('#editAriveTime').val());
	Session.set("editStart",  $('#editStartTime').val());
	Session.set("editDepart",  $('#editDepartTime').val());
	Session.set("editUnload",  $('#editUnload').val());
	Session.set("editLoad",  $('#editLoad').val());
	Session.set("editOmstuw",  $('#editOmstuw').val());
	Session.set("editFuel",  $('#editFuel').val());
}

/*****************************************/
/****		HISTORY  TEMPLATE         ****/
/*****************************************/
Template.logHistory.rendered=function() {
	// Get session vars
	if(Session.get("editTerm")) {
		$('#editTerminal').val(Session.get("editTerm"));
	}
	if(Session.get("editVia")) {
		$('#editVia').val(Session.get("editVia"));
	}

	if(Session.get("editArive")) {
		$('#editAriveTime').val(Session.get("editArive"));
	}
	if(Session.get("editStart")) {
		$('#editStartTime').val(Session.get("editStart"));
	}
	if(Session.get("editDepart")) {
		$('#editDepartTime').val(Session.get("editDepart"));
	}

	if(Session.get("editUnload")) {
		$('#editUnload').val(Session.get("editUnload"));
	}
	if(Session.get("editLoad")) {
		$('#editLoad').val(Session.get("editLoad"));
	}
	if(Session.get("editOmstuw")) {
		$('#editOmstuw').val(Session.get("editOmstuw"));
	}
	if(Session.get("editFuel")) {
		$('#editFuel').val(Session.get("editFuel"));
	}

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
		editingObject = this;
		activeRow = this._id;
		moveHistoryActivity(this);
		// Re-render
		$('#historyContainer').html(Meteor.render(Template.logHistory));
	},
	'click .saveRow':function(e) {
		editHistoryActivity(editingObject);
	}
});

Template.logHistory.locations=function() {
	return locationsCollection.find();
}

function moveHistoryActivity(data) {
	var arivePicker = $('#editAriveTimepicker').data('datetimepicker');
	var startPicker = $('#editStartTimepicker').data('datetimepicker');
	var departPicker = $('#editDepartTimepicker').data('datetimepicker');
	// Set the input values
	$('#editTerminal').val(data.locationlabel);
	$('#editVia').val(data.vialabel);
	$('#editAriveTime').val(tsToStr(data.callstartdate));
	$('#editStartTime').val(tsToStr(data.callbegindate));
	$('#editDepartTime').val(tsToStr(data.callenddate));
	$('#editUnload').val(data.unload);
	$('#editLoad').val(data.load);
	$('#editOmstuw').val(data.omstuw);
	$('#editFuel').val(data.fuel);
	// Save the session values
	Session.set("editTerm",  $('#editTerminal').val());
	Session.set("editVia",  $('#editVia').val());
	Session.set("editArive",  $('#editAriveTime').val());
	Session.set("editStart",  $('#editStartTime').val());
	Session.set("editDepart",  $('#editDepartTime').val());
	Session.set("editUnload",  $('#editUnload').val());
	Session.set("editLoad",  $('#editLoad').val());
	Session.set("editOmstuw",  $('#editOmstuw').val());
	Session.set("editFuel",  $('#editFuel').val());
}

function editHistoryActivity(data) {
	var done = true;
	var arive_timestamp = 0;
	var start_timestamp = 0;
	var end_timestamp = 0;

	//var uniqueID = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
	var location = $('#editTerminal').val();
	var via = $('#editVia').val();
	// calc arive timestamp
	var callarivetime = $('#editAriveTime').val();
	if(callarivetime) {
		arive_timestamp = moment(callarivetime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}	
	// calc start timestamp
	var callstarttime = $('#editStartTime').val();
	if(callstarttime) {
		start_timestamp = moment(callstarttime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}
	// calc end timestamp
	var callendtime = $('#editDepartTime').val();
	if(callendtime) {
		end_timestamp = moment(callendtime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}
	
	var unload = $('#editUnload').val();
	var load = $('#editLoad').val();
	var omstuw = $('#editOmstuw').val();
	var fuel = $('#editFuel').val();
	// Reset input values
	$('#editTerminal').val('');
	$('#editVia').val('');
	$('#editAriveTime').val('');
	$('#editStartTime').val('');
	$('#editDepartTime').val('');
	$('#editUnload').val('');
	$('#editLoad').val('');
	$('#editOmstuw').val('');
	$('#editFuel').val('');

	// If the user selected an existing call
	if(data) {
		Meteor.call('updateActivity', data._id, location, via, arive_timestamp,
			start_timestamp, end_timestamp, unload, load, omstuw, fuel, done);
	}
	// Else it is a custom call

	// Reset the editing object
	editingObject = null;
	activeRow = "";
	// Reset session values
	Session.set("editTerm",  $('#editTerminal').val());
	Session.set("editVia",  $('#editVia').val());
	Session.set("editArive",  $('#editAriveTime').val());
	Session.set("editStart",  $('#editStartTime').val());
	Session.set("editDepart",  $('#editDepartTime').val());
	Session.set("editUnload",  $('#editUnload').val());
	Session.set("editLoad",  $('#editLoad').val());
	Session.set("editOmstuw",  $('#editOmstuw').val());
	Session.set("editFuel",  $('#editFuel').val());
}


Template.logHistory.getHistory=function() {
	return activityCollection.find({done: true},{sort: {callstartdate: -1}});
}

Template.logHistory.checkActive=function(data) {
	if(data._id == activeRow) {
		return "success";
	} else {
		return "active";
	}	
}

Template.logHistory.getDate=function(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}

function tsToStr(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}

function tsmsToStr(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}