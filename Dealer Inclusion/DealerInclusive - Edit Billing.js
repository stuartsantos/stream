//** EDIT BILLING DETAILS

$(document).ready(function() {
	//***************************************************
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
	//***************************************************
	$('#APIDealerBillingUpdateResults, #APIUpdatePaymentRIC').val('').attr("disabled",true);//clear cache on page load
	$('#EmailErrorMSG').val('');//clear cache on page load

//***************************************************
	$('#EditWeeklyAutopay').change(function(e) {
		if($('#EditWeeklyAutopay').val().toLowerCase() == "on"){
			$('#WeeklyAutopayTF').val("true").change();
		}else{
			$('#WeeklyAutopayTF').val("false").change();
		}
	});
//***************************************************
	if(session_vars.AutoPayFlagEval.toString().toLowerCase() == "true"){//update display to match user settings
		$('#EditWeeklyAutopay').prop('checked', true).val('on').change();
	}else{
		$('#EditWeeklyAutopay').prop('checked', false).val('off').change();
	}
//***************************************************
	tg.APIUpdatePayment = function(){
			console.log('now call APIUpdatePayment...');
			triggerMSDYN_API_APIUpdatePayment();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("UpdatePayment", "APIUpdatePayment");}, tg.APItimeOutLength);//check in case APItimedOut
		
		return false;
	};
	//***********************
		$('#APIUpdatePaymentRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
						
			var ReturnInfoCode = $(this).val();
			if(ReturnInfoCode == "1000"){//successful UpdatePayment;
				$('#UpdatePaymentErrorMSGBox').slideUp();	
				//$('#btnNext').trigger("click");//works to submit form
			}else{//triggerMSDYN_API_APIUpdatePayment failed
				tg.ErrorMessaging(ReturnInfoCode, "DealerBillingUpdate", "APIUpdatePayment");//reusable logic call - UpdatePayment
			}
		});// /#APICreatePaymentRIC.change
