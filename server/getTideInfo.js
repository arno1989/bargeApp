String.prototype.replaceAll = function(str1, str2, ignore)
{
   return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), str2);
};


if(Meteor.isServer) {
	Meteor.methods({
		fetchTideInfo: function(my_mmsi, my_location, my_date) {
			console.log('fetchTideInfo CALLED!');
			var tideDataUrl = "http://live.getij.nl/export.cfm?format=txt&from=" + my_date + "&to=" + my_date + "&uitvoer=1&interval=30&lunarphase=yes&location=ROTTDM&Timezone=MET_DST&refPlane=NAP&graphRefPlane=NAP&bottom=0&keel=0";
			console.log('Getting tide INFO!');
			// replace date format
			my_date = my_date.replaceAll('-', '/');
			// calling sync http get
			var data = Meteor.http.get(tideDataUrl);
			try {
				//remove first 324 chars
				var tideInfo = data.content.slice(324,data.content.length-54);
				// remove all dates
				tideInfo = tideInfo.replaceAll(my_date,'');
				// remove all 'cm'
				tideInfo = tideInfo.replaceAll('cm','');
				// remove all spaces
				tideInfo = tideInfo.replaceAll(' ','');
				// split on line endings
				tideInfo = tideInfo.split('\n');
				// remove all times
				for(var i=0;i<tideInfo.length;i++) {
					tideInfo[i] = tideInfo[i].slice(5,tideInfo[i].length);
				}
				// Check if we already exists in the tideInformation collection
				var tideInfoCnt = tideInformation.find({mmsi: my_mmsi},{limit: 1});
				if(tideInfoCnt.count()) {
					console.log('We are known already in the tideInformation collection, UPDATE');
					tideInformation.update({mmsi: my_mmsi}, {$set: {location: my_location, date: my_date,tide: tideInfo}});
				} else {
					console.log('We are not known yet in the tideInformation collection, INSERT');
					tideInformation.insert({mmsi: my_mmsi, location: my_location, date: my_date, tide: tideInfo});
				}
			} catch (e) {
				console.log('Fetching tide info error!: ' + e);
			}
		} // end of fetchTideInfo
	}); // end of Methods
}
	