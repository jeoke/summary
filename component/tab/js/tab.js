function go_tab(x) {
	var h = document.getElementsByTagName("h3");
	var d = document.getElementById("tab").getElementsByTagName("div");
	for(var i=0;i<h.length;i++){
		if(x-1 === i){
			h[i].className += 'up';
			d[i].className += 'block';
		}else{
			h[i].className = "";
			d[i].className = "";
		}
	}
}