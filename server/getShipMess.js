
if(Meteor.isServer) {
	Meteor.methods({
		fetchShipMessages: function() {
			var rssUrl = "http://www.vaarweginformatie.nl/fdd/rss?id=7236";
			var parser = new xml2js.Parser();
			// Get information from rss feed
			var data = Meteor.http.get(rssUrl);
			var messID = "";
			var message = "";
			// Parse xml
			parser.parseString(data.content, function (err, result) {
				// Build a JSON string from result
				var jsonString = JSON.stringify(result);
				// Convert JSON string into JSON objects
				var jsonObj = JSON.parse(jsonString, function (key, value) {

					value = value.toString();
					var indexMessID = value.indexOf("Bericht nr.");
					var indexMess = value.indexOf("<u style");

					if(indexMessID == 0) {
						// Found a message ID, save it
						messID = value;
					}
					if(indexMess == 1) {
						// Found a message, save it
						message = value;
					}

					if(messID.length > 0 && message.length > 0) {
						// Both messageID and message have been found
						if(shipMessages.find().count() < 21) {
							// There are less then 20 messages in the DB, insert message
							shipMessages.insert({
								messageID: messID,
								shipmessage: message 
							});
						} else {
							// There are 20 messages in the DB, Update oldest message
							// First check if the message already exists in the DB
							if(shipMessages.find({messageID: messID}).count() == 0) {
								console.log('A new ship message had been found!');
								// The message doesn't exist yet so we can find the oldest message
								var cursor = shipMessages.findOne({},{sort: {messageID: 1}});
								// Update the oldest message with new information
								shipMessages.update({messageID: cursor.messageID},{$set: {messageID: messID, shipmessage: message}});
							} else {
								//console.log('Ship message does exist already');
							}
						}
						// Reset values
						messID = "";
						message = "";
					} // end if(messID && Message length)
				});	// end JSON parse		
			}); // end parser
		} // end fetchShipMessages
	}); // end Meteor methods
}