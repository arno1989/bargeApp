currentPosition = new Meteor.Collection('CurrentPosition');

if(Meteor.isServer){
	Meteor.publish('currentPosition', function (userMMSI) {
		return currentPosition.find();
	});

	Meteor.methods({
	    updatePosition: function(my_mmsi, my_latitude, my_longitude, my_heading, my_speed, my_timestamp) {
	    	console.log('Updating position for mmsi: ' + my_mmsi);
	    	currentPosition.update({mmsi: my_mmsi},{$set: {latitude: my_latitude, longitude: my_longitude, heading: my_heading, speed: my_speed, timestamp: my_timestamp}});
	    }
	});
}