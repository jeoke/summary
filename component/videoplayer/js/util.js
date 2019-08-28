(function(window,undefined){
  function createDomTree(tagArray,classArray,idArr) {
    var domArr = new Array();
    var idObj = {};
    tagArray.forEach(function(element, index) {
      classArray.forEach(function(classEle,i){
        idArr.forEach( function(idEle, j) {
          if(index === i && i === j){
             if(element instanceof Array){
                var domSecArr = createDomTree(element,classEle,idEle);
                domArr.push(domSecArr[0]);
                idObj = Object.assign(idObj,domSecArr[1]);
             }else{
                var node = document.createElement(element);
                var idName = idEle;
                node.className = classEle;
                node.id = idEle;
                domArr.push(node); 
                idObj[idName] = node;      
             }
          }else{
            return;
          }   
        });
      });
    });
    var returnArr = new Array();
    returnArr.push(domArr);
    returnArr.push(idObj);
    return returnArr;
  }
  
  function LoadDomTree(nodeArr,fragment){
  	if (!nodeArr) {
  		return;
  	}
    var fragments = fragment || document.createDocumentFragment();
    var lastDom = fragments;
  	nodeArr.forEach(function(element, index) {
      if(element instanceof Array){
         LoadDomTree(element,lastDom);
      }else{
         fragments.appendChild(element);
         lastDom = element;
      }
    });
    return fragments;
  }
  
  function addHandler(target,events){
         console.log(Object.keys(events))
  	if(!target || !events || !Object.keys(events)){
  		return ;
  	}
  	Object.keys(events).forEach(function(ev, index) {
        target.addEventListener(ev, function(target){
        	events[ev].call(this, target);
        }, false);
  	});
  }

  function formateTime(time){
  	var formateTime = '',
  	    seconds = 0,
  	    minutes = 0,
  	    hours = 0,
  	    isDisplayHours = undefined,
  	seconds = parseInt(time % 60);
  	minutes = parseInt((time / 60) % 60);
  	hours = parseInt(((time / 60) / 60) % 60);
    isDisplayHours = (hours > 0);
    seconds = ("0" + seconds).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    formateTime = (isDisplayHours ? hours + ':' : '') + minutes + ':' + seconds;
    return formateTime;
  }

  function getComputed(ele,e){
  	var clickpos = e.clientX,
  	    eleLeft = ele.getBoundingClientRect().left,
  	    eleWidth = ele.offsetWidth;
  	var gap = clickpos - eleLeft;
  	if (gap <= 0) {
  		gap = 0;
     	var	precent = 0;
  	}else{
  	    var	precent = gap/eleWidth;
  	}
    return [gap,precent];
  }
  
  function progressStyle(idobj,prefix,precent){
     idobj[(prefix + 'thumb')].style.left = (100*precent) + '%';
     idobj[(prefix + 'runway')].style.left = (100*precent) + '%';
     idobj[(prefix +  'progress')].style.width = (100*precent) + '%';
  }
  window['util'] = {
    'createDomTree' : createDomTree,
    'LoadDomTree' : LoadDomTree,
    'addHandler' : addHandler,
    'formateTime' : formateTime,
    'getComputed' : getComputed,
    'progressStyle' : progressStyle,
  }
})(window)