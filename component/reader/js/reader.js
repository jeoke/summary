document.addEventListener('DOMContentLoaded', function(){
	var html = document.querySelector('html');
	html.style.fontSize = window.innerWidth / 100 + 'px';
}, false);

var left = document.getElementsByClassName('left')[1];
var right = document.getElementsByClassName('right')[1];
var middle = document.getElementsByClassName('middle')[0];
var titleWrapper = document.getElementsByClassName('title-wrapper')[0];
var menuWrapper = document.getElementsByClassName('menu-wrapper')[0];
var x = document.getElementById("file1");
var read = document.getElementById('read');
var isReady = false;
function showEpub(){
	var reader = new FileReader();
    file = x.files[0];
    console.log(file)
	reader.onload = function(){
		var arrayBuffer = this.result;
        //生成Book 对象
        console.log(arrayBuffer);
	    window.book = ePub(arrayBuffer,{
	    	encoding:'binary'
	    });
	    //生成Redition对象
	    window.rendition = book.renderTo(read,{
	    	width: window.innerWidth / 2,
	    	height: window.innerHeight -200,
     	});
        window.displayed = window.rendition.display();
	    //Rendition.display()渲染
	    //获取theme对象 设置字体，主题
	    window.themes = rendition.themes;
	    themes.register('night',{
	    	"body":{
	    		"color":"yellow",
	    		"background":"#000",
	    		"opacity":'0.6'
	    	}
	    });
	    themes.register('sun',{
	    	"body":{
	    		"color":"#000",
	    		"background":"#fff",
	    		"opacity":'1'
	    	}
	    });	    
	    book.ready.then(function(){
	    	return book.locations.generate();
	    }).then(function(result){

        function createNodeTree(catalogData){
        	var fragment = document.createDocumentFragment();
        	var divContent,textNode;
        	console.log(catalogData)
           	for(var i in catalogData){
              divContent = document.createElement('div');
              divContent.addEventListener('click', jumpTo.bind(this,catalogData[i]['href']), false);
              textNode = document.createTextNode(catalogData[i]['label']);
              divContent.appendChild(textNode);
              fragment.appendChild(divContent);
        	}
        	return fragment;
        }

            window.NodeTree = createNodeTree();
	    	window.navigation  = book.navigation;
	    	window.catalogData = navigation.toc;
	    	window.NodeTree = createNodeTree(catalogData);
	    	catalog.appendChild(NodeTree);
	    	window.bookLocation = book.locations;
	    	isReady = true;
	    })

	}
	reader.readAsArrayBuffer(file);
}
function showNav(){
	if(titleWrapper.className.indexOf('show') === -1){
       titleWrapper.className +=' show';
       menuWrapper.className += ' show';
	}else{
 	   catalog.className = catalog.className.replace(' showSetting','');
  	   theme.className = theme.className.replace(' showSetting','');
  	   fontAj.className = fontAj.className.replace(' showSetting','');
  	   progressEle.className = progressEle.className.replace(' showSetting','');
       titleWrapper.className = titleWrapper.className.replace('show','');
       menuWrapper.className = menuWrapper.className.replace('show','');       
	}
}

document.getElementById("file1").addEventListener('change', showEpub, false);
middle.addEventListener('click', showNav, false);

function prePage(){
   if(rendition && isReady){
      rendition.prev();
      if(bookLocation.currentLocation > 0){
        --bookLocation.currentLocation;
        console.log(bookLocation.currentLocation)
   	    var precent = bookLocation.currentLocation/bookLocation.length();
   	    progressStyle(domData,'read-',precent);
      } 
      if (precent < 0.05) {
        progressStyle(domData,'read-',0);
      }
   }
}
function nextPage(){
   if(rendition && isReady){
   	  rendition.next();
   	  ++bookLocation.currentLocation;
   	  var precent = bookLocation.currentLocation/bookLocation.length();
   	  if (precent < 0.05) {
   	  progressStyle(domData,'read-',0.01);
   	  }
   }
}
left.addEventListener('click', prePage, false);
right.addEventListener('click', nextPage, false);

