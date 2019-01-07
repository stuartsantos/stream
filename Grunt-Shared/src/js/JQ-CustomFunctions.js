/*@preserve - customFunctions - 
*/
/*********************************************************
  Framework setup
**********************************************************/
$(document).ready(function() {
	$('body').attr("id","bodyID").append("<div id='mobileRespond'></div>").append("<div id='responsive'></div>");//setup body/responsive
	try{if(session_vars.URLParameterShowVars == "true"){$('#bodyID').addClass('ShowVars');}}catch(err){}//add testing var for custom css show/hide
	//setup header
	$('#header').html('');//clear header
	$("#M_H_DIV1").prependTo("#header");//move header into header location
	$('#brochurePage, #footer').addClass("hideOnNav");
	if ($(".pinned").length){$("#bodyID").addClass("hasPinned");}
	//update phone #s on website
	$(".hasHrefPhoneNum").each(function(){
		try{
			var temp;
			if($(this).hasClass("TelephoneNumberALT")){temp=session_vars.TelephoneNumberALT;}
			else if($(this).hasClass("TelephoneNumberCustom")){temp=session_vars.TelephoneNumberCustom;}
			else{temp=session_vars.TelephoneNumber;}
			$(this).attr('href', 'tel:1'+temp.replace(/\s+|-|\./g, ''));
		}catch(err){}
	});
	$(".isPhoneNum").each(function(){
		try{
			var temp;
			if($(this).hasClass("TelephoneNumberALT")){temp=session_vars.TelephoneNumberALT;}
			else if($(this).hasClass("TelephoneNumberCustom")){temp=session_vars.TelephoneNumberCustom;}
			else{temp=session_vars.TelephoneNumber;}
			$(this).html(temp);
		}catch(err){}
	});
	$("input[type=checkbox]").each(function(){//custom checkbox sprites
		try{
			if(!$(this).hasClass("noCustomCheckboxSprite")){
				$(this).addClass("hasCustomCheckboxSprite");
				$( "<label class='customCheckboxSprite' for='"+this.id+"' id='"+this.id+"CheckboxAlt'></label>" ).insertAfter(this);
			}
		}catch(err){}
	});
	$("input[type=radio]").each(function(){//custom radio sprites
		try{
			if(!$(this).hasClass("noCustomRadioSprite")){
				$(this).addClass("hasCustomRadioSprite");
				$( "<label class='customRadioSprite' for='"+this.id+"' id='"+this.id+"RadioAlt'></label>" ).insertAfter(this);
			}
		}catch(err){}
	});
});

/* script to make the cards on the landing page of equal height */
matchTallest = function (selector) {
    var tallest = 0;
    var thisHeight = 0;
    var cards = $(selector);
    cards.each(function () {//find the tallest card
        $(this).height('auto');
        thisHeight = ($(this).outerHeight());
        //console.log(thisHeight);
        if (thisHeight > tallest) tallest = thisHeight;
    });

    //set all of the card heights.
    cards.height(tallest);

    //set all of the buttons
    $('.card .button').width($('.card').width());

    //console.log('changed', thisHeight, 'to', tallest)
};

$(window).load(function () {
    matchTallest('.card');
});

// Delayed to prevent cascading and thread-locking
var resizeTimer;

$(window).resize(function(e) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
        matchTallest('.card');
        //checkDropdownHeights();
  }, 250);
});

$(document).ready(function () {

   var isAtBottom = function() {
        return ($(document).height() - $(window).height()) == $(document).scrollTop();
    }

    /* expand or contract the contactFlyout on click */
    $('.contactFlyout.contracted').click(function () {
        toggleFlyout(true);
    });

    $('.contactFlyout .close').click(function () {
        toggleFlyout(false);
    });
});

function toggleFlyout(shown) {
    var $flyout = $('.contactFlyout');
    $flyout.filter('.contracted').toggle(!shown);
    $flyout.filter('.expanded').toggle(shown);
}

