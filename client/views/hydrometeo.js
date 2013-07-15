Template.weatherMap.rendered=function() {
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
	var osmLayer = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

	var cloudLayer = L.tileLayer('http://{s}.tile.openweathermap.org/map/clouds_cls/{z}/{x}/{y}.png', {
	  	maxZoom: 18
	});//.addTo(map);

	var rainLayer = L.tileLayer('http://{s}.tile.openweathermap.org/map/rain_cls/{z}/{x}/{y}.png', {
	  	maxZoom: 18
	});

	var windLayer = L.tileLayer('http://{s}.tile.openweathermap.org/map/wind/{z}/{x}/{y}.png', {
	  	maxZoom: 18
	});

	var pressureLayer = L.tileLayer('http://{s}.tile.openweathermap.org/map/pressure_cntr/{z}/{x}/{y}.png', {
	  	maxZoom: 18
	});


	var map = new L.Map('map', {
		center: new L.LatLng(52, 5),
		zoom: 7,
		layers: [osmLayer, rainLayer]
	});

	var baseMaps = {
		"Standaard": osmLayer
	};

	var overlayMaps = {
	    "Wolken": cloudLayer,
	    "Regen": rainLayer,
	    "Wind": windLayer,
	    "Druk, zee niveau": pressureLayer
	};

	L.control.layers(baseMaps, overlayMaps).addTo(map);
}

Template.weatherChart.getijden=function() {
	// Get tide information of location
	Meteor.call('fetchTideInfo', 123456789 , "Rotterdam", "15-07-2013", function(err, result){});
  return tideInformation.findOne();
}

Template.tempWindow.getWeatherInfo=function() {
	return currentWeather.findOne();
}

Template.weatherChart.renderChart=function() {


}