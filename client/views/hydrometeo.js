Template.hydroMeteo.getWeatherData=function() {
	// get current location from mongo
	// Get json data with weatherinformation from openweathermap
	var myPosition = currentPosition.find().fetch();
	try {
		// If we got a position
		// Get weather information 
		Meteor.call('fetchWeatherInfo',myPosition[0].latitude, myPosition[0].longitude ,function(err, respJson) {
		if(err) {
			console.log('FETCH ERROR!');
		} else {
			console.log('FETCH SUCCES');
			console.log(respJson.name);
		}
	});
	} catch(e) {
		//console.log('Couldnt fetch my position: ' + e);
	}

	


	/*$.getJSON( "api.openweathermap.org/data/2.5/weather?q=London,uk") */
}