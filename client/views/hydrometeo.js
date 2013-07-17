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
		layers: [osmLayer, pressureLayer]
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
	// Get tide information of location Rotterdam
	//console.log();
	Meteor.call('fetchTideInfo', 123456789 , "Rotterdam", moment().format('DD[-]MM[-]YYYY'), function(err, result){});
  return tideInformation.findOne();
}

Template.tempWindow.getWeatherInfo=function() {
	return currentWeather.findOne();
}

Template.weatherChart.rendered=function() {
	var tideData = tideInformation.findOne();
	// Get the context of the canvas element we want to select
    var ctx = document.getElementById("myChart").getContext("2d");
    try {
	    // Create the data object to pass to the chart
	    var data = {
	        labels : ["00:30","01:00","01:30","2:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00",
	        		  "06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00",
	        		  "12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00",
	        		  "18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","24:00"],
	        datasets : [
	                    {
	                        fillColor : "rgba(151,187,205,0.5)",
	                        strokeColor : "rgba(151,187,205,1)",
	                        data : tideData.tide
	                    }
	                   ]
	        };
	    // Chart options
	    var options = {
	    	bezierCurve : false
	    }

	    // Create the chart
	    new Chart(ctx).Line(data, options);
	} catch(e) {
		
	}
}