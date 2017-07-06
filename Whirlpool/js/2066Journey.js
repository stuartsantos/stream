/* jQuery.timers - Timer abstractions for jQuery @version 1.2 */
jQuery.fn.extend({ everyTime: function(interval, label, fn, times) { return this.each(function() { jQuery.timer.add(this, interval, label, fn, times); }); }, oneTime: function(interval, label, fn) { return this.each(function() { jQuery.timer.add(this, interval, label, fn, 1); }); }, stopTime: function(label, fn) { return this.each(function() { jQuery.timer.remove(this, label, fn); }); } }); jQuery.extend({ timer: { global: [], guid: 1, dataKey: "jQuery.timer", regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/, powers: { 'ms': 1, 'cs': 10, 'ds': 100, 's': 1000, 'das': 10000, 'hs': 100000, 'ks': 1000000 }, timeParse: function(value) { if (value == undefined || value == null) return null; var result = this.regex.exec(jQuery.trim(value.toString())); if (result[2]) { var num = parseFloat(result[1]); var mult = this.powers[result[2]] || 1; return num * mult; } else { return value; } }, add: function(element, interval, label, fn, times) { var counter = 0; if (jQuery.isFunction(label)) { if (!times) times = fn; fn = label; label = interval; } interval = jQuery.timer.timeParse(interval); if (typeof interval != 'number' || isNaN(interval) || interval < 0) return; if (typeof times != 'number' || isNaN(times) || times < 0) times = 0; times = times || 0; var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {}); if (!timers[label]) timers[label] = {}; fn.timerID = fn.timerID || this.guid++; var handler = function() { if ((++counter > times && times !== 0) || fn.call(element, counter) === false) jQuery.timer.remove(element, label, fn); }; handler.timerID = fn.timerID; if (!timers[label][fn.timerID]) timers[label][fn.timerID] = window.setInterval(handler, interval); this.global.push(element); }, remove: function(element, label, fn) { var timers = jQuery.data(element, this.dataKey), ret; if (timers) { if (!label) { for (label in timers) this.remove(element, label, fn); } else if (timers[label]) { if (fn) { if (fn.timerID) { window.clearInterval(timers[label][fn.timerID]); delete timers[label][fn.timerID]; } } else { for (var fn in timers[label]) { window.clearInterval(timers[label][fn]); delete timers[label][fn]; } } for (ret in timers[label]) break; if (!ret) { ret = null; delete timers[label]; } } for (ret in timers) break; if (!ret) jQuery.removeData(element, this.dataKey); } } } }); jQuery(window).bind("unload", function() { jQuery.each(jQuery.timer.global, function(index, item) { jQuery.timer.remove(item); }); });
/* jQuery Actual Plugin * http://dreamerslab.com/) * Version: 1.0.16 */
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a);}else{a(jQuery);}}(function(a){a.fn.addBack=a.fn.addBack||a.fn.andSelf;a.fn.extend({actual:function(b,l){if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}var f={absolute:false,clone:false,includeMargin:false,display:"block"};var i=a.extend(f,l);var e=this.eq(0);var h,j;if(i.clone===true){h=function(){var m="position: absolute !important; top: -1000 !important; ";e=e.clone().attr("style",m).appendTo("body");};j=function(){e.remove();};}else{var g=[];var d="";var c;h=function(){c=e.parents().addBack().filter(":hidden");d+="visibility: hidden !important; display: "+i.display+" !important; ";if(i.absolute===true){d+="position: absolute !important; ";}c.each(function(){var m=a(this);var n=m.attr("style");g.push(n);m.attr("style",n?n+";"+d:d);});};j=function(){c.each(function(m){var o=a(this);var n=g[m];if(n===undefined){o.removeAttr("style");}else{o.attr("style",n);}});};}h();var k=/(outer)/.test(b)?e[b](i.includeMargin):e[b]();j();return k;}});}));
/* equalheight - http://css-tricks.com/equal-height-blocks-in-rows/ * uses .actual('height') jquery plugin instead to account for hidden items */
(function(){
	equalheight=function(container){var currentTallest=0,currentRowStart=0,rowDivs=new Array(),$el,topPosition=0;$(container).each(function(){$el=$(this);$($el).height('auto');topPostion=$el.position().top;if(currentRowStart!=topPostion){for(currentDiv=0;currentDiv<rowDivs.length;currentDiv++){rowDivs[currentDiv].height(currentTallest);}rowDivs.length=0;currentRowStart=topPostion;currentTallest=$el.actual('height');rowDivs.push($el);}else{rowDivs.push($el);currentTallest=(currentTallest<$el.actual('height'))?($el.actual('height')):(currentTallest);}for(currentDiv=0;currentDiv<rowDivs.length;currentDiv++){rowDivs[currentDiv].height(currentTallest);}});}
	return false;
})();
/**********************************************************/
/* Bowser - a browser detector * https://github.com/ded/bowser */
!function(e,t){typeof module!="undefined"&&module.exports?module.exports=t():typeof define=="function"&&define.amd?define(t):this[e]=t()}("bowser",function(){function t(t){function n(e){var n=t.match(e);return n&&n.length>1&&n[1]||""}function r(e){var n=t.match(e);return n&&n.length>1&&n[2]||""}var i=n(/(ipod|iphone|ipad)/i).toLowerCase(),s=/like android/i.test(t),o=!s&&/android/i.test(t),u=/CrOS/.test(t),a=n(/edge\/(\d+(\.\d+)?)/i),f=n(/version\/(\d+(\.\d+)?)/i),l=/tablet/i.test(t),c=!l&&/[^-]mobi/i.test(t),h;/opera|opr/i.test(t)?h={name:"Opera",opera:e,version:f||n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(t)?h={name:"Yandex Browser",yandexbrowser:e,version:f||n(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/windows phone/i.test(t)?(h={name:"Windows Phone",windowsphone:e},a?(h.msedge=e,h.version=a):(h.msie=e,h.version=n(/iemobile\/(\d+(\.\d+)?)/i))):/msie|trident/i.test(t)?h={name:"Internet Explorer",msie:e,version:n(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:u?h={name:"Chrome",chromeBook:e,chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/chrome.+? edge/i.test(t)?h={name:"Microsoft Edge",msedge:e,version:a}:/chrome|crios|crmo/i.test(t)?h={name:"Chrome",chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:i?(h={name:i=="iphone"?"iPhone":i=="ipad"?"iPad":"iPod"},f&&(h.version=f)):/sailfish/i.test(t)?h={name:"Sailfish",sailfish:e,version:n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(t)?h={name:"SeaMonkey",seamonkey:e,version:n(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel/i.test(t)?(h={name:"Firefox",firefox:e,version:n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t)&&(h.firefoxos=e)):/silk/i.test(t)?h={name:"Amazon Silk",silk:e,version:n(/silk\/(\d+(\.\d+)?)/i)}:o?h={name:"Android",version:f}:/phantom/i.test(t)?h={name:"PhantomJS",phantom:e,version:n(/phantomjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(t)||/rim\stablet/i.test(t)?h={name:"BlackBerry",blackberry:e,version:f||n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:/(web|hpw)os/i.test(t)?(h={name:"WebOS",webos:e,version:f||n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(t)&&(h.touchpad=e)):/bada/i.test(t)?h={name:"Bada",bada:e,version:n(/dolfin\/(\d+(\.\d+)?)/i)}:/tizen/i.test(t)?h={name:"Tizen",tizen:e,version:n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||f}:/safari/i.test(t)?h={name:"Safari",safari:e,version:f}:h={name:n(/^(.*)\/(.*) /),version:r(/^(.*)\/(.*) /)},!h.msedge&&/(apple)?webkit/i.test(t)?(h.name=h.name||"Webkit",h.webkit=e,!h.version&&f&&(h.version=f)):!h.opera&&/gecko\//i.test(t)&&(h.name=h.name||"Gecko",h.gecko=e,h.version=h.version||n(/gecko\/(\d+(\.\d+)?)/i)),!h.msedge&&(o||h.silk)?h.android=e:i&&(h[i]=e,h.ios=e);var p="";h.windowsphone?p=n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):i?(p=n(/os (\d+([_\s]\d+)*) like mac os x/i),p=p.replace(/[_\s]/g,".")):o?p=n(/android[ \/-](\d+(\.\d+)*)/i):h.webos?p=n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):h.blackberry?p=n(/rim\stablet\sos\s(\d+(\.\d+)*)/i):h.bada?p=n(/bada\/(\d+(\.\d+)*)/i):h.tizen&&(p=n(/tizen[\/\s](\d+(\.\d+)*)/i)),p&&(h.osversion=p);var d=p.split(".")[0];if(l||i=="ipad"||o&&(d==3||d==4&&!c)||h.silk)h.tablet=e;else if(c||i=="iphone"||i=="ipod"||o||h.blackberry||h.webos||h.bada)h.mobile=e;return h.msedge||h.msie&&h.version>=10||h.yandexbrowser&&h.version>=15||h.chrome&&h.version>=20||h.firefox&&h.version>=20||h.safari&&h.version>=6||h.opera&&h.version>=10||h.ios&&h.osversion&&h.osversion.split(".")[0]>=6||h.blackberry&&h.version>=10.1?h.a=e:h.msie&&h.version<10||h.chrome&&h.version<20||h.firefox&&h.version<20||h.safari&&h.version<6||h.opera&&h.version<10||h.ios&&h.osversion&&h.osversion.split(".")[0]<6?h.c=e:h.x=e,h}var e=!0,n=t(typeof navigator!="undefined"?navigator.userAgent:"");return n.test=function(e){for(var t=0;t<e.length;++t){var r=e[t];if(typeof r=="string"&&r in n)return!0}return!1},n._detect=t,n})
/** **/
if (bowser) {
	var temp='';
	temp+=bowser.name.toLowerCase().replace(/\s/g, '')+' ';
	temp+=bowser.name.toLowerCase().replace(/\s/g, '')+parseInt(bowser.version)+' ';
	if (bowser.webkit) {temp+='webkit ';}
	if (bowser.android) {temp+='android ';temp+='android'+parseInt(bowser.version)+' ';}
	else if (bowser.ios) {temp+='ios ';temp+='ios'+parseInt(bowser.version)+' ';}
	else if (bowser.msie) {
		var temp2 = parseInt(bowser.version);
		if (temp2=="9") {temp+='ie9 ltIE10 ltIE11 ltIE12'}
		else if (temp2=="10") {temp+='ie10 ltIE11 ltIE12'}
		else if (temp2=="11") {temp+='ie11 ltIE12';}
	}
	if (temp){$('html').addClass(temp);}
}
/*********************************************************
  Framework setup
**********************************************************/
$(document).ready(function() {
	$('body').attr("id","bodyID").append("<div id='mobileRespond'></div>").append("<div id='responsive'></div>");//setup body/responsive
	try{if(session_vars.IsTest == "true"){$('#bodyID').addClass('isTest');}}catch(err){}//add testing var for custom css show/hide
	//setup header
	$('#header').html('');//clear header
	$("#M_H_DIV1").prependTo("#header");//move header into header location
	$('#brochurePage, #footer').addClass("hideOnNav");
	//if ($(".pinned").length){$("#bodyID").addClass("hasPinned");}
	//update phone #s on website
	$(".hasHrefPhoneNum").each(function(){
		try{
			var temp;
			if($(this).hasClass("TelephoneNumberALT")){temp=session_vars.TelephoneNumberALT;}
			else if($(this).hasClass("TelephoneNumberServiceBranded")){temp=session_vars.TelephoneNumberServiceBranded;}
			else{temp=session_vars.TelephoneNumber;}
			$(this).attr('href', 'tel:1'+temp.replace(/\s+|-|\./g, ''));
		}catch(err){}
	});
	$(".isPhoneNum").each(function(){
		try{
			var temp;
			if($(this).hasClass("TelephoneNumberALT")){temp=session_vars.TelephoneNumberALT;}
			else if($(this).hasClass("TelephoneNumberServiceBranded")){temp=session_vars.TelephoneNumberServiceBranded;}
			else{temp=session_vars.TelephoneNumber;}
			$(this).html(temp);
		}catch(err){}
	});
});

/*********************************************************
 UI Functions for Travel Guard
**********************************************************/
var tg = new Object();
var quote = new Object();
quote = {};
(function(w){
/*******************************************************************************************************************/
tg.initValidation = function(){
	tg.errorCount=0;//reset to 0
	$('#errorBox').hide();//show error msg
	$('#errorMSG').html("");//clear error msg
	$('.hasError').removeClass('hasError');//clear ALL errors
	return false;
}
/*******************************************************************************************************************/
tg.errorFoundValidation = function(){
	$('.hasError').focus(function() {$(this).removeClass('hasError');});//clear error on focus, run code here to make sure init properly
	$('.hasError').click(function() {$(this).removeClass('hasError');});
	$('#errorBox').show();//show error msg
	window.location.href = "#errorBoxAnchor";//make sure error messages are showing on screen
}
/*******************************************************************************************************************/
tg.passValidation = function(){
	$(this).removeClass('hasError');//clear errors
	$('#errorBox').hide();//hide error msg
	location.hash = '';//remove errorBox anchor in url
}
/*******************************************************************************************************************/
tg.tagErrors = function(element, errorMsg){
	if(errorMsg){$('#errorMSG').append("<li>"+errorMsg+"</li>");}//add error msg
	$(element).addClass('hasError');
	tg.errorCount++;
}

/**********************************************************/
tg.urlParam = function(urlParamName,paramKeepCase){//expose querystring to javascript via jQuery
	if(paramKeepCase==1){var temp = window.location.href;var results = new RegExp('[\\?&]' + urlParamName + '=([^&#]*)').exec(temp);}
	else{var temp=window.location.href.toLowerCase();var results = new RegExp('[\\?&]' + urlParamName.toLowerCase() + '=([^&#]*)').exec(temp);}
	if (!results) {return "";}
	return results[1] || "";
}
tg.goToURL = function(goToURLtype,theURL,qs) {
	if(theURL){//make sure url destination is available
		if(qs.toLowerCase() == 'yes' || qs.toLowerCase() == true){//attach querystring if asked for
			if(theURL.indexOf("?")==-1){theURL = theURL  + '?';}//attach ? for querystring usage
			else{theURL = theURL  + '&';}//attach & for querystring usage
			theURL = theURL + window.location.search.substring(1);
		}
		if(goToURLtype.toLowerCase() =="newWindow"){
			window.open(theURL, "myWindow")
		}else{window.location = theURL;}
	}
	return false;
}
/*********************************************************
waitForFinalEvent
**********************************************************/
//used for window.resize - need plugin w ability for multiple unique calls
tg.waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();
/*********************************************************
COOKIES
**********************************************************/
tg.setCookie = function(name, value, expires, path, domain, secure){
	if(name && value){//make sure available b/4 attempting to use
		var date=new Date();// pre-set to the current time and date
		if(!expires){expires=180;}// default 6mo if not available
		if(!path){path='/';}// set a default path if not available
		if(secure==true){secure="secure";}else{secure="";}// enable ssl
		if(!domain){domain="domain="+document.domain.split('.').slice(-2).join('.');}else{domain="domain="+domain;}//setup 'domain=' for urls that have a . in them, else setup 'domain=' and use value passed in
		if(domain.indexOf(".")==-1){domain="";}//don't even call 'domain=' if domain doesn't a '.' in it (IE bug)
		if(secure=="secure" && domain){domain+=";"}//check if extra ';' is needed or not	
		date.setTime(date.getTime()+1000*60*60*24*expires);//convert expires (days) into date/time format
		document.cookie=name+"="+escape(value)+";expires="+date.toGMTString()+";path="+path+";"+domain+secure;
	}
	return false;
}
tg.getCookie = function(name){
  var ca = document.cookie.split(';');
  var nameEQ = name + "=";
  for(var i=0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1, c.length); //delete spaces
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
tg.eraseCookie = function (name){tg.setCookie(name, "", -1);}
/*********************************************************
HTML 5 - LocalStorage get/save
**********************************************************/
tg.LocalStorageGetSet = function(storeVal,itemName,inputType){
	if(typeof(Storage) !== void(0)){//browser compatibility
		var temp=localStorage[storeVal];
		if (temp){
			if(inputType == "select"){$(itemName).val(temp).change();}//dropdown choice + run onchange
			else if(inputType == "radio"){$('input:radio[name='+itemName+']').filter('[value='+temp+']').prop("checked",true).trigger("change");}//radio selected
			else if(inputType == 'value'){return temp}//simply return value
			else if(inputType == 'valueChange'){$(itemName).val(temp).change();}//trigger change 
			else{$(itemName).val(temp);}//default text input
		}
	}
	return false;
}
tg.LocalStorageSave = function(storeVal,itemName,inputType){
	if(typeof(Storage) !== void(0)){//browser compatibility
		if(inputType == "select"){var temp=$(itemName+" option:selected").val()}//dropdown choice
		else if(inputType == "radio"){var temp=$("input[name="+itemName+"]:checked").val()}//radio selected
		else if(inputType == 'value'){var temp=itemName}//passed in value to store
		else{var temp=$(itemName).val();}//default to text input
		if (temp && temp!="mm/dd/yyyy"){localStorage[storeVal]=temp;}
	}
	return false;
}
tg.autoPopulate = function(storeVal,itemName,inputType){
	if (storeVal){
		if(inputType == "select"){$(itemName).val(storeVal).change();}//dropdown choice + run onchange
		else if(inputType == "radio"){$('input:radio[name='+itemName+']').filter('[value='+storeVal+']').prop("checked",true).trigger("change");}//radio selected
		else if(inputType == 'valueChange'){$(itemName).val(storeVal).change();}//trigger change 
		else{$(itemName).val(storeVal);}//default text input
	}
	return false;
}
/*********************************************************
Scroll show/hide functions
**********************************************************/
	// Hide Header on on scroll down
	tg.didScroll;
	tg.lastScrollTop = 0;
	tg.delta = 5;
	
	//** Show/hide nav on scroll
	tg.checkSize = function(e){//width function results vary so use css property to detect instead
		if ($("#mobileRespond").css("background-repeat") == "repeat"){$('#bodyID').addClass('isDesktop').removeClass('isMobile');}//is Desktop/tablet
		else{$('#bodyID').removeClass('isDesktop').addClass('isMobile');}//is mobile
	}
	hasScrolled = function(e) {
		var st = $(this).scrollTop();
		// Make sure they scroll more than delta
		if(Math.abs(tg.lastScrollTop - st) <= tg.delta){return;}
		if (st > tg.lastScrollTop && st > tg.navbarHeight && $('#bodyID').hasClass("isMobile")){// Scroll Down
			$('#M_H_DIV1').animate({"top": "-"+(tg.navbarHeight)+"px"},'fast').hover(function(){$("#M_H_DIV1").stop().animate({"top": "0px"},'fast');});//hide nav
			if($(window).scrollTop() > 400 && $('#bodyID').hasClass("isMobile")){$("#M_S_fixedCallCTA").animate({"bottom": "0px"},'fast');}//show callCTA
		} else {// Scroll Up
			if(st + $(window).height() < $(document).height()){ $('#M_H_DIV1').animate({"top": "0px"},'fast');}//show nav
			$('#M_S_fixedCallCTA').animate({"bottom": "-"+(tg.M_S_fixedCallCTA)+"px"},'fast').hover(function(){$("#M_S_fixedCallCTA").animate({"bottom": "0px"},'fast');});//hide callCTA
		}
		tg.lastScrollTop = st;
		return false;
	}
	$(document).ready(function() {
		tg.navbarHeight = $('#M_H_DIV1').outerHeight(true);
		var temp = $('#M_S_fixedCallCTA');
		
		tg.checkSize();// run test on initial page load
		$(window).resize(tg.checkSize);// run test on resize of the window
		temp.attr("style","display:block !important");//display none returns 0 otherwise
		tg.M_S_fixedCallCTA = temp.outerHeight(true);
		temp.animate({"bottom": "-"+(tg.M_S_fixedCallCTA-7)+"px"},'fast').attr("style","");//animate, then clear display
	});
	
	$(document).scroll(function(event){tg.didScroll = true;});
	setInterval(function() {if (tg.didScroll) {hasScrolled();tg.didScroll = false;}}, 250);
/*********************************************************
mobileOnly Collapsibles
**********************************************************/
$(document).ready(function() {
	$('.mobileOnlyCollapsible_Toggle').click(function(e) {//section becomes toggleable on mobile only, always shows on desktop
		if($('#bodyID').hasClass("isMobile")){
			var temp = $(this).next('.mobileOnlyCollapsible_Content');
			if (temp.is(":visible") == true) {temp.hide(0, function() {temp.removeAttr("style").css;});$(this).addClass('closed');}
			else {temp.show();$(this).removeClass('closed');}
		}
		return false;
	});
});
/*********************************************************
custom Collapsibles (no Bootstrap js b/c of old jQuery)
**********************************************************/
$(document).ready(function() {
	$('.tg-collapsible > .tg-collapsible-heading').click(function(e) {
		var temp = $(this).next('.tg-collapsible-content');
		if (temp.is(":visible") == true) {
			temp.hide(0, function() {
				temp.removeAttr("style").css;});
				$(this).addClass('collapsed');
				$(this).children('.glyphicon-chevron-up').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			}
		else {temp.show();$(this).removeClass('collapsed');$(this).children('.glyphicon-chevron-down').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");}
		return false;
	});
});
/*********************************************************
Toggles
**********************************************************/
$(document).ready(function() {
	$('.toggle_Button').click(function(e) {
		var temp = $(this).next('.toggle_Content');
		if (temp.is(":visible") == true) {
			temp.hide(0, function() {
				temp.removeAttr("style").css;});
				$(this).addClass('closed');
				$(this).children('.glyphicon-chevron-up').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			}
		else {temp.show();$(this).removeClass('closed');$(this).children('.glyphicon-chevron-down').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");}
		return false;
	});
});
/*********************************************************
modal scroll fix
**********************************************************/
$(document).ready(function() {
	//$('.modal').on('show.bs.modal', function (e) {tg.scrollTop = $(window).scrollTop();});// find/record scroll position b/4 opening
	//$('.modal').on('hidden.bs.modal', function (e) {$(window).scrollTop(tg.scrollTop);});// reset scroll position on close
	//$.fn.modal.Constructor.DEFAULTS.backdrop = 'static';//disable modal close on click background
	//$.fn.modal.Constructor.DEFAULTS.keyboard = false;//disable modal close on keyboard 'esc' key
});

/*********************************************************
flipswitch radio button
**********************************************************/
$(document).ready(function() {
	$(".tg-flipswitch-wrap input[type=radio]").change(function(){
		$(this).closest('.tg-flipswitch-wrap').find(".form-group").removeClass('active');
		$(this).closest('.form-group').addClass('active');
	});
	$(".tg-flipswitch-wrap input[type=radio]:checked").prop("checked",true).trigger("change");//manual trigger incase of browser history
});

/*********************************************************
carousel equal heights
**********************************************************/

/*********************************************************
Main Nav functionality
**********************************************************/
	$(document).ready(function() {
		$('#navDrop > ul > li > a').click(function(e) {
			tg.closeAllSubNav($(this));
			if($(this).parent().hasClass("contains-sub")){
				tg.toggleSubNav($(this));
				$("#bodyID").addClass('openNav');
				return false;
			}
		});
		$('#btnMenu').click(function(e) {
			tg.toggleMainNav($(this));
			return false;
		});
		$('.navClose').click(function(e) {
			tg.closeAllNav();
			return false;
		});
		$('.submenu > ul > .contains-sub > a').click(function() {
			tg.toggleSubNav($(this));
			return false;
		});	
	});
	tg.toggleSubNav = function(e){
		if(!$(e).next().hasClass('open')){// comes from menu button so show menu
			$("#navDrop .submenu").not(e.parents()).removeClass('open current').hide().removeAttr("style");//close all sub navs
			$("#navDrop .contains-sub").not(e.parents()).removeClass('open current');//close all sub navs
			e.parent().addClass('current');
			$("#bodyID").addClass('openNav');
			e.siblings('.submenu').addClass('open').show();//show this item
		}else {//comes from nav item so show its drop
			$(e).siblings('.submenu').hide().removeClass('open current').removeAttr("style");//removeAttr is jQuery v1.6x fix for hide not working
			$(e).parent().removeClass('open current');
		}
		return false;
	}
	tg.closeAllSubNav = function(e){
		var temp = $("#navDrop");
		$("#bodyID").removeClass('openNav');
		if (!e){
			$('.open', temp).removeClass('open').hide().removeAttr("style");//removeAttr is jQuery v1.6x fix for hide not working
			$('.current', temp).removeClass('current');
		}else{
			$('.open', temp).not(e.next()).removeClass('open').hide().removeAttr("style");//removeAttr is jQuery v1.6x fix for hide not working
			$('.current', temp).not(e.next()).removeClass('current');
		}
		return false;
	}
	tg.toggleMainNav = function(e){
		var temp = $("#navDrop");
		if(temp.is(":hidden") == true){// comes from menu button so show menu
			$("#bodyID").addClass('openNav');
			temp.show(0);
		}else {//comes from nav item so show its drop
			tg.closeAllNav(e);
		}
		return false;
	}
	tg.closeAllNav = function(e){
		$("#bodyID").removeClass('openNav');
		$("#navDrop").hide(0, function() {$(this).removeAttr("style");});//remove style attr and allow default css to rule so resize doesn't impact desktop size
		tg.closeAllSubNav(e);
		return false;
	}
})( this );


/*********************************************************
iOS orientationchange zoom bug - might be in iOS7 too so i updated it to include "OS [1-7]_[0-9_]" from "OS [1-5]_[0-9_]"
**********************************************************/
/*! A fix for the iOS orientationchange zoom bug. Script by @scottjehl, rebound by @wilto.MIT / GPLv2 License.*/
(function(a){function m(){d.setAttribute("content",g),h=!0}function n(){d.setAttribute("content",f),h=!1}function o(b){l=b.accelerationIncludingGravity,i=Math.abs(l.x),j=Math.abs(l.y),k=Math.abs(l.z),(!a.orientation||a.orientation===180)&&(i>7||(k>6&&j<8||k<8&&j>6)&&i>5)?h&&n():h||m()}var b=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-7]_[0-9_]* like Mac OS X/i.test(b)&&b.indexOf("AppleWebKit")>-1))return;var c=a.document;if(!c.querySelector)return;var d=c.querySelector("meta[name=viewport]"),e=d&&d.getAttribute("content"),f=e+",maximum-scale=1",g=e+",maximum-scale=10",h=!0,i,j,k,l;if(!d)return;a.addEventListener("orientationchange",m,!1),a.addEventListener("devicemotion",o,!1)})(this);