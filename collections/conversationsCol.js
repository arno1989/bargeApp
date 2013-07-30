conversationsCol = new Meteor.Collection("Conversations");

if(Meteor.isServer){
	// server publish the BargeUser collection
	Meteor.publish('conversationsCol', function (userID) {
		return conversationsCol.find({ $or: [{owner: userID}, {receiver: userID}, {receiver: "Global"}] }, {sort: {date: -1}});
	});
}