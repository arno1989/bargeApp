if (Meteor.isClient) {

  Meteor.subscribe("bargeUsers", Meteor.userId());

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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

}
