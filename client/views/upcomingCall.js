Template.upcomingCall.getUpcomingCall=function() {
	return customCall.findOne({}, {sort: {timestamp: 1}});
}
