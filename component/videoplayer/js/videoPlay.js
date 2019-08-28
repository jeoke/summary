(function(window,undefined){


  function Video(){
  	this.videoSetting = {
         poster : './poster.jpg',
         src : './video/saySomething.mp4',
         type: 'video/mp4'
  	};
    this.init = function(domArr,classArr,idArr){
    	this.__proto__.domData = util.createDomTree(domArr,classArr,idArr);
    	var domData = this.__proto__.domData;
    	this.__proto__.video = domData[1]['video'];
    	var video = domData[1]['video'];
    	this.__proto__.volume = video.volume = 0.3;
        var fragments = util.LoadDomTree(domData[0]);
        document.getElementById('player').appendChild(fragments);
        video.poster = this.videoSetting.poster;
        video.src = this.videoSetting.src;
        video.type = this.videoSetting.type; 
        video.volume = 0.3;
        domData[1]['time-data'].innerHTML = util.formateTime(0) + '/' + util.formateTime(NaN);
        var progressFn = new Progress();
        var controlFn = new Control();
        util.addHandler(domData[1]['sound-box'],{
        	'click' : controlFn.controlSound,
        	'mousedown' : progressFn.dragStart.bind(this,domData[1]['sound-box']),
        	'mousemove' : progressFn.dragging.bind(this,domData[1]['sound-box']),
        	'mouseup' : progressFn.dragEnd.bind(this,domData[1]['sound-box']),
            'mouseleave' : progressFn.dragEnd.bind(this,domData[1]['sound-box'])
        });
        util.addHandler(domData[1]['slider-box'],{
        	'click' : controlFn.controlPlay,
        	'mousedown' : progressFn.dragStart.bind(this,domData[1]['slider-box']),
        	'mousemove' : progressFn.dragging.bind(this,domData[1]['slider-box']),
        	'mouseup' : progressFn.dragEnd.bind(this,domData[1]['slider-box']),
            'mouseleave' : progressFn.dragEnd.bind(this,domData[1]['slider-box'])
        });
        util.addHandler(domData[1]['video'],{
        	'click' : controlFn.playPause,
        	'timeupdate' : controlFn.tick
        });
        util.addHandler(domData[1]['controlPlay'],{
        	'click' : controlFn.playPause
        });
        util.addHandler(domData[1]['scale-video'],{
        	'click' : controlFn.scaleVideo
        });
        util.addHandler(domData[1]['doubble-speed'],{
        	'click' : controlFn.speedPlay
        });
        util.addHandler(domData[1]['sound'],{
        	'click' : controlFn.mutedSound
        });
    }
    
  }
  
  Video.prototype = {
  	constructor : Video,
    domData : null,
    video : null,
  	volume : 0
  };
  function Progress(){
  	this.isdragging = false;
  	isBuffer = true;
    var domData = this.__proto__.domData;
    var video = this.__proto__.domData[1]['video'];
    var volume = this.__proto__.volume;  	
    this.dragStart = function(ele,e){
        var posData = util.getComputed(ele,e);
        if(ele.id === 'slider-box'){
        	video.pause();
        	video.currentTime = posData[1]*video.duration;
        	util.progressStyle(domData[1],'slider-',posData[1]);
        }else{
        	domData[1].sound.className = 'fa fa-volume-up';
        	if(posData[1] < 0.01){
        		video.volume = 0;
        	}else if(posData[1] >=1 ){
        		video.volume = 1;
        	}else{
        		video.volume = posData[1];
        	}
                volume = video.volume;

            if (posData[0] <= 0) {
            	util.progressStyle(domData[1],'sound-',0);
            }else{
            	util.progressStyle(domData[1],'sound-',posData[1]);        	
            }
        }
    };
    this.dragging = function(ele,e) {
    	if (!this.isdragging) {
    		return;
    	}else{
    		var posData = util.getComputed(ele,e);
    		if(ele.id === 'slider-box'){
    			video.currentTime = posData[1]*video.duration;
    			util.progressStyle(domData[1],'slider-',posData[1]); 
    		}else if (ele.id === 'sound-box') {
    			if (posData[1] <= 0.01) {
    				video.volume = 0;
    			}else{
    				video.volume = posData[1];
    			}

    			volume = video.volume;
                if (posData[0] <= 0) {
                	util.progressStyle(domData[1],'sound-',0);
                }else{
                	util.progressStyle(domData[1],'sound-',posData[1]);                	
                }

    		}
    	}
    };
    this.dragEnd = function(ele,e){
    	this.isdragging = false;
    	if(isBuffer){
    		video.play();
    		domData[1]['controlPlay'].className = 'fa fa-pause';
    	}
    	removeEventListener('mousemove',this.dragging);
    	removeEventListener('mouseup',this.dragEnd);
    }
  }

  function Control(){
  	var domData = this.__proto__.domData;
    var video = this.__proto__.domData[1]['video'];
    var volume = this.__proto__.volume;
    var that = this;
  	this.tick = function(){
    	if (video.ended) {
    		util.progressStyle(domData[1],'slider-',1);
    		util.progressStyle(domData[1],'slider-',0);
    		var str = util.formateTime(0) + '/' + util.formateTime(duration);
    		domData[1]['time-data'].innerHTML = str;
            that.playPause();
    	}else if (!video.paused) {
            var currentTime = video.currentTime;
            var duration = video.duration;
            var precent = currentTime/duration;
            var str = util.formateTime(currentTime) + '/' + util.formateTime(duration);
            domData[1]['time-data'].innerHTML = str;
            util.progressStyle(domData[1],'slider-',precent);
     	}
    };  	
  	this.controlPlay = function(e){
        var posData = util.getComputed(domData[1]['slider-box'],e);
        video.currentTime = posData[1]*video.duration;
        util.progressStyle(domData[1],'slider-',posData[1]);
  	};
    this.playPause = function(){
    	var controller = domData[1]['controlPlay'];
    	if(video.paused){
 	       video.play();
 		   controller.className = 'fa fa-pause';
     	}else{
 		   video.pause();
 		   controller.className = 'fa fa-play';
 	    }
    };
    this.speedPlay = function(){
    	if(video.playbackRate === 2){
 		   video.playbackRate = 1;
 	       domData[1]['doubble-speed'].className = 'fa fa-forward';
     	}else{
           video.playbackRate = 2;
           domData[1]['doubble-speed'].className = 'fa fa-backward';      
 	    }
    };
    this.mutedSound = function(){
    	if(video.volume === 0){
           video.volume = volume;
           domData[1].sound.className = 'fa fa-volume-up';
 	    }else{
           volume = video.volume;
           video.volume = 0;
           domData[1].sound.className = 'fa fa-volume-off'
 	    }
    };
    this.scaleVideo = function(){
    	var player = document.getElementById("player");
        if(player.className === 'full-player'){
 		   player.className = '';
 		   domData[1]['scale-video'].className = 'fa fa-expand';
 	    }else{
 	       player.className = 'full-player';
 		   domData[1]['scale-video'].className = 'fa fa-compress';
     	} 
    };
    this.controlSound = function(e){
        var posData = util.getComputed(domData[1]['sound-box'],e);
        if(posData[1] <= 0.01){
        	video.volume = 0;
        }else if(posData[1] >= 1){
            video.volume = 1;    	
        }else {
            video.volume = posData[1];
        }
        volume = video.volume;
        util.progressStyle(domData[1],'sound-',posData[1]);
        }
  }
  
  Progress.prototype = Video.prototype;
  Control.prototype = Video.prototype;
  
  var domArr = ['video',['source'],'div',['div','div','div'],'div',['div','div','div','div',['div','div',['div','div','div']],'div']];
  var classArr = ['',[''],'',['','',''],'',['fa fa-play','','fa fa-forward','',['fa fa-volume-up','',['','','']],'fa fa-expand']];
  var idArr = ['video',[''],'slider-box',['slider-progress','slider-thumb','slider-runway'],'other-control',['controlPlay','time-data','doubble-speed','sound-control',['sound','sound-box',['sound-progress','sound-thumb','sound-runway']],'scale-video']];
  new Video().init(domArr,classArr,idArr);
})(window)