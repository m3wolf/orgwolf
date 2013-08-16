/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function(f,b,g){var a=/\+/g;function e(h){return h}function c(h){return decodeURIComponent(h.replace(a," "))}var d=f.cookie=function(p,o,u){if(o!==g){u=f.extend({},d.defaults,u);if(o===null){u.expires=-1}if(typeof u.expires==="number"){var q=u.expires,s=u.expires=new Date();s.setDate(s.getDate()+q)}o=d.json?JSON.stringify(o):String(o);return(b.cookie=[encodeURIComponent(p),"=",d.raw?o:encodeURIComponent(o),u.expires?"; expires="+u.expires.toUTCString():"",u.path?"; path="+u.path:"",u.domain?"; domain="+u.domain:"",u.secure?"; secure":""].join(""))}var h=d.raw?e:c;var r=b.cookie.split("; ");for(var n=0,k=r.length;n<k;n++){var m=r[n].split("=");if(h(m.shift())===p){var j=h(m.join("="));return d.json?JSON.parse(j):j}}return null};d.defaults={};f.removeCookie=function(i,h){if(f.cookie(i)!==null){f.cookie(i,null,h);return true}return false}})(jQuery,document);!function(c){var a=function(e,d){this.element=c(e);this.format=b.parseFormat(d.format||this.element.data("date-format")||"mm/dd/yyyy");this.picker=c(b.template).appendTo("body").on({click:c.proxy(this.click,this)});this.isInput=this.element.is("input");this.component=this.element.is(".date")?this.element.find(".add-on"):false;if(this.isInput){this.element.on({focus:c.proxy(this.show,this),keyup:c.proxy(this.update,this)})}else{if(this.component){this.component.on("click",c.proxy(this.show,this))}else{this.element.on("click",c.proxy(this.show,this))}}this.minViewMode=d.minViewMode||this.element.data("date-minviewmode")||0;if(typeof this.minViewMode==="string"){switch(this.minViewMode){case"months":this.minViewMode=1;break;case"years":this.minViewMode=2;break;default:this.minViewMode=0;break}}this.viewMode=d.viewMode||this.element.data("date-viewmode")||0;if(typeof this.viewMode==="string"){switch(this.viewMode){case"months":this.viewMode=1;break;case"years":this.viewMode=2;break;default:this.viewMode=0;break}}this.startViewMode=this.viewMode;this.weekStart=d.weekStart||this.element.data("date-weekstart")||0;this.weekEnd=this.weekStart===0?6:this.weekStart-1;this.onRender=d.onRender;this.fillDow();this.fillMonths();this.update();this.showMode()};a.prototype={constructor:a,show:function(f){this.picker.show();this.height=this.component?this.component.outerHeight():this.element.outerHeight();this.place();c(window).on("resize",c.proxy(this.place,this));if(f){f.stopPropagation();f.preventDefault()}if(!this.isInput){}var d=this;c(document).on("mousedown",function(e){if(c(e.target).closest(".datepicker").length==0){d.hide()}});this.element.trigger({type:"show",date:this.date})},hide:function(){this.picker.hide();c(window).off("resize",this.place);this.viewMode=this.startViewMode;this.showMode();if(!this.isInput){c(document).off("mousedown",this.hide)}this.element.trigger({type:"hide",date:this.date})},set:function(){var d=b.formatDate(this.date,this.format);if(!this.isInput){if(this.component){this.element.find("input").prop("value",d)}this.element.data("date",d)}else{this.element.prop("value",d)}},setValue:function(d){if(typeof d==="string"){this.date=b.parseDate(d,this.format)}else{this.date=new Date(d)}this.set();this.viewDate=new Date(this.date.getFullYear(),this.date.getMonth(),1,0,0,0,0);this.fill()},place:function(){var d=this.component?this.component.offset():this.element.offset();this.picker.css({top:d.top+this.height,left:d.left})},update:function(d){this.date=b.parseDate(typeof d==="string"?d:(this.isInput?this.element.prop("value"):this.element.data("date")),this.format);this.viewDate=new Date(this.date.getFullYear(),this.date.getMonth(),1,0,0,0,0);this.fill()},fillDow:function(){var d=this.weekStart;var e="<tr>";while(d<this.weekStart+7){e+='<th class="dow">'+b.dates.daysMin[(d++)%7]+"</th>"}e+="</tr>";this.picker.find(".datepicker-days thead").append(e)},fillMonths:function(){var e="";var d=0;while(d<12){e+='<span class="month">'+b.dates.monthsShort[d++]+"</span>"}this.picker.find(".datepicker-months td").append(e)},fill:function(){var r=new Date(this.viewDate),s=r.getFullYear(),q=r.getMonth(),g=this.date.valueOf();this.picker.find(".datepicker-days th:eq(1)").text(b.dates.months[q]+" "+s);var k=new Date(s,q-1,28,0,0,0,0),t=b.getDaysInMonth(k.getFullYear(),k.getMonth());k.setDate(t);k.setDate(t-(k.getDay()-this.weekStart+7)%7);var n=new Date(k);n.setDate(n.getDate()+42);n=n.valueOf();var m=[];var j,p,e;while(k.valueOf()<n){if(k.getDay()===this.weekStart){m.push("<tr>")}j=this.onRender(k);p=k.getFullYear();e=k.getMonth();if((e<q&&p===s)||p<s){j+=" old"}else{if((e>q&&p===s)||p>s){j+=" new"}}if(k.valueOf()===g){j+=" active"}m.push('<td class="day '+j+'">'+k.getDate()+"</td>");if(k.getDay()===this.weekEnd){m.push("</tr>")}k.setDate(k.getDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(m.join(""));var o=this.date.getFullYear();var f=this.picker.find(".datepicker-months").find("th:eq(1)").text(s).end().find("span").removeClass("active");if(o===s){f.eq(this.date.getMonth()).addClass("active")}m="";s=parseInt(s/10,10)*10;var h=this.picker.find(".datepicker-years").find("th:eq(1)").text(s+"-"+(s+9)).end().find("td");s-=1;for(var l=-1;l<11;l++){m+='<span class="year'+(l===-1||l===10?" old":"")+(o===s?" active":"")+'">'+s+"</span>";s+=1}h.html(m)},click:function(i){i.stopPropagation();i.preventDefault();var h=c(i.target).closest("span, td, th");if(h.length===1){switch(h[0].nodeName.toLowerCase()){case"th":switch(h[0].className){case"switch":this.showMode(1);break;case"prev":case"next":this.viewDate["set"+b.modes[this.viewMode].navFnc].call(this.viewDate,this.viewDate["get"+b.modes[this.viewMode].navFnc].call(this.viewDate)+b.modes[this.viewMode].navStep*(h[0].className==="prev"?-1:1));this.fill();this.set();break}break;case"span":if(h.is(".month")){var g=h.parent().find("span").index(h);this.viewDate.setMonth(g)}else{var f=parseInt(h.text(),10)||0;this.viewDate.setFullYear(f)}if(this.viewMode!==0){this.date=new Date(this.viewDate);this.element.trigger({type:"changeDate",date:this.date,viewMode:b.modes[this.viewMode].clsName})}this.showMode(-1);this.fill();this.set();break;case"td":if(h.is(".day")&&!h.is(".disabled")){var d=parseInt(h.text(),10)||1;var g=this.viewDate.getMonth();if(h.is(".old")){g-=1}else{if(h.is(".new")){g+=1}}var f=this.viewDate.getFullYear();this.date=new Date(f,g,d,0,0,0,0);this.viewDate=new Date(f,g,Math.min(28,d),0,0,0,0);this.fill();this.set();this.element.trigger({type:"changeDate",date:this.date,viewMode:b.modes[this.viewMode].clsName})}break}}},mousedown:function(d){d.stopPropagation();d.preventDefault()},showMode:function(d){if(d){this.viewMode=Math.max(this.minViewMode,Math.min(2,this.viewMode+d))}this.picker.find(">div").hide().filter(".datepicker-"+b.modes[this.viewMode].clsName).show()}};c.fn.datepicker=function(d,e){return this.each(function(){var h=c(this),g=h.data("datepicker"),f=typeof d==="object"&&d;if(!g){h.data("datepicker",(g=new a(this,c.extend({},c.fn.datepicker.defaults,f))))}if(typeof d==="string"){g[d](e)}})};c.fn.datepicker.defaults={onRender:function(d){return""}};c.fn.datepicker.Constructor=a;var b={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],dates:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},isLeapYear:function(d){return(((d%4===0)&&(d%100!==0))||(d%400===0))},getDaysInMonth:function(d,e){return[31,(b.isLeapYear(d)?29:28),31,30,31,30,31,31,30,31,30,31][e]},parseFormat:function(f){var e=f.match(/[.\/\-\s].*?/),d=f.split(/\W+/);if(!e||!d||d.length===0){throw new Error("Invalid date format.")}return{separator:e,parts:d}},parseDate:function(f,m){var g=f.split(m.separator),f=new Date(),e;f.setHours(0);f.setMinutes(0);f.setSeconds(0);f.setMilliseconds(0);if(g.length===m.parts.length){var k=f.getFullYear(),l=f.getDate(),j=f.getMonth();for(var h=0,d=m.parts.length;h<d;h++){e=parseInt(g[h],10)||1;switch(m.parts[h]){case"dd":case"d":l=e;f.setDate(e);break;case"mm":case"m":j=e-1;f.setMonth(e-1);break;case"yy":k=2000+e;f.setFullYear(2000+e);break;case"yyyy":k=e;f.setFullYear(e);break}}f=new Date(k,j,l,0,0,0)}return f},formatDate:function(d,g){var h={d:d.getDate(),m:d.getMonth()+1,yy:d.getFullYear().toString().substring(2),yyyy:d.getFullYear()};h.dd=(h.d<10?"0":"")+h.d;h.mm=(h.m<10?"0":"")+h.m;var d=[];for(var f=0,e=g.parts.length;f<e;f++){d.push(h[g.parts[f]])}return d.join(g.separator)},headTemplate:'<thead><tr><th class="prev">&lsaquo;</th><th colspan="5" class="switch"></th><th class="next">&rsaquo;</th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>'};b.template='<div class="datepicker dropdown-menu"><div class="datepicker-days"><table class=" table-condensed">'+b.headTemplate+'<tbody></tbody></table></div><div class="datepicker-months"><table class="table-condensed">'+b.headTemplate+b.contTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+b.headTemplate+b.contTemplate+"</table></div></div>"}(window.jQuery);!function(b){var a=function(d,c){this.$element=b(d);this.options=b.extend({},b.fn.timepicker.defaults,c,this.$element.data());this.minuteStep=this.options.minuteStep||this.minuteStep;this.secondStep=this.options.secondStep||this.secondStep;this.showMeridian=this.options.showMeridian||this.showMeridian;this.showSeconds=this.options.showSeconds||this.showSeconds;this.showInputs=this.options.showInputs||this.showInputs;this.disableFocus=this.options.disableFocus||this.disableFocus;this.template=this.options.template||this.template;this.modalBackdrop=this.options.modalBackdrop||this.modalBackdrop;this.defaultTime=this.options.defaultTime||this.defaultTime;this.open=false;this.init()};a.prototype={constructor:a,init:function(){if(this.$element.parent().hasClass("input-append")){this.$element.parent(".input-append").find(".add-on").on("click",b.proxy(this.showWidget,this));this.$element.on({focus:b.proxy(this.highlightUnit,this),click:b.proxy(this.highlightUnit,this),keypress:b.proxy(this.elementKeypress,this),blur:b.proxy(this.blurElement,this)})}else{if(this.template){this.$element.on({focus:b.proxy(this.showWidget,this),click:b.proxy(this.showWidget,this),blur:b.proxy(this.blurElement,this)})}else{this.$element.on({focus:b.proxy(this.highlightUnit,this),click:b.proxy(this.highlightUnit,this),keypress:b.proxy(this.elementKeypress,this),blur:b.proxy(this.blurElement,this)})}}this.$widget=b(this.getTemplate()).appendTo("body");this.$widget.on("click",b.proxy(this.widgetClick,this));if(this.showInputs){this.$widget.find("input").on({click:function(){this.select()},keypress:b.proxy(this.widgetKeypress,this),change:b.proxy(this.updateFromWidgetInputs,this)})}this.setDefaultTime(this.defaultTime)},showWidget:function(c){c.stopPropagation();c.preventDefault();if(this.open){return}this.$element.trigger("show");if(this.disableFocus){this.$element.blur()}var d=b.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});this.updateFromElementVal();b("html").trigger("click.timepicker.data-api").one("click.timepicker.data-api",b.proxy(this.hideWidget,this));if(this.template==="modal"){this.$widget.modal("show").on("hidden",b.proxy(this.hideWidget,this))}else{this.$widget.css({top:d.top+d.height,left:d.left});if(!this.open){this.$widget.addClass("open")}}this.open=true;this.$element.trigger("shown")},hideWidget:function(){this.$element.trigger("hide");if(this.template==="modal"){this.$widget.modal("hide")}else{this.$widget.removeClass("open")}this.open=false;this.$element.trigger("hidden")},widgetClick:function(d){d.stopPropagation();d.preventDefault();var c=b(d.target).closest("a").data("action");if(c){this[c]();this.update()}},widgetKeypress:function(d){var c=b(d.target).closest("input").attr("name");switch(d.keyCode){case 9:if(this.showMeridian){if(c=="meridian"){this.hideWidget()}}else{if(this.showSeconds){if(c=="second"){this.hideWidget()}}else{if(c=="minute"){this.hideWidget()}}}break;case 27:this.hideWidget();break;case 38:switch(c){case"hour":this.incrementHour();break;case"minute":this.incrementMinute();break;case"second":this.incrementSecond();break;case"meridian":this.toggleMeridian();break}this.update();break;case 40:switch(c){case"hour":this.decrementHour();break;case"minute":this.decrementMinute();break;case"second":this.decrementSecond();break;case"meridian":this.toggleMeridian();break}this.update();break}},elementKeypress:function(d){var c=this.$element.get(0);switch(d.keyCode){case 0:break;case 9:this.updateFromElementVal();if(this.showMeridian){if(this.highlightedUnit!="meridian"){d.preventDefault();this.highlightNextUnit()}}else{if(this.showSeconds){if(this.highlightedUnit!="second"){d.preventDefault();this.highlightNextUnit()}}else{if(this.highlightedUnit!="minute"){d.preventDefault();this.highlightNextUnit()}}}break;case 27:this.updateFromElementVal();break;case 37:this.updateFromElementVal();this.highlightPrevUnit();break;case 38:switch(this.highlightedUnit){case"hour":this.incrementHour();break;case"minute":this.incrementMinute();break;case"second":this.incrementSecond();break;case"meridian":this.toggleMeridian();break}this.updateElement();break;case 39:this.updateFromElementVal();this.highlightNextUnit();break;case 40:switch(this.highlightedUnit){case"hour":this.decrementHour();break;case"minute":this.decrementMinute();break;case"second":this.decrementSecond();break;case"meridian":this.toggleMeridian();break}this.updateElement();break}if(d.keyCode!==0&&d.keyCode!==8&&d.keyCode!==9&&d.keyCode!==46){d.preventDefault()}},setValues:function(e){if(this.showMeridian){var c=e.split(" ");var d=c[0].split(":");this.meridian=c[1]}else{var d=e.split(":")}this.hour=parseInt(d[0],10);this.minute=parseInt(d[1],10);this.second=parseInt(d[2],10);if(isNaN(this.hour)){this.hour=0}if(isNaN(this.minute)){this.minute=0}if(this.showMeridian){if(this.hour>12){this.hour=12}else{if(this.hour<1){this.hour=1}}if(this.meridian=="am"||this.meridian=="a"){this.meridian="AM"}else{if(this.meridian=="pm"||this.meridian=="p"){this.meridian="PM"}}if(this.meridian!="AM"&&this.meridian!="PM"){this.meridian="AM"}}else{if(this.hour>=24){this.hour=23}else{if(this.hour<0){this.hour=0}}}if(this.minute<0){this.minute=0}else{if(this.minute>=60){this.minute=59}}if(this.showSeconds){if(isNaN(this.second)){this.second=0}else{if(this.second<0){this.second=0}else{if(this.second>=60){this.second=59}}}}if(this.$element.val()!=""){this.updateElement()}this.updateWidget()},setMeridian:function(c){if(c=="a"||c=="am"||c=="AM"){this.meridian="AM"}else{if(c=="p"||c=="pm"||c=="PM"){this.meridian="PM"}else{this.updateWidget()}}this.updateElement()},setDefaultTime:function(e){if(e){if(e==="current"){var c=new Date();var d=c.getHours();var g=Math.floor(c.getMinutes()/this.minuteStep)*this.minuteStep;var h=Math.floor(c.getSeconds()/this.secondStep)*this.secondStep;var f="AM";if(this.showMeridian){if(d===0){d=12}else{if(d>=12){if(d>12){d=d-12}f="PM"}else{f="AM"}}}this.hour=d;this.minute=g;this.second=h;this.meridian=f}else{if(e==="value"){this.setValues(this.$element.val())}else{this.setValues(e)}}if(this.$element.val()!=""){this.updateElement()}this.updateWidget()}else{this.hour=0;this.minute=0;this.second=0}},formatTime:function(c,f,d,e){c=c<10?"0"+c:c;f=f<10?"0"+f:f;d=d<10?"0"+d:d;return c+":"+f+(this.showSeconds?":"+d:"")+(this.showMeridian?" "+e:"")},getTime:function(){return this.formatTime(this.hour,this.minute,this.second,this.meridian)},setTime:function(c){this.setValues(c);this.update()},update:function(){this.updateElement();this.updateWidget()},blurElement:function(){this.highlightedUnit=undefined;this.updateFromElementVal()},updateElement:function(){var c=this.getTime();this.$element.val(c).change();switch(this.highlightedUnit){case"hour":this.highlightHour();break;case"minute":this.highlightMinute();break;case"second":this.highlightSecond();break;case"meridian":this.highlightMeridian();break}},updateWidget:function(){if(this.showInputs){this.$widget.find("input.bootstrap-timepicker-hour").val(this.hour<10?"0"+this.hour:this.hour);this.$widget.find("input.bootstrap-timepicker-minute").val(this.minute<10?"0"+this.minute:this.minute);if(this.showSeconds){this.$widget.find("input.bootstrap-timepicker-second").val(this.second<10?"0"+this.second:this.second)}if(this.showMeridian){this.$widget.find("input.bootstrap-timepicker-meridian").val(this.meridian)}}else{this.$widget.find("span.bootstrap-timepicker-hour").text(this.hour);this.$widget.find("span.bootstrap-timepicker-minute").text(this.minute<10?"0"+this.minute:this.minute);if(this.showSeconds){this.$widget.find("span.bootstrap-timepicker-second").text(this.second<10?"0"+this.second:this.second)}if(this.showMeridian){this.$widget.find("span.bootstrap-timepicker-meridian").text(this.meridian)}}},updateFromElementVal:function(d){var c=this.$element.val();if(c){this.setValues(c);this.updateWidget()}},updateFromWidgetInputs:function(){var c=b("input.bootstrap-timepicker-hour",this.$widget).val()+":"+b("input.bootstrap-timepicker-minute",this.$widget).val()+(this.showSeconds?":"+b("input.bootstrap-timepicker-second",this.$widget).val():"")+(this.showMeridian?" "+b("input.bootstrap-timepicker-meridian",this.$widget).val():"");this.setValues(c)},getCursorPosition:function(){var d=this.$element.get(0);if("selectionStart" in d){return d.selectionStart}else{if(document.selection){d.focus();var e=document.selection.createRange();var c=document.selection.createRange().text.length;e.moveStart("character",-d.value.length);return e.text.length-c}}},highlightUnit:function(){var c=this.$element.get(0);this.position=this.getCursorPosition();if(this.position>=0&&this.position<=2){this.highlightHour()}else{if(this.position>=3&&this.position<=5){this.highlightMinute()}else{if(this.position>=6&&this.position<=8){if(this.showSeconds){this.highlightSecond()}else{this.highlightMeridian()}}else{if(this.position>=9&&this.position<=11){this.highlightMeridian()}}}}},highlightNextUnit:function(){switch(this.highlightedUnit){case"hour":this.highlightMinute();break;case"minute":if(this.showSeconds){this.highlightSecond()}else{this.highlightMeridian()}break;case"second":this.highlightMeridian();break;case"meridian":this.highlightHour();break}},highlightPrevUnit:function(){switch(this.highlightedUnit){case"hour":this.highlightMeridian();break;case"minute":this.highlightHour();break;case"second":this.highlightMinute();break;case"meridian":if(this.showSeconds){this.highlightSecond()}else{this.highlightMinute()}break}},highlightHour:function(){this.highlightedUnit="hour";this.$element.get(0).setSelectionRange(0,2)},highlightMinute:function(){this.highlightedUnit="minute";this.$element.get(0).setSelectionRange(3,5)},highlightSecond:function(){this.highlightedUnit="second";this.$element.get(0).setSelectionRange(6,8)},highlightMeridian:function(){this.highlightedUnit="meridian";if(this.showSeconds){this.$element.get(0).setSelectionRange(9,11)}else{this.$element.get(0).setSelectionRange(6,8)}},incrementHour:function(){if(this.showMeridian){if(this.hour===11){this.toggleMeridian()}else{if(this.hour===12){return this.hour=1}}}if(this.hour===23){return this.hour=0}this.hour=this.hour+1},decrementHour:function(){if(this.showMeridian){if(this.hour===1){return this.hour=12}else{if(this.hour===12){this.toggleMeridian()}}}if(this.hour===0){return this.hour=23}this.hour=this.hour-1},incrementMinute:function(){var c=this.minute+this.minuteStep-(this.minute%this.minuteStep);if(c>59){this.incrementHour();this.minute=c-60}else{this.minute=c}},decrementMinute:function(){var c=this.minute-this.minuteStep;if(c<0){this.decrementHour();this.minute=c+60}else{this.minute=c}},incrementSecond:function(){var c=this.second+this.secondStep-(this.second%this.secondStep);if(c>59){this.incrementMinute();this.second=c-60}else{this.second=c}},decrementSecond:function(){var c=this.second-this.secondStep;if(c<0){this.decrementMinute();this.second=c+60}else{this.second=c}},toggleMeridian:function(){this.meridian=this.meridian==="AM"?"PM":"AM";this.update()},getTemplate:function(){if(this.options.templates[this.options.template]){return this.options.templates[this.options.template]}if(this.showInputs){var g='<input type="text" name="hour" class="bootstrap-timepicker-hour" maxlength="2"/>';var d='<input type="text" name="minute" class="bootstrap-timepicker-minute" maxlength="2"/>';var c='<input type="text" name="second" class="bootstrap-timepicker-second" maxlength="2"/>';var f='<input type="text" name="meridian" class="bootstrap-timepicker-meridian" maxlength="2"/>'}else{var g='<span class="bootstrap-timepicker-hour"></span>';var d='<span class="bootstrap-timepicker-minute"></span>';var c='<span class="bootstrap-timepicker-second"></span>';var f='<span class="bootstrap-timepicker-meridian"></span>'}var h='<table class="'+(this.showSeconds?"show-seconds":"")+" "+(this.showMeridian?"show-meridian":"")+'"><tr><td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td><td class="separator">&nbsp;</td><td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+(this.showSeconds?'<td class="separator">&nbsp;</td><td><a href="#" data-action="incrementSecond"><i class="icon-chevron-up"></i></a></td>':"")+(this.showMeridian?'<td class="separator">&nbsp;</td><td class="meridian-column"><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>':"")+"</tr><tr><td>"+g+'</td> <td class="separator">:</td><td>'+d+"</td> "+(this.showSeconds?'<td class="separator">:</td><td>'+c+"</td>":"")+(this.showMeridian?'<td class="separator">&nbsp;</td><td>'+f+"</td>":"")+'</tr><tr><td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td><td class="separator"></td><td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+(this.showSeconds?'<td class="separator">&nbsp;</td><td><a href="#" data-action="decrementSecond"><i class="icon-chevron-down"></i></a></td>':"")+(this.showMeridian?'<td class="separator">&nbsp;</td><td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>':"")+"</tr></table>";var e;switch(this.options.template){case"modal":e='<div class="bootstrap-timepicker modal hide fade in" style="top: 30%; margin-top: 0; width: 200px; margin-left: -100px;" data-backdrop="'+(this.modalBackdrop?"true":"false")+'"><div class="modal-header"><a href="#" class="close" data-dismiss="modal">×</a><h3>Pick a Time</h3></div><div class="modal-content">'+h+'</div><div class="modal-footer"><a href="#" class="btn btn-primary" data-dismiss="modal">Ok</a></div></div>';break;case"dropdown":e='<div class="bootstrap-timepicker dropdown-menu">'+h+"</div>";break}return e}};b.fn.timepicker=function(c){return this.each(function(){var f=b(this),e=f.data("timepicker"),d=typeof c=="object"&&c;if(!e){f.data("timepicker",(e=new a(this,d)))}if(typeof c=="string"){e[c]()}})};b.fn.timepicker.defaults={minuteStep:15,secondStep:15,disableFocus:false,defaultTime:"current",showSeconds:false,showInputs:true,showMeridian:true,template:"dropdown",modalBackdrop:false,templates:{}};b.fn.timepicker.Constructor=a}(window.jQuery);