//进度条计算
var domData = {
	'read-thumb':document.getElementById('read-thumb'),
	'read-runway':document.getElementById('read-runway'),
	'read-progress':document.getElementById('read-progress'),
	'font-thumb':document.getElementById('font-thumb'),
	'font-runway':document.getElementById('font-runway'),
	'font-progress':document.getElementById('font-progress')
};
var body = document.body;
function getStyle(obj, name){ 
    if(obj.currentStyle){ 
      return obj.currentStyle[name]; 
    }else{ 
      return getComputedStyle(obj, false)[name]; 
    } 
}
var bodyFontSize = parseInt(getStyle(body,'fontSize'));
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
var isdragging = false;
   function Progress(){
    this.dragStart = function(ele,e){
    	e.preventDefault();
    	isdragging = true;
      if(isReady){
        var posData = getComputed(ele,e);
        if(ele.className.indexOf('progress') !== -1){
        	progressStyle(domData,'read-',posData[1]);
        	var locations = posData[1] > 0 ? bookLocation.cfiFromPercentage(posData[1]) : 0;
        	bookLocation.currentLocation = locations;
            rendition.display(locations);
        	
        }else{
            if(posData[1] < 0.3){
             	themes.fontSize(100);        		
        	}else if(posData[1] >=1 ){
        	    themes.fontSize(bodyFontSize*2 + 'px');
        	}else{
        		themes.fontSize(posData[1]*bodyFontSize*2 + 'px');
        	}
                
            if (posData[0] <= 0) {
            	progressStyle(domData,'font-',0);
            }else{
            	progressStyle(domData,'font-',posData[1]);        	
            }
        }
      }else{
      	return;
      }
    };
    this.dragging = function(ele,e) {
    	console.log(isdragging)
    	if (isdragging && isReady) {
    		var posData = getComputed(ele,e);
    		if(ele.className.indexOf('progress') !== -1){
                //设置进度
    			progressStyle(domData,'read-',posData[1]);
        	    var locations = posData[1] > 0 ? bookLocation.cfiFromPercentage(posData[1]) : 0;
                bookLocation.currentLocation = locations; 
                rendition.display(locations);
    		}else if (ele.id === 'font-normal') {
    			//设置字体
    			if(posData[1] < 0.3){
             	themes.fontSize(0.3*bodyFontSize*2 + 'px');        		
        	    }else if(posData[1] >=1 ){
        	        themes.fontSize(bodyFontSize*2 + 'px');
        	    }else{
        	    	themes.fontSize(posData[1]*bodyFontSize*2 + 'px');
        	    }
                    
                if (posData[0] <= 0) {
                	progressStyle(domData,'font-',0);
                }else{
                	progressStyle(domData,'font-',posData[1]);        	
            }
    		}
    	}else{
    		return;
    	}
    };
    this.dragEnd = function(ele,e){
    	console.log(isdragging)
    	isdragging = false;
    	console.log(isdragging)
    	removeEventListener('mousemove',this.dragging);
    	removeEventListener('mouseup',this.dragEnd);
    }
  }

  
  var progressBar = new Progress();
  var progressEle =  document.getElementsByClassName('progress')[0];
  var fontEle = document.getElementById('font-normal');
  progressEle.addEventListener('mousedown', progressBar.dragStart.bind(this,progressEle), false);
  progressEle.addEventListener('mousemove', progressBar.dragging.bind(this,progressEle), false);
  progressEle.addEventListener('mouseup', progressBar.dragEnd.bind(this,progressEle), false);
  progressEle.addEventListener('mouseleave', progressBar.dragEnd.bind(this,progressEle), false);
  fontEle.addEventListener('mousedown', progressBar.dragStart.bind(this,fontEle), false);
  fontEle.addEventListener('mousemove', progressBar.dragging.bind(this,fontEle), false);
  fontEle.addEventListener('mouseup', progressBar.dragEnd.bind(this,fontEle), false);
  fontEle.addEventListener('mouseleave', progressBar.dragEnd.bind(this,fontEle), false);

