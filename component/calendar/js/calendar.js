(function(window,undefined){
   function DatePicker(){

   }

   DatePicker.prototype = {
   	 constructor : DatePicker,
   	 getMonthDate : function(year,month){
        var ret = [];
        if (!year || !month) {
        	var today = new Date(),
        	year = today.getFullYear();
        	month = today.getMonth() + 1;
        }
        var firstDay = new Date(year,month-1,1);//这个月第一天
        var firstDayWeekDay = firstDay.getDay();//星期几
        if (firstDayWeekDay === 0) {
        	firstDayWeekDay = 7
        }

        year = firstDay.getFullYear();
        month = firstDay.getMonth()+1;
        var lastDayOfLastMonth = new Date(year, month-1, 0);//上个月最后一天
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();//上个月最后一天的日期
        var preMonthDayCount = firstDayWeekDay - 1;//开头缺的天数
        var lastDay = new Date(year, month, 0);//这个月最后一天的日期
        var lastDate = lastDay.getDate();//这个月最后一天的星期

        for(var i=0;i<7*6;i++){
        	var date = i+1-preMonthDayCount; //
        	var showDate = date;
        	var thisMonth = month;
        	if (date <= 0) {
        		thisMonth = month - 1;
        		showDate = lastDateOfLastMonth + date;
        	}else if (date > lastDate) {
        		thisMonth = month + 1;
        		showDate = showDate -lastDate;
        	}
        	if(thisMonth === 0){
        		thisMonth = 12;
        	}
        	if(thisMonth === 13){
        		thisMonth = 1
        	}
        	ret.push({
        		month:thisMonth,
        		date:date,
        		showDate:showDate
        	})
        }

        return {
        	year : year,
        	month : month,
        	days : ret
        }

   	 },
   	 buildUI : function(year,month){
   	 	monthData = this.getMonthDate(year,month);
   	    var html = '<div class="ui-datepicker-header">'+
                    '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>'+
                    '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>'+
                    '<span class="ui-datepicker-curr-month">'+monthData.year+'-'+monthData.month+'</span>'+
                '</div>'+
                '<div class="ui-datepicker-body">'+
                '<table>'+
                '<thead>'+
                       '<tr>'+
                           '<th>一</th>'+
                           '<th>二</th>'+
                           '<th>三</th>'+
                           '<th>四</th>'+
                           '<th>五</th>'+
                           '<th>六</th>'+
                           '<th>日</th>'+
                       '</tr>'+
                   '</thead>'+
                   '<tbody>';
            for(var i = 0; i < monthData.days.length;i++){
            	var date = monthData.days[i];
            	if(i%7 === 0){
            		html += '<tr>';
            	}
            	html +='<td data-date="'+date.date+'">' + date.showDate + '</td>';
                if(i%7 === 6){
                	html +='</tr>';
                }
            }
            html +='</tbody>'+
                '</table>';
        return html;
   	 },
   	 render : function(direction){
       var year,month;
       if (monthData) {
       	  year = monthData.year;
       	  month = monthData.month;
       }
       if (direction === 'prev') {month--}
       if (direction === 'next') {month++}
        var html = this.buildUI(year,month);
        $wrapper=document.querySelector('.ui-datepicker-wrapper');

        if(!$wrapper){
            $wrapper = document.createElement('div');
            $wrapper.className = 'ui-datepicker-wrapper';
        }

        $wrapper.innerHTML = html;
        document.body.appendChild($wrapper);
   	 },
   	 init : function($input){
       this.render();
       var $input = document.querySelector($input);
               var isOpen = false;
        $input.addEventListener('click',function(){
            if(isOpen){
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            }else{
                $wrapper.classList.add('ui-datepicker-wrapper-show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop;
                var height = $input.offsetHeight;
                $wrapper.style.top = top + height + 2 + 'px';
                $wrapper.style.left = left + 'px';
                isOpen = true;
            }
        },false);
        var that = this;
        $wrapper.addEventListener('click',function(e){
            var $target = e.target;
            if (!$target.classList.contains('ui-datepicker-btn')) {
                return false;
            }

            if ($target.classList.contains('ui-datepicker-prev-btn')) {
                that.render('prev');
            }else if ($target.classList.contains('ui-datepicker-next-btn')) {
                that.render('next');    
            }
            },false);

        $wrapper.addEventListener('click',function(e){
            var $target = e.target;

            if ($target.tagName.toLocaleLowerCase()!=='td') {
                return false;
            }

            var date = new Date(monthData.year, monthData.month-1, $target.dataset.date);
           
            $input.value = format(date);

            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = false;
        },false);

        function format(date){
            var ret = '';
            var padding = function(num){
                if (num <= 9) {
                    return '0' + num;
                }
                return num;
            };

            ret += date.getFullYear() + '-';
            ret += padding(date.getMonth()+1)+'-';
            ret += padding(date.getDate());

            return ret;
        }
   	 }
   };
     window.datePicker = new DatePicker();
})(window)
newDate = new Date();
newYear = newDate.getFullYear();
newMonth = newDate.getMonth()+1;
var monthData = datePicker.getMonthDate(newYear,newMonth);
datePicker.init('.datePicker');