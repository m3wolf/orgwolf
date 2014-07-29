/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function(f,b,g){var a=/\+/g;function e(h){return h}function c(h){return decodeURIComponent(h.replace(a," "))}var d=f.cookie=function(p,o,u){if(o!==g){u=f.extend({},d.defaults,u);if(o===null){u.expires=-1}if(typeof u.expires==="number"){var q=u.expires,s=u.expires=new Date();s.setDate(s.getDate()+q)}o=d.json?JSON.stringify(o):String(o);return(b.cookie=[encodeURIComponent(p),"=",d.raw?o:encodeURIComponent(o),u.expires?"; expires="+u.expires.toUTCString():"",u.path?"; path="+u.path:"",u.domain?"; domain="+u.domain:"",u.secure?"; secure":""].join(""))}var h=d.raw?e:c;var r=b.cookie.split("; ");for(var n=0,k=r.length;n<k;n++){var m=r[n].split("=");if(h(m.shift())===p){var j=h(m.join("="));return d.json?JSON.parse(j):j}}return null};d.defaults={};f.removeCookie=function(i,h){if(f.cookie(i)!==null){f.cookie(i,null,h);return true}return false}})(jQuery,document);"use strict";Array.prototype.order_by=function(g){var a,b,e,c,d,f;d=["opened","closed","scheduled_date","deadline_date"];a=/^(-)?(\S*)$/.exec(g);c=a[2];b=this.slice(0);if(a[1]==="-"){f=-1}else{f=1}e=function(i,h){var n,k,m,l,j;if(typeof i.fields==="undefined"||typeof h.fields==="undefined"){n=i[c];k=h[c]}else{if(i.fields.hasOwnProperty(c)&&h.fields.hasOwnProperty(c)){n=i.fields[c];k=h.fields[c]}else{n=i[c];k=h[c]}}m=Number(n);l=Number(k);if(i.pk===0){j=-1;f=1}else{if(h.pk===0){j=1;f=1}else{if(d.indexOf(c)>-1){j=new Date(n)-new Date(k)}else{if(m&&l){j=m-l}else{if(typeof n!=="string"){n=""}if(typeof k!=="string"){k=""}n=n.toUpperCase();k=k.toUpperCase();if(n<k){j=-1}else{if(n>k){j=1}else{j=0}}}}}}return j*f};b.sort(e);return b};Date.prototype.ow_date=function(){var a;a=this.getFullYear()+"-"+(this.getMonth()+1)+"-"+this.getDate();a=this.toISOString().slice(0,10);return a};"use strict";var HeadingFactory;angular.module("owServices",["ngResource","toaster"]).value("personaUser",null).factory("personaNavigator",["personaUser","$rootScope","$http","owWaitIndicator","activeState",function(d,a,e,c,b){if(typeof navigator.id!=="undefined"){navigator.id.watch({loggedInUser:d,onlogin:function(f){c.start_wait("medium","persona");e.post("/accounts/login/persona/",{assertion:f}).success(function(i,g,j,h){c.end_wait("medium","persona");b.user=i.user_id;a.$broadcast("refresh-data")}).error(function(i,g,h){navigator.id.logout();alert("Login failure: "+h)})},onlogout:function(){c.start_wait("medium","persona");e.post("/accounts/logout/persona/",{logout:true}).success(function(){window.location.reload()}).error(function(h,f,i,g){alert("Logout failure: ")})}})}return navigator}]).factory("owWaitIndicator",["$rootScope",function(a){var c,b;c={waitLists:{quick:[],medium:[],},start_wait:function(e,d){c.waitLists[e].push(d)},end_wait:function(f,e){var d,g;d=c.waitLists[f];if(d===undefined){e=f;d=[c.waitLists.quick,c.waitLists.medium]}else{d=[d]}for(g=0;g<d.length;g+=1){b(d[g],e)}},};b=function(f,d){var e;e=f.indexOf(d);while(e>-1){f.splice(e,1);e=f.indexOf(d)}};return c}]).factory("Heading",["$resource",function(b){var a=b("/gtd/nodes/:id/",{id:"@id",field_group:"@field_group"},{update:{method:"PUT"},create:{method:"POST"},});return a}]).factory("activeHeading",["Heading",function(b){var a;a={id:0,obj:null};a.activate=function(e,c){var d;this.id=parseInt(e,10)||0;if(this.id){d=angular.extend({},{id:this.id},c);this.obj=b.get(d)}else{this.obj=null}};a.ifActive=function(c){if(this.obj){this.obj.$promise.then(c)}};return a}]).value("todoStatesList",[{id:1,color:{red:0,green:0,blue:0,alpha:0,},abbreviation:"NEXT",},{id:2,color:{red:0,green:0,blue:0,alpha:0,}},]).factory("todoStates",["$resource","todoStatesList",function(d,c){var b,a;a=d("/gtd/todostates/");b=a.query();b=c;b.getState=function(g){var e,f;f=this.filter(function(h){return h.id===g});if(f.length>0){e=f[0]}else{e=null}return e};return b}]).factory("focusAreas",["$resource",function(a){return a("/gtd/focusareas/").query()}]);"use strict";angular.module("owDirectives",["ngAnimate","ngResource","ngCookies","owServices","toaster"]).directive("personaButton",["personaNavigator","personaUser",function(a,c){function b(f,e,d){e.on("click",function(){if(d.personaButton==="login"){a.id.request()}else{a.id.logout()}})}return{restrict:"AC",link:b}}]).directive("owSwitch",function(){function a(c,b,e,d){var g;g=b.find("input");function f(h){g.bootstrapSwitch("setState",h)}d.$formatters.push(f);g.on("switch-change",function(i,h){if(h.value!==d.$modelValue){c.$apply(function(){d.$setViewValue(h.value)})}});g.bootstrapSwitch()}return{link:a,require:"?ngModel",}}).directive("owWaitFeedback",["owWaitIndicator",function(b){function a(d,c,e){var f;f=c.find(".mask");f.hide();c.hide();d.$watchCollection(function(){return b.waitLists.quick.length},function(g){if(g>0){c.show()}else{c.hide()}});d.$watchCollection(function(){return b.waitLists.medium.length},function(g){if(g>0){c.show();f.show()}else{c.hide();f.hide()}})}return{link:a,scope:{},}}]).directive("owCurrentDate",function(){function a(c,b,d){var f;f=b.find("input");c.isEditable=false;function e(g){c.dateString=g.toDateString();c.dateModel=g.ow_date();return g}c.$watch("currentDate",function(g){return e(g)},true);f.on("blur",function(){c.$apply(function(){var g;c.isEditable=false;g=new Date(c.dateModel);if(isNaN(g)){e(c.currentDate)}else{c.currentDate.setDate(g.getUTCDate());c.currentDate.setMonth(g.getUTCMonth());c.currentDate.setYear(g.getUTCFullYear())}})})}return{link:a,templateUrl:"/static/current-date.html",scope:true,}}).directive("owDetails",["$timeout",function(a){function b(f,e,c){var d;f.editorId="edit-text-"+f.heading.id;f.heading.$get().then(function(g){f.headingText=g.text});a(function(){if(typeof tinymce!=="undefined"){tinymce.init({plugins:"charmap fullscreen hr image link table textcolor",toolbar:"undo redo | fullscreen | styleselect | bold italic forecolor backcolor superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | hr link image",inline:true,tools:"inserttable",mode:"exact",elements:f.editorId,setup:function(g){g.on("change",function(h){f.$apply(function(){f.heading.text=g.getContent();f.heading.$update()})})}})}});f.editText=function(g){g.stopPropagation();f.textIsEditable=true;f.textEditStatus=""};f.stopEditingText=function(){f.textIsEditable=false;if(typeof tinymce!=="undefined"){tinymce.remove("#"+f.editorId)}}}return{link:b,scope:{heading:"=owHeading"},templateUrl:"/static/details.html"}}]).directive("owEditable",["$resource","$rootScope","$timeout","owWaitIndicator","Heading","todoStates","focusAreas","toaster",function(i,g,b,h,c,a,f,d){function e(q,k,p){var s,n,r,l,m,o,j;q.focusAreas=f;q.todoStates=a;q.fields={};k.addClass("ow-editable");if(q.heading){h.start_wait("quick","editable");q.fields=c.get({id:q.heading.id});q.fields.$promise.then(function(){h.end_wait("editable")})}else{if(q.parent){q.fields.focus_areas=q.parent.focus_areas;q.fields.priority=q.parent.priority;q.fields.parent=q.parent.id}else{q.fields.focus_areas=[];q.fields.priority="B";if(g.activeFocusArea&&g.activeFocusArea.id>0){q.fields.focus_areas.push(g.activeFocusArea.id)}}}q.priorities=[{sym:"A",display:"A - high"},{sym:"B",display:"B - medium (default)"},{sym:"C",display:"C - low"}];q.time_units=[{value:"d",label:"Days"},{value:"w",label:"Weeks"},{value:"m",label:"Months"},{value:"y",label:"Years"},];q.repeat_schemes=[{value:false,label:"scheduled date"},{value:true,label:"completion date"},];n=k.find(".edit-text");l=k.find("#edit-save");$("html").animate({scrollTop:k.offset().top-27},"500");q.save=function(u){var t;q.fields.text=tinyMCE.get(q.editorId).getContent();if(q.heading){t=c.update(q.fields)}else{t=c.create(q.fields)}t.$promise.then(function(v){d.pop("success","Saved");q.endEdit(t)})["catch"](function(v){d.pop("error","Error, not saved!","Check your internet connection and try again.");console.log("Save failed:");console.log(v)})};q.editorId="editable-text-";if(q.heading){q.editorId+=q.heading.id}else{if(q.parent){q.editorId+="child-"+q.parent.id}else{q.editorId+="new"}}b(function(){if(typeof tinymce!=="undefined"){tinymce.init({plugins:"charmap fullscreen hr image link table textcolor",toolbar:"undo redo | fullscreen | styleselect | bold italic forecolor backcolor superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | hr link image",inline:true,tools:"inserttable",mode:"exact",elements:q.editorId,auto_focus:false})}k.find("#title").focus()});q.cancelEdit=function(t){q.endEdit(t)};q.endEdit=function(t){q.$emit("finishEdit",t);q.$parent.$parent.$eval(q.finishCallback)}}return{link:e,scope:{heading:"=owHeading",parent:"=owParent",finishCallback:"@owEditFinish",},require:"?ngModel",templateUrl:"/static/editable.html"}}]).directive("owFocusAreaTabs",["$resource","$rootScope","$timeout","focusAreas",function(c,a,b,e){function d(h,g,f){var i={id:0,display:"All"};h.focusAreas=[i];e.$promise.then(function(j){h.focusAreas=h.focusAreas.concat(j)});h.activeFocusArea=i;a.activeFocusArea=i;b(function(){g.find("#fa-tab-0").addClass("active")});h.changeFocusArea=function(j){g.find("#fa-tab-"+h.activeFocusArea.id).removeClass("active");h.activeFocusArea=j;a.activeFocusArea=j;g.find("#fa-tab-"+h.activeFocusArea.id).addClass("active");a.$broadcast("focus-area-changed",j)}}return{link:d,scope:{},templateUrl:"/static/focus-area-tabs.html"}}]).directive("owTodo",["$rootScope","$filter","todoStates","toaster",function(a,e,f,b){function c(q,j,p){var k,n,h,l,g,m,r,o;j.addClass("todo-state-widget");q.todoState=f.getState(q.heading.todo_state);q.todoStateId=q.heading.todo_state;q.$watch("todoStateId",function(s,t){if(s!==q.heading.todo_state){var i;q.heading.todo_state=parseInt(s,10);q.todoState=f.getState(q.heading.todo_state);q.heading.auto_update=true;i=q.heading.scheduled_date;q.heading.$update().then(function(v){if(v.scheduled_date!==i){var u="Rescheduled for ";u+=v.scheduled_date;b.pop("info",null,u)}})["catch"](function(u){b.pop("error","Error, not saved!","Check your internet connection and try again.");console.log("Save failed:");console.log(u)})}});q.$watch(function(){return q.heading.todo_state},function(i){if(i!==q.todoStateId){q.todoState=f.getState(q.heading.todo_state);q.todoStateId=i}if(q.todoState){j.tooltip({delay:{show:1000,hide:100},title:q.todoState.display_text,})}})}function d(n,k){var j,l,m,g;j=n.find("select");for(l=0;l<f.length;l+=1){g=f[l];m='<option value="'+g.id+'" ';m+='style="'+e("todoStateStyle")(g)+'">';m+=g.abbreviation+"</option>";j.append(m)}return c}return{compile:d,scope:{heading:"=owHeading"},templateUrl:"/static/todo-state-selector.html",}}]).directive("owTwisty",["$compile","$rootScope","Heading","activeHeading",function(b,a,d,f){function c(k,i,h){var j,g;k.isEditing=false;k.loadedChildren=false;k.state=0;i.addClass("state-"+k.state);k.showArchived=a.showArchived;if(a.todoStates){k.todoStates=a.todoStates}else{k.todoStates=[]}if(k.todoState&&k.todoState.actionable){i.find(".ow-hoverable").addClass("actionable")}k.$on("toggle-archived",function(m,l){k.showArchived=l});if(k.heading.level===0){i.find(".ow-hoverable").addClass("project")}i.addClass("heading");j=i.children(".ow-hoverable");k.tags=k.heading.tag_string.slice(1,-1).split(":");k.$watch("heading.rght - heading.lft",function(l){if(l>1){j.removeClass("leaf-node");k.isLeafNode=false}else{j.addClass("leaf-node");k.isLeafNode=true}});k.getChildren=function(){if(!k.loadedChildren){k.children=d.query({parent_id:k.heading.id,field_group:"outline"});k.children.$promise.then(function(l){k.numArchived=l.filter(function(m){return m.archived===true}).length;k.loadedChildren=true})}};k.$on("open-descendants",function(l){if(l.targetScope!==l.currentScope){k.toggleHeading(1)}});if(k.heading.level>0){k.getChildren()}k.toggleHeading=function(l){i.removeClass("state-"+k.state);if(/^\d+$/.test(l)){k.state=l%3}else{if($(l.target).is(":not(.non-opening)")){k.state=(k.state+1)%3;if(k.isLeafNode&&k.state===1){k.state=2}}}i.addClass("state-"+k.state);if(k.state>0){k.getChildren()}if(k.state===2){k.$broadcast("open-descendants")}};k.edit=function(m){var l;m.stopPropagation();k.isEditing=true;l=k.$on("finishEdit",function(o,n){k.isEditing=false;o.stopPropagation();if(n){angular.extend(k.heading,n);if(k.heading.todo_state){k.todoState=k.todoStates.filter(function(p){return p.id===k.heading.todo_state})[0]}else{k.todoState=null}}l()})};k.createChild=function(m){var l;m.stopPropagation();if(k.state===0){k.toggleHeading(1)}k.newChild=true;l=k.$on("finishEdit",function(o,n){k.newChild=false;o.stopPropagation();if(n){k.children.push(n)}l()})};k.archive=function(l){l.stopPropagation();k.heading.archived=!k.heading.archived;k.heading.$update()};f.ifActive(function(m){var l=(m.tree_id===k.heading.tree_id&&m.lft>k.heading.lft&&m.rght<k.heading.rght);if(m.id===k.heading.id){i.addClass("active-heading")}else{if(l){k.toggleHeading(1)}}})}function e(i,g){var h,j;j=i.contents().remove();return function(l,m,k){if(!h){h=b(j)}h(l,function(o,n){m.append(o);c(n,m,k)})}}return{compile:e,templateUrl:"/static/outline-twisty.html",scope:{heading:"=owHeading",},}}]).directive("owListRow",["$rootScope","todoStates","$filter",function(a,d,c){function b(i,h,g){var f,e;e=$(h);h.addClass("heading-row");h.addClass("priority"+(i.heading.priority||"B"));i.todoState=d.getState(i.heading.todo_state);i.$watch(function(){return i.heading.deadline_date},function(n){var k,m,j,l;m=null;if(n){j=new Date();l=new Date(n);i.owDate=c("deadline_str")(n);m=l-j}h.removeClass("overdue");h.removeClass("upcoming");if(m===null){k=""}else{if(m<=0){k="overdue"}else{if(7*86400000>m>0){k="upcoming"}}}h.addClass(k)});i.$watch("heading.fields.archived",function(j){if(j){h.addClass("archived")}});i.$watch("heading.fields.priority",function(j,k){if(k){h.removeClass("priority-"+k)}if(j){h.addClass("priority-"+j)}});i.edit=function(){var j;i.isEditable=true;j=i.$on("finishEdit",function(k){i.isEditable=false;j()})};i.$on("finishEdit",function(k,j){k.stopPropagation();angular.extend(i.heading,j)})}return{link:b,scope:{heading:"=owHeading",owDate:"@",},templateUrl:"/static/actions-list-row.html",}}]);"use strict";var owFilters=angular.module("owFilters",["ngSanitize","owServices"]);owFilters.filter("is_target",function(){return function(c,b){var a="";if(b){if(c.pk===b.id){a="yes"}else{if(c.fields.tree_id===b.tree_id&&c.fields.lft<b.lft&&c.fields.rght>b.rght){a="ancestor"}}}return a}});owFilters.filter("slugify",function(){return function(a){var b;if(a!==undefined){b=a.toLowerCase().replace(/[^a-z_]/g,"-")}return b}});owFilters.filter("todoStateStyle",function(){return function(b){var a,d;a="";if(b===null||b===undefined){a=null}else{d=b.color;a+="color: rgba("+d.red+", "+d.green+", ";a+=d.blue+", "+d.alpha+"); "}return a}});owFilters.filter("headingStyle",function(){return function(d){var c,a,b;c="";if(d.level>0){a=["rgb(80, 0, 0)","rgb(0, 44, 19)","teal","slateblue","brown"];b=(d.level)%a.length;c+="color: "+a[b-1]+"; "}return c}});owFilters.filter("asHtml",["$sce",function(a){return function(c){var b=a.trustAsHtml(c);return b}}]);owFilters.filter("order",["$sce",function(a){return function(g,f,h){var c,e,b,d;if(f==="list"){b=g.filter(function(k){var j,l,i,m;i=false;if(k.deadline_date===null){i=true}else{j=new Date();l=new Date(k.deadline_date);m=l-j;if(m>(7*24*3600*1000)){i=true}}return i});e=$(g).not(b).get().order_by("deadline_date");c=e;c=c.concat(b.order_by("priority"))}else{if(f==="none"){c=g}else{c=g.order_by(f)}}if(h){for(d=0;d<c.length;d+=1){if(c[d].tree_id===h.tree_id){c.unshift(c.splice(d,1)[0])}}}return c}}]);owFilters.filter("currentList",function(){return function(d,e,a,b){var c;if(e){d=d.filter(function(f){return e.indexOf(f.todo_state)>-1})}if(a){c=a.map(function(f){return f.id});d=d.filter(function(f){return c.indexOf(f.id)===-1})}if(b){d=d.filter(function(g){var f;if(g.tree_id===b.tree_id&&g.lft>=b.lft&&g.rght<=b.rght){f=true}else{f=false}return f})}return d}});owFilters.filter("deadline_str",["$sce",function(a){return function(d,b){var f,c,e,g;if(typeof b==="undefined"){b=new Date()}f="";if(d){f="Due ";c=new Date(d+"T12:00:00");b.setHours(12,0,0,0);e=c.getTime()-b.getTime();g=Math.ceil(e/(1000*3600*24));if(g===0){f+="today"}else{if(g===-1){f+="yesterday"}else{if(g<0){f+=Math.abs(g)+" days ago"}else{if(g===1){f+="tomorrow"}else{if(g>0){f+="in "+g+" days"}}}}}}return f}}]);owFilters.filter("duration",function(){return function(b){var e,h,f,c,i,a,d,g;h=f=c=0;if(b.scheduled_time&&b.end_time){a=new Date(b.scheduled_date+"T"+b.scheduled_time);d=new Date(b.end_date+"T"+b.end_time)}else{a=new Date(b.scheduled_date);d=new Date(b.end_date)}g=d.getTime()-a.getTime();h=Math.floor(g/(1000*3600*24));g=g%(1000*3600*24);f=Math.floor(g/(1000*3600));g=g%(1000*3600);c=Math.floor(g/(1000*60));i=function(k,m,j){var l="";if(k){l+=k+" ";if(Math.abs(k)>1){l+=j}else{l+=m}l+=", "}return l};e="";if(h){e+=i(h,"day","days")}if(f){e+=i(f,"hour","hours")}if(c){e+=i(c,"minute","minutes")}e=e.substring(0,e.length-2);return e}});owFilters.filter("currentFocusArea",["$rootScope",function(a){return function(f,c){var d,e,b;if(typeof c==="undefined"&&a.activeFocusArea){b=parseInt(a.activeFocusArea.id,10)}else{if(c){b=parseInt(c.id,10)}else{b=0}}if(b){e=[];for(d=0;d<f.length;d+=1){if(f[d].focus_areas.indexOf(b)>-1){e.push(f.slice(d,d+1)[0])}}}else{e=f.slice(0)}return e}}]);owFilters.filter("listFocusAreas",["focusAreas",function(a){return function(h){var d,g,c,e,b,j;b=[];g=function(f){return f.id===h.focus_areas[c]};for(c=0;c<h.focus_areas.length;c+=1){j=a.filter(g)[0];b.push(j)}d="";for(c=0;c<b.length;c+=1){e=b[c];if(c===0){d+=e.display}else{if(c===(b.length-1)&&b.length>1){d+=" and "+e.display}else{d+=", "+e.display}}}return d}}]).filter("highlightSearch",[function(){return function(d,a){var b,c;c=new RegExp(a,"ig");d=d.replace(c,'<span class="highlight">$&</span>');return d}}]).filter("highlightSearchText",[function(){return function(e,c){var d,a,b;e=String(e).replace(/<[^>]+>/gm,"");d=new RegExp(c,"ig");b=e.search(d);if(b>-1){if(b>40){e="&hellip;"+e.slice(b-40)}if(e.length>500){e=e.slice(0,500);e+="&hellip;"}}else{e=""}return e}}]);"use strict";var test_headings,owConfig,HeadingFactory,outlineCtrl,listCtrl;var owMain=angular.module("owMain",["ngAnimate","ngResource","ngSanitize","ngRoute","ngCookies","ui.bootstrap","ui.calendar","toaster","owServices","owDirectives","owFilters"]).config(["$routeProvider","$locationProvider",function(b,a){a.html5Mode(true);b.when("/gtd/actions/:context_id?/:context_slug?",{templateUrl:"/static/actions-list.html",controller:"nextActionsList",reloadOnSearch:false,}).when("/gtd/projects/",{templateUrl:"/static/project-outline.html",controller:"nodeOutline"}).when("/search/",{templateUrl:"/static/search-results.html",controller:"search"}).when("/calendar/",{templateUrl:"/static/calendar.html",controller:"calendar"}).when("/",{redirectTo:"/gtd/projects/"})}]).config(["$httpProvider","$locationProvider",function(d,b){d.defaults.headers.common["X-Request-With"]="XMLHttpRequest";d.defaults.xsrfCookieName="csrftoken";d.defaults.xsrfHeaderName="X-CSRFToken";function a(e){var j,h,g,f;j=null;if(document.cookie&&document.cookie!==""){h=document.cookie.split(";");for(g=0;g<h.length;g+=1){f=jQuery.trim(h[g]);if(f.substring(0,e.length+1)===(e+"=")){j=decodeURIComponent(f.substring(e.length+1));break}}}return j}var c=a("csrftoken");$.ajaxSetup({beforeSend:function(e){e.setRequestHeader("X-CSRFToken",c)}})}]).run(["$rootScope","$resource",function(b,e){var a,d,f,c;d=e("/gtd/contexts/");b.contexts=d.query()}]);owMain.run(["$rootScope","$location",function(a,b){a.$on("$routeChangeSuccess",function(){if(typeof ga!=="undefined"){ga("send","pageview",{page:b.path()})}})}]);owMain.controller("inboxCapture",["$scope","$rootScope","owWaitIndicator",function(b,a,c){b.capture=function(f){var g,d,h;d={handler_path:"plugins.quickcapture"};h=$(f.target).find("#new_inbox_item");d.subject=h.val();c.start_wait("medium","quickcapture");$.ajax("/wolfmail/message/",{type:"POST",data:d,complete:function(){b.$apply(function(){c.end_wait("quickcapture")})},success:function(){h.val("");a.$emit("refresh_messages")},error:function(j,e,i){alert("Failed!");console.log(e);console.log(i)}})}}]);owMain.controller("nodeOutline",["$scope","$rootScope","$http","$resource","$filter","Heading","$location","$anchorScroll","owWaitIndicator","activeHeading",outlineCtrl]);function outlineCtrl(s,l,w,k,r,t,i,g,o,m){var n,h,f,q,j,u,d,e,p,c,x,b,v;b=$("#add-heading");v=$("#show-all");m.activate(i.hash().split("-")[0]);s.activeHeading=m;function a(){s.children=t.query({parent_id:0,archived:false,field_group:"outline"})}a();s.activeScope=null;s.sortField="title";s.sortFields=[{key:"title",display:"Title"},{key:"-title",display:"Title (reverse)"},{key:"-opened",display:"Creation date"},{key:"opened",display:"Creation date (oldest first)"},];if(s.parent_id===""){s.parent_id=0}else{s.parent_id=parseInt(s.parent_id,10)}l.showArchived=false;if(s.parent_id){p=t.query({tree_id:d,level__lte:e+1});s.headings.add(p);p.$promise.then(function(){var z,y;z=s.headings.get({pk:s.parent_id});y=function(B){var A;B.toggle("open");B.update();A=B.get_parent();if(A.rank!==0){y(A)}};if(z.fields.archived){l.showArchived=true}y(z);z.editable=true})}s.showAll=function(z){var y;l.showArchived=!l.showArchived;v.toggleClass("active");if(!s.arx_cached){y=t.query({parent_id:0,archived:true});y.$promise.then(function(){s.children=s.children.concat(y)});s.arx_cached=true}s.$broadcast("toggle-archived",l.showArchived)};s.addProject=function(z){var y;s.newProject=!s.newProject;b.toggleClass("active");y=s.$on("finishEdit",function(B,A){B.stopPropagation();s.newProject=false;b.removeClass("active");if(A){s.sortFields.unshift({key:"none",display:"None"});s.children=r("order")(s.children,s.sortField);s.sortField="none";s.children.unshift(A)}y()})};s.$on("refresh-data",a);s.$on("focus-area-changed",function(z,y){s.activeFocusArea=y})}owMain.controller("nextActionsList",["$sce","$scope","$resource","$location","$routeParams","$filter","Heading","todoStates","owWaitIndicator","$cookies",listCtrl]);function listCtrl(h,n,d,c,b,j,q,s,g,l){var r,f,o,t,e,m,k,p;n.list_params={field_group:"actions_list"};n.showArchived=true;n.todoStates=s;n.activeScope=null;if(typeof b.context_id!=="undefined"){n.activeContext=parseInt(b.context_id,10);n.contextName=b.context_slug;n.list_params.context=n.activeContext}else{n.activeContext=null}n.show_list=true;function a(){n.parentId=c.search().parent;p=c.search().todo_state;if(p){if(!Array.isArray(p)){p=[p]}p=p.map(function(i){return parseInt(i,10)})}else{p=[2]}n.cachedStates=p.slice(0);n.activeStates=p.slice(0);n.list_params.todo_state=n.activeStates}a();n.$on("$routeUpdate",a);n.$on("filter-parent",function(i,u){n.parentId=u;e(n)});n.$watch("parentId",function(i){if(i){n.activeParent=q.get({id:i});n.activeParent.$promise.then(n.setVisibleHeadings)}else{n.activeParent=null;n.setVisibleHeadings()}});n.currentDate=new Date();n.$watch("currentDate",function(){n.$emit("refresh_list")},true);n.setVisibleHeadings=function(){var i=j("currentList");n.visibleHeadings=[];if(n.upcomingList){n.visibleHeadings=n.visibleHeadings.concat(n.upcomingList);n.visibleHeadings=n.visibleHeadings.concat(i(n.actionsList,n.activeStates,n.upcomingList,n.activeParent))}};n.$watchCollection("actionsList",function(){n.setVisibleHeadings()});n.$watchCollection("upcomingList",function(){n.setVisibleHeadings()});n.refreshList=function(){var i,u;n.isLoading=true;g.start_wait("quick","loadLists");n.completedRequests=[];n.actionsList=q.query(n.list_params);i=angular.extend({upcoming:n.currentDate.ow_date()},n.list_params);n.upcomingList=q.query(i);n.scheduledList=q.query({field_group:"actions_list",scheduled_date__lte:n.currentDate.ow_date(),todo_state:8});u=n.$watch(function(){return(n.actionsList.$resolved&&n.upcomingList.$resolved&&n.scheduledList.$resolved)},function(v){n.isLoading=!v;if(v){g.end_wait("quick","loadLists");u()}})};n.$on("refresh_list",n.refreshList);n.$on("refresh-data",n.refreshList);n.$on("focus-area-changed",function(u,i){n.activeFocusArea=i});n.toggleTodoState=function(v){var u=n.activeStates.indexOf(v.id);if(u>-1){n.activeStates.splice(u,1)}else{n.activeStates.push(v.id)}e(n)};n.$watchCollection("activeStates",function(u,w){var i,v;v={};v.todo_state=u.filter(function(x){return n.cachedStates.indexOf(x)===-1});if(v.todo_state.length>0){i=q.query(v);i.$promise.then(function(){n.cachedStates=n.cachedStates.concat(v.todo_state);n.actionsList=n.actionsList.concat(i)})}n.setVisibleHeadings()});e=function(v){var u,i;u="/gtd/actions";if(v.activeContext){u+="/"+v.activeContext;u+="/"+v.contextName.toLowerCase().replace(/ /g,"-").replace(/[^\w\-]+/g,"")}c.path(u);i={};if(n.parentId){i.parent=n.parentId}i.todo_state=n.activeStates;c.search(i)};n.changeContext=function(){var i,v,u,w;n.list_params.context=n.activeContext||0;if(n.activeContext){n.contextName=n.contexts.filter(function(x){return x.id===n.activeContext})[0].name}else{delete n.contextName}n.list_params.todo_state=n.activeStates;n.$emit("refresh_list");e(n);l.activeContext=String(n.activeContext);i=$("#nav-actions");v=i.find(".nav-text");u=i.find("a");w=n.contexts.filter(function(x){return x.id===n.activeContext});if(w.length===1){v.text(w[0].name+" Actions")}else{v.text("Next Actions")}u.attr("href",c.absUrl())}}owMain.controller("search",["$scope","$location","Heading",function(g,d,f){var c,e,h,j,a,b;g.rawResults=[];g.queryString=d.search().q.replace("+"," ");g.queries=g.queryString.split(" ");b=function(i){g.rawResults=g.results.concat(i)};for(c=0;c<g.queries.length;c+=1){e=g.queries[c];f.query({title__contains:e}).$promise.then(b);f.query({text__contains:e}).$promise.then(b)}g.$watchCollection("rawResults",function(){h=[];g.results=[];for(c=0;c<g.rawResults.length;c+=1){j=g.rawResults[c];if(h.indexOf(j.id)===-1){g.results.push(j);h.push(j.id)}}});a="";for(c=0;c<g.queries.length;c+=1){a+="|"+g.queries[c]}if(g.queries.length>0){a=a.slice(1)}g.reString=a}]).controller("calendar",["$scope","Heading","$filter","$modal",function(b,f,g,e){var c,h,a,i;b.activeCalendars=[];c=new Date();h=c.getDate();a=c.getMonth();i=c.getFullYear();b.toggleCalendar=function(j){var d;d=b.activeCalendars.indexOf(j.calId);if(d>-1){b.activeCalendars.splice(d,1)}else{b.activeCalendars.push(j.calId)}b.owCalendar.fullCalendar("render")};b.allCalendars=[];b.refreshCalendars=function(){var d,j,k;d={calId:1,order:10,name:"Scheduled tasks [HARD]",color:"rgb(92, 0, 92)",textColor:"white",field_group:"calendar",events:f.query({field_group:"calendar",todo_state__abbreviation:"HARD",archived:false}),};j={calId:2,order:20,name:"Reminders [DFRD]",color:"rgb(230, 138, 0)",textColor:"white",field_group:"calendar",events:f.query({field_group:"calendar",todo_state__abbreviation:"DFRD",archived:false}),};k={calId:3,order:30,name:"Deadlines",color:"rgb(204, 0, 0)",textColor:"white",field_group:"calendar_deadlines",events:f.query({field_group:"calendar_deadlines",deadline_date__gt:"1970-01-01",archived:false}),};b.allCalendars.length=0;b.allCalendars.push(d);b.allCalendars.push(j);b.allCalendars.push(k)};b.$on("refresh-data",b.refreshCalendars);b.refreshCalendars();b.editEvent=function(l){var k,d,j;k=b.$new(true);k.editableEvent=l;j=e.open({scope:k,templateUrl:"edit-modal",windowClass:"calendar-edit"});d=b.$on("finishEdit",function(n,m){l.$get();j.close();d()})};b.moveEvent=function(p,j,d){var m,l,o,k,n;if(p.field_group==="calendar_deadlines"){k="deadline_date";n="deadline_time"}else{k="scheduled_date";n="scheduled_time"}m={id:p.id};o=p.start.getFullYear()+"-"+(p.start.getMonth()+1)+"-"+p.start.getDate();m[k]=o;if(!p.allDay){l=p.start.getHours()+":"+p.start.getMinutes();m.scheduled_time=l}f.update(m)};b.renderEvent=function(j,d){if(b.activeFocusArea&&b.activeFocusArea.id>0){if(j.focus_areas.indexOf(b.activeFocusArea.id)===-1){return false}}if(j.repeats){d.find(".fc-event-title").append('<span class="repeat-icon"></span>')}if(b.activeCalendars.indexOf(j.calId)===-1){return false}};b.resizeEvent=function(l){var j,k,d;if(l.field_group==="calendar"){j={id:l.id};k=l.end.getFullYear()+"-"+(l.end.getMonth()+1)+"-"+l.end.getDate();j.end_date=k;if(!l.allDay){d=l.end.getHours()+":"+l.end.getMinutes();j.end_time=d}f.update(j)}};b.$on("focus-area-changed",function(l,j){var d,k;b.activeFocusArea=j;b.owCalendar.fullCalendar("rerenderEvents")});b.calendarOptions={editable:true,header:{left:"month agendaWeek agendaDay",center:"title",right:"today prev,next"},eventClick:b.editEvent,eventDrop:b.moveEvent,eventResize:b.resizeEvent,eventRender:b.renderEvent,}}]);"use strict";var Message;Message=function(a){if(a===undefined){a={}}this.fields={};this.set_fields(a)};Message.prototype.set_fields=function(a){$.extend(this.fields,a);this.pk=a.id;this.url="/wolfmail/message/"+this.pk+"/"};Message.prototype.create_node=function(d){var b,e,c,a;b=this;c={action:"create_node"};$.extend(c,d);delete c.$scope;jQuery.ajax(this.url,{type:"PUT",data:c,success:function(){d.$scope.$apply(d.$scope.success(b))},})};Message.prototype.delete_msg=function(b){var c,a;a=this;jQuery.ajax(this.url,{type:"DELETE",data:{action:"delete"},success:function(){b.$scope.$apply(b.$scope.success(a))}})};Message.prototype.archive=function(b){var c,a;a=this;jQuery.ajax(this.url,{type:"PUT",data:{action:"archive"},success:function(){b.$scope.$apply(b.$scope.success(a))}})};Message.prototype.defer=function(b){var c,a;a=this;jQuery.ajax(this.url,{type:"PUT",data:{action:"defer",target_date:b.target_date},success:function(){b.$scope.$apply(b.$scope.success(a))}})};"use strict";angular.module("owServices").factory("Message",["$resource","$rootScope",function(c,a){var b=c("/wolfmail/message/:id",{id:"@id"},{archive:{method:"PUT",params:{action:"archive"},transformResponse:function(d){d=angular.fromJson(d);a.$broadcast("message-archived",d.message);return d.message}},createNode:{method:"POST",params:{action:"create_heading"},transformResponse:function(d){d=angular.fromJson(d);a.$broadcast("heading-created",d.message,d.heading);return d.message}},defer:{method:"PUT",params:{action:"defer"},transformResponse:function(d){d=angular.fromJson(d);a.$broadcast("message-deferred",d.message);return d.message}},});return b}]);"use strict";angular.module("owDirectives").directive("owMessageRow",function(){function a(i,b,g){var h,j,c,k,d,f,e;h=$(b);h.find(".glyphicon").tooltip();i.headings=[];j=h.find(".msg-task");c=h.find(".msg-project");k=h.find(".msg-complete");d=h.find(".msg-defer");f=h.find(".msg-archive");e=h.find(".msg-delete");if(g.owHandler==="plugins.deferred"){c.remove();f.remove();e.remove()}else{k.remove()}i.$on("heading-created",function(n,m,l){if(i.message.id===m.id){i.headings.push(l)}})}return{scope:true,link:a,}}).directive("owMessageHeading",["todoStates",function(b){function a(e,d,c){e.isEditable=false;e.$on("finishEdit",function(){e.isEditable=false});e.$watch("heading.todo_state",function(f){if(f){e.todoState=b.filter(function(g){return g.id===f})[0]}else{e.todoState=null}})}return{scope:false,link:a,}}]).directive("owMsgActions",["Heading",function(b){function a(g,f,e){var c,d;c=$(f);g.$task_modal=c.find(".modal.task");g.$delete_modal=c.find(".modal.delete");g.$defer_modal=c.find(".modal.defer");if(g.new_node===undefined){g.new_node={}}g.create_task_modal=function(h){g.new_node.title=h.subject;if(h.handler_path==="plugins.deferred"){h.$createNode()}else{g.active_msg=h;g.modal_task=true;g.$task_modal.modal()}};g.open_task_modal=function(h){g.new_node.close=false;g.create_task_modal(h)};g.completeTask=function(h){h.$createNode({close:true})};g.create_project_modal=function(h){delete g.new_node.tree_id;delete g.new_node.parent;g.new_node.title=h.subject;g.active_msg=h;g.modal_task=false;g.$task_modal.modal()};g.defer_modal=function(i){var h;h=new Date();g.active_msg=i;g.$defer_modal.modal()};g.delete_modal=function(h){g.active_msg=h;g.$delete_modal.modal()};g.archive=function(h){h.$archive()};g.createNode=function(h){g.$task_modal.modal("hide").one("hidden.bs.modal",function(){h.$createNode(g.new_node)})};g.change_project=function(h){g.parents=b.query({tree_id:h.tree_id,archived:false});g.parent=h};g.change_parent=function(h){g.new_node.parent=h.id};g.deferMessage=function(){g.new_node.target_date=g.$defer_modal.find("#target-date").val();g.$defer_modal.modal("hide").one("hidden.bs.modal",function(){g.active_msg.$defer({target_date:g.newDate})})};g.delete_node=function(){g.$delete_modal.modal("hide").one("hidden.bs.modal",function(){g.active_msg.$delete().then(function(){g.messages.splice(g.messages.indexOf(g.active_msg),1)})})}}return{link:a,scope:false,templateUrl:"/static/message-modals.html"}}]);"use strict";owFilters.filter("format_sender",["$sce",function(a){return function(c){var b;if(c.handler_path==="plugins.deferred"){b="";b+='<span class="dfrd">DFRD</span> Node';b=a.trustAsHtml(b)}else{if(c.handler_path==="plugins.quickcapture"){b="Quick capture"}else{b=c.sender}}return b}}]);owFilters.filter("format_subject",["$sce",function(a){return function(c){var b;b="";if(c.handler_path==="plugins.deferred"){b='<a href="/gtd/projects/#';b+=c.source_node+"-";b+=c.node_slug+'">';b+=c.subject;b+="</a>";b=a.trustAsHtml(b)}else{if(c.handler_path==="plugins.quickcapture"){b=c.subject}else{b='<a href="/wolfmail/inbox/'+c.id+'/">';b+=c.subject;b+="</a>"}}return b}}]);owFilters.filter("format_date",function(){return function(a){var b;b=new Date(a);return b.toDateString()}});owFilters.filter("parent_label",function(){return function(c){var b,a;b=c.title;for(a=0;a<c.level;a+=1){if(a===0){b=" "+b}b="---"+b}return b}});"use strict";var MessageFactory,owinbox,owmessage;angular.module("owMain").config(["$routeProvider","$locationProvider",function(b,a){a.html5Mode(true);b.when("/wolfmail/inbox/",{templateUrl:"/static/inbox.html",controller:"owInbox"}).when("/wolfmail/inbox/:msg_id/",{templateUrl:"/static/message.html",controller:"owMessage"})}]).controller("owInbox",["$scope","$rootScope","$resource","Message","Heading","owWaitIndicator","toaster",function(j,g,k,e,d,i,f){var a,c,h;j.currentDate=new Date();j.$watch("currentDate",function(m,l){j.$emit("refresh_messages")},true);j.get_messages=function(l){i.start_wait("quick","get-messages");j.messages=e.query({in_inbox:true,rcvd_date__lte:j.currentDate.ow_date(),});j.messages.$promise["finally"](function(){i.end_wait("get-messages")});j.messages.$promise["catch"](function(){f.pop("error","Error getting messages.","Check your internet connection and try again")})};g.$on("refresh_messages",j.get_messages);g.$on("refresh-data",j.get_messages);j.$emit("refresh_messages");function b(m){var l=j.messages.map(function(n){return n.id}).indexOf(m.id);j.messages.splice(l,1)}j.$on("message-archived",function(m,l){b(l)});j.$on("message-deferred",function(m,l){b(l)});j.$on("heading-created",function(m,l){if(!l.in_inbox){b(l)}});j.projects=d.query({parent_id:0,archived:false});j.success=function(l){j.messages.remove(l)}}]).controller("owMessage",["$scope","$routeParams","$location","Message",function(a,d,f,c){var e,b;b=d.msg_id;a.msg=c.get({id:b});a.success=function(g){f.path("/wolfmail/inbox")}}]).directive("owFeedback",["$http","$timeout",function(c,a){function b(g,f,e){var d;d=f.find("#feedbackModal");g.feedback={};g.send_feedback=function(h){c.post("/feedback/",{body:h.text}).success(function(){g.success=true;a(function(){g.success=false;g.feedback={};d.modal("hide")},1200)}).error(function(j,i,k){console.log(j)})}}return{link:b,templateUrl:"/static/feedback-modal.html"}}]);"use strict";angular.module("owServices").factory("activeState",["$rootScope",function(a){var b={user:null};a.$watch(function(){return b.user},function(c){if(c){$("body").removeClass("ow-logged-out");$("body").addClass("ow-logged-in")}else{$("body").addClass("ow-logged-out");$("body").removeClass("ow-logged-in")}});return b}]);"use strict";angular.module("owDirectives").directive("owNavbar",["$location","$cookies",function(c,a){function b(g,f,e){var d;d={actions:new RegExp("^/gtd/actions"),inbox:new RegExp("^/wolfmail/inbox/"),projects:new RegExp("^/gtd/projects/"),calendar:new RegExp("^/calendar/")};function h(){var k,j,i,l;$("ul.navbar-nav li").removeClass("active");i=c.path();for(l in d){if(d.hasOwnProperty(l)){j=d[l].exec(i);if(j){$("#nav-"+l).addClass("active")}}}}h();g.$on("$locationChangeSuccess",function(i){h()});g.$watch(function(){return a.activeContext},function(i){i=parseInt(i,10);g.contexts.$promise.then(function(){g.activeContext=g.contexts.filter(function(j){return j.id===i})[0]})})}return{scope:true,link:b}}]);"use strict";owFilters.value("staticUrl",null);owFilters.filter("static",["staticUrl",function(a){return function(b){if(a!==null){b=a+b}return b}}]);"use strict";angular.module("owMain").config(["$routeProvider",function(a){a.when("/accounts/settings/",{templateUrl:"/static/settings.html",controller:"settings",})}]).controller("settings",["$scope","$window","$resource","$http","toaster",function(b,f,d,h,a){var g,c,e;g=d("/providers/");b.providers=g.query();c=d("/accountassociations/:id/",{id:"@id"});b.$on("refresh-data",function(){b.linkedAccounts=c.query()});b.linkedAccounts=c.query();b.disconnectAccount=function(i){i.$delete().then(function(){a.pop("success","Deleted");b.$emit("refresh-data")})};b.addAccount=function(k){var i,j;i={Google:function(l){e=true}};j=i[k.button_type];j(k)};f.signInCallbacks=function(i){var j;if(e&&!i.error){j={access_token:i.access_token,code:i.code,handler_path:"plugins.google"};a.pop("info","Saving...");c.save({},j).$promise.then(function(k){a.pop("success","Saved");b.$emit("refresh-data")},function(k){if(k.data.reason==="duplicate"){a.pop("error","Not saved","Duplicate Account")}else{a.pop("error","Not saved","An error occured. Please check your internet connection and try again.");console.log(k)}})}}}]);