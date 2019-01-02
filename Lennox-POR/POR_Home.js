//HOME
$('.DealerModal').attr('id','DealerModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.OfferDetailsModal').attr('id','OfferDetailsModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready

$(document).ready(function() {
//***************************************************
	//correct the history so back button works
	history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page=Landing-Page');
//***************************************************
	//remove Stream's inerror so it isn't flagged when submitting
	$('#DealerModal, #DealerLoginZip').on('hidden.bs.modal', function () {
		$('#DealerLoginID').removeClass('inerror').attr("onblur","flagblank(this,'No','minmaxlength','1', '8')").blur();
		$('#DealerLoginID').removeClass('inerror').attr("onblur","flagblank(this,'No','minmaxlength','5', '9')").blur();
	}).on('show.bs.modal', function () {
		$('#DealerLoginZip').attr("onblur","flagblank(this,'Yes','minmaxlength','1', '8')").blur();
		$('#DealerLoginZip').attr("onblur","flagblank(this,'Yes','minmaxlength','5', '9')").blur();
	});

	//Dealer input button initialization
	$("#IsDealer").val('N');//default to no for salesFile, let Careington update on success for dealer
	$("#DealerLoginID").appendTo("#DealerLoginIDWrap");//move into modal
	$("#DealerLoginZip").appendTo("#DealerLoginZipWrap");//move into modal
	$("#CustPhone").val($("#CustPhone").val().replace(/\D/g,'')).change();//strip non-numeric #s for Careington
	
	tg.APIGetDealerResultsErrCount = 0;
	tg.APItimeOutWatch = 35000;
//******************************************************************************************************
	tg.flagError = function(element){
		$(element).addClass('hasError');
		$('.hasError').focus(function() {$(this).removeClass('hasError');});//clear error on focus, run code here to make sure init properly
		$('.hasError').click(function() {$(this).removeClass('hasError');});
	};
	//***************************************************
	$("#DealerLoginForm").submit(function(event) {//use this to capture enter keys so it submits DealerLogin form rather than customer form
	  event.preventDefault();//don't submit, but let onclick take over
	  return;
	});
	//*************************************************** //set focus on dealer ID
	$('#DealerModal').on('shown.bs.modal', function() {
		try{$('#DealerLoginID').focus();}
		catch(err){}//IE has issues w hidden inputs
	});
//******************************************************************************************************
	tg.APIGetDealer = function(){
		console.log('tg.APIGetDealer');
		$('#APIResultsErrorType').val("GetDealer");
		tg.PORerrorShow('#POR-API-DealerBtn', "wait");
		var err = 0;
		if($('#DealerLoginID').val().length < 5){
			err++;
			$('#DealerLoginIDError').slideDown();
			tg.flagError('#DealerLoginID');
		}else{$('#DealerLoginIDError').slideUp();}//hide error messages
		var temp = $('#DealerLoginZip').val();
		
		if(temp.length > 7 || temp.length < 5){;
			err++;
			$('#DealerLoginZipError').slideDown();
			tg.flagError('#DealerLoginZip');
		}else{$('#DealerLoginZipError').slideUp();}//hide error messages
		
		if(err===0){
			tg.PORerrorShow('#POR-API-DealerBtn', "wait");//validation passed, disable button
			triggerMSDYN_API_APIGetDealer();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('#POR-API-DealerBtn');}, tg.APItimeOutLength);//check in case APItimedOut
			console.log('triggerMSDYN_API_APIGetDealer');
		}else{
		   tg.PORerrorShow('#POR-API-DealerBtn');//validation didn't pass, re-enable button
		}// if err===0
		return false;
	};
	//***************************************************
	$('#APIGetDealerResults').change(function(e) {
		console.log('APIGetDealerResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		try{tg.GetDealerResults = JSON.parse($('#APIGetDealerResults').val());}catch(err){
			console.log('JSON.parse(APIGetDealerResults error = '+err);
			tg.PORerrorShow('#POR-API-GetHVACBtn, #POR-API-DealerBtn');//re-enable button
			//send email error
			console.log('need to send JSON.parse error email...');
			$('#APIResultsErrorCode').val("0000");//store error code for email
			$('#APIResultsReturnInfoDesc').val("JSON.parse | APIGetDealerResults error = "+err);//store error code for email
			tg.SendPOREmailError();
		}
		if(tg.GetDealerResults.ReturnInformation.ReturnInfoCode == "1000" && tg.GetDealerResults.Dealer.IsActive.toLowerCase() == "true"){//successful APIGetDealer
			$('#APIResultsErrorType, #APIResultsErrorCode, #APIResultsReturnInfoDesc').val("");//reset errorCode/errorType
			$('#PORdealerErrorMSGBox').slideUp();
			
			$('#DealerID').val(tg.GetDealerResults.Dealer.AigDealerId);//set DealerID
			$('#ClientDealerID').val(tg.GetDealerResults.Dealer.ClientDealerId);//set ClientDealerId
			$('#DealerName').val(tg.GetDealerResults.Dealer.DealerName);//set DealerName
			$('#DealerAddress1').val(tg.GetDealerResults.Dealer.DealerAddressLine1);//set DealerAddress1
			$('#DealerAddress2').val(tg.GetDealerResults.Dealer.DealerAddressLine2);//set DealerAddress2
			$('#DealerCity').val(tg.GetDealerResults.Dealer.DealerCity);//set DealerCity
			$('#DealerState').val(tg.GetDealerResults.Dealer.DealerState);//set DealerState
			$('#DealerStateFull').val(convert_state(tg.GetDealerResults.Dealer.DealerState,'name'));//set DealerStateFull to full state name
			$('#DealerZip').val(tg.GetDealerResults.Dealer.DealerZip);//set DealerZip
			$('#DealerEmail').val(tg.GetDealerResults.Dealer.DealerEmail);//set DealerEmail
			
			$('#IsDealer').val("Y").change();//set IsDealer flag
			tg.triggerAPIGetHVACPackage('#POR-API-DealerBtn');
		}else{
			console.log('APIGetDealer error: ReturnInfoCode or IsActive');
			tg.APIGetDealerResultsErrCount++;//error count < 5
			$('#IsDealer').val("N");//reset IsDealer flag
			$('#APIResultsErrorCode').val(tg.GetDealerResults.ReturnInformation.ReturnInfoCode);//store error code for email
			$('#APIResultsReturnInfoDesc').val(tg.GetDealerResults.ReturnInformation.ReturnInfoDesc);//store error desc for email
			if(tg.APIGetDealerResultsErrCount <= 4){
				tg.PORerrorShow('#POR-API-DealerBtn');//API broke, reset button
				if(tg.GetDealerResults.ReturnInformation.ReturnInfoCode == "1004"){//Multiple Records Found
					$('#PORdealerErrorMSGBox1004').slideDown();//show 1004
					$('#PORdealerErrorMSGBox').slideUp();//hide default
				}else {
					$('#PORdealerErrorMSGBox1004').slideUp();//hide 1004
					$('#PORdealerErrorMSGBox').slideDown();//show default
				}
			}else{
				//send email error
				console.log('need to send APIGetDealer error email...');
				tg.SendPOREmailError();
			}
		}
	});// /#APIGetDealerResults.change
//******************************************************************************************************
	tg.APItimedOut = function(item){
		console.log('tg.APItimedOut | item='+item);
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		console.log('APItimedOut...');
		tg.PORerrorShow(item);//API timed out, reset button

		//send email error
		console.log('need to send APItimedOut error email...');
		$('#APIResultsErrorCode').val("0000");//store error code for email
		$('#APIResultsReturnInfoDesc').val("APItimedOut, API = "+item);//store error code for email
		tg.SendPOREmailError();
		return false;
	};
//***************************************************
	tg.PORerrorShow = function(item, logic){
		console.log('tg.PORerrorShow | item='+item+' | logic='+logic);
		if(!item){console.log('tg.PORerrorShow is missing item');return false;}
		if(typeof logic !== "undefined" && logic == "disabled"){
			$(item).addClass('disabled').attr("disabled",true).html(function(){return $(this).attr('data-errmsg')});//disable button
			$('#PORerrorMSGBox').slideDown();
			$('#DealerModal').modal('hide');//close modal and let error message show
			window.location.href="#PORerrorMSGAnchor";
			
			//send email error
			//console.log('need to send API error email?');
			//tg.SendPOREmailError("tg.PORerrorShow, item = "+item+", logic = disabled");
		}else if(typeof logic !== "undefined" && logic == "wait"){
			$(item).addClass('disabled').attr("disabled",true).html(function(){return $(this).attr('data-waitmsg')});//animate wait button
			$('#PORerrorMSGBox').slideUp();
		}else {
			$(item).removeClass('disabled').attr("disabled",false).html(function(){return $(this).attr('data-txtmsg')});//re-enable button
			$('#PORerrorMSGBox').slideUp();		
		}
		return false;
	};
//***************************************************
	$('#POR-API-GetHVACBtn').click(function(){
		console.log('$(#POR-API-GetHVACBtn).click');
		tg.triggerAPIGetHVACPackage('#POR-API-GetHVACBtn');
		return false;
	});
//***************************************************
	$('#POR-API-DealerBtn').click(function(){
		console.log('$(#POR-API-DealerBtn).click');
			$('#PORdealerErrorMSGBox1004').slideUp();//hide 1004
			$('#PORdealerErrorMSGBox').slideUp();//hide default
		tg.APIGetDealer();
		return false;
	});
//******************************************************************************************************
	tg.triggerAPIGetHVACPackage = function(item){
		console.log('tg.triggerAPIGetHVACPackage');
		
		try{
			if(tg.GetDealerResults.ReturnInformation.ReturnInfoCode == "1000" && tg.GetDealerResults.Dealer.IsActive.toLowerCase() == "true"){
				$('#IsDealer').val("Y").change();//set IsDealer flag
			}else{
				$('#IsDealer').val("N").change();
			}//set IsDealer flag
		}catch(err){
			$('#IsDealer').val("N").change();//set IsDealer flag
		}
		try{
			if($('#IsDealer').val().toUpperCase() == "Y"){
				$('#OEMInvoice').val(session_vars.ContractorDealerInvoice).change();
			}else{
				$('#OEMInvoice').val('').change();//must be blank for consumers
			}
		}catch(err){
			$('#OEMInvoice').val('').change();//must be blank for consumers
		}
		
		
		var temp;
		//attempt to covert dates FROM yyyy-mm-dd TO mm-dd-yyyy
		for(i=1;i<=5;i++){
			temp = $('#RecProduct'+i+'PurchaseDate').val();
			if (typeof temp != 'undefined'){
				$('#RecProduct'+i+'PurchaseDateEval').val(myConvertDate(temp,"MMDDYYYY",'/'));
			}else{
				$('#RecProduct'+i+'PurchaseDateEval').val('');
			}
		}
		$('#APIResultsErrorType').val("GetHVACPackage");
		triggerMSDYN_API_APIGetHVACPackage();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut(item);}, tg.APItimeOutLength);//check in case APItimedOut
		tg.PORerrorShow('#POR-API-GetHVACBtn', "wait");
		
		return false;
	};