//***************************************************
	tg.APIDealerBillingUpdate = function(){
		console.log('tg.APIDealerBillingUpdate');

		triggerMSDYN_API_APIDealerBillingUpdate();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('#DealerBillingUpdate', "APIDealerBillingUpdate");}, tg.APItimeOutLength);//check in case APItimedOut
		console.log('triggerMSDYN_API_APIDealerBillingUpdate');

		return false;
	};
	//***************************************************
	$('#APIDealerBillingUpdateResults').change(function(e) {
		console.log('APIDealerBillingUpdateResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
	
		try{
			tg.APIDealerBillingUpdateResults = JSON.parse($('#APIDealerBillingUpdateResults').val());
		
			var ReturnInfoCode = tg.APIDealerBillingUpdateResults.ReturnInfo.ReturnInfoCode;
			if(ReturnInfoCode == "1000"){//successful APIGetDealer
				$('#DealerBillingUpdateErrorMSGBox').slideUp();
				//success, now update stream vars
				$('#BillingAddress1').val($('#EditBillingAddress1').val()).trigger('change');
				$('#BillingAddress2').val($('#EditBillingAddress2').val()).trigger('change');
				$('#BillingCity').val($('#EditBillingCity').val()).trigger('change');
				tg.SwapStateLength('#EditBillingState', '#BillingState', 'abbrev');//store as abbrev
				//remove any non alphanumeric chars
				var temp = $('#EditBillingZip').val();
				$('#EditBillingZip, #BillingZip').val(temp.replace(/[^0-9a-zA-Z]/gi, '')).trigger('change');
				
				if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android"){
					$('#DealerPhone').val($('#EditDealerPhoneFix').val()).trigger('change');
				}else{
					$('#DealerPhone').val($('#EditDealerPhone').val()).trigger('change');
				}
				
				var temp;
				if($('#WeeklyAutopayTF').val() == "true"){//checked
					$('#WeeklyAutopay').val("on").trigger('change');
					temp = "IsAutopay";
				}else{
					$('#WeeklyAutopay').val("off").trigger('change');
					temp = "NoAutopay";
				}
				
				$('#SuccessFlag').val('Billing'+'-'+temp);
				$('#SaveAndSubmit').click();//use this to ensure new values are saved
			}else{
				tg.ErrorMessaging(ReturnInfoCode, "DealerBillingUpdate", "APIDealerBillingUpdateResults");//reusable logic call
			}
			
		}catch(err){
			console.log('JSON.parse(APIDealerBillingUpdateResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "DealerBillingUpdate", "APIDealerBillingUpdateResults");//reusable logic call
		}
	});// /#APIDealerBillingUpdateResults.change
	//***************************************************
	$("#DealerBillingUpdate").click(function(){
		$('#DealerBillingUpdate').addClass('disabled').attr("disabled",true).text(function(){return $(this).attr('data-waitmsg')});
		var err = 0;
		if($('#EditBillingAddress1').val().length < 1){err++;tg.flagError('#EditBillingAddress1');}
		if($('#EditBillingCity').val().length < 1){err++;tg.flagError('#EditBillingCity');}
		if($('#EditBillingState').val().length < 1 || $('#EditBillingState').val() == "-- Please Select --"){err++;tg.flagError('#EditBillingState');}
		//remove any non alphanumeric chars
		var temp = $('#EditBillingZip').val();
		$('#EditBillingZip').val(temp.replace(/[^0-9a-zA-Z]/gi, '')).change();
		temp = $('#EditBillingZip').val().length;
		if(temp < 5 || temp > 6){err++;tg.flagError('#EditBillingZip');}
		
		if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android" ){
			if(!flagblank(document.getElementById("EditDealerPhoneFix"),'Yes','minmaxlength','10', '10') || isNaN($('#EditDealerPhoneFix').val())){
				err++;
				tg.flagError('#EditDealerPhoneFix');
				$('#spanEditDealerPhoneFixWarning').slideDown();
			}else{$('#spanEditDealerPhoneFixWarning').slideUp();}
		}else if(!flagblank(document.getElementById("EditDealerPhone"),'Yes','minmaxlength','14', '14')){
			err++;
			tg.flagError('#EditDealerPhone');
			$('#spanEditDealerPhoneWarning').slideDown();
		}else{$('#spanEditDealerPhoneWarning').slideUp();}
		
		if(err===0){
			$('#DealerBillingUpdateErrorMSGBox').slideUp();
			if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android" ){$('#SendDealerPhone').val($('#EditDealerPhoneFix').val().replace(/\D/g,'')).trigger('change');}else{$('#SendDealerPhone').val($('#EditDealerPhone').val().replace(/\D/g,'')).trigger('change');}
			tg.APIDealerBillingUpdate();
		}else{
		    $('#DealerBillingUpdate').removeClass('disabled').attr("disabled",false).text(function(){return $(this).attr('data-txtmsg')});
			$('#DealerBillingUpdateErrorMSG').html("<h3>Required fields are missing or incorrect.</h3> Please make sure you fill out the highlighted item(s) below.");
			$('#DealerBillingUpdateErrorMSGBox').slideDown();
			window.location.href="#DealerBillingUpdateErrorMSGBox";
		}// if err===0

		
		return false;
	});
//***************************************************
	//push billing into editBilling
	$('#EditBillingAddress1').val($('#BillingAddress1').val()).trigger('change');
	$('#EditBillingAddress2').val($('#BillingAddress2').val()).trigger('change');
	$('#EditBillingCity').val($('#BillingCity').val()).trigger('change');
	//BillingState comes as Abbrev, need to display fullname and swap for CA provinces but pass abbrev back to Careington
	try{
		if(session_vars.Region.toLowerCase() == 'ca') {
			tg.UpdateDropdownsCA('#BillingState', '#EditBillingState');
		} else{
			tg.SwapStateLength('#BillingState', '#EditBillingState', 'name');//push abbrev into full name
		}
		//BillingState comes as Abbrev, need to display fullname but pass abbrev back to Careington
		$("#EditBillingState option").each(function(index) {
			$(this).val(tg.convert_state($(this).val(),'abbrev'));
		});
	}catch(err){}
	$('#EditBillingZip').val($('#BillingZip').val().replace(/-/i, "").replace(/\s/i, "")).trigger('change');

	if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android"){
		$('#EditDealerPhoneFix').val($('#DealerPhone').val()).trigger('change');
	}else{
		$('#EditDealerPhone').val($('#DealerPhone').val()).trigger('change').trigger('keyup');//format #
	}
	if($('#DealerPhone').val() == ""){$('#DealerPhone').val(' ');}//set to space so stream doesn't pass brackets
	
	//restrict to alpha numeric chars
	$('#EditBillingZip, #BillingZip').keydown(function(event){tg.zipFieldStrictInput(event, 0, 0,$(this).val());});
	
	tg.APIUpdatePayment();//init onload
});// /document.ready
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