(function(window,undefined){
   var _aniQueue = [],   //动画队列
       _baseUID = 0,
       _aniId = -1,  //动画ID
       _aniUpdateTimer = 13,//更新时间
       _isTicking = false; //检测状态

   animateManage = function(option){
   	 this.context = option;
   }

   animateManage.prototype = {
   	 init : function(){
       this.start(this.context);
   	 },

   	 start : function(option){
       if(option){
        this.pushQueue(option);
       }
       if(_isTicking || _aniQueue.length === 0){
       	return false;
       }
       this.tick();
       return true;
   	 },

   	 stop : function(){
       clearInterval(_aniId);
       _isTicking = false;
   	 },

     tick : function(){
       var self = this;
       _isTicking = true;
       _aniId = setInterval(function(){
         if(_aniQueue.length === 0){
         	self.stop();
         } else {
         	var i = 0;
         	_anilen = _aniQueue.length;
         	for(;i<_anilen;i++){
         		_aniQueue[i] && self.go(_aniQueue[i],i);
         	}
         }
       },_aniUpdateTimer)
     },
  
     go : function(_option,i){
       var n = this.now();
           st = _option.startTime,
           ting = _option.time,
           c = _option.context,
           t = st + ting,
           name = _option.name,
           tops = _option.value,
           spos = _option.startValue,
           effect = _option.effect,
           scale = 1;

           if(n>=t){
           	 _aniQueue[i] = null,
           	 this.delQueue();
           }else{
           	  tops = this.aniEffect({
           	  	c : c,
           	  	ting : ting,
           	  	n : n,
           	  	st : st,
           	  	spos : spos,
           	  	tpos : tpos
           	  },effect);
           }
           c.style[name] = name === "z-index"?tpos:tpos+'px';
           this.goCallback(_option.callBack,_option.uid);
     },
     
     aniEffect : function(_option,effect){
     	effect = effect || "linear";
     	var _effect = {
     		"linear":function(_option){
     			var scale = (_option.n - _option.st)/_option.ting,
     			    tpos = _option.spos + (_option.tpos - _option.spos)*scale;
     			    return tpos;
     		}
     	}

     	return _effect[effect](_option);
     }
     now : function(){
        return new Date().getTime();
     },

     goCallback : function(callback,uid){
     	var i = 0,
            _anilen = _aniQueue.length,
            isCallback = true;
          for (;i<_anilen;i++) {
          	if(_aniQueue[i].uid == u){
          		isCallback = false;
          	}
          }
          if (isCallback) {
          	callback && callback();
          }
     }
   	 pushQueue : function(option){
        var con = option.context,
            t = option.time || 1000,
            callback = option.callback || false,
            effect = option.effect,
            startCss = option.startCss,
            c = option.css,
            name = "",
            u = this.setUID(con);

            for(name in c){
            	_aniQueue.push({
            		"context" : con,
            		"time" : t,
            		"name" : name,
            		"value" : parseInt(c[name]),
            		"startValue" : parseInt(startCss[name]),
            		"effect" : effect,
            		"uid" :  u,
            		"callback" : callback,
            		"startTime" : this.now()
            	})
            }

   	 },

   	 delQueue : function(){
   	 	var i = 0,
   	 	    l = _aniQueue.length;
   	 	  for(;i<l;i++){
   	 	  	if(_aniQueue[i] === null){
   	 	  		_aniQueue.splice(i,1);
   	 	  	}
   	 	  }
   	 },

   	 getUID : function(_e){
   	 	return _e.getAttribute("anUID");
   	 },

   	 setUID : function(_e,_v){
   	 	var u = this.getUID(_e);
   	 	if(u){
   	 		return u;
   	 	};
   	 	u = _v || _baseUID++;
   	 	_e.setAttribute("anUID",u);
   	 	return u;
   	 }
   };
})(window)