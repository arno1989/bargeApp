Meteor.startup( function () {

});

/**
 * Global subscribe handlers
 */

bargeSubHandler = null;
currentposSubHandler = null;
callSubHandler = null;
cmCallSubHandler = null;
featSubHandler = null;
weatherSubHandler = null;
obstSubHandler = null; 
convSubHandler = null;

/**
 * Subscribing to datababes
 */
Template.mainContainer.getUserInfo=function() {
  Deps.autorun(function() {
    // Check if the user logged in
    Meteor.call("userCheck", function (error, userInfo) {
        if(error) {
          console.log('Error getting user information! ' + error);
        } else {
          console.log('Hoi ' + userInfo.name + ', jij hebt mmsi nr: ' + userInfo.mmsi);
          /**
           * Subscribing to collections
           */
          bargeSubHandler = Meteor.subscribe("bargeUsers", Meteor.userId());
          currentposSubHandler = Meteor.subscribe("currentPosition", userInfo.mmsi);
          cmCallSubHandler = Meteor.subscribe("customCall", userInfo.mmsi);    
          obstSubHandler = Meteor.subscribe("obstacleCollection", userInfo.mmsi);    
          Meteor.subscribe("positionLog", userInfo.mmsi);
          weatherSubHandler = Meteor.subscribe("currentWeather", userInfo.mmsi);
          Meteor.subscribe("tideInformation", userInfo.mmsi);
          callSubHandler = Meteor.subscribe("callCollection", userInfo.mmsi);
          Meteor.subscribe("locationsCollection");
          Meteor.subscribe("activityCollection", userInfo.mmsi);
          convSubHandler = Meteor.subscribe("conversationsCol", Meteor.userId());
          Meteor.subscribe("chatCollection"); 
          Meteor.subscribe("shipMessages");
          featSubHandler = Meteor.subscribe('featureCollection');
        }
      });
  });
}


/**
 * Add linking for the navigation bar.
 * These link to different Templates
 */
Meteor.Router.add({
  '/'           : 'mainWindow',
  '/kaart'      : 'fullMap',
  '/log'        : 'log',
  '/manifest'   : 'manifest',
  '/hydroMeteo' : 'hydroMeteo',
  '/chat'       : 'chatroom',
  '/profile'    : 'profile' 
});
