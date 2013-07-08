// Users.find({}, {fields: {firstname: 1, lastname: 1}})
//Item.find().sort('_id','descending').limit(15).find(function(err, doc) {
//    client.send(JSON.stringify(doc));
//  });


Template.upcomingCall.getUpcomingCall=function() {
	return customCall.findOne({}, {sort: {time: 'a'}});
// Aphorisms.find({}, {sort: {date_created: -1}});
}