/**********************************************************/
/* Bowser - a browser detector * https://github.com/ded/bowser */
!function(e,t){typeof module!="undefined"&&module.exports?module.exports=t():typeof define=="function"&&define.amd?define(t):this[e]=t()}("bowser",function(){function t(t){function n(e){var n=t.match(e);return n&&n.length>1&&n[1]||""}function r(e){var n=t.match(e);return n&&n.length>1&&n[2]||""}var i=n(/(ipod|iphone|ipad)/i).toLowerCase(),s=/like android/i.test(t),o=!s&&/android/i.test(t),u=/CrOS/.test(t),a=n(/edge\/(\d+(\.\d+)?)/i),f=n(/version\/(\d+(\.\d+)?)/i),l=/tablet/i.test(t),c=!l&&/[^-]mobi/i.test(t),h;/opera|opr/i.test(t)?h={name:"Opera",opera:e,version:f||n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(t)?h={name:"Yandex Browser",yandexbrowser:e,version:f||n(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/windows phone/i.test(t)?(h={name:"Windows Phone",windowsphone:e},a?(h.msedge=e,h.version=a):(h.msie=e,h.version=n(/iemobile\/(\d+(\.\d+)?)/i))):/msie|trident/i.test(t)?h={name:"Internet Explorer",msie:e,version:n(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:u?h={name:"Chrome",chromeBook:e,chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/chrome.+? edge/i.test(t)?h={name:"Microsoft Edge",msedge:e,version:a}:/chrome|crios|crmo/i.test(t)?h={name:"Chrome",chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:i?(h={name:i=="iphone"?"iPhone":i=="ipad"?"iPad":"iPod"},f&&(h.version=f)):/sailfish/i.test(t)?h={name:"Sailfish",sailfish:e,version:n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(t)?h={name:"SeaMonkey",seamonkey:e,version:n(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel/i.test(t)?(h={name:"Firefox",firefox:e,version:n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t)&&(h.firefoxos=e)):/silk/i.test(t)?h={name:"Amazon Silk",silk:e,version:n(/silk\/(\d+(\.\d+)?)/i)}:o?h={name:"Android",version:f}:/phantom/i.test(t)?h={name:"PhantomJS",phantom:e,version:n(/phantomjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(t)||/rim\stablet/i.test(t)?h={name:"BlackBerry",blackberry:e,version:f||n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:/(web|hpw)os/i.test(t)?(h={name:"WebOS",webos:e,version:f||n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(t)&&(h.touchpad=e)):/bada/i.test(t)?h={name:"Bada",bada:e,version:n(/dolfin\/(\d+(\.\d+)?)/i)}:/tizen/i.test(t)?h={name:"Tizen",tizen:e,version:n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||f}:/safari/i.test(t)?h={name:"Safari",safari:e,version:f}:h={name:n(/^(.*)\/(.*) /),version:r(/^(.*)\/(.*) /)},!h.msedge&&/(apple)?webkit/i.test(t)?(h.name=h.name||"Webkit",h.webkit=e,!h.version&&f&&(h.version=f)):!h.opera&&/gecko\//i.test(t)&&(h.name=h.name||"Gecko",h.gecko=e,h.version=h.version||n(/gecko\/(\d+(\.\d+)?)/i)),!h.msedge&&(o||h.silk)?h.android=e:i&&(h[i]=e,h.ios=e);var p="";h.windowsphone?p=n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):i?(p=n(/os (\d+([_\s]\d+)*) like mac os x/i),p=p.replace(/[_\s]/g,".")):o?p=n(/android[ \/-](\d+(\.\d+)*)/i):h.webos?p=n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):h.blackberry?p=n(/rim\stablet\sos\s(\d+(\.\d+)*)/i):h.bada?p=n(/bada\/(\d+(\.\d+)*)/i):h.tizen&&(p=n(/tizen[\/\s](\d+(\.\d+)*)/i)),p&&(h.osversion=p);var d=p.split(".")[0];if(l||i=="ipad"||o&&(d==3||d==4&&!c)||h.silk)h.tablet=e;else if(c||i=="iphone"||i=="ipod"||o||h.blackberry||h.webos||h.bada)h.mobile=e;return h.msedge||h.msie&&h.version>=10||h.yandexbrowser&&h.version>=15||h.chrome&&h.version>=20||h.firefox&&h.version>=20||h.safari&&h.version>=6||h.opera&&h.version>=10||h.ios&&h.osversion&&h.osversion.split(".")[0]>=6||h.blackberry&&h.version>=10.1?h.a=e:h.msie&&h.version<10||h.chrome&&h.version<20||h.firefox&&h.version<20||h.safari&&h.version<6||h.opera&&h.version<10||h.ios&&h.osversion&&h.osversion.split(".")[0]<6?h.c=e:h.x=e,h}var e=!0,n=t(typeof navigator!="undefined"?navigator.userAgent:"");return n.test=function(e){for(var t=0;t<e.length;++t){var r=e[t];if(typeof r=="string"&&r in n)return!0}return!1},n._detect=t,n})
/** **/
if (bowser) {
	var browserName='';
	var browserVer= parseInt(bowser.version);
	browserName+=bowser.name.toLowerCase().replace(/\s/g, '')+' ';
	browserName+=bowser.name.toLowerCase().replace(/\s/g, '')+browserVer+' ';
	if (bowser.webkit) {browserName+='webkit ';}
	if (bowser.android) {browserName+='android ';browserName+='android'+browserVer+' ';}
	else if (bowser.ios) {browserName+='ios ';browserName+='ios'+browserVer+' ';}
	else if (bowser.msie) {
		var temp2 = browserVer;
		if (temp2=="9") {browserName+='ie9 ltIE10 ltIE11 ltIE12'}
		else if (temp2=="10") {browserName+='ie10 ltIE11 ltIE12'}
		else if (temp2=="11") {browserName+='ie11 ltIE12';}
	}
	$('html').addClass(browserName);
	/*
	if(
		bowser.msie && browserVer < 10 || 
		bowser.chrome && browserVer < 50 ||
		bowser.firefox && browserVer < 45 ||
		bowser.ios && browserVer < 9 ||
		bowser.safari && browserVer < 8 ||
		bowser.android && browserVer < 5
	){$('html').addClass('browser-error');}
	*/
	if(
		(bowser.msie && browserVer < 10) || 
		(bowser.chrome && browserVer < 50) ||
		(bowser.firefox && browserVer < 45) ||
		(bowser.ios && browserVer < 9) ||
		(bowser.safari && browserVer < 8) ||
		(bowser.android && browserVer < 5)
	){$('html').addClass('browser-error');}
}
/*********************************************************
 UI Functions for Travel Guard
**********************************************************/
var tg = new Object();
var quote = new Object();
quote = {};
(function(w){
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
			$('#nav').animate({"top": "-"+(tg.navbarHeight)+"px"},'fast').hover(function(){$("#nav").stop().animate({"top": "0px"},'fast');});//hide nav
			if($(window).scrollTop() > 400 && $('#bodyID').hasClass("isMobile")){$(".pinned").animate({"bottom": "0px"},'fast');}//show callCTA
		} else {// Scroll Up
			if(st + $(window).height() < $(document).height()){ $('#nav').animate({"top": "0px"},'fast');}//show nav
			$('.pinned').animate({"bottom": "-"+(tg.M_S_fixedCallCTA)+"px"},'fast').hover(function(){$(".pinned").animate({"bottom": "0px"},'fast');});//hide callCTA
		}
		tg.lastScrollTop = st;
		return false;
	}
	$(document).ready(function() {
		tg.navbarHeight = $('#navWrap').outerHeight(true);
		var temp = $('.pinned');
		
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
			if (temp.is(":visible") == true) {temp.slideUp("slow", function() {temp.removeAttr("style").css;});$(this).addClass('closed');}
			else {temp.slideDown();$(this).removeClass('closed');}
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
			temp.slideUp("slow", function() {
				temp.removeAttr("style").css;});
				$(this).addClass('collapsed');
				$(this).children('.glyphicon-chevron-up').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			}
		else {temp.slideDown();$(this).removeClass('collapsed');$(this).children('.glyphicon-chevron-down').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");}
		return false;
	});
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
Toggles
**********************************************************/
$(document).ready(function() {
	$('.toggle_Button').click(function(e) {
		var temp = $(this).next('.toggle_Content');
		if (temp.is(":visible") == true) {
			temp.slideUp("slow", function() {
				temp.removeAttr("style").css;});
				$(this).addClass('closed');
				$(this).children('.glyphicon-chevron-up').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
			}
		else {temp.slideDown();$(this).removeClass('closed');$(this).children('.glyphicon-chevron-down').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");}
		return false;
	});
});
/*********************************************************
modal scroll fix
**********************************************************/
$(document).ready(function() {
	try{
		$('.modal').on('show.bs.modal', function (e) {tg.scrollTop = $(window).scrollTop();});// find/record scroll position b/4 opening
		$('.modal').on('hidden.bs.modal', function (e) {$(window).scrollTop(tg.scrollTop);});// reset scroll position on close
		$.fn.modal.Constructor.DEFAULTS.backdrop = 'static';//disable modal close on click background
		$.fn.modal.Constructor.DEFAULTS.keyboard = false;//disable modal close on keyboard 'esc' key
	}catch(err){}//incase bootstap js isn't loaded
});
/*********************************************************
Left Rail
**********************************************************/
$(document).ready(function() {
	$(".leftRail").delegate(".leftRailTitle", "click", function() {
		//$(this).removeClass('hasError');
		var temp =$(this).parent()
		if(temp.hasClass("open")){
			temp.removeClass("open");
		}else{
			temp.addClass("open");
		}
		return false;
	});// v1.4.3 < jQuery < v1.7
});
/*********************************************************
HTML 5 - LocalStorage get/save
**********************************************************/
tg.LocalStorageGetSet = function(storeVal,itemName,inputType){
	if(typeof(Storage) !== void(0)){//browser compatibility
		var temp=localStorage[storeVal];
		if (temp){
			if(inputType.toLowerCase() == "select"){$(itemName).val(temp).change();}//dropdown choice + run onchange
			if(inputType.toLowerCase() == "radio"){$('input:radio[name='+itemName+']').filter('[value='+temp+']').prop("checked",true).trigger("change");}//radio selected
			if(inputType.toLowerCase() == 'value'){return temp}//simply return value
			else{$(itemName).val(temp);}//default text input
		}
	}
	return false;
}
tg.LocalStorageSave = function(storeVal,itemName,inputType){
	if(typeof(Storage) !== void(0)){//browser compatibility
		if(inputType.toLowerCase() == "select"){var temp=$(itemName+" option:selected").val()}//dropdown choice
		if(inputType.toLowerCase() == "radio"){var temp=$("input[name="+itemName+"]:checked").val()}//radio selected
		if(inputType.toLowerCase() == 'value'){var temp=itemName}//passed in value to store
		else{var temp=$(itemName).val();}//default to text input
		if (temp && temp!="mm/dd/yyyy"){localStorage[storeVal]=temp;}
	}
	return false;
}
/*********************************************************
Main Nav functionality
**********************************************************/
	$(document).ready(function() {
		$('#navDrop > ul > li > a').click(function(e) {
			if($(this).parent().hasClass("current") && $("#bodyID").hasClass("isDesktop")){//only close on desktop sizes
				tg.closeAllNav();//close main nav re-clicks
				return false;
			}
			if($(this).parent().hasClass("contains-sub")){
				tg.toggleSubNav($(this));
				$("#bodyID").addClass('openNav');
				return false;
			}
			tg.closeAllSubNav($(this));
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
			$("#navDrop .submenu").not(e.parents()).removeClass('open current').slideUp().removeAttr("style");//close all sub navs
			$("#navDrop .contains-sub").not(e.parents()).removeClass('open current');//close all sub navs
			e.parent().addClass('current');
			$("#bodyID").addClass('openNav');
			e.siblings('.submenu').addClass('open').slideDown();//show this item
		}else {//comes from nav item so show its drop
			$(e).siblings('.submenu').slideUp().removeClass('open current').removeAttr("style");//removeAttr is jQuery v1.6x fix for slideUp not working
			$(e).parent().removeClass('open current');
		}
		return false;
	}
	tg.closeAllSubNav = function(e){
		var temp = $("#navDrop");
		$("#bodyID").removeClass('openNav');
		if (!e){
			$('.open', temp).removeClass('open').slideUp().removeAttr("style");//removeAttr is jQuery v1.6x fix for slideUp not working
			$('.current', temp).removeClass('current');
		}else{
			$('.open', temp).not(e.next()).removeClass('open').slideUp().removeAttr("style");//removeAttr is jQuery v1.6x fix for slideUp not working
			$('.current', temp).not(e.next()).removeClass('current');
		}
		return false;
	}
	tg.toggleMainNav = function(e){
		var temp = $("#navDrop");
		if(temp.is(":hidden") == true){// comes from menu button so show menu
			$("#bodyID").addClass('openNav');
			temp.css("display","block");
			//temp.slideDown("slow");// causes desktop background to tween
		}else {//comes from nav item so show its drop
			tg.closeAllNav(e);
		}
		return false;
	}
	tg.closeAllNav = function(e){
		$("#bodyID").removeClass('openNav');
		$("#navDrop").css("display","none").removeAttr("style");
		//$("#navDrop").slideUp("slow", function() {$(this).removeAttr("style");});//remove style attr and allow default css to rule so resize doesn't impact desktop size// causes desktop background to tween
		tg.closeAllSubNav(e);
		return false;
	}
})( this );