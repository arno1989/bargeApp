var savingObject;
var editingObject;
var activeRow;
var splitCounter = 0;
var prevSplitObj;
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
	// Init date-time pickers
    $('#ariveTimepicker').datetimepicker({
      language: 'pt-BR'
    });
    $('#startTimepicker').datetimepicker({
      language: 'pt-BR'
    });
    $('#departTimepicker').datetimepicker({
      language: 'pt-BR'
    });

    // Init split date-time-pickers
    for(var i=2;i<splitCounter+2;i++) {
    	var arivepickerid = '#ariveTimepicker'+parseInt(i);
    	var startpickerid = '#startTimepicker'+parseInt(i);
    	var departpickerid = '#departTimepicker'+parseInt(i);
    	$(arivepickerid).datetimepicker({
    		language: 'pt-BR'
    	});
    	$(startpickerid).datetimepicker({
    		language: 'pt-BR'
    	});
    	$(departpickerid).datetimepicker({
    		language: 'pt-BR'
    	});
    }
}

/**
** This function returns all available locations
**/
Template.logActivity.locations=function() {
	return locationsCollection.find();
}

/**
** This function returns the timestamp in a readable string
**/
Template.logActivity.getDate=function(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}

/**
** This function returns all calls from the activityCollection which are not done
**/
Template.logActivity.futureCalls=function() {
	return activityCollection.find({done: false}, {sort: {callstartdate: -1}});
}

/**
** This function checks whether a row is selected
**/
Template.logActivity.checkActive=function(data) {
	if(data._id == activeRow) {
		return "success";
	} else {
		return "active";
	}
}

