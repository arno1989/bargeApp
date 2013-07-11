currentPosition = new Meteor.Collection('CurrentPosition');

if(Meteor.isServer){
	Meteor.publish('currentPosition', function (userMMSI) {
		return currentPosition.find({mmsi: userMMSI});
	});

	Meteor.methods({
	    updatePosition: function(my_mmsi, my_latitude, my_longitude, my_timestamp) {
	    	console.log('Updating position for mmsi: ' + my_mmsi);
	    	currentPosition.update({mmsi: my_mmsi},{$set: {latitude: my_latitude, longitude: my_longitude, timestamp: my_timestamp}});
	    }
	});
}