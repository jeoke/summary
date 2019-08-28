(function(window,jQery,$,$undefined){
    "use strict";
    //ajax
    function createxmlHttpRequest(){
    	//window兼容
    	var xml;
    	if(window.ActiveXObject){
          xml = new ActiveXObject("microsoft.XMLHTTP");
    	}else{
          xml = new XMLHttpRequest();
    	}
    	return xml;
    }
    //对象,数组转字符串
    function convertObject(data){
    	if(typeof data === 'object'){
    		var result;
    		for (i in data) {
    			result += i + '=' + data[i] + '&';
    		}
    		result = result.substring(0, result.length-1);
    		return result;
    	}else{
    		return data;
    	}
    }

    function ajax(){
    	//type,url,async,data,datatype,contentType,beforeSend,sucess,error,
        var ajaxData = {
           type : argument[0].type || 'GET',
           url : argument[0].url || '',
           async : argument[0].async || 'true',
           data : argument[0].data || 'null',
           dataType : argument[0].dataType || 'text',
           contentType : argument[0].contentType || 'application/x-www-form-urlencoded',
           beforeSend : argument[0].beforeSend || function(){},
           sucess : argument[0].sucess || function(){},
           error : argument[0].error || function(){}
        };

        //创建XMLHttpRequest
        var xhr = createxmlHttpRequest();
        xhr.responseType = ajaxData.datatype;
        xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);
        xhr.setRequestHeader('contentType', ajaxData.contentType);
        xhr.send(convertObject(ajaxData.data))
        xhr.onreadystatechange = function(){
        	if(xhr.readyState === 4){
        		if(xhr.status === 200){
        			ajaxData.sucess();
        		}
        	}else{
        		ajaxData.error();
        	}
        }
    }
    jQuery.ajax = ajax;
    //调用jquery.ajax
    window.jQuery = window.$ = jQuery = $;
})(window,jQuery,$)