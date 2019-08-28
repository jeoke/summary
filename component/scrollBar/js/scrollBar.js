var scrollBar = document.getElementsByClassName('scrollBar')[0];
var contentEle = document.getElementById('modules');
var wrapper = document.getElementById('wrapper');

function client(){
	var engine = {
		opera : 0,
		ver : null
	}
	if(window.opera){
        engine.ver = window.opera.version();
        engine.opera = parseFloat(engine.ver);
	}
	return {
		engine:engine
	}
}

var wrapperW = wrapper.offsetHeight;

function initScroll(){
	var scrollBarOfHeight = scrollBar.offsetHeight;
	var contentH = contentEle.offsetHeight;
	var scrollTop = scrollBar.offsetTop;
	wrapperW = wrapperW;
    var wrapperH = wrapper.offsetHeight; 
    scrollBarHeightValue = wrapperH*wrapperH/contentH;
    if(scrollBarOfHeight && scrollBarOfHeight !== 0){
        scrollBarTopValue = scrollTop*Math.ceil(wrapperH/wrapperW*100)/100;
        if(scrollBarTopValue + scrollBarHeightValue < wrapperH){
        	scrollBar.style.height = wrapperH*wrapperH/contentH + 'px';
        	scrollBar.style.top = scrollBarTopValue + 'px';
            console.log(scrollBar.style.top)
        }else{
            scrollBar.style.height = wrapperH*wrapperH/contentH + 'px';
            scrollBar.style.top = wrapperH - scrollBar.offsetHeight + 'px';
        }
    	contentEle.style.top = '-'+scrollBar.offsetTop/wrapperH*contentH + 'px';
    	wrapperW = wrapperH;
    }else{
    	 scrollBar.style.height = wrapperH*wrapperH/contentH + 'px';
         scrollBar.style.top = 0 + 'px';
         contentEle.style.top = 0 + 'px';
    }

}
initScroll();
window.addEventListener('resize', initScroll, false);

function prescroll(wrapperH,contentH){
    if(scrollBar.offsetTop <= 10){
       scrollBar.style.top = 0 + 'px';
       contentEle.style.top = 0 + 'px';
    }else{
       scrollBar.style.top = scrollBar.offsetTop - 10 + 'px';
       contentEle.style.top = '-' + scrollBar.offsetTop/wrapperH*contentH + 'px';
    }
}

function nextScroll(wrapperH,contentH){
	if ( wrapperH-scrollBar.offsetHeight-10 <= scrollBar.offsetTop &&  scrollBar.offsetTop<= wrapperH-scrollBar.offsetHeight) {
       scrollBar.style.top = wrapperH-scrollBar.offsetHeight + 'px';
	   contentEle.style.top = '-' + (wrapperH-scrollBar.offsetHeight)/wrapperH*contentH + 'px';
	}else{
       scrollBar.style.top = parseInt(scrollBar.offsetTop) + 10 + 'px';
	   contentEle.style.top = '-' + parseInt(scrollBar.offsetTop)/wrapperH*contentH + 'px';
	}
}


function scrollContent (ele,e) {
	e.preventDefault();
	var wheelDeltaData;
	var contentH = contentEle.offsetHeight;
    var wrapperH = wrapper.offsetHeight;
	if (e.wheelDelta) {
       wheelDeltaData = (client().engine.opera && client().engine.opera>9.5)? -e.wheelDelta : e.wheelDelta;
	}else{
		wheelDeltaData = -e.detail*40;
	}

    if(wheelDeltaData > 0){
    	prescroll(wrapperH,contentH);
    }else{
    	nextScroll(wrapperH,contentH);
    }

}

var isdragging = false;
var diff;
var wrapperH;
var contentH;
var clientYValue;
var newDiff;

function dragStart(e){
	e.preventDefault()
    isdragging = true;
    clientYValue = e.clientY;
    wrapperH = wrapper.offsetHeight;
    contentH = contentEle.offsetHeight;
    diff = e.clientY - this.offsetTop;
    console.log(diff);
}

function dragging(e){
    e.preventDefault();
    if(clientYValue){
      newDiff = e.clientY - clientYValue;    	
    }
  
    if(((newDiff > 0 && this.offsetTop<=0) ||(newDiff<0 && this.offsetTop + this.offsetHeight >= wrapperH) || (this.offsetTop + this.offsetHeight < wrapperH && this.offsetTop >= 0)) && isdragging === true){
    	isdragging = true;
    }else{
    	isdragging = false;
    }
    if(newDiff<0 && this.offsetTop + this.offsetHeight >= wrapperH && isdragging){
       	this.style.top = this.offsetTop + newDiff + 'px'; 
    	console.log('c')
    	contentEle.style.top = '-' + parseInt(scrollBar.offsetTop)/wrapperH*contentH + 'px';
    }else if ( wrapperH-scrollBar.offsetHeight-10 <= scrollBar.offsetTop &&  scrollBar.offsetTop<= wrapperH-scrollBar.offsetHeight && newDiff>0) {
       scrollBar.style.top = wrapperH-scrollBar.offsetHeight + 'px';
       contentEle.style.top = '-'+Math.floor(scrollBar.offsetTop/wrapperH*contentH) + 'px';
	   console.log('a')
	}else if (isdragging) {
		console.log('b')
		if(this.offsetTop+newDiff<0){
			 this.style.top = 'px';
			 contentEle.style.top = '0px';
		}else if(this.offsetTop + newDiff + this.offsetHeight > wrapperH){
    	  this.style.top = wrapperH-scrollBar.offsetHeight + 'px'; 
          contentEle.style.top = '-'+Math.floor(scrollBar.offsetTop/wrapperH*contentH) + 'px';	
		}else{
			this.style.top = this.offsetTop+newDiff+'px';
			contentEle.style.top = '-'+Math.floor(scrollBar.offsetTop/wrapperH*contentH) + 'px';
		}
    }
    clientYValue = e.clientY;
}

function dragEnd(){
     isdragging = false;
     removeEventListener('mousedown', dragStart, false);
     removeEventListener('mousemove', dragging, false);
}
console.log(scrollBar)
document.body.addEventListener('mousewheel', scrollContent.bind(this,contentEle), false);
document.body.addEventListener('DOMMouseScroll', scrollContent.bind(this,contentEle), false);
scrollBar.addEventListener('mousedown', dragStart, false);
scrollBar.addEventListener('mousemove', dragging, false);
scrollBar.addEventListener('mouseup', dragEnd, false);
scrollBar.addEventListener('mouseleave', dragEnd, false);