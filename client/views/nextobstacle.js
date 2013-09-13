/**
 * Meteor mongo GeoSpatial find is not yet supported therefor we calculate the distance
 **/
Template.nextObstacle.getNearest=function() {
	// Return the next obstacle
	return obstacleCollection.findOne();
}

Template.nextObstacle.getType=function(type) {
	// Return the obstacletype name
	if(type == "Lock") {
		return "Sluis";
	} else if(type == "Bridge") {
		return "Brug";
	}
}

getNearestObstacle = function() {
Deps.autorun(function() {
	if(currentposSubHandler && currentposSubHandler.ready) {
		if(featSubHandler && featSubHandler.ready) {
			if(bargeSubHandler && bargeSubHandler.ready) {
				if(obstSubHandler && obstSubHandler.ready) {
					// Get the user MMSI
					var myMMSI = bargeUsers.findOne({accessID: Meteor.userId()}).mmsi;
					// Get my latest position
					var myLat = currentPosition.findOne({mmsi: myMMSI}).latitude;
					var myLng = currentPosition.findOne({mmsi: myMMSI}).longitude;
					// Find bridges and locks
					var cursor = featureCollection.find({$or: [{'properties.style': "Lock"},{'properties.style': "Bridge"}]});
					var first = featureCollection.findOne({$or: [{'properties.style': "Lock"},{'properties.style': "Bridge"}]});
					// If bridges or locks are found
					if(cursor.count()) {
						// Init the first latitude and longitude
						var firstLng = first.geometry.coordinates[0][0][0];
						var firstLat = first.geometry.coordinates[0][0][1];
						// Init distance at 0
						var distance = 0;
						// Get the distance and info from the first found obstacle
						var nearest = getDistanceFromLatLonInKm(myLat, myLng, firstLat,firstLng);			
						var obstName = first.properties.name;
						var obstType = first.properties.style;
						// Compare the distance for each feature and save the closest one
						cursor.forEach(function (Feature) {
							distance = getDistanceFromLatLonInKm(myLat, myLng, Feature.geometry.coordinates[0][0][1],Feature.geometry.coordinates[0][0][0]);
							if(distance < nearest) {
								nearest = distance;
								obstName = Feature.properties.name;
								obstType = Feature.properties.style;
							}
						});
						// Round the distance to a 2 decimal number
						nearest = nearest.toFixed(2);
						
						// If we already exist in the collection ask the server to update the information
						if(obstacleCollection.find({mmsi: myMMSI}).count()) {
							Meteor.call('updateObstacle', myMMSI, obstName, obstType, nearest);
						} else {
							// Else insert the data into the collection
							obstacleCollection.insert({mmsi: myMMSI, obstacleName: obstName, obstacleType: obstType, distance: nearest});
						}
						// Re-render template to show the next obstacle
						$('#nextObstacle').html(Meteor.render(Template.nextObstacle));
					} // end if cursor.count()
				} // end if obstSubHandler
			} // end if bargeSubHandler
		} // end if featSubHandler
	} // end if currentposSubHandler
});
} // end function

/**
 * This function calculates the distance between 2 lat/lngs
 **/
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	// Degree to Radian funcion
 	return deg * (Math.PI/180)
}
