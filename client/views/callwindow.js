/**
 * Event to toggle the dropdown menu
 */
Template.addCall.events({
  'click .dropdown-toggle': function(e) {
    $('.dropdown-toggle').dropdown();
  }
});

/**
 * Event to keep the dropdown menu displaying when using the form
 */
Template.addCall.events({
	'click .dropdown-menu': function (e) {
    e.stopPropagation();
  }
});

/**
 * This event is executed when the submit button is clicked.
 * The form values will be inserted into the database
 */
 /*
Template.addCallForm.events({
  'click .submit': function() {
    Meteor.call("userCheck", function (error, userInfo) {
      if(error) {
        console.log('addCallForm failed to retrieve userInfo!' + error);
      } else {
        var my_mmsi = userInfo.mmsi;
        var currentTime = new Date();
        var myDate = $('.datepicker').val();
        var myTime = $('.timepicker').val();
        var tStamp = new Date(myDate + " " + myTime);
        // Check if given time is in the future
        if(currentTime.getTime() < tStamp.getTime()) {
          console.log('Time is in the future');
          customCall.insert({
            callowner: my_mmsi,
            callreference: " ",
            callstartdate: 0,
            locationlabel: $('.location').val(),
            callenddate: 0,
            uniqueresourceid: my_mmsi,
            calltype: " ",
            load: 0,
            unload: 0
          });
          // Time is in the future and is allowed to be inserted
          customCall.insert({
          mmsi: my_mmsi,
          location: $('.location').val(),
          timestamp: tStamp.getTime(),
          type: $('.type').val(),
          duration: $('.duration').val()
          });
        }else{
          console.log('Time is in the past!');
        }
      }      
    });
  }    
});

Template.timePicker.rendered=function() {
  return $('#timepicker1').timepicker({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false,
                disableFocus: false
            });
}

Template.datePicker.rendered=function() {
  return $('.datepicker').datepicker();
}
*/