//***************************************************
	$('#APIGetHVACPackageResults').change(function() {
		console.log('APIGetHVACPackageResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		try{tg.GetHVACPackageResults = JSON.parse($('#APIGetHVACPackageResults').val());}
		catch(err){
			console.log('JSON.parse(APIGetHVACPackageResults error = '+err);
			tg.PORerrorShow('#POR-API-GetHVACBtn, #POR-API-DealerBtn');//re-enable button
			//send email error
			console.log('need to send JSON.parse error email...');
			$('#APIResultsErrorCode').val("0000");//store error code for email
			$('#APIResultsReturnInfoDesc').val("JSON.parse(APIGetHVACPackage error = "+err);//store error code for email
			tg.SendPOREmailError();
		}
		if(tg.GetHVACPackageResults.CoveredProducts && tg.GetHVACPackageResults.CoveredProducts.length <= 0 && tg.GetHVACPackageResults.ReturnInfo.ReturnInfoCode == "1000"){//careington passes but no covered products
			console.log('APIGetHVACPackage error: '+session_vars.APIGetHVACPackageResults);
			$('#APIResultsErrorCode').val(tg.GetHVACPackageResults.ReturnInfo.ReturnInfoCode);//store error code for email
			$('#APIResultsReturnInfoDesc').val("CoveredProducts is empty");//store error code for email

			//send email error
			console.log('need to send APIGetHVACPackageResults error email...');
			tg.PORerrorShow('#POR-API-GetHVACBtn', "disabled");
			tg.SendPOREmailError();
			
		}else if(tg.GetHVACPackageResults.ReturnInfo.ReturnInfoCode == "1000"){//successful APIGetHVACPackage
			tg.PORerrorShow('#POR-API-GetHVACBtn, #POR-API-DealerBtn');//re-enable button
			$('#APIResultsErrorType, #APIResultsErrorCode, #APIResultsReturnInfoDesc').val("");//reset errorCode/errorType
			tg.SetGetHVACPackageValues();
			tg.check4PO_Box('#CustAddress1, #CustAddress2', '#POBoxFlag');//check for PO Box address
			$('#btnNext').click();//submit page to save variables
		}else{
			console.log('APIGetHVACPackage error: '+session_vars.APIGetHVACPackageResults);
			$('#APIResultsErrorCode').val(tg.GetHVACPackageResults.ReturnInfo.ReturnInfoCode);//store error code for email
			$('#APIResultsReturnInfoDesc').val(tg.GetHVACPackageResults.ReturnInfo.ReturnInfoDesc);//store error code for email

			tg.PORerrorShow('#POR-API-GetHVACBtn', "disabled");//API broke, disable button
			if(tg.GetHVACPackageResults.ReturnInfo.ReturnInfoCode == "1009"){//PurchaseDate > 90 days
				console.log('error 1009 caught, PurchaseDate > 90 days');
				tg.PORerrorShow('#POR-API-GetHVACBtn', "disabled");
				$('#PORerrorMSG').html("<h3>We are unable to provide you with a coverage option at this time.</h3> The registration has exceeded the allowable time frame for this offer.");
			} else {
				//send email error
				console.log('need to send APIGetHVACPackageResults error email...');
				tg.SendPOREmailError();
			}			
		}// /GetHVACPackageResults
	});// /#APIGetHVACPackageResults.change
//******************************************************************************************************
	tg.SendPOREmailError = function(errorType, errorCode){
		$('#PORerrorSubmit').click();//submit page to save variables and then redirect user to POR-error page
		return false;
	};
//***************************************************
	tg.SetGetHVACPackageValues = function(){
		try{
			for(i=0;i<tg.GetHVACPackageResults.CoveredProducts.length; i++){
				console.log('tg.SetGetHVACPackageValues i = '+i);
				$('#CovProduct'+(i+1)+'Serial').val(tg.GetHVACPackageResults.CoveredProducts[i].Serial).change();
				//$('#CovProduct'+(i+1)+'CategoryID').val(tg.GetHVACPackageResults.CoveredProducts[i].CategoryID).change();
				$('#CovProduct'+(i+1)+'ModelNum').val(tg.GetHVACPackageResults.CoveredProducts[i].ModelNumber).change();
				$('#CovProduct'+(i+1)+'Description').val(tg.GetHVACPackageResults.CoveredProducts[i].Description).change();
				$('#CovProduct'+(i+1)+'ID').val(tg.GetHVACPackageResults.CoveredProducts[i].ID).change();
				$('#CovProduct'+(i+1)+'PurchaseDate').val(tg.GetHVACPackageResults.CoveredProducts[i].PurchaseDate).change();
				$('#CovProduct'+(i+1)+'Brand').val(tg.GetHVACPackageResults.CoveredProducts[i].Brand).change();
			}
		}catch(err){console.log('tg.SetGetHVACPackageValues error: '+err);}
		$('#PackageCode').val(tg.GetHVACPackageResults.PackageCode).change();
		$('#CampaignCode').val(tg.GetHVACPackageResults.CampaignCode).change();
	
		return false;
	};
//******************************************************************************************************
	$('#trPORContent .btnCareington').bind('mousedown keydown, ',function(){
		  doPorPreFlightChecks();
	});
	function doPorPreFlightChecks(){
		if($("#DealerModal").hasClass("in")){//isDealer submit

		} else{//isConsumer submit, wipe dealer login info b/4 submision to careington
			$('#DealerLoginID').val("");
			$('#DealerLoginZip').val("");
		}
	}
//***************************************************
	$('.btnCareington').click(function(){//??? is this for??
		console.log('storing old name and zip');
		window.oldName = $('#CustLastName').val();
		window.oldZip = $('#CustZip').val();
	});
//***************************************************
try{
    $('#JourneyIDnumber').val(portalID);//store portal ID # for error/SC messaging
}catch(err){
    $('#JourneyIDnumber').val('unknown');
}
//***************************************************
	$("#AMContentSubmit").click(function(event) {
		event.preventDefault();//don't submit, but let onclick take over

		console.log('storing old name and zip');
		window.oldName = $('#CustLastName').val();
		window.oldZip = $('#CustZip').val();

		var err = 0;
		if($('#InvitationNumber').val() == ""){$('#spanInvitationNumberWarning').slideDown();err++;}
		else{$('#spanInvitationNumberWarning').slideUp();}
		if($('#CustLastName').val() == ""){$('#spanCustLastNameWarning').slideDown();err++;}
		else{$('#spanCustLastNameWarning').slideUp();}
		if($('#CustZip').val() == ""){$('#spanCustZipWarning').slideDown();err++;}
		else{$('#spanCustZipWarning').slideUp();}
		
		if(err==0){
		    $('#AMerrorMSGBox').slideUp();
		    $('#AMContentSubmit').val("Please Wait...");
			$('#trAMContent .btnCareington.readyCareington').trigger( 'click' );//simulate onclick
		}
		return false;
	});


//***************************************************
myConvertDate = function(oldDate,toFormat,separator){
	var date = new Date(oldDate.replace(/-/g, '\/'));
	if(!Date.parse(date)){return "";}//make sure is valid date b/4 using
	if(!separator){separator="-";}//make default separator '-' not '/'
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;


	if(toFormat=="MMDDYYYY"){	return (month + separator + day + separator + year);}
	else if(toFormat=="YYYYMMDD"){	return (year + separator + month + separator + day);}
	else if(toFormat=="YYMMDD"){	return (year.substring(2, 3) + separator + month + separator + day);}
	else{return (month + separator + day + separator + year);}
};
//******************************************************************************************************
	//check to see if has PO Box address
	tg.check4PO_Box = function(CheckElement, FlagElement){
		var r = new RegExp(/^(?![\d#]\ \w+)?^((?!^ *((^(?![\d#]).*p[ \.]*\ ?(o|0)[-. \/\\]*[\ \.\-]+[-]?((box|bin)|b|(#|num)?\d+))|(p(ost)? *(o(ff(ice)?)?)? +((box|bin)|b)? *\d+)|(p *-?\/?(o)? *-?box)|post office box)|(\bPOB\b)).)*$/igm);

		$(CheckElement).each(function(e){
			if($(this).val().match(r) == null) {
				console.log('found PO Box item in = '+$(this).attr('id'));
				$(CheckElement).val('');
				$(FlagElement).val('true');
			}
		});
		return false;
	};

//***************************************************
	$('#trPORContent .btnCareington.readyCareington').addClass('CTA_button').wrap("<div class='tgHide'></div>");//stylize Stream button
	$('#trAMContent .btnCareington.readyCareington').addClass('tgHide');//hide Stream button so custom can run
	
	//update partner logo
	try{
		if(session_vars.Brand != "AIG" && session_vars.Brand != "Lennox"){
			var img = $('<img>');
			img.attr('src', '/uploads/00002004/'+session_vars.Brand+'Logo.png').attr('class', 'manufacturerLogo '+session_vars.Brand+'Logo').attr('alt', session_vars.Brand+' Logo');
			img.appendTo('#manufacturerLogoWrap');
		}		
	}catch(err){}
//***************************************************
	tg.setPORcarriedValues = function(){
		console.log("matching POR customer info to stream placeholders...");
		$('#CustFirstName').val(session_vars.HomeOwnerFirstName);
		$('#CustLastName').val(session_vars.HomeOwnerLastName);
		$('#CustAddress1').val(session_vars.HomeOwnerAddressLine1);
		$('#CustAddress2').val(session_vars.HomeOwnerAddressLine2);
		$('#CustCity').val(session_vars.HomeOwnerCity);
		$('#TempState').val(session_vars.HomeOwnerState);
		$('#CustZip').val(session_vars.HomeOwnerZipCode);
		$('#CustEmail').val(session_vars.HomeOwnerEmailAddress);
		try{$('#CustPhone').val(session_vars.HomeOwnerPhoneNumber.replace(/\D/g,''));}catch(err){}
		try{if(session_vars.HVACMfg){$('#HVACMfg').val(session_vars.HVACMfg);}}catch(err){}

		if($('#TempState').val().length == 2){$('#CustState').val(convert_state($('#TempState').val(),'name'));//Careington requires fullname
		}else{$('#CustState').val($('#TempState').val());}//assume string is not an abbreviation and just pass as is

		console.log("matching POR product info to stream placeholders...");

		try{$('#RecProduct1Serial').val(session_vars.Product1SerialNumber);}catch(err){}
		try{$('#RecProduct1CategoryID').val(session_vars.Product1ProductCategoryID);}catch(err){}
		try{$('#RecProduct1ModelNum').val(session_vars.Product1ItemName);}catch(err){}
		try{$('#RecProduct1PurchaseDate').val(session_vars.Product1InstallDate);}catch(err){}
		try{$('#RecProduct1Brand').val(session_vars.Product1Brand);}catch(err){}

		try{$('#RecProduct2Serial').val(session_vars.Product2SerialNumber);}catch(err){}
		try{$('#RecProduct2CategoryID').val(session_vars.Product2ProductCategoryID);}catch(err){}
		try{$('#RecProduct2ModelNum').val(session_vars.Product2ItemName);}catch(err){}
		try{$('#RecProduct2PurchaseDate').val(session_vars.Product2InstallDate);}catch(err){}
		try{$('#RecProduct2Brand').val(session_vars.Product2Brand);}catch(err){}

		try{$('#RecProduct3Serial').val(session_vars.Product3SerialNumber);}catch(err){}
		try{$('#RecProduct3CategoryID').val(session_vars.Product3ProductCategoryID);}catch(err){}
		try{$('#RecProduct3ModelNum').val(session_vars.Product3ItemName);}catch(err){}
		//try{$('#RecProduct3PurchaseDate').val(convertDate(session_vars.Product3InstallDate));}catch(err){}
		try{$('#RecProduct3PurchaseDate').val(session_vars.Product3InstallDate);}catch(err){}
		try{$('#RecProduct3Brand').val(session_vars.Product3Brand);}catch(err){}

		try{$('#RecProduct4Serial').val(session_vars.Product4SerialNumber);}catch(err){}
		try{$('#RecProduct4CategoryID').val(session_vars.Product4ProductCategoryID);}catch(err){}
		try{$('#RecProduct4ModelNum').val(session_vars.Product4ItemName);}catch(err){}
		try{$('#RecProduct4PurchaseDate').val(session_vars.Product4InstallDate);}catch(err){}
		try{$('#RecProduct4Brand').val(session_vars.Product4Brand);}catch(err){}

		try{$('#RecProduct5Serial').val(session_vars.Product5SerialNumber);}catch(err){}
		try{$('#RecProduct5CategoryID').val(session_vars.Product5ProductCategoryID);}catch(err){}
		try{$('#RecProduct5ModelNum').val(session_vars.Product5ItemName);}catch(err){}
		try{$('#RecProduct5PurchaseDate').val(session_vars.Product5InstallDate);}catch(err){}
		try{$('#RecProduct5Brand').val(session_vars.Product5Brand);}catch(err){}
		
		tg.UpdateResultsCustomerInfo();//update values to stip spec chars
	};

//*******************************************************
	if(session_vars.Channel == "POR"){
		tg.setPORcarriedValues();//push Partner data into session
	}else{
		try{$('#InvitationNumber').val(session_vars.URLParameterInvitationNumber);}catch(err){}//check for querystring and if so prepopulate invitation #
	}	
//** customTabs ******************************************
	tg.customTab = function(e,parentWrap){
		parentWrap.addClass('parentWrap');
		var index = parentWrap.find('.customTabsButtonsWrap a').index(e);
		parentWrap.find('.customTabsButtonsWrap a').removeClass('current');//remove all current tab classes
		parentWrap.find('.customTabsContentWrap .customTab').removeClass('current').fadeOut('fast', function() {$(this).removeAttr('style').css;});//remove all current tab classes
		e.addClass('current');
		parentWrap.find('.customTabsContentWrap .customTab').eq(index).addClass('current').fadeIn('fast');
		return false;
	}
	$('.customTabsWrap .customTabsButtonsWrap a').click(function(e) {
		tg.customTab($(this),$(this).closest('.customTabsWrap'));
		return false;
	});
	$('.customTabsWrap .customTabsButtonsWrap a:first-child').trigger( 'click' );//initialize first tab on EACH .customTabsWrap

});//end document.ready
//***************************************************
matchCoveredProducts = function(){
	// Loop thru all returned Serial Nums from GetHVACPackage API
	var returnProductIndex = 0;
	var mfgProductIndex = 0;

	for (returnProductIndex = 1; returnProductIndex <= 5; returnProductIndex++) {
		// Get the returned Serial Number
		var returnSerial = $('#RecProduct' + returnProductIndex + 'Serial').val().trim();
		// Make sure the return is not empty
		if (returnSerial === '' || returnSerial === null) {continue;}
		// Find matching Serial in products received from Manufacturer
		for (mfgProductIndex = 1; mfgProductIndex <=5; mfgProductIndex++) {
			var mfgSerial = $('#CovProduct' + mfgProductIndex + 'Serial').val().trim();
			if (mfgSerial === returnSerial) {
				// Copy mfg & return values to covered product values
				//*$('#CovProduct' + mfgProductIndex + 'Serial').val($('#RecProduct' + returnProductIndex + 'Serial').val());//already come from Careington
				$('#CovProduct' + mfgProductIndex + 'CategoryID').val($('#RecProduct' + returnProductIndex + 'CategoryID').val());
				$('#CovProduct' + mfgProductIndex + 'ModelNum').val($('#RecProduct' + returnProductIndex + 'ModelNum').val());
				//*$('#CovProduct' + mfgProductIndex + 'Description').val($('#RecProduct' + returnProductIndex + 'Description').val());//already come from Careington
				//*$('#CovProduct' + mfgProductIndex + 'ID').val($('#RecProduct' + returnProductIndex + 'ID').val());//already come from Careington
				$('#CovProduct' + mfgProductIndex + 'PurchaseDate').val($('#RecProduct' + returnProductIndex + 'PurchaseDate').val());
console.log('mfgProductIndex = '+mfgProductIndex + '#CovProduct'+mfgProductIndex +'PurchaseDate = '+ $('#CovProduct'+mfgProductIndex +'PurchaseDate').val());
$('#CovProduct'+mfgProductIndex +'PurchaseDate').val(myConvertDate($('#CovProduct'+mfgProductIndex +'PurchaseDate').val(),"YYYYMMDD"));
				$('#CovProduct' + mfgProductIndex + 'Brand').val($('#RecProduct' + returnProductIndex + 'Brand').val());
				// Go to the next returned Product
				break;
			}
		}

	}
}
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
//******************************************************************************************************
	tg.UpdateResultsCustomerInfo = function(){
		//strip any non char/num for careington
		console.log('updating consumer values...');
		$('#CustFirstName, #CustLastName, #CustCity').each(function(e) {
			$(this).val($(this).val().replace(/[0-9]/g, '')).change();//remove #s
		});
		$('.ResultsCustomerInfo input[type="text"], #CustLastName').not('.ResultsCustomerInfo .skip input[type="text"]').each(function(e) {
			$(this).val($(this).val().replace(/[&+()\/\\]/g,'-').replace(/[^\w\s-]/gi, '').replace(/-{2,}/g,'-')).change();
		});
	};