
Meteor.startup( function () {

  
});

/**
 * Global subscribe handlers
 */

 bargeSubHandler = null;
 currentposSubHandler = null;


/**
 * Subscribing to datababes
 */
Deps.autorun(function() {
  // Check if the user logged in
  Meteor.call("userCheck", function (error, userInfo) {
      if(error) {
        console.log('Error getting user information! ' + error);
      } else {
        console.log('Hoi ' + userInfo.name + ', jij hebt mmsi nr: ' + userInfo.mmsi);
        /**
         * Subscribing to datababes
         */
        bargeSubHandler = Meteor.subscribe("bargeUsers", Meteor.userId());
        currentposSubHandler = Meteor.subscribe("currentPosition", userInfo.mmsi);
        Meteor.subscribe("customCall", userInfo.mmsi);        
        Meteor.subscribe("positionLog", userInfo.mmsi);
        Meteor.subscribe("currentWeather", userInfo.mmsi);
        Meteor.subscribe("tideInformation", userInfo.mmsi);
        Meteor.subscribe("callCollection", userInfo.mmsi);
        Meteor.subscribe("fuelCollection", userInfo.mmsi);
        Meteor.subscribe("conversationsCol", Meteor.userId());
        Meteor.subscribe("chatCollection"); 
        Meteor.subscribe("shipMessages");
      }
    });
});


/**
 * Add linking for the navigation bar.
 * These link to different Templates
 */
Meteor.Router.add({
  '/'           : 'mainWindow',
  '/kaart'      : 'fullMap',
  '/brandstof'  : 'fuel',
  '/manifest'   : 'manifest',
  '/hydroMeteo' : 'hydroMeteo',
  '/chat'       : 'chatroom',
  '/profile'    : 'profile' 
});