var fontAj = document.getElementsByClassName('font')[0];
var catalog = document.getElementsByClassName('catalog')[0];
var theme = document.getElementsByClassName('theme')[0];
var catalogSet = document.getElementById('catalog');
var themeSet = document.getElementById('theme');
var fontSet = document.getElementById('font');
var progressSet = document.getElementById('progress');
var fontNormal = document.getElementById('font-normal');
  function showSetting(ele){
  	if (ele.className.indexOf('showSetting') !== -1) {
  		ele.className = ele.className.replace('showSetting','');
  	}else{
  		catalog.className = catalog.className.replace(' showSetting','');
  		theme.className = theme.className.replace(' showSetting','');
  		fontAj.className = fontAj.className.replace(' showSetting','');
  		progressEle.className = progressEle.className.replace(' showSetting','');
  		ele.className += ' showSetting';
  	}
  }

  
  catalogSet.addEventListener('click', showSetting.bind(this,catalog),false); 
  themeSet.addEventListener('click', showSetting.bind(this,theme),false); 
  fontSet.addEventListener('click', showSetting.bind(this,fontAj),false); 
  progressSet.addEventListener('click', showSetting.bind(this,progressEle),false); 

var fontInc = document.getElementById('font-increate');
var fontDec = document.getElementById('font-decreate');



function increateFont(){
	var fontNum = parseInt(getStyle(domData['font-progress'],'width'));
	var fontAjW = parseInt(getStyle(fontNormal,'width'));
	if(fontNum/fontAjW >= 0 && fontNum/fontAjW <= 0.9){
		themes.fontSize((fontNum/fontAjW+0.1)*bodyFontSize*2 + 'px');
		progressStyle(domData,'font-',fontNum/fontAjW+0.1);     
	}else{
		themes.fontSize(bodyFontSize*2 + 'px');
		progressStyle(domData,'font-',1);
	}
}

function decreateFont(){
	var fontNum = parseInt(getStyle(domData['font-progress'],'width'));
	var fontAjW = parseInt(getStyle(fontNormal,'width'));
	if(fontNum/fontAjW <= 0.1 ){
		themes.fontSize(0.1*bodyFontSize*2 + 'px');
		progressStyle(domData,'font-',0);     
	}else{
		themes.fontSize((fontNum/fontAjW-0.1)*bodyFontSize*2 + 'px');
		progressStyle(domData,'font-',fontNum/fontAjW-0.1);
	}	
}

fontInc.addEventListener('click', increateFont, false);
fontDec.addEventListener('click', decreateFont, false);

var night = document.getElementById('night');
var sun = document.getElementById('sun');

function themeNight(){
  themes.select('night');
}

function themeSun(){
  themes.select('sun');
}
night.addEventListener('click', themeNight, false);
sun.addEventListener('click', themeSun, false);

//目录
var catalogId = document.getElementById('catalog');



function jumpTo(href){
   catalog.className = catalog.className.replace(' showSetting','');
   rendition.display(href);
}


function catalogOut(){
	catalog.className = catalog.className.replace(' showSetting','');
  	theme.className = theme.className.replace(' showSetting','');
  	fontAj.className = fontAj.className.replace(' showSetting','');
  	progressEle.className = progressEle.className.replace(' showSetting','');
    titleWrapper.className = titleWrapper.className.replace('show','');
    console.log(catalog.className.indexOf(' showSetting'));
    if(catalog.className.indexOf(' showSetting') == -1){
      catalog.className += ' showSetting';
    }else{
      catalog.className = catalog.className.replace(' showSetting','');
    }
}
catalogId.addEventListener('click', catalogOut, false);

