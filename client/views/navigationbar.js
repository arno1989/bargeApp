Template.navigationbar.active=function(path) {
	var isActive;
	if(path == window.location.pathname) {
		isActive = "active";
	} else {
		isActive = "";
	}
	console.log('window loc: ' + window.location.pathname);
	console.log('path: ' + path);
	console.log('active:' + isActive);
	return isActive;
}