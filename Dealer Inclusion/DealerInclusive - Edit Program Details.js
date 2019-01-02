//** EDIT PROGRAM DETAILS
$('.TermSelectionModal').attr('id','TermSelectionModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.TierSelectionModal').attr('id','TierSelectionModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.InstallationBeginOnModal').attr('id','InstallationBeginOnModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.InstallationEndOnModal').attr('id','InstallationEndOnModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready

//***************************************************
$(document).ready(function() {

    $("#OfferCoverage").val("Labor").attr("disabled",true);//default to labor, disable user input
	$("#APIInclusionOfferEPDResults, #APIInclusionOfferCreateResults, #APIInclusionOfferUpdateResults").attr("disabled",true);//disable user input
//***************************************************
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
//***************************************************
	$('#OfferEndDate .dropdownPlaceholder').remove();//remove default stream <option>
	$("#WeeklyAutopay").prop("checked", true);//set enrollment to be autochecked
//***************************************************
	//Careington requires numbers only, stream forces text into value prop
	$("#OfferTerm option").eq(1).val(1);
	$("#OfferTerm option").eq(2).val(3);
	$("#OfferTerm option").eq(3).val(5);
	$("#OfferTerm option").eq(4).val(10);

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
	$("#OfferBeginDate, #OfferEndsDateCustom").attr("placeholder","mm/dd/yyyy").addClass("form-control").wrap("<div class='form-group full-width'></div>").wrap("<div class='input-group'></div>");
	$("<div id='OfferBeginDateCalendar' class='input-group-addon input-group-addon-calendar pointer'></div>").insertBefore("#OfferBeginDate");
	$("<div id='OfferEndsDateCustomCalendar' class='input-group-addon input-group-addon-calendar pointer'></div>").insertBefore("#OfferEndsDateCustom");
    //$( "<div class='fineprint padTop12'>(Purchase must be within 30 days of Installation date for eligibility.)</div>" ).insertBefore('#spanOfferBeginDateWarning');
    
function GetFormattedDate(theDate) {
    var month = theDate.getMonth() + 1;
    var day = theDate.getDate();
    var year = theDate.getFullYear();
    return month + "/" + day + "/" + year;
}
function DetermineEndDatesMinDate(OfferBeginDateVal) {
	//today's date + 30
	minDate = new Date((new Date(OfferBeginDateVal).valueOf() + 1000*3600*24*30)).toLocaleDateString();//convert ms for date addition of +30D, has to be ms to account for timezones and stream onblur
	//tomorrowDate
	console.log('setup OfferEndsDateCustom: minDate = '+ minDate+ ' | tomorrowDate = '+tomorrowDate);
	minDate = (tomorrowDate.getTime() > new Date(minDate).getTime()) ? tomorrowDate : minDate;
	console.log('calculated OfferEndsDateCustom: minDate = '+ minDate);
	
	var timestamp = Date.parse(minDate);
	if (isNaN(timestamp) == true) {//not a date
		console.log('minDate is not a date: '+timestamp);
		minDate = new Date();
		minDate.setDate(minDate.getDate() + 30);
	}
	console.log('calculated isNaN OfferEndsDateCustom: minDate = '+ minDate);
	return minDate;
}

	var projectStartDate = session_vars.ProgramStartDate;
	var temp = new Date (session_vars.ProgramStartDate);	
	var projectStartDateDisplay = GetFormattedDate(temp);
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

	if(startDate !== date){$('#OfferBeginDateErrMsgDate').html(GetFormattedDate(beginDate));}//update error message to state +30D from project start date instead of "today's date"

	
	
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
			//var minDate = new Date(dates);
			//minDate.setDate(minDate.getDate() + 30);
			//minDate = new Date(minDate.getTime() + minDate.getTimezoneOffset() * 60000);//fix timezone issue
			
			console.log('$("#OfferBeginDate").change calls: DetermineEndDatesMinDate');
			minDate = DetermineEndDatesMinDate(new Date(dates));
			$('#OfferEndsDateCustom').datepicker('option', 'minDate', minDate);//date chosen so set #OfferEndsDateCustom minDate to this date
			$('#OfferEndsDateCustom').trigger('change');//try to update session var in case of page reload
			
			if(session_vars.EditFlag != "Active"){
				$(this).attr("onblur","flagblank(this,'Yes','betweendates','"+$(this).datepicker("option", "minDate").toLocaleDateString()+"', '"+$(this).datepicker("option", "maxDate").toLocaleDateString()+"')");//update for Stream auto validation
			}else {
				$(this).attr("onblur", "flagblank(this,'No')");
			}
		}

	});	
	
	console.log('page load calls: DetermineEndDatesMinDate');
	var minDate = DetermineEndDatesMinDate($("#OfferBeginDate").val());
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
		if(session_vars.EditFlag != "Active"){
			console.log('$(this).datepicker("option", "minDate") = '+$(this).datepicker("option", "minDate"));
			$(this).attr("onblur","flagblank(this,'Yes','betweendates','"+$(this).datepicker("option", "minDate")+"', 'null')");//update for Stream auto validation
		}else {
			$(this).attr("onblur", "flagblank(this,'No')");
		}
	});
	


	$('#OfferBeginDate, #OfferEndsDateCustom').prop('readonly', 'readonly');//prevent user from manually typing date
	if(session_vars.EditFlag != "Active"){
		$("#OfferBeginDate").attr("onblur","flagblank(this,'Yes','betweendates','"+$("#OfferBeginDate").datepicker("option", "minDate").toLocaleDateString()+"', '"+$("#OfferBeginDate").datepicker("option", "maxDate").toLocaleDateString()+"')");//update for Stream auto validation
	}else {
		$('#OfferBeginDate').attr("onblur", "flagblank(this,'No')");
	}
	$("#OfferEndsDateCustom").attr("onblur","flagblank(this,'Yes','betweendates','"+$("#OfferEndsDateCustom").datepicker("option", "minDate")+"', 'null')");//update for Stream auto validation
	
    $("#OfferBeginDateCalendar").click(function(){$("#OfferBeginDate").datepicker("show");});
	$("#OfferEndsDateCustomCalendar").click(function(){$("#OfferEndsDateCustom").datepicker("show");});
