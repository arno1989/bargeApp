/**
 * Event to keep the dropdown menu displaying when using the form
 */
Template.addCall.events({
  'click .dropdown-toggle': function(e) {
    $('.dropdown-toggle').dropdown();
  }
});

Template.addCall.events({
	'click .dropdown-menu': function (e) {
    e.stopPropagation();
  }
});

Template.addCall.events({
'click .submit': function() {
	var myDate = $('.datepicker').val();
	var myTime = $('.timepicker').val();

	var tStamp = new Date(myDate + " " + myTime);
	console.log(tStamp.getTime());

    customCall.insert({
      location: $('.location').val(),
      timestamp: tStamp.getTime(),
      type: $('.type').val(),
      duration: $('.duration').val()
    	}
    )
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

