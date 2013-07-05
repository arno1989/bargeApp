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

  Template.addCall.events({
    'click .submit': function() {
      customCall.insert(
        {callname: $('.callName').val(),
        callduration: $('.callDuration').val()}
      )
    }
  });
  

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

}