//***************************************************
	$("#OfferEndDate").change(function() {
		if($(this).val() == "Until Further Notice"){
			$('#OfferEndsDateCustom').val('');//clear for Careington send
		}
	});
//***************************************************
	$('#EditProgramDetailsBtn').click(function(e) {
		console.log('#EditProgramDetailsBtn click...');
		var err = 0;
		$('#EditProgramDetailsErrorMSGBox').slideUp();
		$('#EditProgramDetailsBtn').val(function(){return $(this).attr('data-waitmsg')}).addClass("disabled").attr("disabled",true);
		
		if($('#OfferTerm').val() == "-- Please Select --"){$('#spanOfferTermWarning').slideDown();err++;tg.flagError('#OfferTerm');}
		else{$('#spanOfferTermWarning').slideUp();}
		
		if($('#OfferTier').val() == "-- Please Select --"){$('#spanOfferTierWarning').slideDown();err++;tg.flagError('#OfferTier');}
		else{$('#spanOfferTierWarning').slideUp();}
		
		if($('#OfferBeginDate').val() === ""){$('#spanOfferBeginDateWarning').slideDown();err++;tg.flagError('#OfferBeginDate');}
		else{$('#spanOfferBeginDateWarning').slideUp();}
		
		if($('#OfferEndDate').val() === ""){$('#spanOfferEndDateWarning').slideDown();err++;tg.flagError('#OfferEndDate');}
		else{$('#spanOfferEndDateWarning').slideUp();}
		
		if($('#OfferEndsDateCustom').is(":visible") == true && $('#OfferEndsDateCustom').val() === ""){$('#spanOfferEndsDateCustomWarning').slideDown();err++;tg.flagError('#OfferEndsDateCustom');}
		else{$('#spanOfferEndsDateCustomWarning').slideUp();}
		
		if(err===0){
			console.log('#EditProgramDetailsBtn no errors found, now call API...');
			if(session_vars.EditFlag == "Active"){
				$('#OfferTerm, #OfferTier, #OfferCoverage, #OfferBeginDate').removeClass("disabled").attr("disabled",false);//enable so Stream can read the variables
			}
			if(tg.InclusionOfferMode == "create"){
				//alert('Validation passed, now call APIInclusionOfferCreate');
				triggerMSDYN_API_APIInclusionOfferCreate();//local validation passed, do API call
				tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("EditProgramDetails", "APIInclusionOfferCreate");}, tg.APItimeOutLength);//check in case APItimedOut
			}else if(tg.InclusionOfferMode == "update"){//assume new InclusionOfferMode
				//alert('Validation passed, now call APIInclusionOfferUpdate');
				triggerMSDYN_API_APIInclusionOfferUpdate();//local validation passed, do API call
				tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("EditProgramDetails", "APIInclusionOfferUpdate");}, tg.APItimeOutLength);//check in case APItimedOut
			}else {
				tg.ErrorMessaging("0000-UnknownUpdateMode", "EditProgramDetails", "APIInclusionOfferEPDUnknown");//reusable logic call
			}
			if(session_vars.EditFlag == "Active"){
				$('#OfferTerm, #OfferTier, #OfferCoverage, #OfferBeginDate').addClass("disabled").attr("disabled",true);//active programs cannot update these values
			}
		}else{
			console.log('#EditProgramDetailsBtn errors found...');
			$('#EditProgramDetailsErrorMSGBox').slideDown();
			window.location.href="#EditProgramDetailsErrorAnchor";
			$('#EditProgramDetailsBtn').val(function(){return $(this).attr('data-txtmsg')}).removeClass("disabled").attr("disabled",false);
		}// if err===0
		
		return false;
	});
	//***********************
	$('#APIInclusionOfferCreateResults').change(function(e) {
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		try{tg.APIInclusionOfferCreateResults = JSON.parse($('#APIInclusionOfferCreateResults').val());}
		catch(err){
			console.log('JSON.parse(APIInclusionOfferCreateResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "EditProgramDetails", "APIInclusionOfferCreateResults");//reusable logic call
		}
		
		var ReturnInfoCode = tg.APIInclusionOfferCreateResults.ReturnInfo.ReturnInfoCode;
		if(ReturnInfoCode == "1000"){//successful EditProgramDetails;
			//success
			$('#EditProgramDetailsErrorMSGBox').slideUp();
			$('#SuccessFlag').val('Program-'+tg.InclusionOfferMode);//add tg.InclusionOfferMode for NoOfferFlag change
			$('#SaveAndSubmit').click();//use this to ensure new values are saved and redirect user back to account page
		}else{//error in InclusionOfferCreate
			tg.ErrorMessaging(ReturnInfoCode, "EditProgramDetails", "APIInclusionOfferCreateResults");//reusable logic call
			$('#EditProgramDetailsBtn').removeClass("disabled").attr("disabled",false);
		}
	});// /#APIInclusionOfferCreateResults.change
	//***********************
	$('#APIInclusionOfferUpdateResults').change(function(e) {		
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		try{tg.APIInclusionOfferUpdateResults = JSON.parse($('#APIInclusionOfferUpdateResults').val());}
		catch(err){
			console.log('JSON.parse(APIInclusionOfferUpdateResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "InclusionOfferCreate", "APIInclusionOfferUpdateResults");//reusable logic call
			$('#EditProgramDetailsBtn').removeClass("disabled").attr("disabled",false);
		}
		
		var ReturnInfoCode = tg.APIInclusionOfferUpdateResults.ReturnInfo.ReturnInfoCode;
		if(ReturnInfoCode == "1000"){//successful InclusionOfferCreate;
			//success
			$('#EditProgramDetailsErrorMSGBox').slideUp();
			$('#SuccessFlag').val('Program-'+tg.InclusionOfferMode);//add tg.InclusionOfferMode for NoOfferFlag change
			$('#SaveAndSubmit').click();//use this to ensure new values are saved and redirect user back to account page
		}else{//error in InclusionOfferCreate
			tg.ErrorMessaging(ReturnInfoCode, "InclusionOfferCreate", "APIInclusionOfferUpdateResults");//reusable logic call
		}
	});// /#APIInclusionOfferUpdateResults.change
//**********************************************
	tg.APIInclusionOffer = function(){
		console.log('tg.APIInclusionOffer');

		if(session_vars.EditFlag == "Active" || session_vars.EditFlag == "Future"){
			triggerMSDYN_API_APIInclusionOfferEPD();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('#InclusionOffer', "APIInclusionOfferEPDResults");}, tg.APItimeOutLength);//check in case APItimedOut
			console.log('triggerMSDYN_API_APIInclusionOffer');
		} else{
			tg.ErrorMessaging("0000-Unknown Mode", "EditProgramDetails", "APIInclusionOffer");//reusable logic call
		}

		return false;
	};
	//***************************************************
	$('#APIInclusionOfferEPDResults').change(function(e) {		
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		try{tg.InclusionOfferEPDResults = JSON.parse($('#APIInclusionOfferEPDResults').val());}
		catch(err){
			console.log('JSON.parse(APIInclusionOfferEPDResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "InclusionOffer", "APIInclusionOfferEPDResults");//reusable logic call
		}
		
		var ReturnInfoCode = tg.InclusionOfferEPDResults.ReturnInfo.ReturnInfoCode;
		if(ReturnInfoCode == "1000"){//successful InclusionOffer;
			//success
			$('#EditProgramDetailsErrorMSGBox').slideUp();
			
			if(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferTerm != ""){
				tg.InclusionOfferMode = "update";
				
				$('#OfferID').val(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferID).change();	
				$('#OfferTerm').val(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferTerm).change();
				$('#OfferTier').val(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferTier).change();
				$('#OfferCoverage').val(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferCoverage).change();
				$('#OfferBeginDate').val(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferBeginDate).change();
				if(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferEndDate != ""){
					$('#OfferEndDate').val("Choose your end date...").change();
					$('#OfferEndsDateCustom').val(tg.InclusionOfferEPDResults.InclusionOffers[0].OfferEndDate).change();
				}else{
					$('#OfferEndDate').val("Until Further Notice").change();
					$('#OfferEndsDateCustom').val("").change();
				}
				
				if(session_vars.EditFlag == "Active"){
					$('#OfferTerm, #OfferTier, #OfferCoverage, #OfferBeginDate').addClass("disabled").attr("disabled",true);//active programs cannot update these values
					$('#OfferBeginDate').attr("onblur", "flagblank(this,'No')");
					$('#OfferBeginDateCalendar').unbind("click").css('cursor','default');
				}
			}
			
		}else if(ReturnInfoCode == "1028"){//no active InclusionOffer;
			if(session_vars.EditFlag == "Future"){
				tg.InclusionOfferMode = "create";
			} else {
				// do what??
			}
			
		}else{//error in InclusionOffer
			tg.ErrorMessaging(ReturnInfoCode, "EditProgramDetails", "APIInclusionOfferEPDResults");//reusable logic call
		}
		
	});// /#APIInclusionOfferEPDResults.change
//***************************************************
	if(session_vars.EditFlag == "Future"){
		$('#PageTitleWrap').html("Create New Or Modify Future Program");
	}
	tg.APIInclusionOffer();//init lookup incase it isn't prepopulated already
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