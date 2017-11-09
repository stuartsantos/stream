/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=80a5a7d128d747ba7e38)
 * Config saved to config.json and https://gist.github.com/80a5a7d128d747ba7e38
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";var e=t.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(t){"use strict";function e(e){return this.each(function(){var i=t(this),n=i.data("bs.alert");n||i.data("bs.alert",n=new s(this)),"string"==typeof e&&n[e].call(i)})}var i='[data-dismiss="alert"]',s=function(e){t(e).on("click",i,this.close)};s.VERSION="3.3.5",s.TRANSITION_DURATION=150,s.prototype.close=function(e){function i(){a.detach().trigger("closed.bs.alert").remove()}var n=t(this),o=n.attr("data-target");o||(o=n.attr("href"),o=o&&o.replace(/.*(?=#[^\s]*$)/,""));var a=t(o);e&&e.preventDefault(),a.length||(a=n.closest(".alert")),a.trigger(e=t.Event("close.bs.alert")),e.isDefaultPrevented()||(a.removeClass("in"),t.support.transition&&a.hasClass("fade")?a.one("bsTransitionEnd",i).emulateTransitionEnd(s.TRANSITION_DURATION):i())};var n=t.fn.alert;t.fn.alert=e,t.fn.alert.Constructor=s,t.fn.alert.noConflict=function(){return t.fn.alert=n,this},t(document).on("click.bs.alert.data-api",i,s.prototype.close)}(jQuery),+function(t){"use strict";function e(e){return this.each(function(){var s=t(this),n=s.data("bs.button"),o="object"==typeof e&&e;n||s.data("bs.button",n=new i(this,o)),"toggle"==e?n.toggle():e&&n.setState(e)})}var i=function(e,s){this.$element=t(e),this.options=t.extend({},i.DEFAULTS,s),this.isLoading=!1};i.VERSION="3.3.5",i.DEFAULTS={loadingText:"loading..."},i.prototype.setState=function(e){var i="disabled",s=this.$element,n=s.is("input")?"val":"html",o=s.data();e+="Text",null==o.resetText&&s.data("resetText",s[n]()),setTimeout(t.proxy(function(){s[n](null==o[e]?this.options[e]:o[e]),"loadingText"==e?(this.isLoading=!0,s.addClass(i).attr(i,i)):this.isLoading&&(this.isLoading=!1,s.removeClass(i).removeAttr(i))},this),0)},i.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var i=this.$element.find("input");"radio"==i.prop("type")?(i.prop("checked")&&(t=!1),e.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==i.prop("type")&&(i.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),i.prop("checked",this.$element.hasClass("active")),t&&i.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var s=t.fn.button;t.fn.button=e,t.fn.button.Constructor=i,t.fn.button.noConflict=function(){return t.fn.button=s,this},t(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(i){var s=t(i.target);s.hasClass("btn")||(s=s.closest(".btn")),e.call(s,"toggle"),t(i.target).is('input[type="radio"]')||t(i.target).is('input[type="checkbox"]')||i.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(e){t(e.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(e.type))})}(jQuery),+function(t){"use strict";function e(e){return this.each(function(){var s=t(this),n=s.data("bs.carousel"),o=t.extend({},i.DEFAULTS,s.data(),"object"==typeof e&&e),a="string"==typeof e?e:o.slide;n||s.data("bs.carousel",n=new i(this,o)),"number"==typeof e?n.to(e):a?n[a]():o.interval&&n.pause().cycle()})}var i=function(e,i){this.$element=t(e),this.$indicators=this.$element.find(".carousel-indicators"),this.options=i,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",t.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",t.proxy(this.pause,this)).on("mouseleave.bs.carousel",t.proxy(this.cycle,this))};i.VERSION="3.3.5",i.TRANSITION_DURATION=600,i.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},i.prototype.keydown=function(t){if(!/input|textarea/i.test(t.target.tagName)){switch(t.which){case 37:this.prev();break;case 39:this.next();break;default:return}t.preventDefault()}},i.prototype.cycle=function(e){return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this},i.prototype.getItemIndex=function(t){return this.$items=t.parent().children(".item"),this.$items.index(t||this.$active)},i.prototype.getItemForDirection=function(t,e){var i=this.getItemIndex(e),s="prev"==t&&0===i||"next"==t&&i==this.$items.length-1;if(s&&!this.options.wrap)return e;var n="prev"==t?-1:1,o=(i+n)%this.$items.length;return this.$items.eq(o)},i.prototype.to=function(t){var e=this,i=this.getItemIndex(this.$active=this.$element.find(".item.active"));return t>this.$items.length-1||0>t?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){e.to(t)}):i==t?this.pause().cycle():this.slide(t>i?"next":"prev",this.$items.eq(t))},i.prototype.pause=function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&t.support.transition&&(this.$element.trigger(t.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},i.prototype.next=function(){return this.sliding?void 0:this.slide("next")},i.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},i.prototype.slide=function(e,s){var n=this.$element.find(".item.active"),o=s||this.getItemForDirection(e,n),a=this.interval,r="next"==e?"left":"right",l=this;if(o.hasClass("active"))return this.sliding=!1;var d=o[0],h=t.Event("slide.bs.carousel",{relatedTarget:d,direction:r});if(this.$element.trigger(h),!h.isDefaultPrevented()){if(this.sliding=!0,a&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var c=t(this.$indicators.children()[this.getItemIndex(o)]);c&&c.addClass("active")}var f=t.Event("slid.bs.carousel",{relatedTarget:d,direction:r});return t.support.transition&&this.$element.hasClass("slide")?(o.addClass(e),o[0].offsetWidth,n.addClass(r),o.addClass(r),n.one("bsTransitionEnd",function(){o.removeClass([e,r].join(" ")).addClass("active"),n.removeClass(["active",r].join(" ")),l.sliding=!1,setTimeout(function(){l.$element.trigger(f)},0)}).emulateTransitionEnd(i.TRANSITION_DURATION)):(n.removeClass("active"),o.addClass("active"),this.sliding=!1,this.$element.trigger(f)),a&&this.cycle(),this}};var s=t.fn.carousel;t.fn.carousel=e,t.fn.carousel.Constructor=i,t.fn.carousel.noConflict=function(){return t.fn.carousel=s,this};var n=function(i){var s,n=t(this),o=t(n.attr("data-target")||(s=n.attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,""));if(o.hasClass("carousel")){var a=t.extend({},o.data(),n.data()),r=n.attr("data-slide-to");r&&(a.interval=!1),e.call(o,a),r&&o.data("bs.carousel").to(r),i.preventDefault()}};t(document).on("click.bs.carousel.data-api","[data-slide]",n).on("click.bs.carousel.data-api","[data-slide-to]",n),t(window).on("load",function(){t('[data-ride="carousel"]').each(function(){var i=t(this);e.call(i,i.data())})})}(jQuery),+function(t){"use strict";function e(e,s){return this.each(function(){var n=t(this),o=n.data("bs.modal"),a=t.extend({},i.DEFAULTS,n.data(),"object"==typeof e&&e);o||n.data("bs.modal",o=new i(this,a)),"string"==typeof e?o[e](s):a.show&&o.show(s)})}var i=function(e,i){this.options=i,this.$body=t(document.body),this.$element=t(e),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,t.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};i.VERSION="3.3.5",i.TRANSITION_DURATION=300,i.BACKDROP_TRANSITION_DURATION=150,i.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},i.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},i.prototype.show=function(e){var s=this,n=t.Event("show.bs.modal",{relatedTarget:e});this.$element.trigger(n),this.isShown||n.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',t.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){s.$element.one("mouseup.dismiss.bs.modal",function(e){t(e.target).is(s.$element)&&(s.ignoreBackdropClick=!0)})}),this.backdrop(function(){var n=t.support.transition&&s.$element.hasClass("fade");s.$element.parent().length||s.$element.appendTo(s.$body),s.$element.show().scrollTop(0),s.adjustDialog(),n&&s.$element[0].offsetWidth,s.$element.addClass("in"),s.enforceFocus();var o=t.Event("shown.bs.modal",{relatedTarget:e});n?s.$dialog.one("bsTransitionEnd",function(){s.$element.trigger("focus").trigger(o)}).emulateTransitionEnd(i.TRANSITION_DURATION):s.$element.trigger("focus").trigger(o)}))},i.prototype.hide=function(e){e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(i.TRANSITION_DURATION):this.hideModal())},i.prototype.enforceFocus=function(){t(document).off("focusin.bs.modal").on("focusin.bs.modal",t.proxy(function(t){this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},i.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",t.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},i.prototype.resize=function(){this.isShown?t(window).on("resize.bs.modal",t.proxy(this.handleUpdate,this)):t(window).off("resize.bs.modal")},i.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$body.removeClass("modal-open"),t.resetAdjustments(),t.resetScrollbar(),t.$element.trigger("hidden.bs.modal")})},i.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},i.prototype.backdrop=function(e){var s=this,n=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var o=t.support.transition&&n;if(this.$backdrop=t(document.createElement("div")).addClass("modal-backdrop "+n).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",t.proxy(function(t){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),o&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!e)return;o?this.$backdrop.one("bsTransitionEnd",e).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION):e()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var a=function(){s.removeBackdrop(),e&&e()};t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",a).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION):a()}else e&&e()},i.prototype.handleUpdate=function(){this.adjustDialog()},i.prototype.adjustDialog=function(){var t=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&t?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!t?this.scrollbarWidth:""})},i.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},i.prototype.checkScrollbar=function(){var t=window.innerWidth;if(!t){var e=document.documentElement.getBoundingClientRect();t=e.right-Math.abs(e.left)}this.bodyIsOverflowing=document.body.clientWidth<t,this.scrollbarWidth=this.measureScrollbar()},i.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",t+this.scrollbarWidth)},i.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},i.prototype.measureScrollbar=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var s=t.fn.modal;t.fn.modal=e,t.fn.modal.Constructor=i,t.fn.modal.noConflict=function(){return t.fn.modal=s,this},t(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(i){var s=t(this),n=s.attr("href"),o=t(s.attr("data-target")||n&&n.replace(/.*(?=#[^\s]+$)/,"")),a=o.data("bs.modal")?"toggle":t.extend({remote:!/#/.test(n)&&n},o.data(),s.data());s.is("a")&&i.preventDefault(),o.one("show.bs.modal",function(t){t.isDefaultPrevented()||o.one("hidden.bs.modal",function(){s.is(":visible")&&s.trigger("focus")})}),e.call(o,a,this)})}(jQuery),+function(t){"use strict";function e(e){return this.each(function(){var s=t(this),n=s.data("bs.tab");n||s.data("bs.tab",n=new i(this)),"string"==typeof e&&n[e]()})}var i=function(e){this.element=t(e)};i.VERSION="3.3.5",i.TRANSITION_DURATION=150,i.prototype.show=function(){var e=this.element,i=e.closest("ul:not(.dropdown-menu)"),s=e.data("target");if(s||(s=e.attr("href"),s=s&&s.replace(/.*(?=#[^\s]*$)/,"")),!e.parent("li").hasClass("active")){var n=i.find(".active:last a"),o=t.Event("hide.bs.tab",{relatedTarget:e[0]}),a=t.Event("show.bs.tab",{relatedTarget:n[0]});if(n.trigger(o),e.trigger(a),!a.isDefaultPrevented()&&!o.isDefaultPrevented()){var r=t(s);this.activate(e.closest("li"),i),this.activate(r,r.parent(),function(){n.trigger({type:"hidden.bs.tab",relatedTarget:e[0]}),e.trigger({type:"shown.bs.tab",relatedTarget:n[0]})})}}},i.prototype.activate=function(e,s,n){function o(){a.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),r?(e[0].offsetWidth,e.addClass("in")):e.removeClass("fade"),e.parent(".dropdown-menu").length&&e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),n&&n()}var a=s.find("> .active"),r=n&&t.support.transition&&(a.length&&a.hasClass("fade")||!!s.find("> .fade").length);a.length&&r?a.one("bsTransitionEnd",o).emulateTransitionEnd(i.TRANSITION_DURATION):o(),a.removeClass("in")};var s=t.fn.tab;t.fn.tab=e,t.fn.tab.Constructor=i,t.fn.tab.noConflict=function(){return t.fn.tab=s,this};var n=function(i){i.preventDefault(),e.call(t(this),"show")};t(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',n).on("click.bs.tab.data-api",'[data-toggle="pill"]',n)}(jQuery),+function(t){"use strict";function e(e){return this.each(function(){var s=t(this),n=s.data("bs.affix"),o="object"==typeof e&&e;n||s.data("bs.affix",n=new i(this,o)),"string"==typeof e&&n[e]()})}var i=function(e,s){this.options=t.extend({},i.DEFAULTS,s),this.$target=t(this.options.target).on("scroll.bs.affix.data-api",t.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",t.proxy(this.checkPositionWithEventLoop,this)),this.$element=t(e),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};i.VERSION="3.3.5",i.RESET="affix affix-top affix-bottom",i.DEFAULTS={offset:0,target:window},i.prototype.getState=function(t,e,i,s){var n=this.$target.scrollTop(),o=this.$element.offset(),a=this.$target.height();if(null!=i&&"top"==this.affixed)return i>n?"top":!1;if("bottom"==this.affixed)return null!=i?n+this.unpin<=o.top?!1:"bottom":t-s>=n+a?!1:"bottom";var r=null==this.affixed,l=r?n:o.top,d=r?a:e;return null!=i&&i>=n?"top":null!=s&&l+d>=t-s?"bottom":!1},i.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(i.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},i.prototype.checkPositionWithEventLoop=function(){setTimeout(t.proxy(this.checkPosition,this),1)},i.prototype.checkPosition=function(){if(this.$element.is(":visible")){var e=this.$element.height(),s=this.options.offset,n=s.top,o=s.bottom,a=Math.max(t(document).height(),t(document.body).height());"object"!=typeof s&&(o=n=s),"function"==typeof n&&(n=s.top(this.$element)),"function"==typeof o&&(o=s.bottom(this.$element));var r=this.getState(a,e,n,o);if(this.affixed!=r){null!=this.unpin&&this.$element.css("top","");var l="affix"+(r?"-"+r:""),d=t.Event(l+".bs.affix");if(this.$element.trigger(d),d.isDefaultPrevented())return;this.affixed=r,this.unpin="bottom"==r?this.getPinnedOffset():null,this.$element.removeClass(i.RESET).addClass(l).trigger(l.replace("affix","affixed")+".bs.affix")}"bottom"==r&&this.$element.offset({top:a-e-o})}};var s=t.fn.affix;t.fn.affix=e,t.fn.affix.Constructor=i,t.fn.affix.noConflict=function(){return t.fn.affix=s,this},t(window).on("load",function(){t('[data-spy="affix"]').each(function(){var i=t(this),s=i.data();s.offset=s.offset||{},null!=s.offsetBottom&&(s.offset.bottom=s.offsetBottom),null!=s.offsetTop&&(s.offset.top=s.offsetTop),e.call(i,s)})})}(jQuery),+function(t){"use strict";function e(e){var i,s=e.attr("data-target")||(i=e.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,"");return t(s)}function i(e){return this.each(function(){var i=t(this),n=i.data("bs.collapse"),o=t.extend({},s.DEFAULTS,i.data(),"object"==typeof e&&e);!n&&o.toggle&&/show|hide/.test(e)&&(o.toggle=!1),n||i.data("bs.collapse",n=new s(this,o)),"string"==typeof e&&n[e]()})}var s=function(e,i){this.$element=t(e),this.options=t.extend({},s.DEFAULTS,i),this.$trigger=t('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};s.VERSION="3.3.5",s.TRANSITION_DURATION=350,s.DEFAULTS={toggle:!0},s.prototype.dimension=function(){var t=this.$element.hasClass("width");return t?"width":"height"},s.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var e,n=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(n&&n.length&&(e=n.data("bs.collapse"),e&&e.transitioning))){var o=t.Event("show.bs.collapse");if(this.$element.trigger(o),!o.isDefaultPrevented()){n&&n.length&&(i.call(n,"hide"),e||n.data("bs.collapse",null));var a=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[a](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var r=function(){this.$element.removeClass("collapsing").addClass("collapse in")[a](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!t.support.transition)return r.call(this);var l=t.camelCase(["scroll",a].join("-"));this.$element.one("bsTransitionEnd",t.proxy(r,this)).emulateTransitionEnd(s.TRANSITION_DURATION)[a](this.$element[0][l])}}}},s.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var e=t.Event("hide.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var i=this.dimension();this.$element[i](this.$element[i]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var n=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return t.support.transition?void this.$element[i](0).one("bsTransitionEnd",t.proxy(n,this)).emulateTransitionEnd(s.TRANSITION_DURATION):n.call(this)}}},s.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},s.prototype.getParent=function(){return t(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(t.proxy(function(i,s){var n=t(s);this.addAriaAndCollapsedClass(e(n),n)},this)).end()},s.prototype.addAriaAndCollapsedClass=function(t,e){var i=t.hasClass("in");t.attr("aria-expanded",i),e.toggleClass("collapsed",!i).attr("aria-expanded",i)};var n=t.fn.collapse;t.fn.collapse=i,t.fn.collapse.Constructor=s,t.fn.collapse.noConflict=function(){return t.fn.collapse=n,this},t(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(s){var n=t(this);n.attr("data-target")||s.preventDefault();var o=e(n),a=o.data("bs.collapse"),r=a?"toggle":n.data();i.call(o,r)})}(jQuery),+function(t){"use strict";function e(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(void 0!==t.style[i])return{end:e[i]};return!1}t.fn.emulateTransitionEnd=function(e){var i=!1,s=this;t(this).one("bsTransitionEnd",function(){i=!0});var n=function(){i||t(s).trigger(t.support.transition.end)};return setTimeout(n,e),this},t(function(){t.support.transition=e(),t.support.transition&&(t.event.special.bsTransitionEnd={bindType:t.support.transition.end,delegateType:t.support.transition.end,handle:function(e){return t(e.target).is(this)?e.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery);


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

/*********************************************************
iOS orientationchange zoom bug - might be in iOS7 too so i updated it to include "OS [1-7]_[0-9_]" from "OS [1-5]_[0-9_]"
**********************************************************/
/*! A fix for the iOS orientationchange zoom bug. Script by @scottjehl, rebound by @wilto.MIT / GPLv2 License.*/
(function(a){function m(){d.setAttribute("content",g),h=!0}function n(){d.setAttribute("content",f),h=!1}function o(b){l=b.accelerationIncludingGravity,i=Math.abs(l.x),j=Math.abs(l.y),k=Math.abs(l.z),(!a.orientation||a.orientation===180)&&(i>7||(k>6&&j<8||k<8&&j>6)&&i>5)?h&&n():h||m()}var b=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-7]_[0-9_]* like Mac OS X/i.test(b)&&b.indexOf("AppleWebKit")>-1))return;var c=a.document;if(!c.querySelector)return;var d=c.querySelector("meta[name=viewport]"),e=d&&d.getAttribute("content"),f=e+",maximum-scale=1",g=e+",maximum-scale=10",h=!0,i,j,k,l;if(!d)return;a.addEventListener("orientationchange",m,!1),a.addEventListener("devicemotion",o,!1)})(this);