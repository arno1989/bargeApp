
if(Meteor.isServer) {
	Meteor.methods({
		fetchShipMessages: function() {
			console.log('>>>Getting shipmessages!');
			var anwbUrl = "http://www.anwbwatersport.nl/vaarinformatie/waterkaarten_wateralmanak_cursusboeken/scheepvaartberichten.html"
			var rssUrl = "http://www.vaarweginformatie.nl/fdd/rss?id=7236";
			var parser = new xml2js.Parser();

			var data = Meteor.http.get(anwbUrl);

			console.log(data.content.indexOf("index: " + "// Set up markers with info windows"));

			//console.log(data.content);
			//var cleanedString = data.content.replace("\ufeff", "");
			/*parser.parseString(data.content, function (err, result) {
				var jsonString = JSON.stringify(result);
				var jsonObj = JSON.parse(jsonString, function (key, value) {
					// if(value == "Bericht nr. 2013.06388.1") {
					// 	console.log('TADAA');
					// 	console.log('key/value: ' + key + value);
					// }
					if(key == "0" && value[0] == " ") {
						console.log('Bericht: ' + value);						
					}
				});
				//console.log('full' + jsonObj.rss);

			});*/

			//console.log(result);
			//console.log(JSON.stringify(result));
			//console.log('>>>RSS DATA: ' + test);
		}
	});
}