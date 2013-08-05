if(Meteor.isServer) {
	Meteor.methods({
		fetchWeatherInfo: function(my_mmsi, latitude, longitude) {
			//var respJson;
			var weatherDataUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude
			+ "&lon=" + longitude + "&lang=nl&units=metric";
			console.log('My weatherURL: ' + weatherDataUrl);

			// Make async http call
			Meteor.http.get(weatherDataUrl, function(error, result) {
				if(result.statusCode==200) {
					var respJson = JSON.parse(result.content);
					console.log("response received.");
					// Check if currentWeather already exists in the collection
					var weatherCol = currentWeather.find({mmsi: my_mmsi}, {limit: 1});
					if(weatherCol.count()) {
						// Our mmsi is already known, update data
						console.log('We are known in the currentWeather collection. Updating data');
						currentWeather.update({mmsi: my_mmsi}, 
						{$set: {location: respJson.name, temperature: respJson.main.temp, windspeed: respJson.wind.speed,
								humidity: respJson.main.humidity, iconID: respJson.weather[0].icon}});
					} else {
						// Our mmsi isn't known yet, insert data
						console.log('We are not known in the currentWeather collection. Inserting data');
						currentWeather.insert({mmsi: my_mmsi, location: respJson.name, temperature: respJson.main.temp,
						windspeed: respJson.wind.speed,	humidity: respJson.main.humidity, iconID: respJson.weather[0].icon});
					}			
				} else {
					// An error occured getting the JSON data
					console.log("Response issue: ", result.statusCode);
					var errorJson = JSON.parse(result.content);
					throw new Meteor.Error(result.statusCode, errorJson.error);
				}
			});
		}
	});
}