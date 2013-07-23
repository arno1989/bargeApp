positionLog = new Meteor.Collection('PositionLog');

if(Meteor.isServer){
	Meteor.publish('positionLog', function (userMMSI) {
		return positionLog.find({mmsi: userMMSI});
	});
}