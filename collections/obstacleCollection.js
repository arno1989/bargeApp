obstacleCollection = new Meteor.Collection("ObstacleCollection");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('obstacleCollection', function (my_mmsi) {
		return obstacleCollection.find({mmsi: my_mmsi});
	});

	Meteor.methods({
		updateObstacle: function(my_mmsi, obstName, obstType, distance) {
			obstacleCollection.update({mmsi: my_mmsi}, {$set: {obstacleName: obstName, obstacleType: obstType, distance: distance}});
		}
	});
}