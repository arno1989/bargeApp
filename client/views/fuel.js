Template.fuel.rendered=function() {
    // Hide the alert message when this page is loaded
    $('.alert').hide();
}

Template.fuel.events({
    // Hide the alert message when 'close' is clicked
    'click .close': function() {
        $('.alert').hide();
    }
});

Template.fuelInput.events({
    // Add a row to the table
	'click .addRow': function() {
		addRow();
	},
    // Remove last row from table
    'click .remRow':function() {
        remRow();
    },
    // First check the input values, then insert
	'click .addFuelList': function() {
		inputCheck();
	}
}); 

function addRow() {
    // Get the table information
	var table = document.getElementById("fuelFormTable");
	var id = "";
    // Append a row to the table
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    // Insert elements inside all new cells
    var cell1 = row.insertCell(0);
    var element1 = document.createElement("input");
    id = "termName" + rowCount;
    element1.type = "text";
    element1.id = id;
    element1.placeholder="Terminal";
    cell1.appendChild(element1);

    var cell2 = row.insertCell(1);
    var element2 = document.createElement("input");
    id = "arriveDate" + rowCount;
    element2.type = "text";
    element2.id = id;
    element2.placeholder="00-00";
    cell2.appendChild(element2);

    var cell3 = row.insertCell(2);
    var element3 = document.createElement("input");
    id = "arriveTime" + rowCount;
    element3.type = "text";
    element3.id = id;
    element3.placeholder="00:00";
    cell3.appendChild(element3);

    var cell4 = row.insertCell(3);
    var element4 = document.createElement("input");
    id = "startTime" + rowCount;
    element4.type = "text";
    element4.id = id;
    element4.placeholder="00:00";
    cell4.appendChild(element4);

    var cell5 = row.insertCell(4);
    var element5 = document.createElement("input");
    id = "departTime" + rowCount;
    element5.type = "text";
    element5.id = id;
    element5.placeholder="00:00";
    cell5.appendChild(element5);

    var cell6 = row.insertCell(5);
    var element6 = document.createElement("input");
    id = "20Feet" + rowCount;
    element6.type = "number";
    element6.id = id;
    element6.placeholder="0";
    cell6.appendChild(element6);

    var cell7 = row.insertCell(6);
    var element7 = document.createElement("input");
    id = "40Feet" + rowCount;
    element7.type = "number";
    element7.id = id;
    element7.placeholder="0";
    cell7.appendChild(element7);

    var cell8 = row.insertCell(7);
    var element8 = document.createElement("input");
    id = "45Feet" + rowCount;
    element8.type = "number";
    element8.id = id;
    element8.placeholder="0";
    cell8.appendChild(element8);

    var cell9 = row.insertCell(8);
    var element9 = document.createElement("input");
    id = "teu" + rowCount;
    element9.type = "number";
    element9.id = id;
    element9.placeholder="0";
    cell9.appendChild(element9);

    var cell10 = row.insertCell(9);
    var element10 = document.createElement("input");
    id = "omstuw" + rowCount;
    element10.type = "number";
    element10.id = id;
    element10.placeholder="0";
    cell10.appendChild(element10);

    var cell11 = row.insertCell(10);
    var element11 = document.createElement("input");
    id = "gasoil" + rowCount;
    element11.type = "number";
    element11.id = id;
    element11.placeholder="0";
    cell11.appendChild(element11);
}

function remRow() {
    // Get the table information
    var table = document.getElementById("fuelFormTable");
    var rowCount = table.rows.length;
    // Delete the last row except the first one
    if(rowCount > 2) {
        table.deleteRow(rowCount-1);
    }
}

