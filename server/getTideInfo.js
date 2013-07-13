//var fs = require('fs');
//var xml2js = require('xml2js');

if(Meteor.isServer) {
	Meteor.methods({
		fetchTideInfo: function(location) {

			var tideDataUrl = "http://live.getij.nl/export.cfm?format=xml&from=12-07-2013&to=14-07-2013&uitvoer=2&interval=10&lunarphase=yes&location=DORDT&Timezone=MET_DST&refPlane=NAP&graphRefPlane=NAP&bottom=0&keel=0";

			// Make async http call
			Meteor.http.get(tideDataUrl, function(error, result) {
				console.log('GET tide information response succes!');
				if(result.statusCode==200) {
					var parser = new xml2js.Parser();
					    parser.parseString(result.content, function (err, jsonResult) {
					        console.log('Done');
					        console.log(jsonResult);
					        //var respJson = JSON.parse(jsonResult);
					        //console.log(respJson.location);
					    });
				} else {
					// An error occured getting the JSON data
					console.log("Response issue: ", result.statusCode);
					throw new Meteor.Error(result.statusCode, errorJson.error);
				}
			});
		}
	});
}
	