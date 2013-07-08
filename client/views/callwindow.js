/**
 * Event to keep the dropdown menu displaying when using the form
 */

Template.addCall.events({
	'click .dropdown-menu': function (e) {
    e.stopPropagation();
  }
});

Template.addCall.events({
'click .submit': function() {
    /*customCall.insert({
      location: $('.location').val(),
      date: $('.datepicker').val(),
      time: $('.timepicker').val(),
      type: $('.type').val(),
      duration: $('.duration').val()
    	}
    )*/


	var myDate = $('.datepicker').val();
	var myTime = $('.timepicker').val();

	myDate=myDate.split("/");
	myTime=myTime.split(":");

	var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
	//var myDate = $('.datepicker').val();
	//console.log(new Date(newDate).getTime());

	var d = new Date();
	var n = d.getTime();
	console.log(d);
	console.log(n);
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

