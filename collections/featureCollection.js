featureCollection = new Meteor.Collection('FeatureCollection');

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('featureCollection', function () {
		return featureCollection.find();
	});

	Meteor.methods({
		getNearestFeature: function() {
			var myLat = 52.246458999999994;
			var myLng = 6.7837715;
			// var cursor = featureCollection.find({'geometry.coordinates': {$within: {$box: [myLng,myLat]}}});
			// console.log('COUNT: ' + cursor.count());	
		}
	});
}