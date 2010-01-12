/**
* Calendar Builder v0.1 (2009/09/02)
* @author Miller Medeiros (http://www.millermedeiros.com/)
* based on jQuery Calendar Widget Plugin - http://eisabainyo.net/demo/jquery.calendar-widget.php
* Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var CalendarBuilder = function(){
	var _monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		_dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		_now = new Date(),
		_thisMonth = _now.getMonth(),
		_thisYear = _now.getYear() + 1900,
		_thisDate = _now.getDate();
	/**
	* Build calendar
	* @param {Element}	target	Element where calendar should be build
	* @param {number}	[calendarMonth]	Calendar month (default is current month)
	* @param {Number}	[calendarYear]	Calendar year (defaul is current year)
	* @param {Array}	[markedDays]	Days to be marked
	* @param {Number}	[dayChars]	Number of chars on the day name (-1 for complete name : default)
	*/
	function build(target, calendarMonth, calendarYear, markedDays, dayChars) { 
		var calendar = '',
			nDayChars = (dayChars != null)? dayChars : -1,
			marked = (markedDays)? markedDays : [],
			month = (calendarMonth)? calendarMonth-1 : _thisMonth,
			year = (calendarYear)? calendarYear : _thisYear;
		//begin calendar
		calendar += '<div class="month-calendar">';
		calendar += '<h3 class="month-name">'+_monthNames[month]+' '+year+'</h3>';
		calendar += '<table class="calendar-month" id="c-'+(month+1)+'-'+Number(String(year).substr(2,2))+'" cellspacing="0">';	
		// days name
		if(dayChars != 0){
			calendar += '<tr>';
			for (d=0; d<7; d++) {
				calendar += '<th class="weekday">';
				calendar += (nDayChars != -1) ? (_dayNames[d]).substr(0,nDayChars) : _dayNames[d];
				calendar += '</th>';
			}
			calendar += '</tr>';
		}
		var firstDayDate = new Date(year,month,1),
        	firstDay = (firstDayDate.getDay()) ? firstDayDate.getDay() : 0,
			nDays = nDaysInMonth(month, year),
			prevMonth = (month == 0) ? 11 : month-1,
			prevYear = (prevMonth == 11) ? year - 1 : year,
			prevNDays = nDaysInMonth(prevMonth, prevYear) - firstDay,
			markedStr = String(marked)+',', //string used to check if day is marked
			curDate;
		// calandar days
        for (var j=0; j<42; j++){
          if (j < firstDay){
            calendar += '<td class="other-month">'+ (prevNDays+j+1) +'</td>';
		  } else if (j >= firstDay+nDays) {
			calendar += '<td class="other-month">'+ (j-firstDay-nDays+1) +'</td>';
          } else{
			curDate = j-firstDay+1;
            calendar += '<td class="current-month';
            calendar += (markedStr.search('\\b'+ curDate +',') >= 0)? ' marked' : ''; //search if the day is marked
			calendar += (year == _thisYear && month == _thisMonth && curDate == _thisDate)? ' today' : ''; //mark current day
            calendar += '">'+ curDate +'</td>';
          }
          if (j%7==6) calendar += '</tr>';
        }
        calendar += '</table></div>';
		target.innerHTML += calendar; //add calendar
	}
	// Get number of days in the month
	function nDaysInMonth(month,year)  {
		var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (month==1 && year%4==0 && (year%100!=0 || year%400==0)) return 29;
		else return daysInMonth[month];
	}
	// API
	return{
		build: build
	};
}();