(function(window,undefined){
  function setCss(_this,option){
    if(!_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ){
      retrun '';
    } else {
      for (cs in option) {
      	_this.style[cs] = option[cs];
      }
    }
    return _this;
  }
})(window)