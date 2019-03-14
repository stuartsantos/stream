//** ENROLLMENT 2170
$('.TermSelectionModal').attr('id','TermSelectionModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.TierSelectionModal').attr('id','TierSelectionModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.RncExclusionModal').attr('id','RncExclusionModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.InstallationBeginOnModal').attr('id','InstallationBeginOnModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.InstallationEndOnModal').attr('id','InstallationEndOnModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready



//***************************************************
$(document).ready(function() {
    
    //Dropdown Modifier for Exclusions dropdown
    //Careington requires that 'No Exclusions' have a value of Y, and Exclude Residential New Construction have a value of N
	$("#OfferExclusion option[value='Y']").text('No');
	$("#OfferExclusion option[value='N']").text('Yes');

 //Show Billing Form
	function showEditBillingQuestions() { 
        $('#BillingAddressWrap').slideUp(); 
        $('.EditBillingAddressWrap').slideDown(); 
        
        return false;
	}

    
	tg.UpdateBillingItems = function(source, target){
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
		
		return false;
	}
    //***************************************************	
	
    $("#OfferCoverage").val("Labor").attr("disabled",true);//default to labor, disable user input
    //***************************************************
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
	
	try{
		//enrollment not allowed for U490 dealers
		if(session_vars.DealerDistrict.toUpperCase() == "U490"){
			$('#EnrollmentBtn').addClass('disabled').attr("disabled","disabled");
			$('#BillingAddressWrap a').hide();
			$('#EnrollmentU490ErrorMSGBox').slideDown();
			window.location.href="#EnrollmentU490ErrorMSGBox";
		}
	}catch(err){console.log('err = '+err);}
	
	//***************************************************
	$('#OfferEndDate .dropdownPlaceholder').remove();//remoev default stream <option>
	$("#WeeklyAutopay").prop("checked", true);//set enrollment to be autochecked
	$(".EditBillingAddressWrap").hide();//bypass Stream bug of empty billing inputs if hidden
    //***************************************************
	//Careington requires numbers only, stream forces text into value prop
	$("#OfferTerm option").eq(1).val(1);
	$("#OfferTerm option").eq(2).val(3);
	$("#OfferTerm option").eq(3).val(5);
	$("#OfferTerm option").eq(4).val(10);
	//restrict to alpha numeric chars
	$('#BillingZip').keydown(function(event){tg.zipFieldStrictInput(event, 0, 0,$(this).val());});
    //***************************************************
    if(session_vars.Brand.toLowerCase() == "carrier"){
    	$('#OfferTier').append($('<option>', {value:1, text: 'Plan 1'})).append($('<option>', {value:2, text: 'Plan 2'})).append($('<option>', {value:3, text: 'Plan 3'})).append($('<option>', {value:4, text: 'Plan 4'}));
    } else if(session_vars.Brand.toLowerCase() == "lennox"){
    	$('#OfferTier').append($('<option>', {value:1, text: 'Basic'})).append($('<option>', {value:2, text: 'Tier 1'})).append($('<option>', {value:3, text: 'Tier 2'}));
    } else if(session_vars.Brand.toLowerCase() == "rheem" || session_vars.Brand.toLowerCase() == "nortek"){
    	$('#OfferTier').append($('<option>', {value:1, text: 'Plan 1'})).append($('<option>', {value:2, text: 'Plan 2'})).append($('<option>', {value:3, text: 'Plan 3'}));
    } else{
    	$('#OfferTier').append($('<option>', {text: 'Error, plans not found'}));
    }
	if(session_vars.OfferTier){//reselect default on page load
		$('#OfferTier').val(session_vars.OfferTier);
	}
    //***************************************************
	$("#Coverage").attr("disabled","disabled");//will this break Stream mapping?
	$("#OfferBeginDate, #OfferEndsDateCustom").attr("placeholder","mm/dd/yyyy").addClass("form-control").wrap("<div class='form-group full-width'></div>").wrap("<div class='input-group'></div>");
	$("<div id='OfferBeginDateCalendar' class='input-group-addon input-group-addon-calendar pointer'></div>").insertBefore("#OfferBeginDate");
	$("<div id='OfferEndsDateCustomCalendar' class='input-group-addon input-group-addon-calendar pointer'></div>").insertBefore("#OfferEndsDateCustom");
    //$( "<div class='fineprint padTop12'>(Purchase must be within 30 days of Installation date for eligibility.)</div>" ).insertBefore('#spanOfferBeginDateWarning');
    
	var projectStartDate = session_vars.ProgramStartDate;
	var temp = new Date (session_vars.ProgramStartDate);	
	var projectStartDateDisplay = (temp.getMonth()+1)+'/'+(temp.getDate()+1)+'/'+temp.getFullYear();
	
	var date = new Date();//today
	date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);//fix timezone issue
	var tomorrowDate = new Date(date.setDate(date.getDate() + 1));//tomorrow
	
	var startDate = new Date(projectStartDate);//project start date
	startDate = new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60000);//fix timezone issue

	var beginDate = (tomorrowDate > startDate) ? tomorrowDate : startDate;

	var date2 = new Date(beginDate);
	date2 = new Date(date2.getTime() + date2.getTimezoneOffset() * 60000);//fix timezone issue

	var endDate = new Date(date2.setDate(date2.getDate() + 365));
	endDate = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);//fix timezone issue

	if(startDate !== date){$('#OfferBeginDateErrMsgDate').html(projectStartDateDisplay);}//update error message to state +30D from project start date instead of "today's date"
	
	$("#OfferBeginDate").datepicker({minDate: beginDate, maxDate: endDate,
    	onSelect: function(dates) {
			$(this).removeClass('inerror');//hide default validation, run here too to avoid showing error message
			$('#span'+$(this).attr('id')+'Warning').attr('style','');//hide default validation, run here too to avoid showing error message
			$("#OfferBeginDate").trigger('change');//iOS doesn't understand onSelect, no one else understands onChange
		}
    });
	$('#OfferBeginDate').datepicker('option', 'minDate', beginDate);//iOS bug where above defaults run b/4 Stream properties are set and thus this is overwritten.  remove Stream settings and recall manual set here 
	$('#OfferBeginDate').datepicker('option', 'maxDate', endDate);//iOS bug where above defaults run b/4 Stream properties are set and thus this is overwritten  remove Stream settings and recall manual set here 

	$("#OfferBeginDate").change(function() {//use onChange instead of onSelect for iOS bug
		var dates = $(this).val();
		$(this).removeClass('inerror');//hide default validation
		$('#span'+$(this).attr('id')+'Warning').attr('style','');//hide default validation
		if(dates != ''){
			var minDate = new Date(dates);
			minDate.setDate(minDate.getDate() + 30);
			minDate = new Date(minDate.getTime() + minDate.getTimezoneOffset() * 60000);//fix timezone issue
			$('#OfferEndsDateCustom').datepicker('option', 'minDate', minDate);//date chosen so set #OfferEndsDateCustom minDate to this date
			$('#OfferEndsDateCustom').trigger('change');//try to update session var in case of page reload
			$(this).attr("onblur","flagblank(this,'Yes','betweendates','"+$(this).datepicker("option", "minDate").toLocaleDateString()+"', '"+$(this).datepicker("option", "maxDate").toLocaleDateString()+"')");//update for Stream auto validation
		}

	});	
	
	var minDate = new Date((new Date($("#OfferBeginDate").val()).valueOf() + 1000*3600*24*30)).toLocaleDateString();//convert ms for date addition of +30D, has to be ms to account for timezones and stream onblur
	$("#OfferEndsDateCustom").datepicker({minDate: minDate, maxDate: null,
    	onSelect: function(dates) {
			$(this).removeClass('inerror');//hide default validation, run here too to avoid showing error message
			$('#span'+$(this).attr('id')+'Warning').attr('style','');//hide default validation, run here too to avoid showing error message
			$("#OfferEndsDateCustom").trigger('change');//iOS doesn't understand onSelect, no one else understands onChange
    	}
    });
	$("#OfferEndsDateCustom").change(function() {//use onChange instead of onSelect for iOS bug
		//var dates = $(this).val();
		$(this).removeClass('inerror');//hide default validation
		$('#span'+$(this).attr('id')+'Warning').attr('style','');//hide default validation
		$(this).attr("onblur","flagblank(this,'Yes','betweendates','"+$(this).datepicker("option", "minDate").toLocaleDateString()+"', 'null')");//update for Stream auto validation
	});

	
	


	$('#OfferBeginDate, #OfferEndsDateCustom').prop('readonly', 'readonly');//prevent user from manually typing date
	$("#OfferBeginDate").attr("onblur","flagblank(this,'Yes','betweendates','"+$("#OfferBeginDate").datepicker("option", "minDate").toLocaleDateString()+"', '"+$("#OfferBeginDate").datepicker("option", "maxDate").toLocaleDateString()+"')");//update for Stream auto validation
	$("#OfferEndsDateCustom").attr("onblur","flagblank(this,'Yes','betweendates','"+$("#OfferEndsDateCustom").datepicker("option", "minDate")+"', 'null')");//update for Stream auto validation
	
    $("#OfferBeginDateCalendar").click(function(){$("#OfferBeginDate").datepicker("show");});
	$("#OfferEndsDateCustomCalendar").click(function(){$("#OfferEndsDateCustom").datepicker("show");});

    //***************************************************
	$('#EnrollmentBtn').click(function(e) {
		console.log('#EnrollmentBtn click...');
		var err = 0;
		$('#EnrollmentErrorGenericMSGBox').slideUp();
		$('#EnrollmentBtn').val(function(){return $(this).attr('data-waitmsg')});
		
		if($('#OfferTerm').val() == "-- Please Select --"){$('#spanOfferTermWarning').slideDown();err++;tg.flagError('#OfferTerm');}
		else{$('#spanOfferTermWarning').slideUp();}
		
		if($('#OfferTier').val() == "-- Please Select --"){$('#spanOfferTierWarning').slideDown();err++;tg.flagError('#OfferTier');}
		else{$('#spanOfferTierWarning').slideUp();}

		if($('#OfferExclusion').val() == "-- Please Select --"){$('#spanOfferExclusionWarning').slideDown();err++;tg.flagError('#OfferExclusion');}
		else{$('#spanOfferExclusionWarning').slideUp();}
		
		if($('#OfferBeginDate').val() === ""){$('#spanOfferBeginDateWarning').slideDown();err++;tg.flagError('#OfferBeginDate');}
		else{$('#spanOfferBeginDateWarning').slideUp();}
		
		if($('#OfferEndDate').val() === ""){$('#spanOfferEndDateWarning').slideDown();err++;tg.flagError('#OfferEndDate');}
		else{$('#spanOfferEndDateWarning').slideUp();}
		
		if($('#OfferEndsDateCustom').is(":visible") == true && $('#OfferEndsDateCustom').val() === ""){$('#spanOfferEndsDateCustomWarning').slideDown();err++;tg.flagError('#OfferEndsDateCustom');}
		else{$('#spanOfferEndsDateCustomWarning').slideUp();}

		//*** BILLING FORM Error Handling

		if($('#EditBillingAddress1').val() === ""){$('#spanEditBillingAddress1Warning').slideDown();err++;tg.flagError('#EditBillingAddress1');showEditBillingQuestions();}
		else{$('#spanEditBillingAddress1Warning').slideUp();}

		if($('#EditBillingCity').val() === ""){$('#spanEditBillingCityWarning').slideDown();err++;tg.flagError('#EditBillingCity');showEditBillingQuestions();}
		else{$('#spanEditBillingCityWarning').slideUp();}

		if($('#EditBillingState').val() === "-- Please Select --"){$('#spanEditBillingStateWarning').slideDown();err++;tg.flagError('#EditBillingState');showEditBillingQuestions();}
		else{$('#spanEditBillingStateWarning').slideUp();}

		if($('#EditBillingZip').val() === ""){$('#spanEditBillingZipWarning').slideDown();err++;tg.flagError('#EditBillingZip');showEditBillingQuestions();}
		else{$('#spanEditBillingZipWarning').slideUp();}

		if(!$('#TermsAndConditions').prop('checked')){$('#spanTermsAndConditionsWarning').slideDown();err++;tg.flagError('#TermsAndConditions');}
		else{$('#spanTermsAndConditionsWarning').slideUp();}
		
		if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android" ){
			if(!flagblank(document.getElementById("EditDealerPhoneFix"),'Yes','minmaxlength','10', '14')){
				$('#BillingAddressWrap').slideUp();
				$('.EditBillingAddressWrap').slideDown();
				err++;tg.flagError('#EditDealerPhoneFix');
			}
		}else if(!flagblank(document.getElementById("EditDealerPhone"),'Yes','minmaxlength','14', '14')){
			$('#BillingAddressWrap').slideUp();
			$('.EditBillingAddressWrap').slideDown();
			err++;tg.flagError('#EditDealerPhone');
		}
		
		if(err===0){
			if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android" ){$('#SendDealerPhone').val($('#EditDealerPhoneFix').val().replace(/\D/g,'')).trigger('change');}
			else{$('#SendDealerPhone').val($('#EditDealerPhone').val().replace(/\D/g,'')).trigger('change');}
			
			console.log('#EnrollmentBtn no errors found');
			if(session_vars.DealerCOD.toLowerCase() == "invoice"){
				$("#WeeklyAutopay").prop("checked", false);//set enrollment to be false for invoice dealers
				//bypass careington API call
				$('#EnrollmentErrorMSGBox').slideUp();
				$('#EnrollmentBtn').addClass('disabled').attr("disabled",true);//success so disable button to prevent dupes
				if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android"){
					$('#DealerPhone').val($('#EditDealerPhoneFix').val()).trigger('change');
				}else{
					$('#DealerPhone').val($('#EditDealerPhone').val()).trigger('change');
				}
				tg.UpdateBillingItems();
				$('#SaveAndSubmit').click();//trigger manual save and submit
			}else {
				triggerMSDYN_API_APICreatePayment();//local validation passed, do API call
				tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("Enrollment", "APICreatePayment");}, tg.APItimeOutLength);//check in case APItimedOut
			}

		}else{
			console.log('#EnrollmentBtn errors found...');
			$('#EnrollmentErrorGenericMSGBox').slideDown();
			window.location.href="#EnrollmentErrorAnchor";
		    $('#EnrollmentBtn').val(function(){return $(this).attr('data-txtmsg')});
			
		}// if err===0
		
		return false;
	});
	//***********************
		$('#APICreatePaymentRIC').change(function(e) {
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1=$(this).val();
			if(errVal1 == "1000"){//successful login
				$('#EnrollmentErrorMSGBox').slideUp();
				$('#EnrollmentBtn').addClass('disabled').attr("disabled",true);//success so disable button to prevent dupes
				tg.UpdateBillingItems();
				$('#btnNext').trigger("click");//works to submit form
			}else{//triggerMSDYN_API_APICreatePayment failed
				tg.ErrorMessaging(errVal1, "Enrollment", "APICreatePayment");//reusable logic call
			}
		});// /#APICreatePaymentRIC.change
	//***************************************************
	
	//init - push billing into editBilling
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
	
	if($('#EditBillingAddress1, #EditBillingCity, #EditBillingZip').val() == "" || $('#EditBillingAddress1, #EditBillingCity, #EditBillingZip').val() == " " || $('#EditBillingState').val() == "-- Please Select --"  || 
	$('#EditDealerPhone').val() === "" && $('#EditDealerPhoneFix').val() === "") 

 {
		showEditBillingQuestions(); 
	}else{

	}

	if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android"){
		if($('#EditDealerPhoneFix').val() == "" || $('#EditDealerPhoneFix').val() == " "){//set to space so stream doesn't pass brackets
			$('#EditDealerPhoneFix').val(' ');
			$('#BillingAddressWrap').slideUp();//show edits to force update by user
			$('.EditBillingAddressWrap').slideDown();
		}
		$('#EditDealerPhoneFix').trigger('keyup');//format #
	}else{
		if($('#EditDealerPhone').val() == "" || $('#EditDealerPhone').val() == " "){//set to space so stream doesn't pass brackets
			$('#DealerPhone').val(' ');
			$('#BillingAddressWrap').slideUp();//show edits to force update by user
			$('.EditBillingAddressWrap').slideDown();
		}
		$('#EditDealerPhone').trigger('keyup');//format #
	}

	

	//restrict to alpha numeric chars
	$('#EditBillingZip, #BillingZip').keydown(function(event){tg.zipFieldStrictInput(event, 0, 0,$(this).val());});


	
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