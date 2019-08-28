function changeBackground(title){
	var link = document.getElementsByTagName("link");
	for(var i=0,length = link.length;i<length;i++){
		if (link[i].getAttribute("rel").indexOf("style") !== -1) {
		   link[i].disabled = true;
		}
		if (link[i].getAttribute("title").indexOf(title) !== -1) {
			link[i].disabled = false;
		}
	}
}