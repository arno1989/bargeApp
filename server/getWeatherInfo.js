var Future = Npm.require("fibers/future")

if(Meteor.isServer) {
	Meteor.methods({
		fetchWeatherInfo: function(latitude, longitude) {
			//var respJson;
			var weatherDataUrl = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude
			+ "&lon=" + longitude + "&lang=nl&units=metric";
			console.log('My URL: ' + weatherDataUrl);

			// Set up a future
			var fut = new Future();

			// A callback so the job can signal completion
			//var onComplete = fut.resolver();

			// Make async http call
			Meteor.http.get(weatherDataUrl, function(error, result) {
				if(result.statusCode==200) {
					var respJson = JSON.parse(result.content);
					console.log("response received.");
					console.log('The Temp is: ' + respJson.main.temp);
					fut.ret(respJson);
					//return respJson;
				} else {
					console.log("Response issue: ", result.statusCode);
					var errorJson = JSON.parse(result.content);
					throw new Meteor.Error(result.statusCode, errorJson.error);
				}
				//onComplete(error, respJson);
			});
			// Wait for the future to complete
			//Future.wait(fut);

			// and grab the results out.
    		//console.log('done waiting: ' + respJson.main.temp);
    		return fut.wait();

			//synchronous GET
			/*var result = Meteor.http.get(weatherDataUrl, {timeout:30000});
			if(result.statusCode==200) {
				var respJson = JSON.parse(result.content);
				console.log("response received.");
				return respJson;
			} else {
				console.log("Response issue: ", result.statusCode);
				var errorJson = JSON.parse(result.content);
				throw new Meteor.Error(result.statusCode, errorJson.error);
			}*/
		}
	});
	/*
	Meteor.methods({
		asyncJob: function(message) {
      
	      // Setup a future
	      var fut = new Future();

	      // This should work for any async method
	      setTimeout(function() {

	        // Return the results
	        fut.ret(message + " (delayed for 3 seconds)");

	      }, 3 * 1000);

	      // Wait for async to finish before returning
	      // the result
	      fut.wait();
	      console.log(message);
	      return fut.wait();
	    }
	});
	*/
}