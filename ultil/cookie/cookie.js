(function(window){
   //格式化cookie
   function getCookieObject(){
     var cookies = {};
     if (document.cookie) {
     	var objects = document.cookie.split(';')
     }
     for (var i in objects) {
     	var index = objects[i].indexOf('=');
     	var key = objects[i].substring(0, index);
     	while (key.charAt(0) === '') {
     		key.substring(1);
     	}
     	var value = objects[i].substring(index+1, objects[i].length);
     	cookies[key] = value;
     }
     return cookie;
   }
   //查询cookie
   function getCookie(key){
     return decodeURIComponent(getCookieObject()[key]);
   }
   //设置cookie
   function setCookie(name,value,opts){
    //opts:maxAge,path,domain,secure
    if (name && value) {
       var cookie = name + '=' + encodeURIComponent(value);
       if (opts) {
       	if (opts.maxAge) {
       		cookie += ';max-age=' + opts.maxAge;
       	}
       	if (opts.path) {
       		cookie += ';path=' + opts.path;
       	}
       	if (opts.domain) {
            cookie += ';domain=' + opts.domain;
       	}
       	if (opts.secure) {
       		cookie += ';secure=' + opts.secure;
       	}
       }
       document.cookie = cookie;
       return cookie;
    } else {
    	return '';
    }
   }
   //移除cookie
   function removeCookie(key){
     if (getCookieObject()[key]) {
     	document.cookie = key + '=;max-age=0';
     }
   }
   //清除cookie
   function clearCookie(){
     var cookies = getCookieObject();
     for (var i in cookies) {
     	document.cookie = cookies[i] + '=;max-age=0';
     }
   }
   window['cookie'] = {
   	'getCookieObject' : getCookieObject,
   	'setCookie' : setCookie,
   	'getCookie' : getCookie,
   	'removeCookie' : removeCookie,
   	'clearCookie' : clearCookie
   }
})(window)