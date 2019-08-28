(function(){
    //初始化变量
    var isMoveFocus = false; //是否移动
    var focusElement = null; //焦点对象
    var magnifierElement = null; //放大镜
    var magnifierWidth = 400;  //放大镜的宽度
    var focusZindex = 100;  //焦点的Z轴
    var magnifierZindex=101;
    var magnifierScale = 0; //比例尺
    var eMagnifierMages = null; //放大镜对象

    var focusArae = {    //焦点面积
        "width":50,
        "height":50
    };

    setCss = function(_this,cssOpthion){ //设置元素样式
        //判断节点类型
        if(!_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style){
            return;
        }
        for(var cs in cssOpthion){ //遍历节点设置样式
            _this.style[cs] = cssOpthion[cs];
        }
        return _this;
    };
    //初始化焦点对象
    initMagnifierMages = function(_e){
        //初始化图片管理相关元素
        //焦点对象
        focusElement = setCss(document.getElementById("focusPoint"),{
            "z-index":focusZindex,
            "width":focusArae.width + "px",
            "height":focusArae.height + "px"
        });

        initMagnifierPos(_e);
        magnifierScale = magnifierWidth/_e.offsetWidth;

        var _img = _e.getAttribute("data-maxImg");  //设置大图
        document.getElementById('magnifierImg').setAttribute("src", _img);
    };
    //定义移动放大镜的方法
    mouseMagnifier = function(_e){
        this.initMagnifierMages(_e);   //业务处理
        this.eMagnifierMages = _e;     //移动
    };

    _mousepos = {            //鼠标在页面上的位置
        "top":0,
        "left":0
    };

    //获取鼠标在页面上的位置
    getMousePoint = function(_e){
        var _body = document.body,
        _left = 0,
        _top  = 0;

        if(typeof window.pageYOffset != 'undefined'){
            _left = window.pageXOffset;
            _top = window.pageYOffset;
        }else if(typeof document.compatMode != undefined && document.compatMode != 'BackCompat'){
            _left = document.documentElement.scrollLeft;
            _top = document.documentElement.scrollTop;
        }else if(typeof _body != 'undefined'){
            _left = _body.scrollLeft;
            _top = _body.scrollTop;
        }
        _left += _e.clientX;
        _top += _e.clientY;
        _mousepos.left = _left;
        _mousepos.top = _top;

        return _mousepos;
    };

    //检查鼠标点位
    pointCheck = function(_event,_e,options){
        var _pos = getMousePoint(_event),
        _w = options && options.width || _e.offsetWidth,  //获取元素宽度
        _h = options && options.height || _e.offsetHeight, //获取元素高度
        _left = getAbsoluteLeft(_e);
        _top = getAbsoluteTop(_e);
        _pos.left += options && options.left || 0;
        //计算鼠标的top和left 是否落入元素的left与top内
        if(_pos.left < (_left + _w) && _left < _pos.left && _pos.top > _top && _pos.top < (_top + _h)){
            return true;
        }
        return false;
    };
    
    //放大镜移动
    bodyMagnifiermousemove = function(_event){
        var _event = _event || window.event,
        _e = eMagnifierMages;
        if(pointCheck(_event,_e)){
            isMoveFocus = true;
            focusStatus();
            if(!isMoveFocus){
                return;
            }
            focusPos(_e,_event);
            magnifierPos(_e,_event);
        }else{
                isMoveFocus = false;
                focusStatus();
        }
    };

    //获取焦点并设置焦点方块的位置
    focusPos = function(_e,_event){
        var _pos = getMousePoint(_event),
        _top = _pos.top - focusArae.height/2,
        _left = _pos.left - focusArae.width/2;
        setCss(focusElement,{
            "top":_top + 'px',
            "left":_left + 'px'
        })
    };

    //设置焦点方块的状态
    focusStatus = function(){
        isMoveFocus && (setCss(focusElement,{
            "display":"block"
        })) && setCss(magnifierElement,{
            "display":"block"
        }) || (setCss(focusElement,{
            "display":"none"
        }) && setCss(magnifierElement,{
            "display":"none"
        })) 
    };

    //初始化放大镜位置
    initMagnifierPos = function(_e){
        magnifierElement = setCss(document.getElementById("magnifier"),{
            "z-index":magnifierZindex,
            "top":getAbsoluteTop(_e) + 'px',
            "left":getAbsoluteLeft(_e) + _e.offsetWidth + focusArae.width + 'px'
        });
    };
    
    //计算放大镜图片的位置
    magnifierPos = function(_e,_event){
        var _pos = getMousePoint(_event),
        _top = magnifierScale * (_pos.top - getAbsoluteTop(_e)-focusArae.height/2),
        _left = magnifierScale * (_pos.left - getAbsoluteLeft(_e)-focusArae.width/2);
        if(_top < 0 || _left < 0){
            return;
        }
        setCss(document.getElementById("magnifierImg"),{
            "top":"-"+_top + 'px',
            "left": "-" + _left + 'px'
        });
    };
    
    //获取元素左边距
    getAbsoluteLeft = function(_e){
        var _left = _e.offsetLeft,
        _current = _e.offsetParent;
        while(_current !== null){
            _left += _current.offsetLeft;
            _current = _current.offsetParent;
        }
        return _left;
    };
    //获取元素右边距
    getAbsoluteTop = function(_e){
        var _top = _e.offsetTop,
        _current = _e.offsetParent;
        while(_current !== null){
            _top += _current.offsetTop;
            _current = _current.offsetParent;
        }
        return _top;
    };
    eMagnifierMages = document.getElementById("imagesSource");
    initMagnifierMages(eMagnifierMages);
  
    document.body.onmousemove = function(e){
        bodyMagnifiermousemove(e);
    }
//放大镜，焦点方块，固定放大镜的位置  图片的位置
 })();