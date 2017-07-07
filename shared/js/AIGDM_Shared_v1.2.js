/* jQuery Actual Plugin * http://dreamerslab.com/) * Version: 1.0.16 */
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a);}else{a(jQuery);}}(function(a){a.fn.addBack=a.fn.addBack||a.fn.andSelf;a.fn.extend({actual:function(b,l){if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}var f={absolute:false,clone:false,includeMargin:false,display:"block"};var i=a.extend(f,l);var e=this.eq(0);var h,j;if(i.clone===true){h=function(){var m="position: absolute !important; top: -1000 !important; ";e=e.clone().attr("style",m).appendTo("body");};j=function(){e.remove();};}else{var g=[];var d="";var c;h=function(){c=e.parents().addBack().filter(":hidden");d+="visibility: hidden !important; display: "+i.display+" !important; ";if(i.absolute===true){d+="position: absolute !important; ";}c.each(function(){var m=a(this);var n=m.attr("style");g.push(n);m.attr("style",n?n+";"+d:d);});};j=function(){c.each(function(m){var o=a(this);var n=g[m];if(n===undefined){o.removeAttr("style");}else{o.attr("style",n);}});};}h();var k=/(outer)/.test(b)?e[b](i.includeMargin):e[b]();j();return k;}});}));
/* equalheight - http://css-tricks.com/equal-height-blocks-in-rows/ * uses .actual('height') jquery plugin instead to account for hidden items */
(function(){
	equalheight=function(container){var currentTallest=0,currentRowStart=0,rowDivs=new Array(),$el,topPosition=0;$(container).each(function(){$el=$(this);$($el).height('auto');topPostion=$el.position().top;if(currentRowStart!=topPostion){for(currentDiv=0;currentDiv<rowDivs.length;currentDiv++){rowDivs[currentDiv].height(currentTallest);}rowDivs.length=0;currentRowStart=topPostion;currentTallest=$el.actual('height');rowDivs.push($el);}else{rowDivs.push($el);currentTallest=(currentTallest<$el.actual('height'))?($el.actual('height')):(currentTallest);}for(currentDiv=0;currentDiv<rowDivs.length;currentDiv++){rowDivs[currentDiv].height(currentTallest);}});}
	return false;
})()
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
	if ($(".pinned").length){$("#bodyID").addClass("hasPinned");}
	//update phone #s on website
	$(".hasHrefPhoneNum").each(function(){
		try{
			var temp;
			if($(this).hasClass("TelephoneNumberALT")){temp=session_vars.TelephoneNumberALT;}else{temp=session_vars.TelephoneNumber;}
			$(this).attr('href', 'tel:1'+temp.replace(/\s+|-|\./g, ''));
		}catch(err){}
	});
	$(".isPhoneNum").each(function(){
		try{
			var temp;
			if($(this).hasClass("TelephoneNumberALT")){temp=session_vars.TelephoneNumberALT;}else{temp=session_vars.TelephoneNumber;}
			$(this).html(temp);
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
			temp.slideDown("slow");
		}else {//comes from nav item so show its drop
			tg.closeAllNav(e);
		}
		return false;
	}
	tg.closeAllNav = function(e){
		$("#bodyID").removeClass('openNav');
		$("#navDrop").slideUp("slow", function() {$(this).removeAttr("style");});//remove style attr and allow default css to rule so resize doesn't impact desktop size
		tg.closeAllSubNav(e);
		return false;
	}
})( this );

/*********************************************************
iOS orientationchange zoom bug - might be in iOS7 too so i updated it to include "OS [1-7]_[0-9_]" from "OS [1-5]_[0-9_]"
**********************************************************/
/*! A fix for the iOS orientationchange zoom bug. Script by @scottjehl, rebound by @wilto.MIT / GPLv2 License.*/
(function(a){function m(){d.setAttribute("content",g),h=!0}function n(){d.setAttribute("content",f),h=!1}function o(b){l=b.accelerationIncludingGravity,i=Math.abs(l.x),j=Math.abs(l.y),k=Math.abs(l.z),(!a.orientation||a.orientation===180)&&(i>7||(k>6&&j<8||k<8&&j>6)&&i>5)?h&&n():h||m()}var b=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-7]_[0-9_]* like Mac OS X/i.test(b)&&b.indexOf("AppleWebKit")>-1))return;var c=a.document;if(!c.querySelector)return;var d=c.querySelector("meta[name=viewport]"),e=d&&d.getAttribute("content"),f=e+",maximum-scale=1",g=e+",maximum-scale=10",h=!0,i,j,k,l;if(!d)return;a.addEventListener("orientationchange",m,!1),a.addEventListener("devicemotion",o,!1)})(this);