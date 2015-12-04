window.onload = function(){
	var elems = Array.prototype.slice.call(document.getElementsByTagName("li"));
	elems.map(function(elem){
		if(elem.getAttribute("value")){
			elem.addEventListener("click", createAddPeriodEventListener(elem.getAttribute("value")));
		}
	});
	document.getElementById("reset")
		.addEventListener("click", createRemovePeriodEventListener());
};

function createAddPeriodEventListener(period){
	return createEventListener(function(url){
		return addPeriod(url, period);
	})
}

function createRemovePeriodEventListener(){
	return createEventListener(function(url){
		return removePeriod(url);
	})
}

function createEventListener(urlConvertFunc){
	return function(){
		chrome.tabs.getSelected(null, function(tab){
			if(isGoogleSearch(tab.url)){
				var url = urlConvertFunc(tab.url);
				chrome.tabs.update(tab.id, {url: url});
			}
			window.close();
		});
	}
}

function addPeriod(currentUrl, period){
	return removePeriod(currentUrl) + "&tbs=qdr:" + period;
}

function removePeriod(currentUrl){
	var splited = currentUrl.split("?");
	var noparam = splited[0];
	var params = splited[1].split("&");
	params = params.filter(function(s){
		return !s.startsWith("tbs=");
	})
	return noparam+"?"+params.join("&");
}

function isGoogleSearch(url){
	return (
		url.includes("google") &&
		(url.includes("search?") || url.includes("webhp?"))
	);
}
