(function(window,undefined) {
   function saveLocalStorage(key,value){
   	  var type = typeof value;
   	  if(type === "object"){
   	  	var str = JSON.stringify(value);
   	  	window.localStorage.setItem(key, str);
   	  }else{
   	  	window.localStorage.setItem(key,value);
   	  }
   }
   function findLocalStorage(key){
   	  try {
   	  	var value;
   	  	value = JSON.parse(window.localStorage.getItem(key));
   	  } catch(e) {
   	  	value = window.localStorage.getItem(key);
   	  }finally{
   	  	return value;
   	  }
   }
})(window)