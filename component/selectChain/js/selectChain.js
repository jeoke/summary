var provincial =  ['湖北省','河南省','江西省'];
var metropolis =  [
      ['武汉市','宜昌市','恩施市'],
      ['河南省1','河南省2',],
      ['江西省1','江西省2','江西省3']
];
var area = [
    [
      ['武汉市1','武汉市2','武汉市3'],
      ['宜昌市1','宜昌市2','宜昌市3'],
      ['恩施市1','恩施市2','恩施市3']
    ],
    [
      ['河南省11','河南省12','河南省13'],
      ['河南省21','河南省22','河南省23'],
    ],
    [
      ['江西省11','江西省12','江西省13'],
      ['江西省21','江西省22','江西省23'],
      ['江西省31','江西省32','江西省33']
    ]
];


var province = document.form1.select1;
var metro =  document.form1.select2;
var areaName = document.form1.select3;
var transitionArr = area[0];

function optionArr(arr,e){
	e.options.length = 0;
	for(var i = 0;i<arr.length;i++){
		var option = new Option(arr[i],i);
		e.appendChild(option);
	}
}

optionArr(provincial,province);
optionArr(metropolis[0],metro);
optionArr(area[0][0],areaName);

province.onchange = function(){
	metro.options.length = 0;
	areaName.options.length = 0;
    var index = this.selectedIndex;
    var metro_arr = metropolis[index];
    transitionArr = area[index];
    optionArr(metro_arr,metro);
	optionArr(area[index][0],areaName);
}

metro.onchange = function(){
	areaName.options.length = 0;
	var index = this.selectedIndex;
	var areaName_arr = transitionArr[index];
	optionArr(areaName_arr,areaName);
}