/**
** Define all events for this template
**/
Template.logActivity.events({
	// Save the activity
	'click #saveAct':function(e) {
		saveActivity(savingObject);
	},
	// Move the activity to the form
	'click .moveRow':function(e) {
		savingObject = this;
		moveActivity(this);
		activeRow = this._id;
		splitCounter = 0;
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
	// Split the selected call
	'click .splitRow':function(e) {
		savingObject = this;

		// if we already clicked on a split button
		if(prevSplitObj) {
			// and it is the same as the previous
			if(this._id == prevSplitObj._id) {
				splitCounter++;
			} else {
				splitCounter = 1;
			}
		} else {
			splitCounter++;
		}
		prevSplitObj = this;
		
		// Add 
		moveActivity(this);
		activeRow = this._id;
		var origTerm = document.getElementById('terminal').selectedIndex;
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
		// Add new row to the activity form
		for(var i=0;i<splitCounter;i++) {
			addRow(origTerm);
		}
	},
	'click .remRow':function() {
		remRow();
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
	},
	'click #customActivity':function(e) {
		// Reset saving object
		savingObject = null;
		// First delete the extra table rows
		var table = document.getElementById("activityFormTable");
    	var rowCount = table.rows.length;
    	for(var i=0;i<rowCount;i++) {
    		remRow();
    	}
    	// Add custom activity information
		toggleCustomActivity();
	}
});

/**
** This function moves the data of the selected row to the form
**/
function moveActivity(data) {
	var arivePicker = $('#ariveTimepicker').data('datetimepicker');
	var departPicker = $('#departTimepicker').data('datetimepicker');

	$('#terminal').val(data.locationlabel);
	$('#via').val(data.vialabel);
	arivePicker.setDate(new Date(data.callstartdate + (2*1000*60*60)));
	departPicker.setDate(new Date(data.callenddate + (2*1000*60*60)));

	$('#unload').val(data.unload);
	$('#load').val(data.load);
	//$('#omstuw').val()
	//$('#fuel').val()
}

/**
** This function saves the data of the input form
**/
function saveActivity(data) {
	var done = true;
	var arive_timestamp = 0;
	var start_timestamp = 0;
	var end_timestamp = 0;

	var location = document.getElementById("terminal").value;
	var via = document.getElementById("via").value;
	// Calc arive timestamp
	var callarivetime = document.getElementById("ariveTime").value;
	if(callarivetime) {
		arive_timestamp = moment(callarivetime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}	
	// Calc start timestamp
	var callstarttime = document.getElementById("startTime").value;
	if(callstarttime) {
		start_timestamp = moment(callstarttime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}
	// Calc end timestamp
	var callendtime = document.getElementById("departTime").value;
	if(callendtime) {
		end_timestamp = moment(callendtime, "DD-MM-YYYY HH:mm").unix() * 1000;
	}
	
	var unload = parseInt(document.getElementById("unload").value);
	var load = parseInt(document.getElementById("load").value);
	var omstuw = parseInt(document.getElementById("omstuw").value);
	var fuel = parseInt(document.getElementById("fuel").value);
	// If one of these values isn't given set them to 0
	if(!unload) {
		unload = 0;
	}
	if(!load) {
		load = 0;
	}
	if(!omstuw) {
		omstuw = 0;
	}
	if(!fuel) {
		fuel = 0;
	}

	// Check if the call is in the future
	if(arive_timestamp > (moment().unix() * 1000)) {
		// Set done to false
		done = false;
	}

	// If the user selected an existing call
	if(data) {
		// Update selected call
		Meteor.call('updateActivity', data._id, location, via, arive_timestamp,
			start_timestamp, end_timestamp, unload, load, omstuw, fuel, done);
		// Insert extra calls if the call is splitted
		if(splitCounter > 0) {
			console.log('split!');
			// Call is split create call reference
			for(var i=2;i<splitCounter+2;i++) {
				var callref = data.callreference + ':' + parseInt(i-1);
				var owner = data.callowner;
				var uniqid = data.uniqueresourceid;

				var termid = '#terminal' + parseInt(i);
				var viaid = '#via' + parseInt(i);
				var ariveid = '#ariveTime' + parseInt(i);
				var startid = '#startTime' + parseInt(i);
				var endid = '#departTime' + parseInt(i);
				var unloadid = '#unload' + parseInt(i);
				var loadid = '#load' + parseInt(i);
				var omstuwid = '#omstuw' + parseInt(i);
				var fuelid = '#fuel' +parseInt(i);

				location = $(termid).val();
				via = $(viaid).val();
				// Calc arive timestamp
				callarivetime = $(ariveid).val();
				if(callarivetime) {
					arive_timestamp = moment(callarivetime, "DD-MM-YYYY HH:mm").unix() * 1000;
				}	
				// Calc start timestamp
				callstarttime = $(startid).val();
				if(callstarttime) {
					start_timestamp = moment(callstarttime, "DD-MM-YYYY HH:mm").unix() * 1000;
				}
				// Calc end timestamp
				callendtime = $(endid).val();
				if(callendtime) {
					end_timestamp = moment(callendtime, "DD-MM-YYYY HH:mm").unix() * 1000;
				}

				unload = $(unloadid).val();
				load = $(loadid).val();
				omstuw = $(omstuwid).val();
				fuel = $(fuelid).val();
				
				// Check if the call is in the future
				if(arive_timestamp > (moment().unix() * 1000)) {
					// Set done to false
					done = false;
				}
				
				activityCollection.insert({
					callowner: owner,
					callreference: callref,
					uniqueresourceid: uniqid,
					locationlabel: location,
					vialabel: via,
					callstartdate: arive_timestamp,
					callbegindate: start_timestamp,
					callenddate: end_timestamp,
					unload: unload,
					load: load,
					omstuw: omstuw,
					fuel: fuel,
					done: done
				});
			}
		}
	} else {
	// Else it is a custom call, create call-ref
		var user = bargeUsers.findOne({accessID: Meteor.userId()});
		if(user != null) {
			var owner = user.name;
			var uniqid = user.mmsi;
			var callref = user.mmsi + ':' + parseInt(new Date().getTime());
			// Check for special call
			if($('#customActivity').prop('checked')) {
				var callType = ($("#cusActivity option:selected").val());

				// And insert into the activityCollection
				activityCollection.insert({
					callowner: owner,
					callreference: callref,
					uniqueresourceid: uniqid,
					locationlabel: location,
					callstartdate: arive_timestamp,
					callenddate: end_timestamp,
					fuel: fuel,
					calltype: callType,
					done: done
				});
			} else {
				// And insert into the activityCollection
				activityCollection.insert({
					callowner: owner,
					callreference: callref,
					uniqueresourceid: uniqid,
					locationlabel: location,
					vialabel: via,
					callstartdate: arive_timestamp,
					callbegindate: start_timestamp,
					callenddate: end_timestamp,
					unload: unload,
					load: load,
					omstuw: omstuw,
					fuel: fuel,
					done: done
				});
			}
		}
	}

	// Remove any splitted call rows
	for(var i=0;i<splitCounter;i++) {
		remRow();
	}

	// Reset the saving object
	savingObject = null;
	activeRow = "";
	splitCounter = 0;
	
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
	// Reset session values
	Session.set("currentTerm", $('#terminal').val());
	Session.set("currentVia", $('#via').val());
	Session.set("currentArive", $('#ariveTime').val());
	Session.set("currentStart", $('#startTime').val());
	Session.set("currentDepart", $('#departTime').val());
	Session.set("currentUnload",  $('#unload').val());
	Session.set("currentLoad",  $('#load').val());
	Session.set("currentOmstuw",  $('#omstuw').val());
	Session.set("currentFuel",  $('#fuel').val());
}

function addRow(defaultTerminal) {
    // Get the table information
	var table = document.getElementById('activityFormTable');
	var id = "";
    // Append a row to the table
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    // Insert elements inside all new cells
    var cell1 = row.insertCell(0);
    var element1 = document.createElement('select');
    id = "terminal" + rowCount;
    element1.className = "form-control";
    element1.id = id;
    // Add options
    var locations = locationsCollection.find();
    locations.forEach(function (location) {
    	var newOpt = document.createElement('option');
    	newOpt.text = location.name;
    	newOpt.value = location.name;
    	element1.add(newOpt);
    });
    // Read original selected value & set to default selected
    element1.selectedIndex = defaultTerminal;
    cell1.appendChild(element1);

    var cell2 = row.insertCell(1);
    var element2 = document.createElement('select');
    id = "via" + rowCount;
    element2.className = "form-control";
    element2.id = id;
    // Add options
    var emptOpt = document.createElement('option');
	emptOpt.text = "";
	emptOpt.value = "";
	element2.add(emptOpt);

    locations = locationsCollection.find();
    locations.forEach(function (location) {
    	var newOpt = document.createElement('option');
    	newOpt.text = location.name;
    	newOpt.value = location.name;
    	element2.add(newOpt);
    });    
    cell2.appendChild(element2);

    var cell3 = row.insertCell(2);
    cell3.innerHTML = '<div id="ariveTimepicker' + parseInt(rowCount) + '" class="input-append date"><input id="ariveTime' + rowCount + '" data-format="dd-MM-yyyy hh:mm" type="text" style="font-size:10px;height:34px;width:115px"></input><span class="add-on" style="height:34px"><i data-time-icon="icon-time" data-date-icon="icon-calendar" class="icon-calendar"></i></span></div>';

    var cell4 = row.insertCell(3);
    cell4.innerHTML = '<div id="startTimepicker' + parseInt(rowCount) + '" class="input-append date"><input id="startTime' + rowCount + '" data-format="dd-MM-yyyy hh:mm" type="text" style="font-size:10px;height:34px;width:115px"></input><span class="add-on" style="height:34px"><i data-time-icon="icon-time" data-date-icon="icon-calendar" class="icon-calendar"></i></span></div>';

    var cell5 = row.insertCell(4);
    cell5.innerHTML = '<div id="departTimepicker' + parseInt(rowCount) + '" class="input-append date"><input id="departTime' + rowCount + '" data-format="dd-MM-yyyy hh:mm" type="text" style="font-size:10px;height:34px;width:115px"></input><span class="add-on" style="height:34px"><i data-time-icon="icon-time" data-date-icon="icon-calendar" class="icon-calendar"></i></span></div>';

    var cell6 = row.insertCell(5);
    cell6.innerHTML = '<input class="form-control input-sm" style="height:34px;width:50px" type="number" id="unload' + rowCount + '" placeholder="">';

    var cell7 = row.insertCell(6);
    cell7.innerHTML = '<input class="form-control input-sm" style="height:34px;width:50px" type="number" id="load' + rowCount + '" placeholder="">';

    var cell8 = row.insertCell(7);
    cell8.innerHTML = '<input class="form-control input-sm" style="height:34px;width:50px" type="number" id="omstuw' + rowCount + '" placeholder="">';

    var cell9 = row.insertCell(8);
    cell9.innerHTML = '<input class="form-control input-sm" style="height:34px;width:70px" type="number" id="fuel' + rowCount + '" placeholder="">';

    var cell10 = row.insertCell(9);
    // If last row add rem-row button
    if(rowCount == splitCounter+1) {
    	cell10.innerHTML = '<button class="remRow btn btn-default btn-xs"><i class="icon-minus-sign"></i></button>';
    }
}

function remRow() {
    // Get the table information
    var table = document.getElementById("activityFormTable");
    var rowCount = table.rows.length;

    // Delete the last row except the first one
    if(rowCount > 2) {
        table.deleteRow(rowCount-1);
    }
    // Set splitcounter
    if(splitCounter > 0) {
    	splitCounter--;
	}
	// Add remove row btn to new last row
	if(rowCount > 3) {
		var cell10 = table.rows[rowCount-2].cells[9];
		cell10.innerHTML = '<button class="remRow btn btn-default btn-xs"><i class="icon-minus-sign"></i></button>';
	}
}

function toggleCustomActivity(e) {
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
	// Reset session values
	Session.set("currentTerm", $('#terminal').val());
	Session.set("currentVia", $('#via').val());
	Session.set("currentArive", $('#ariveTime').val());
	Session.set("currentStart", $('#startTime').val());
	Session.set("currentDepart", $('#departTime').val());
	Session.set("currentUnload", $('#unload').val());
	Session.set("currentLoad", $('#load').val());
	Session.set("currentOmstuw", $('#omstuw').val());
	Session.set("currentFuel", $('#fuel').val());

	var activityContainer = document.getElementById("customActivityContainer");
	// Check if customActivity checkbox is checked
	if($('#customActivity').prop('checked')) {
		// Create select box
		var actSelect = document.createElement('select');
	    actSelect.className = "form-control";
	    actSelect.id = 'cusActivity';
	    // Add bunker option
    	var bunkerOpt = document.createElement('option');
    	bunkerOpt.text = "Bunkeren";
    	bunkerOpt.value = "bunkeren";
    	actSelect.add(bunkerOpt);
    	// Add rest option
    	var restOpt = document.createElement('option');
    	restOpt.text = "Rusten";
    	restOpt.value = "rest";
    	actSelect.add(restOpt);
    	// Add car option
    	var carOpt = document.createElement('option');
    	carOpt.text = "Auto op/af-zetten";
    	carOpt.value = "car";
    	actSelect.add(carOpt);
    	// Add select box to div
    	activityContainer.appendChild(actSelect);
    	// Deactivate
    	$('#via').prop('disabled', true);
    	$('#startTime').prop('disabled', true);
    	$('#load').prop('disabled', true);
    	$('#unload').prop('disabled', true);
    	$('#omstuw').prop('disabled', true);
	} else {
		var selectElement = document.getElementById("cusActivity");
		if(selectElement) {
			activityContainer.removeChild(selectElement);
			$('#via').prop('disabled', false);
			$('#startTime').prop('disabled', false);
    		$('#load').prop('disabled', false);
    		$('#unload').prop('disabled', false);
    		$('#omstuw').prop('disabled', false);
		}
	}
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
	Session.set("editTerm", $('#editTerminal').val());
	Session.set("editVia", $('#editVia').val());
	Session.set("editArive", $('#editAriveTime').val());
	Session.set("editStart", $('#editStartTime').val());
	Session.set("editDepart", $('#editDepartTime').val());
	Session.set("editUnload", $('#editUnload').val());
	Session.set("editLoad", $('#editLoad').val());
	Session.set("editOmstuw", $('#editOmstuw').val());
	Session.set("editFuel", $('#editFuel').val());
}


Template.logHistory.getHistory=function() {
	return activityCollection.find({done: true},{sort: {callstartdate: -1}});
}

Template.logHistory.checkType=function(data) {
	console.log(data.calltype);
	if(data.calltype == 'bunkeren') {
		return "bunkeren";
	} else if(data.calltype == 'rest') {
		return "rest";
	} else if(data.calltype == 'car') {
		return "car";
	}
}

Template.logHistory.getDate=function(timestamp) {
	if(timestamp)
	{
		return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
	}
}

function tsToStr(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}

function tsmsToStr(timestamp) {
	return moment.unix(timestamp/1000).format("DD-MM-YYYY HH:mm");
}