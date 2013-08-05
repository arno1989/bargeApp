Template.conditionSummary.getWeatherData=function() {
	// Return the data from the weather Collection
	return currentWeather.findOne();
}