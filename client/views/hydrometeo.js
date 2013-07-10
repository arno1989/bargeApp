Template.hydroMeteo.rendered=function() {
	var jsonurl = "http://openweathermap.org/data/2.1/history/city/?id=524901&cnt=80";
	consone.log($.get(jsonurl));
}