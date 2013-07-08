if (Meteor.isClient) {
  /**
   * Add linking for the navigation bar.
   * These link to different Templates
   */
  Meteor.Router.add({
    '/'           : 'start',
    '/kaart'      : 'kaart',
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
