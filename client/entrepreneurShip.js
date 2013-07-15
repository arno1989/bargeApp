USERMMSI = 0;

Meteor.startup( function () {
  Meteor.call("userCheck", function (error, userInfo) {
    if(error) {
      console.log('Error getting user information! ' + error);
    } else {
      console.log('Hoi ' + userInfo.name + ', jij hebt mmsi nr: ' + userInfo.mmsi);
      USERMMSI = userInfo.mmsi;
      /**
       * Subscribing to datababes
       */
      Meteor.subscribe("bargeUsers", Meteor.userId());
      Meteor.subscribe("customCall", userInfo.mmsi);
      Meteor.subscribe("currentPosition", userInfo.mmsi);
      Meteor.subscribe("currentWeather", userInfo.mmsi);
      Meteor.subscribe("tideInformation", userInfo.mmsi);
    }
  });
})

if (Meteor.isClient) {

  /**
   * Add linking for the navigation bar.
   * These link to different Templates
   */
  Meteor.Router.add({
    '/'           : 'mainWindow',
    '/kaart'      : 'fullMap',
    '/brandstof'  : 'brandstof',
    '/manifest'   : 'manifest',
    '/hydroMeteo' : 'hydroMeteo'
  });

  //Meteor.Router.extend({});
}
