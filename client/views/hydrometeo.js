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

	//Meteor.call('fetchTideInfo', "Hengelo");
}

Template.tempWindow.getWeatherInfo=function() {
	return currentWeather.findOne();
}

Template.weatherChart.renderChart=function() {

	/** LINE CHART EXAMPLE **
	var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 7];
	var w = 400;
	var h = 200;
	var margin = 20;
	var y = d3.scale.linear().domain([0, d3.max(data)]).range([0 + margin, h - margin]);
	var x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin]);

	var vis = d3.select("body")
    	.append("svg:svg")
    	.attr("width", w)
    	.attr("height", h);
 
	var g = vis.append("svg:g")
    	.attr("transform", "translate(0, 200)");

	var line = d3.svg.line()
    	.x(function(d,i) { return x(i); })
    	.y(function(d) { return -1 * y(d); });

	g.append("svg:path").attr("d", line(data));

	g.append("svg:line")
    	.attr("x1", x(0))
    	.attr("y1", -1 * y(0))
    	.attr("x2", x(w))
    	.attr("y2", -1 * y(0));
 
	g.append("svg:line")
    	.attr("x1", x(0))
    	.attr("y1", -1 * y(0))
    	.attr("x2", x(0))
    	.attr("y2", -1 * y(d3.max(data)));

	g.selectAll(".xLabel")
	    .data(x.ticks(5))
	    .enter().append("svg:text")
	    .attr("class", "xLabel")
	    .text(String)
	    .attr("x", function(d) { return x(d) })
	    .attr("y", 0)
	    .attr("text-anchor", "middle");
 
	g.selectAll(".yLabel")
	    .data(y.ticks(4))
	    .enter().append("svg:text")
	    .attr("class", "yLabel")
	    .text(String)
	    .attr("x", 0)
	    .attr("y", function(d) { return -1 * y(d) })
	    .attr("text-anchor", "right")
	    .attr("dy", 4);

    g.selectAll(".xTicks")
	    .data(x.ticks(5))
	    .enter().append("svg:line")
	    .attr("class", "xTicks")
	    .attr("x1", function(d) { return x(d); })
	    .attr("y1", -1 * y(0))
	    .attr("x2", function(d) { return x(d); })
	    .attr("y2", -1 * y(-0.3));
 
	g.selectAll(".yTicks")
	    .data(y.ticks(4))
	    .enter().append("svg:line")
	    .attr("class", "yTicks")
	    .attr("y1", function(d) { return -1 * y(d); })
	    .attr("x1", x(-0.3))
	    .attr("y2", function(d) { return -1 * y(d); })
	    .attr("x2", x(0));
    /** END LINE CHART **/

	/** BAR CHART EXAMPLE
	var data = [4, 8, 15, 16, 23, 42];

	var chart = d3.select("Chart body").append("svg")
	     .attr("class", "chart")
	     .attr("width", 420)
	     .attr("height", 20 * data.length);

	var x = d3.scale.linear()
	     .domain([0, d3.max(data)])
	     .range([0, 420]);

    var y = d3.scale.ordinal()
    	.domain(data)
    	.rangeBands([0, 120]);

    chart.selectAll("rect")
	    .data(data)
	    .enter().append("rect")
	    .attr("y", y)
	    .attr("width", x)
	    .attr("height", y.rangeBand());

    chart.selectAll("text")
	    .data(data)
    	.enter().append("text")
    	.attr("x", x)
    	.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
    	.attr("dx", -3) // padding-right
    	.attr("dy", ".35em") // vertical-align: middle
    	.attr("text-anchor", "end") // text-align: right
    	.text(String);
    	**/
}