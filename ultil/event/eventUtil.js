(function(window,undefined){
    var eventUltil = {
    	  setHandler ： function(element,type,handler){
            if (element.addEventListener) {
            	element.addEventListener(eventType, handler, false);
            } else if (element.attachEvent) {
            	element.attachEvent('on' + type , handler);
            } else {
                element['on'+ type] = handler;
            }
    	  },
    	  removeHandler : function(element, type , handler){
    	  	if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
    	  	} else if (element.detachEvent) {
    	  		element.dettach('on' + type , handler);
    	  	} else {
                element['on' + type] = null;
    	  	}
    	  },
    	  getEvent : function(e){
            retrun e?e:window.event;
    	  },
    	  getTarget : function(e){
    	  	return e.target || e.srcElement;
    	  }
    	  preventDefault : function(e){
            if (e.preventDefault) {
            	e.preventDefault();
            } else {
            	e.returnValue = false;
            }
    	  },
    	  stopPropagation : function(e){
    	  	if (e.stopPropagation) {
                e.stopPropagation();
    	  	} else {
                e.cancelBubble = true;
    	  	}
    	  }
    }
})(window)