function inputCheck() {
    // Init the pass var on true. This is set to false when false input is given
    var pass = true;
    // Set the wanted input format for time and date
    var timeCheck = new RegExp("^[0-9]{2}:[0-9]{2}$","i");
    var dateCheck = new RegExp("^[0-9]{2}-[0-9]{2}$","i");
    // Sets the alert class to color red and add error message
    $('.alert').attr("class","alert alert-danger");
    $('#alertTitle').text("Foutieve invoer!");
    // Get the table information
    var table = document.getElementById("fuelFormTable");
    var rowCount = table.rows.length;
    // Go through every row/cell and check it's input value
    for(var i=1; i<rowCount; i++) {
        console.log('checking input!');
        var term = "termName" + i;
        var ariveD = "arriveDate" + i;
        var ariveT = "arriveTime" + i;
        var startT = "startTime" + i;
        var departT = "departTime" + i;
        var Ft20 = "20Feet" + i;
        var Ft40 = "40Feet" + i;
        var Ft45 = "45Feet" + i;
        var teu = "teu" + i;
        var omst = "omstuw" + i;
        var gasoil = "gasoil" + i;

        var termVal = document.getElementById(term).value;
        var ariveDVal = document.getElementById(ariveD).value;
        var ariveTVal = document.getElementById(ariveT).value;
        var startTVal = document.getElementById(startT).value;
        var departTVal = document.getElementById(departT).value;
        var Ft20Val = document.getElementById(Ft20).value;
        var Ft40Val = document.getElementById(Ft40).value;
        var Ft45Val = document.getElementById(Ft45).value;
        var teuVal = document.getElementById(teu).value;
        var omstVal = document.getElementById(omst).value;
        var gasoilVal = document.getElementById(gasoil).value;

        if(termVal.length == 0) {
            pass = false;
            $('#alertMsg').text("Terminal naam niet ingevoerd.");
            $('.alert').show();
        }
        if(ariveDVal.length == 0 || !dateCheck.test(ariveDVal)) {
            $('#alertMsg').text("Foutieve aankomstdatum ingevuld.");
            $('.alert').show();
            pass = false;
        }
        if(ariveTVal.length == 0 || !timeCheck.test(ariveTVal)) {
            $('#alertMsg').text("Foutieve aankomsttijd ingvuld.");
            $('.alert').show();
            pass = false;
        }
        if(startTVal.length == 0 || !timeCheck.test(startTVal)) {
            $('#alertMsg').text("Foutieve aanvangtijd ingevuld.");
            $('.alert').show();
            pass = false;
        }
        if(departTVal.length == 0 || !timeCheck.test(departTVal)) {
            $('#alertMsg').text("Foutieve vertrektijd ingevuld.");
            $('.alert').show();
            pass = false;
        }
        if(Ft20Val.length == 0 || isNaN(Ft20Val)) {
            $('#alertMsg').text("20\" invoerveld is leeg of is geen nummer.");
            $('.alert').show();
            pass = false;
        }
        if(Ft40Val.length == 0 || isNaN(Ft40Val)) {
            $('#alertMsg').text("40\" invoerveld is leeg of is geen nummer.");
            $('.alert').show();
            pass = false;
        }
        if(Ft45Val.length == 0 || isNaN(Ft45Val)) {
            $('#alertMsg').text("45\" invoerveld is leeg of is geen nummer.");
            $('.alert').show();
            pass = false;
        }
        if(teuVal.length == 0 || isNaN(teuVal)) {
            $('#alertMsg').text("Teu invoerveld is leeg of is geen nummer.");
            $('.alert').show();
            pass = false;
        }
        if(omstVal.length == 0 || isNaN(omstVal)) {
            $('#alertMsg').text("Omstuw invoerveld is leeg of is geen nummer.");
            $('.alert').show();
            pass = false;
        }
        if(gasoilVal.length == 0 || isNaN(gasoilVal)) {
            $('#alertMsg').text("Gasoliestand invoerveld is leeg of is geen nummer.");
            $('.alert').show();
            pass = false;
        }
    }
    if(pass) {
        // all input values are correct, save data
        saveFuelForm();
    } else {
        // Invalid input
    }
}

