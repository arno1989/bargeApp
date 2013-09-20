Template.logActivity.rendered=function() {
  // Init timepicker
  $('.timepicker').timepicker({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false,
                disableFocus: false
            });
}

Template.logActivity.locations=function() {
	return locationsCollection.find();
}

Template.logActivity.events({
	// Save the activity
	'click #saveAct':function(e) {
		saveActivity();
	}
});

function saveActivity() {
	var uniqueID = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
	var location = document.getElementById("terminal").value;
	var via = document.getElementById("via").value;
	// calc arive timestamp
	var calldate = document.getElementById("ariveDate").value;
	var calltime = document.getElementById("ariveTime").value;
	var arive_timestamp = moment(calldate + " " + calltime, "YYYY-MM-DD HH:mm").unix();

	// calc start timestamp
	var callstarttime = document.getElementById("startTime").value;
	var start_timestamp = moment(calldate + " " + callstarttime, "YYYY-MM-DD HH:mm").unix();

	// calc end timestamp
	var callendtime = document.getElementById("departTime").value;
	var end_timestamp = moment(calldate + " " + callendtime, "YYYY-MM-DD HH:mm").unix();

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

Template.logHistory.getHistory=function() {
	return activityCollection.find({},{sort: {callarivetime: -1}});
}

Template.logHistory.getDate=function(timestamp) {
	return moment.unix(timestamp).format("DD-MM-YYYY");
}

Template.logHistory.getTime=function(timestamp) {
	return moment.unix(timestamp).format("HH:mm");
}