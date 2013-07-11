currentWeather = new Meteor.Collection('CurrentWeather');

if(Meteor.isServer){
	Meteor.publish('currentWeather', function (userMMSI) {
		return currentWeather.find({mmsi: userMMSI});
	});

	Meteor.methods({
	    updateWeather: function(my_mmsi, my_location_name, my_temp, my_windspeed) {
	    	console.log('Updating position for mmsi: ' + my_mmsi);
	    	currentWeather.update({mmsi: my_mmsi},{$set: {location: my_location_name, temperature: my_temp, windspeed: my_windspeed}});
	    }
	});
}