
 //puse()
 var video = document.getElementById("video");
video.volume = 0.3;
 function playPause(){
 	var controller = document.getElementById('control');
 	if(video.paused){
 		video.play();
 		controller.className = 'fa fa-pause';
 	}else{
 		video.pause();
 		controller.className = 'fa fa-play';
 	}
 }
 var playEl = document.getElementById("control");

 var fullP = document.getElementById("fullPage");
 function fullPage(){
 	var player = document.getElementById("player");
 	if(player.className === 'full-player'){
 		player.className = '';
 		fullP.className = 'fa fa-expand';
 	}else{
 		player.className += 'full-player';
 		fullP.className = 'fa fa-compress';
 	} 
}



var playBoolean = null;
var thumb = document.getElementById("thumb");
var sliderProgress = document.getElementById('slider-progress');
var sliderRunway = document.getElementById('slider-runWay');
 function tick(){
 	if (video.ended) {
       thumb.style.left = '100%';
       sliderRunway.style.left = '100%';
       sliderProgress.style.width = '100%';
       thumb.style.left = 0;
       sliderRunway.style.left = 0;
       sliderProgress.style.width = 0;
       video.currentTime = 0;
       playPause();
 	}else if (!video.paused) {
       var currentTime = video.currentTime;
       var duration = video.duration;
       var precent = currentTime/duration;
       thumb.style.left = (100*precent) + '%';
       sliderRunway.style.left = (100*precent) + '%';
       sliderProgress.style.width = (100*precent) + '%';
 	}
 }


 var sliderBox = document.getElementById("slider-box");
 function changePosition(e){
 	var clickPos = e.clientX;
 	var totalLeft = sliderBox.getBoundingClientRect().left;
    var playPos = clickPos - totalLeft;
    var BoxWidth = sliderBox.offsetWidth;
    var precent = playPos/BoxWidth;
    video.currentTime = precent*video.duration;
    thumb.style.left = playPos + 'px';
    sliderRunway.style.left = playPos + 'px';
    sliderProgress.style.width = playPos + 'px';
 }
 

var soundBox = document.getElementById('sound-box');
var soundProgress = document.getElementById('sound-progress');
var soundThumb = document.getElementById('sound-thumb');
var soundRunwat = document.getElementById('sound-runWay');
var volume = video.volume;
 function controlSound(e){
    var clickPos = e.clientX;
    var totalLeft = soundBox.getBoundingClientRect().left;
    var BoxWidth = soundBox.offsetWidth;
    var pos = clickPos-totalLeft;
    var precent = pos/BoxWidth;
    console.log(clickPos);
    console.log(totalLeft);
    console.log(pos);
    if(precent <=0.01){
    	video.volume = 0;
    }else if(precent >= 1){
        video.volume = 1;    	
    }else {
        video.volume = precent;
    }
    volume = video.volume;
    console.log(video.volume);
    soundThumb.style.left = pos + 'px';
    soundRunwat.style.left = pos + 'px';
    soundProgress.style.width = pos + 'px';
 }
 var sound = document.getElementById('sound');
 function muteOrSound(){
 	if(video.volume === 0){
       video.volume = volume;
       sound.className = 'fa fa-volume-up';
 	}else{
       volume = video.volume;
       video.volume = 0;
       sound.className = 'fa fa-volume-off'
 	}
 }
var dobbleSpeed = document.getElementById("DoubleSpeed");
 function speedPlay(){
 	if(video.playbackRate === 2){
 		video.playbackRate = 1;
 		dobbleSpeed.className = 'fa fa-forward';
 	}else{
        video.playbackRate = 2;
        dobbleSpeed.className = 'fa fa-backward';      
 	}
 }


 var isDragging = false;
var isBuffer = false;
function dragStart(ele,e){
  console.log(ele);
   isDragging = true;
   isBuffer = true;
   var clientX = e.clientX;
   var eleLeft = ele.getBoundingClientRect().left;
   var playPos = clientX - eleLeft;
   var precent = playPos/ele.offsetWidth;
   if(ele.id === 'slider-box'){
    video.pause();
    video.currentTime = precent*video.duration;
    thumb.style.left = playPos + 'px';
    sliderRunway.style.left = playPos + 'px';
    sliderProgress.style.width = playPos + 'px';
   }else{
    if(precent <=0.01){
      video.volume = 0;
    }else{
        video.volume = precent;     
    }
    volume = video.volume;
    if(playPos <= 0){
     soundThumb.style.left = 0 + 'px';
    soundRunwat.style.left = 0 + 'px';
    soundProgress.style.width = 0 + 'px';
    }else{
     soundThumb.style.left = playPos + 'px';
    soundRunwat.style.left = playPos + 'px';
    soundProgress.style.width = playPos + 'px';  
    }
    
   }

}

function dragging(ele,e){
  console.log(!isDragging);
  if(!isDragging){
      return;
  }else{
    console.log('a');
   var clientX = e.clientX;
   var eleLeft = ele.getBoundingClientRect().left;
   var playPos = clientX - eleLeft;
   var precent = playPos/ele.offsetWidth;
   if(ele.id === 'slider-box'){
    video.currentTime = precent*video.duration;
    thumb.style.left = playPos + 'px';
    sliderRunway.style.left = playPos + 'px';
    sliderProgress.style.width = playPos + 'px';
   }else if(ele.id === 'sound-box'){
    if(precent <=0.01){
      video.volume = 0;
    }else{
        video.volume = precent;     
    }
    volume = video.volume;
    if(playPos <= 0){
     soundThumb.style.left = 0 + 'px';
    soundRunwat.style.left = 0 + 'px';
    soundProgress.style.width = 0 + 'px';
    }else{
     soundThumb.style.left = playPos + 'px';
    soundRunwat.style.left = playPos + 'px';
    soundProgress.style.width = playPos + 'px';  
    }
   }
  }
}

function dragEnd(ele,e){
  console.log(isDragging)
  isDragging = false;
  if (!isDragging) {
    if(isBuffer){
       video.play();
    }
    return ;
  }
   ele.removeEventListener('mousedown', dragStart, false);
   ele.removeEventListener('mousemove',dragging, false);
}
soundBox.addEventListener('click', controlSound, false);
soundBox.addEventListener('mousedown', dragStart.bind(this,soundBox),false);
soundBox.addEventListener('mousemove', dragging.bind(this,soundBox), false);
soundBox.addEventListener('mouseup', dragEnd.bind(this,soundBox), false);
soundBox.addEventListener('mouseleave', dragEnd.bind(this,soundBox), false);

sliderBox.addEventListener('click', changePosition, false);
sliderBox.addEventListener('mousedown', dragStart.bind(this,sliderBox),false);
sliderBox.addEventListener('mousemove', dragging.bind(this,sliderBox), false);
sliderBox.addEventListener('mouseup', dragEnd.bind(this,sliderBox), false);
sliderBox.addEventListener('mouseleave', dragEnd.bind(this,sliderBox), false);

video.addEventListener('click', playPause, false);
video.addEventListener('timeupdate', tick, false);


playEl.addEventListener('click', playPause, false);
fullP.addEventListener("click", fullPage, false);
dobbleSpeed.addEventListener('click',speedPlay, false);
sound.addEventListener('click', muteOrSound, false);