function saveFuelForm() {
    if(bargeSubHandler && bargeSubHandler.ready()) {
    	var table = document.getElementById("fuelFormTable");
        var rowCount = table.rows.length;
        // Get the MMSI & Timestamp of input
    	var mmsi = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
    	var timestamp = new Date().getTime();
        // Create a JSON string from the given values
    	var fuelData = "{\"mmsi\": " + "\"" + mmsi + "\"" + ', ';
    	fuelData = fuelData.concat("\"date\": " + timestamp + ', ');
    	fuelData = fuelData.concat("\"data\": [{");

    	for(var i=1; i<rowCount; i++) {
    		// Get data from the inputs
    		var term = "termName" + i;
    		var ariveD = "arriveDate" + i;
    		var ariveT = "arriveTime" + i;
    		var startT = "startTime" + i;
    		var departT = "departTime" + i;
    		var Ft20 = "20Feet" + i;
    		var Ft40 = "40Feet" + i;
    		var Ft45 = "45Feet" + i;
    		var teu = "teu" + i;
    		var omst = "omstuw" + i;
    		var gasoil = "gasoil" + i;

    		fuelData = fuelData.concat("\"terminal\": " + "\"" + document.getElementById(term).value + "\"" + ', ');
    		fuelData = fuelData.concat("\"ariveDate\": " + "\"" +  document.getElementById(ariveD).value + "\"" + ', ');
    		fuelData = fuelData.concat("\"ariveTime\": " + "\"" + document.getElementById(ariveT).value + "\"" + ', ');
    		fuelData = fuelData.concat("\"startTime\": " + "\"" + document.getElementById(startT).value + "\"" + ', ');
    		fuelData = fuelData.concat("\"departTime\": " + "\"" + document.getElementById(departT).value + "\"" + ', ');
    		fuelData = fuelData.concat("\"20Feet\": " + document.getElementById(Ft20).value + ', ');
    		fuelData = fuelData.concat("\"40Feet\": " + document.getElementById(Ft40).value + ', ');
    		fuelData = fuelData.concat("\"45Feet\": " + document.getElementById(Ft45).value + ', ');
    		fuelData = fuelData.concat("\"teu\": " + document.getElementById(teu).value + ', ');
    		fuelData = fuelData.concat("\"omstuw\": " + document.getElementById(omst).value + ', ');
    		fuelData = fuelData.concat("\"gasoil\": " + document.getElementById(gasoil).value);

    		if(i!=rowCount-1) {
    			fuelData = fuelData.concat("},{");
    		} else {
    			fuelData = fuelData.concat("}]");
    		}
    	}
    	fuelData = fuelData.concat("}");
        // Create a JSON object from the string
    	var jsonobject = JSON.parse(fuelData);
        // Insert the data into the collection
        console.log('Inserting fuel data into collection!');
        // Change the alert class to color green and add success text
        $('.alert').attr("class","alert alert-success");
        $('#alertTitle').text("Invoer geslaagd!");
        $('#alertMsg').text("Brandstof formulier is opgeslagen.");
        $('.alert').show();
        // Insert the data into the collection
    	fuelCollection.insert(jsonobject);
    }
}

/**
 * FuelHistory Template Helpers
 **/
Template.fuelHistory.getFuelHistory=function() {
    // Return all data from the fuelCollection
	return fuelCollection.find({},{sort: {date: -1}});
}

Template.fuelHistory.getLastTerm=function(data) {
    // Return the last terminal name from the data array
    return data[data.length-1].terminal;
}

Template.fuelHistory.convertTime=function(timestamp) {
    // Convert timestamp to readable date
	return moment(timestamp).format("DD MMM YYYY");
}

Template.fuelHistory.total20=function(data) {
    // Return the sum of all 20 Feets
    var total = 0;
    for(var i=0; i<data.length; i++) {
        total += data[i]['20Feet'];
    }
    return total;
}

Template.fuelHistory.total40=function(data) {
    // Return the sum of all 40 Feets
    var total = 0;
    for(var i=0; i<data.length; i++) {
        total += data[i]['40Feet'];
    }
    return total;
}

Template.fuelHistory.total45=function(data) {
    // Return the sum of all 45 Feets
   var total = 0;
    for(var i=0; i<data.length; i++) {
        total += data[i]['45Feet'];
    }
    return total; 
}

Template.fuelHistory.totalTeu=function(data) {
    // Return the sum of all teu's
    var total = 0;
    for(var i=0; i<data.length; i++) {
        total += data[i]['teu'];
    }
    return total;    
}

Template.fuelHistory.totalOmstuw=function(data) {
    // Return the sum of all Omstuw's
    var total = 0;
    for(var i=0; i<data.length; i++) {
        total += data[i]['omstuw'];
    }
    return total;    
}