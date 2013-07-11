Template.conditionSummary.getTemp=function() {
	var TempValue = "N/A";
	var myPosition = curr

	/*var message = "hoi";
	Meteor.call('asyncJob', message, function(err, result) {
        if (typeof console !== 'undefined')
          console.log(message);
    });*/
	

	try {
		// If we got a position, Get weather info
		// Call function is async!
		Meteor.call('fetchWeatherInfo',myPosition[0].latitude, myPosition[0].longitude ,function(err, respJson) {
			if(err) {
				console.log('Weer niet beschikbaar');
				TempValue = "Niet beschikbaar";
				console.log('TempValue err: ' + TempValue);
			} else {
				//console.log(respJson.main.temp.toString());
				TempValue = respJson.main.temp;
				console.log('TempValue suc: ' + TempValue);
			}
		});
	} catch(e) {
		//console.log('Couldnt fetch my position: ' + e);
	}
	console.log('TempValue ret: ' + TempValue);
	return TempValue; // Returning the wrong value
}