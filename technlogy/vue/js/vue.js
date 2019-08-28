var input = document.getElementById('in');
var out = document.getElementById('out');
var obj = {};
var Value;
Object.defineProperty(obj, 'msg', {
	enumerable: true,
	configurable:true,
	get:function() {
		console.log(Value)
		return Value;
	},
	set:function(newValue){
		out.innerHTML = newValue;
		Value = newValue;
	}
});

input.addEventListener('input', function(e){
	obj.msg = e.target.value;
	console.log(obj.msg)
}, false);
var c={};
c.a = 'd';
console.log(c.a)
c.a = 'f';
console.log(c.a);


//观察者 observe()
function observe(data){
	if(!data || typeof data !== 'object'){
		return;
	}

	Object.keys(data).forEach(function(key){
		defineReactive(data,key,data[key]);
	});
}

function defineReactive(data,key,val){
	observe(val);
	var dep = new Dep();//订阅器，收集每个组件的定阅,
	Object.defineProperty(data, key, {
		enumerable : true,
		configurable : true,
		get: function(){
			if(Dep.target){  //订阅者存在
                dep.addSub(Dep.target);
			}
			return val;
		},
		set: function(newVal){
			if(val === newVal){ //不必频繁更新
				return;
			}
			val = newVal;
			dep.notify(); //有变动通知订阅者更新
			console.log('属性'+key+'已经被监听，观察者已经监听了data的所有属性')
		}
	})
}
//观察者有了，剩下需要 消息订阅器，为收集发布者的订阅
function Dep(){
	this.subs = [];
}
Dep.prototype = {
  constructor: Dep,
  addSub: function(sub){
    this.subs.push(sub);
  },
  notify: function(){
  	console.log(this.subs);
  	this.subs.forEach(function(sub){
  		sub.update();   //定阅者更新
  	});
  }
};
Dep.target = null;
//订阅者
function Watcher(vm,exp,callback){
	this.callback = callback;
	this.vm = vm;
	this.exp = exp;
	this.value = this.get(); //触发订阅者的初始化
}

Watcher.prototype = {
	constructor: Watcher,
	update:function(){
		this.run();
	},
	run:function(){
		var value = this.vm.data[this.exp];
		var oldVal = this.value;
		if(value !== oldVal){
			this.value = value;
			this.callback.call(this.vm,value,oldVal);
		}
	},
	get:function(){
		Dep.target = this; //将订阅者添加到订阅器中
		var value = this.vm.data[this.exp]; //执行观察者的观察,并初始化自身
		console.log(this);
		Dep.target = null; //清除闭包缓存的变量
		return value;      //缓存状态
	}
}

//Vue对象 
function Vue(options){
	var self = this;
	this.data = options.data;
	this.methods = options.methods;
	if(this.data instanceof Object){
     	  Object.keys(this.data).forEach( function(key) {
		  self.proxyKeys(key);
	    });
	}else {
		console.error('data不是对象');
	}
	
	observe(this.data);
    new Compile(options.el,this);
    if(options.mounted){
      options.mounted.call(this);	
    }	
}

//但访问属性需要以vue.data的形式;

Vue.prototype = {
	proxyKeys: function(key){
		var self = this;
		Object.defineProperty(this,key, {
			enumerable:false,
			configurable:true,
			get:function(){
				return self.data[key];
			},
			set:function(newValue){
				self.data[key] = newValue;
			}
		})
	}
}

//实现匹配自解析 改变状态

//解析模板指令
function Compile(el,vm){
	this.vm = vm;
	this.el = document.querySelector(el);
	this.fragment = null;
	this.init();
}

Compile.prototype = {
	init: function(){
		if(this.el){
			this.fragment = this.nodeToFragment(this.el);
			this.compileElement(this.fragment);
			this.el.appendChild(this.fragment);
		}else{
			return;
		}
	},

	nodeToFragment: function(el){
        var fragment = document.createDocumentFragment();
	    var child = el.firstChild;
	    while (child) {
	    	fragment.appendChild(child);
	    	child = el.firstChild;
	    	console.log(child);
	    }
	    return fragment;
	},

	compileElement: function(el){
		var childNodes = el.childNodes;
	    var self = this;
	    [].slice.call(childNodes).forEach( function(node) {
	    	var reg = /\{\{(.*)\}\}/;
	    	var text = node.textContent;
	    	if(self.isElementNode(node)){
	    		self.compileDirective(node);
	    	}
	    	if (self.isTextNode(node) && reg.test(text)) {
	    		console.log(text);
	    		console.log(reg.exec(text));
	    		self.compileText(node,reg.exec(text)[1]);
	    	}
	    	if (node.childNodes && node.childNodes.length) {
	    		self.compileElement(node);
	    	}
	    }); 
	},

	compileText: function(node,exp){
		var self = this;
	    var initText = this.vm.data[exp];
	    self.updateText(node,initText); //更新视图
	    new Watcher(this.vm,exp,function(value){ //生成定阅者并更新
	    	self.updateText(node,value);
	    });
	},

	updateText: function(node,value){
		node.textContent = typeof value == 'undefined'? '': value;
	},

	isTextNode: function(node){
		return node.nodeType === 3;
	},

	compileDirective: function(node){
		var nodeAttrs = node.attributes;
		var self = this;
		Array.prototype.forEach.call(nodeAttrs,function(attr){
			var attrName = attr.name;
			if(self.isDirective(attrName)){
				var exp = attr.value;
				var dir = attrName.substring(2);
				if(self.isEventDirective(dir)){ //事件指令
                    self.compileEvent(node,self.vm,exp,dir);
				}else{
					self.compileModel(node,self.vm,exp,dir);
				}
				node.removeAttribute(attrName);
			}
		});
	},
	compileEvent: function(node,vm,exp,dir){
		var eventType = dir.split(':')[1];
		var callback = vm.methods && vm.methods[exp];
	  if(eventType && callback){
	  	 node.addEventListener(eventType, callback.bind(vm.data), false);
	  }
	},
	compileModel: function(node,vm,exp,dir){
		var self = this;
		var val = this.vm[exp];
		console.log(val);
		this.modelUpdater(node,val);
		new Watcher(this.vm,exp,function(value){
			self.modelUpdater(node,value);
		});

		node.addEventListener('input', function(e){
			var newValue = e.target.value;
			if (val === newValue) {
				return;
			}
			self.vm.data[exp] = newValue;
			val = newValue;
		}, false);
	},

	modelUpdater: function(node,value,oldValue){
		node.value = typeof value == 'undefined'?'':value;
	},
	isDirective: function(attr){
		return attr.indexOf('v-') === 0;
	},
	isEventDirective: function(dir){
		return dir.indexOf('on:') === 0;
	},
	isElementNode:function(node){
		return node.nodeType === 1;
	}
}


new Vue({
	el:'#app',
	data:{
		title:'hello world',
		name: 'ccc'
	},
	methods: {
		clickMe:function(){
			this.title = 'ssss';
			console.log(this)
		}
	}
})