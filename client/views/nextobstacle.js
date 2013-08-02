Template.nextObstacle.getNearest=function() {
	var myLat = 52.246458999999994;
	var myLng = 6.7837715;

	if(featSubHandler && featSubHandler.ready) {
		var cursor = featureCollection.find({'properties.style': "Lock"}).fetch();
		var first = featureCollection.findOne({'properties.style': "Lock"});

		var firstLng = first.geometry.coordinates[0][0][0];
		var firstLat = first.geometry.coordinates[0][0][1];

		var nearest = getDistanceFromLatLonInKm(myLat, myLng, firstLat,firstLng);
		var distance = 0;
		var lockName = "";
		cursor.forEach(function (Feature) {
			 distance = getDistanceFromLatLonInKm(myLat, myLng, Feature.geometry.coordinates[0][0][1],Feature.geometry.coordinates[0][0][0]);
			 if(distance < nearest) {
			 	nearest = distance;
			 	lockName = Feature.properties.name;
			 }
		});
		console.log('Nearest Lock: ' + lockName + ' ' + nearest + ' Km away!');
	}

}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
