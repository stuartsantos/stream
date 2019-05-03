//HOME
//var checkMatch = new RegExp(/^(?![\d#]\ \w+)?^((?!^ *((^(?![\d#]).*p[ \.]*\ ?(o|0)[-. \/\\]*[\ \.\-]+[-]?((box|bin)|b|(#|num)?\d+))|(p(ost)? *(o(ff(ice)?)?)? +((box|bin)|b)? *\d+)|(p *-?\/?(o)? *-?box)|post office box)|(\bPOB\b)).)*$/igm);
$('.EnrollNowModal').attr('id','EnrollNowModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.DealerSignInModal').attr('id','DealerSignInModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.DealerForgotPasswordModal').attr('id','DealerForgotPasswordModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.DealerCreateAccountModal').attr('id','DealerCreateAccountModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready

$(document).ready(function() {
	//***************************************************
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
    //***************************************************
	//restrict to alpha numeric chars
	$('#DealerCreateAccountZip, #DealerForgotPasswordZip').keydown(function(event){tg.zipFieldStrictInput(event, 0, 0,$(this).val());});
    //***************************************************
	//Move Dealer inputs to modal windows
	$("#DealerLoginNumber").removeAttr("type").appendTo("#DealerLoginNumberWrap");//move into modal
	$("#DealerLoginPassword").removeAttr("type").attr("type","password").appendTo("#DealerLoginPasswordWrap");//move into modal
	//**
	$("#DealerForgotPasswordNumber").removeAttr("type").appendTo("#DealerForgotPasswordNumberWrap");//move into modal
	$("#DealerForgotPasswordZip").appendTo("#DealerForgotPasswordZipWrap");//move into modal
	//**
	$("#DealerCreateAccountNumber").removeAttr("type").appendTo("#DealerCreateAccountNumberWrap");//move into modal
	$("#DealerCreateAccountZip").appendTo("#DealerCreateAccountZipWrap");//move into modal
	$("#DealerCreateAccountEmail").appendTo("#DealerCreateAccountEmailWrap");//move into modal
	$("#DealerCreateAccountPassword1").removeAttr("type").attr("type","password").appendTo("#DealerCreateAccountPassword1Wrap");//move into modal
	$("#DealerCreateAccountPassword2").removeAttr("type").attr("type","password").appendTo("#DealerCreateAccountPassword2Wrap");//move into modal
    //**
    $('#APIGetDealerRIC, #APIDealerCreateAccountRIC, #APIDealerSignInRIC, #APIDealerSendPasswordResetRIC, #APIDealerSendPasswordResetCaRIC, #APIDealerRIC').val('').attr("disabled",true);//clear cache on page load
	//***************************************************
	if(session_vars.URLParameterModal == "reset"){//auto show certain modals on page load
		$('#DealerForgotPasswordModal').modal("show");
	}else if(session_vars.URLParameterModal == "login"){
		$('#DealerSignInModal').modal("show");
	}else if(session_vars.URLParameterModal == "notloggedin"){
		$('#LoginStatusModal').modal("show");
	}
	
    //*********************************************************************************************************************************************************
	tg.DealerLoginSubmit = function(e){
		//$('#BillingState, #AccountID, #Region, #IsActive, #DealerDistrict, #DealerCOD').val('').change();//clear values incase of partial signin
		
		var err = 0;
		$('#DealerLoginNumber').val($('#DealerLoginNumber').val().replace(/\s/g, '')); // remove blank spaces		
		if($('#DealerLoginNumber').val().length < 5){$('#DealerLoginNumberError').slideDown();err++;tg.flagError('#DealerLoginNumber');}
		else{$('#DealerLoginNumberError').slideUp();}
		if($('#DealerLoginPassword').val() == " " || $('#DealerLoginPassword').val().length === 0){$('#DealerLoginPasswordError').slideDown();err++;tg.flagError('#DealerLoginPassword');}
		else{$('#DealerLoginPasswordError').slideUp();}
		
		if(err===0){
			$('#DealerSignInErrorMSGBox').slideUp();
			$('#DealerSignInBtn').val(function(){return $(this).attr('data-waitmsg')});
			triggerMSDYN_API_APIDealerSignIn();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerSignIn", "APIDealerSignIn", "Home-APIDealerSignIn");}, tg.APItimeOutLength);//check in case APItimedOut
		}else{
		    $('#DealerSignInBtn').val(function(){return $(this).attr('data-txtmsg')});
		}// if err===0
		return false;
	};
	//***********************
		$('#APIDealerSignInRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1 = $(this).val();
			if(errVal1 == "1000"){//successful login
				//103 = Rheem, 147 = Carrier, 102 = Nortek, 18 = Lennox
				$('#Region').val("US").change();
				if($('#AccountID').val() == "18"){//check if Lennox brand
					triggerMSDYN_API_APIDealerSignInLennox();//APIDealerSignIn passed, do Lennox API call
					tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerSignIn", "APIDealerSignInLennox");}, tg.APItimeOutLength);//check in case APItimedOut
					console.log('running Lennox APIDealerSignInLennox');
				}else{//non Lennox brands
					$('#SaveAndSubmit').click();//trigger manual save and submit
				}
				$('#DealerSignInErrorMSGBox').slideUp();
			}else if(errVal1 == "1013"){//check for CA account
					triggerMSDYN_API_APIDealerSignInCA();//APIDealerSignIn passed, do Lennox API call
					tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerSignIn", "APIDealerSignInCA", "Home-APIDealerSignInCA");}, tg.APItimeOutLength);//check in case APItimedOut
					console.log('not a US dealer, checking to see if CA dealer...');
			}else{
				tg.ErrorMessaging(errVal1, "DealerSignIn", "APIDealerSignIn");//reusable logic call
			}
		});// /#APIDealerSignInRIC.change
	//***********************
		$('#APIDealerSignInCaRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1 = $(this).val();
			if(errVal1 == "1000"){//successful login
				//103 = Rheem, 147 = Carrier, 102 = Nortek, 18 = Lennox
				$('#Region').val("CA").change();
				if($('#AccountID').val() == "18"){//check if Lennox brand
					triggerMSDYN_API_APIDealerSignInLennox();//APIDealerSignIn passed, do Lennox API call
					tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerSignIn", "APIDealerSignInLennox");}, tg.APItimeOutLength);//check in case APItimedOut
					console.log('running Lennox APIDealerSignInLennox');
				}else{//non Lennox brands
					$('#SaveAndSubmit').click();//trigger manual save and submit
				}
				$('#DealerSignInErrorMSGBox').slideUp();
			}else{
				tg.ErrorMessaging(errVal1, "DealerSignIn", "APIDealerSignIn");//reusable logic call
			}
		});// /#APIDealerSignInRIC.change
	//***********************
		$('#APIDealerSignInLennoxRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1 = $(this).val();
			if(errVal1.toLowerCase() != "success"){//catch empty APIDealer > Status
				errVal1 = "LennoxWarning";
				$('#DealerSignInBtn').addClass('disabled').attr("disabled",true);
			}
			if(errVal1.toLowerCase() == "success"){//successful login
				$('#SaveAndSubmit').click();//trigger manual save and submit
				$('#DealerSignInErrorMSGBox').slideUp();
			}else{
				tg.ErrorMessaging(errVal1, "DealerSignIn", "APIDealerSignInLennox");//reusable logic call
			}
		});// /#APIDealerSignInLennoxRIC.change
	//*********************************************************************************************************************************************************
	tg.DealerForgotPasswordSubmit = function(e){
		$('#BillingState, #AccountID, #Region, #IsActive, #DealerDistrict, #DealerCOD').val('').change();//clear values incase of partial signin
	    //APIDealerSendPasswordResetRIC
		var err = 0;


		if($('#DealerForgotPasswordNumber').val().length < 5){$('#DealerForgotPasswordNumberError').slideDown();err++;tg.flagError('#DealerForgotPasswordNumber');}
		else{$('#DealerForgotPasswordNumberError').slideUp();}
		//remove any non alphanumeric chars
		var temp = $('#DealerForgotPasswordZip').val();
		$('#DealerForgotPasswordZip').val(temp.replace(/[^0-9a-zA-Z]/gi, '')).change();
		temp = $('#DealerForgotPasswordZip').val().length;
		if(!temp || temp >6 || temp <5){$('#DealerForgotPasswordZipError').slideDown();err++;tg.flagError('#DealerForgotPasswordZip');}
		else{$('#DealerForgotPasswordZipError').slideUp();}

		if(err===0){
			$('#DealerForgotPasswordErrorMSGBox').slideUp();
			$('#DealerForgotPasswordBtn').val(function(){return $(this).attr('data-waitmsg')});
			
			if(temp > 5){//is CA
				triggerMSDYN_API_APIDealerSendPasswordResetCA();//local validation passed, do API call
				tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerForgotPassword", "APIDealerSendPasswordReset");}, tg.APItimeOutLength);//check in case APItimedOut
			} else {//is US
				triggerMSDYN_API_APIDealerSendPasswordReset();//local validation passed, do API call
				tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerForgotPassword", "APIDealerSendPasswordReset");}, tg.APItimeOutLength);//check in case APItimedOut
			}
		}else{
		    $('#DealerForgotPasswordBtn').val(function(){return $(this).attr('data-txtmsg')});
		}// if err===0

		return false;
	};
	//***********************
		$('#APIDealerSendPasswordResetRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1 = $(this).val();
			if(errVal1 == "1000"){//successful login
				$('#DealerForgotPasswordErrorMSGBox').slideUp();
				$('#DealerForgotPasswordSuccessMSGBox').slideDown();
				$('#DealerForgotPasswordBtn').val("Success").addClass('disabled').attr("disabled",true);//success so disable button to prevent dupes		

				window.location.href="#DealerForgotPasswordSuccessMSGBox";
			}else{
				tg.ErrorMessaging(errVal1, "DealerForgotPassword", "APIDealerSendPasswordReset");//reusable logic call
			}
		});// /#APIDealerSendPasswordResetRIC.change
	//***********************
		$('#APIDealerSendPasswordResetCaRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1 = $(this).val();
			if(errVal1 == "1000"){//successful login
				$('#DealerForgotPasswordErrorMSGBox').slideUp();
				$('#DealerForgotPasswordSuccessMSGBox').slideDown();
				$('#DealerForgotPasswordBtn').val("Success").addClass('disabled').attr("disabled",true);//success so disable button to prevent dupes		

				window.location.href="#DealerForgotPasswordSuccessMSGBox";
			}else{
				tg.ErrorMessaging(errVal1, "DealerForgotPassword", "APIDealerSendPasswordResetCA");//reusable logic call
			}
		});// /#APIDealerSendPasswordResetCaRIC.change

	//*********************************************************************************************************************************************************
	tg.DealerCreateAccountSubmit = function(e){
		$('#BillingState, #AccountID, #Region, #IsActive, #DealerDistrict, #DealerCOD').val('').change();//clear values incase of partial signin
		var err = 0;

		if($('#DealerCreateAccountPassword1').val().match(/[a-z]/g)){$('#PasswordCriteriaWrap').removeClass('lowercaseErr');}else{err++;$('#PasswordCriteriaWrap').addClass('lowercaseErr');}//match lowercase
		if($('#DealerCreateAccountPassword1').val().match(/[A-Z]/g)){$('#PasswordCriteriaWrap').removeClass('uppercaseErr');}else{err++;$('#PasswordCriteriaWrap').addClass('uppercaseErr');}//match uppercase
		if($('#DealerCreateAccountPassword1').val().match(/[0-9]/g)){$('#PasswordCriteriaWrap').removeClass('numbersErr');}else{err++;$('#PasswordCriteriaWrap').addClass('numbersErr');}//match numbers
		var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		if(format.test($('#DealerCreateAccountPassword1').val())){$('#PasswordCriteriaWrap').removeClass('specialCharErr');}else{err++;$('#PasswordCriteriaWrap').addClass('specialCharErr');}//match special char
		if($('#DealerCreateAccountPassword1').val().length >= 7){$('#PasswordCriteriaWrap').removeClass('minErr');}else{err++;$('#PasswordCriteriaWrap').addClass('minErr');}//match min length
		if($('#DealerCreateAccountPassword1').val().length <= 32){$('#PasswordCriteriaWrap').removeClass('maxErr');}else{err++;$('#PasswordCriteriaWrap').addClass('maxErr');}//match max length
		if(err>=1){
			$('#DealerCreateAccountPassword1Error').slideDown();
			tg.flagError('#DealerCreateAccountPassword1');
		    window.location.href="#PasswordCriteriaAnchor1";
		}else{$('#DealerCreateAccountPassword1Error').slideUp();}
		
		if($('#DealerCreateAccountPassword2').val() === ""  || $('#DealerCreateAccountPassword2').val() != $('#DealerCreateAccountPassword1').val()){$('#DealerCreateAccountPassword2Error').slideDown();err++;tg.flagError('#DealerCreateAccountPassword2');}
		else{$('#DealerCreateAccountPassword2Error').slideUp();}
		
		$('#DealerCreateAccountNumber').val($('#DealerCreateAccountNumber').val().replace(/\s/g, '')); // remove blank spaces
		if($('#DealerCreateAccountNumber').val().length < 5){$('#DealerCreateAccountNumberError').slideDown();err++;tg.flagError('#DealerCreateAccountNumber');}
		else{$('#DealerCreateAccountNumberError').slideUp();}
		

		//remove any non alphanumeric chars
		$('#DealerCreateAccountZip').val($('#DealerCreateAccountZip').val().replace(/\s/g, '')); // remove blank spaces
		var temp = $('#DealerCreateAccountZip').val();
		$('#DealerCreateAccountZip').val(temp.replace(/[^0-9a-zA-Z]/gi, '')).change();
		temp = $('#DealerCreateAccountZip').val().length;
		if(temp < 5 || temp > 6){$('#DealerCreateAccountZipError').slideDown();err++;tg.flagError('#DealerCreateAccountZip');}
		else{$('#DealerCreateAccountZipError').slideUp();}
		
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if($('#DealerCreateAccountEmail').val() === "" || !re.test($('#DealerCreateAccountEmail').val())){$('#DealerCreateAccountEmailError').slideDown();err++;tg.flagError('#DealerCreateAccountEmail');}
		else{$('#DealerCreateAccountEmailError').slideUp();}

		if(err===0){
			$('#DealerCreateAccountErrorMSGBox').slideUp();
			$('#DealerCreateAccountBtn').val(function(){return $(this).attr('data-waitmsg')});
			triggerMSDYN_API_APIGetDealer();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerCreateAccount", "GetDealer");}, tg.APItimeOutLength);//check incase APItimedOut
		}else{
		    $('#DealerCreateAccountBtn').val(function(){return $(this).attr('data-txtmsg')});
		}// if err===0

		return false;
	};
	//***********************
		$('#APIGetDealerRIC').change(function(e) {//Warranty API
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal=$(this).val();
			if(errVal == ""){errVal = "APItimedOut";}
			
			if(errVal == "1000" && String($("#IsActive").val()).toLowerCase() == "true"){//successful inital login
			
				if($('#AccountID').val() == "18" && $('#ClientDealerID').val() == ""){//is lennox and missing ClientDealerID
					tg.ErrorMessaging("WarrantyClientDealerID", "DealerCreateAccount", "APIGetDealer");//reusable logic call
					$('#DealerCreateAccountBtn').addClass('disabled').attr("disabled",true);
				}else{//successful full login
					$('#DealerPhoneCareintonEval').val($('#DealerPhone').val().replace(/[^0-9]/g, ""));

					var temp = "AB|BC|MB|NB|NL|NT|NS|NU|ON|PE|QC|SK|YT";
					if (temp.indexOf($('#BillingState').val().toUpperCase()) !== -1){$('#Region').val("CA").change();}//check for region code by checking state abbrev
					else{$('#Region').val("US").change();}
					if($('#AccountID').val() == "18"){//check if Lennox brand
						triggerMSDYN_API_APIDealer();//APIDealerSignIn passed, do Lennox API call
						tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerCreateAccount", "APIDealer");}, tg.APItimeOutLength);//check in case APItimedOut
					}else{//non Lennox brands
						triggerMSDYN_API_APIDealerCreateAccount();
						tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerCreateAccount", "APIDealerCreateAccount");}, tg.APItimeOutLength);//check in case APItimedOut
					}
					$('#DealerCreateAccountErrorMSGBox').slideUp();
				}
			}else{
				tg.ErrorMessaging(errVal, "DealerCreateAccount", "APIGetDealer");//reusable logic call
			}
		});// /#APIGetDealerRIC.change
	//***********************
		$('#APIDealerRIC').change(function(e) {
			console.log('$APIDealerRIC changed...');
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal=$(this).val();
			console.log('$APIDealerRIC = '+errVal + ' | IsActive = '+String($("#IsActive").val()).toLowerCase());
			if(errVal.toLowerCase() != "success"){//catch empty APIDealer > Status
				if(errVal == ""){errVal = "LennoxWarning";}
				$('#DealerCreateAccountBtn').addClass('disabled').attr("disabled",true);
			}
			if(errVal.toLowerCase() == "success" && String($("#IsActive").val()).toLowerCase() == "true"){//successful login
				if($('#Region').val().toLowerCase() == "ca"){//CA Lennox brands
					triggerMSDYN_API_APIDealerCreateAccountCA();
					tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerCreateAccount", "APIDealerCreateAccountCA");}, tg.APItimeOutLength);//check in case APItimedOut
				}else{//US Lennox brands
					triggerMSDYN_API_APIDealerCreateAccount();
					tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("DealerCreateAccount", "APIDealerCreateAccount");}, tg.APItimeOutLength);//check in case APItimedOut
				}
			}else{//triggerMSDYN_API_APIDealer failed
				tg.ErrorMessaging(errVal, "DealerCreateAccount", "APIDealer");//reusable logic call
			}
		});// /#APIDealerRIC.change
	//***********************
		$('#APIDealerCreateAccountRIC').change(function(e) {
			console.log('$APIDealerCreateAccountRIC changed...');
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal=$(this).val();
			if(errVal == ""){errVal = "APItimedOut";}
			
			if(errVal == "1000" && String($("#IsActive").val()).toLowerCase() == "true"){//successful creation, now login
				$("#InitialLogin").val('true');
				$('#SaveAndSubmit').click();//trigger manual save and submit
			}else{//triggerMSDYN_API_APIDealer failed
			console.log('$APIDealerCreateAccountRIC failed');
				tg.ErrorMessaging(errVal, "DealerCreateAccount", "APIDealerCreateAccount");//reusable logic call
			}
		});// /#APIDealerCreateAccountRIC.change
	//***********************
		$('#APIDealerCreateAccountCaRIC').change(function(e) {
			console.log('$APIDealerCreateAccountCaRIC changed...');
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal=$(this).val();
			console.log('$APIDealerCreateAccountCaRIC errVal = '+errVal);
			if(errVal == ""){errVal = "APItimedOut";}
			
			if(errVal == "1000" && String($("#IsActive").val()).toLowerCase() == "true"){//successful creation, now login
				$("#InitialLogin").val('true');
				$('#SaveAndSubmit').click();//trigger manual save and submit
			}else{//triggerMSDYN_API_APIDealer failed
			console.log('$APIDealerCreateAccountCaRIC failed');
				tg.ErrorMessaging(errVal, "DealerCreateAccount", "APIDealerCreateAccount");//reusable logic call
			}
		});// /#APIDealerCreateAccountCaRIC.change
	//***************************************************
	$('#DealerSignInBtn').click(function(e) {
		tg.DealerLoginSubmit();
		return false;
	});
	$("#DealerSignInForm").submit(function(event) {//use this to capture enter keys so it submits DealerSignIn form rather than stream form
		event.preventDefault();//don't submit, but let onclick take over
		tg.DealerLoginSubmit();
	  return;
	});
    //***************************************************
	$('#DealerForgotPasswordBtn').click(function(e) {
		tg.DealerForgotPasswordSubmit();
		return false;
	});
	$("#DealerForgotPasswordForm").submit(function(event) {//use this to capture enter keys so it submits DealerForgotPasswordForm form rather than stream form
		event.preventDefault();//don't submit, but let onclick take over
		tg.DealerForgotPasswordSubmit();
		return;
	});
    //***************************************************
	$('#DealerCreateAccountBtn').click(function(e) {
		tg.DealerCreateAccountSubmit();
		return false;
	});
	$("#DealerCreateAccountForm").submit(function(event) {//use this to capture enter keys so it submits DealerCreateAccountForm form rather than stream form
		event.preventDefault();//don't submit, but let onclick take over
		tg.DealerCreateAccountSubmit();
		return;
	});
    //** customTabs ******************************************
	tg.customTab = function(e,parentWrap){
		parentWrap.addClass('parentWrap');
		var index = parentWrap.find('.customTabsButtonsWrap a').index(e);
		parentWrap.find('.customTabsButtonsWrap a').removeClass('current');//remove all current tab classes
		parentWrap.find('.customTabsContentWrap .customTab').removeClass('current').fadeOut('fast', function() {$(this).removeAttr('style').css;});//remove all current tab classes
		e.addClass('current');
		parentWrap.find('.customTabsContentWrap .customTab').eq(index).addClass('current').fadeIn('fast');
		return false;
	};
	$('.customTabsWrap .customTabsButtonsWrap a').click(function(e) {
		tg.customTab($(this),$(this).closest('.customTabsWrap'));
		return false;
	});
	$('.customTabsWrap .customTabsButtonsWrap a:first-child').trigger( 'click' );//initialize first tab on EACH .customTabsWrap

});// /document.ready
//***************************************************
	$('.btnCareington.readyCareington').addClass('tgHide');//hide Stream button so custom can run
//***************************************************
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//***************************************************
var inFormOrLink;
$('a').on('click', function() { inFormOrLink = true; });
$('form').bind('submit', function() { inFormOrLink = true; });
$('.backButton').bind('click', function() { inFormOrLink = true; });

$(window).bind('beforeunload', function(eventObject) {
    var closeDialog = getCookie("exit");
    if(session_vars.Channel == "POR" && closeDialog !== "true") {
        var returnValue = undefined;
        if (! inFormOrLink) {
            returnValue = "Are you sure you want to leave?  This offer is only good at time of product registration.";
            document.cookie = "exit=true";
        }
        eventObject.returnValue = returnValue;
        return returnValue;
    }
});
//***************************************************
//*bootstap dual modal fix
function SwapModals(toOpenModal){
    $(".modal").modal("hide");
    setTimeout(function() {
           //your code to be executed after 400 msecond 
           $(toOpenModal).modal("show");
    }, 1000);//delay in miliseconds##1000=1second
}