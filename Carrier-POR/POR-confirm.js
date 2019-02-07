//Confirm
var poBoxREG = new RegExp(/^(?![\d#]\ \w+)?^((?!^ *((^(?![\d#]).*p[ \.]*\ ?(o|0)[-. \/\\]*[\ \.\-]+[-]?((box|bin)|b|(#|num)?\d+))|(p(ost)? *(o(ff(ice)?)?)? +((box|bin)|b)? *\d+)|(p *-?\/?(o)? *-?box)|post office box)|(\bPOB\b)).)*$/igm);

$(document).ready(function() {
	//correct the history so back button works
	history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page=Confirm');
	//********************************************************
	$('#CustPhone').val($('#CustPhone').val()).change();//attempt to format phone #
	// if(session_vars.IsDealerEval == "Y"){$('#CustEmail').val('noemail@noemail.com');}//SalesFile has to have CustEmail populated
	$("#btnNext").click(function() {
		if(session_vars.MobileDeviceIdentifier.toLowerCase() == "android") {
			if($('#CustPhone').val() == "" && $('#CustPhoneFix').val() != ""){$('#CustPhone').val($('#CustPhoneFix').val()).change();}
			if($('#CustPhoneMobile').val() == "" && $('#CustPhoneMobile').val() != ""){$('#CustPhoneMobile').val($('#CustPhoneMobileFix').val()).change();}
		}
		for(i=1;i<=5;i++){
			if($("#CovProduct"+i+"Description").is(":visible")) {
				if($("#CovProduct"+i+"Description").val() == "Thermostat"){
					$("#CovProduct"+i+"ID").val("965");//use quotes to keep value from changing to 1302??
				}else if($("#CovProduct"+i+"Description").val() == "Indoor Coil"){
					$("#CovProduct"+i+"ID").val("02426");//use quotes to keep value from changing to 1302
				}else if($("#CovProduct"+i+"Description").val() == "-- Please Select --"){//is on page but description is empty so clear it
					$("#CovProduct"+i+"ID").val("");
				}
				var temp = $('#CovProduct'+i+'Serial').val();
				if(temp == undefined || temp ==""){
					$('#CovProduct'+i+'Serial').val(" ");//place space to prevent {name} references
				}
				
			}else if($("#CovProduct"+i+"Description").is(":hidden")){//is on page but hidden so clear it
				$("#CovProduct"+i+"ID").val("");
			}
		}
		$('#POBoxFlag').val('');//clear PO Box flag
		$('#WarningMessageBox').slideUp();
	});
	//********************************************************
    $("#DealerConfirmConsumerInformationWrap").append($(".DealerConfirmConsumerInformationCheckBox"));
    if(session_vars.IsDealerEval =="Y"){$("#DealerConfirmConsumerInformationWrap").removeClass("tgHide");}
	//********************************************************
    if($('#CustMiddleInitial').val() == " "){$('#CustMiddleInitial').val("");}//fix issue where careington sends us spacer for middleName and that utilizes 1char space for entering content
	//********************************************************
	// check POBoxFlag to see if it was emptied
	if($('#POBoxFlag').val() == 'true'){
		$('.editYourInformation').slideDown();
		$('.displayYourInformation').slideUp();
		$('.editYourInformationBtn').slideUp();
	}

	checkMatch = function(elemID, itemVal, regex) {
		$('#'+elemID).removeClass('inerror');
		$('#span'+elemID+'Warning').hide();
		if($('#'+elemID).attr('data-isRequired')=='yes'){flagblank($('#'+elemID).get(0),'Yes');}//mark as required if necessary
		console.log(itemVal, regex);
		if(itemVal.match(regex) == null) {
			$('#'+elemID).addClass('inerror');
			$('#span'+elemID+'Warning').show();
		}
	};
	$('#CustAddress1, #CustAddress2').attr('onchange', "");
	if(/yes/.test($('#CustAddress1').attr('onblur').toLowerCase())){$('#CustAddress1').attr('data-isRequired','yes');}//check to see if item is required
	if(/yes/.test($('#CustAddress2').attr('onblur').toLowerCase())){$('#CustAddress2').attr('data-isRequired','yes');}//check to see if item is required
	$('#CustAddress1, #CustAddress2').attr('onblur', "");//remove blur function so that custom regex can run on it
	$('#CustAddress1, #CustAddress2').change(function(){checkMatch($(this).attr('id'),$(this).val(), poBoxREG);});

	checkMatch('CustAddress1',$('#CustAddress1').val(), poBoxREG);//run onload incase of browser history?
	checkMatch('CustAddress2',$('#CustAddress2').val(), poBoxREG);//run onload incase of browser history?

	//********************************************************

	$(".navigatorItem1").addClass('cursorPointer').click(function() {window.location = "?Page=Select-a-Plan";});
	$('#navigatorCircle2').addClass('current');

	//********************************************************
	try{tg.GetHVACPackageResults = JSON.parse($('#APIGetHVACPackageResults').val());}
	catch(err){
		console.log('JSON.parse(APIGetHVACPackageResults error = '+err);
		tg.GetHVACPackageResults = new Object();
		tg.GetHVACPackageResults.CoveredProducts = new Object();
		for(i=1;i<=5;i++){
			if(eval('session_vars.CovProduct'+i+'ID') != undefined){tg.GetHVACPackageResults.CoveredProducts.length = i;}
		}
	}
	//********************************************************
	tg.AddOptional = function(i){
		if(i === undefined) {
			var i = 0;
			for(e=tg.GetHVACPackageResults.CoveredProducts.length;e<=5;e++){
				if(!$('#productSummaryNum'+e).length || ($('#productSummaryNum'+e).length && !$('#productSummaryNum'+e).is(":visible"))){
					i = e;
					if(e == 5){//at max position so hide add optional button
						$('#addOptionalWrap').slideUp();
					}
					break;
				}
			}
		}
		console.log('AddOptional: i = '+i);
		if($('#productSummaryNum'+i).length){
			$('#productSummaryNum'+i).removeClass("tgHide").slideDown();//make visible instead of create
			$('#CovProduct'+i+'PurchaseDateEval').val(session_vars.CovProduct1PurchaseDateEval).change();//hardcode to 1st covered product date, can't disable otherwise breaks
			$('#CovProduct'+i+'PurchaseDate').val(session_vars.CovProduct1PurchaseDate).change();//hardcode to 1st covered product date, can't disable otherwise breaks
		}else{//doesn't exist yet
			$("#productSummaryNum").clone().attr('id','productSummaryNum'+i).removeClass("tgHide").appendTo("#ShowOptional");
			tg.EditOptional(i);//now make editable
		}
		//$('#CovProduct'+i+'PurchaseDateEval').attr("disabled","disabled");//disable here so enough time for .change() to occur
		return false;
	};
	//********************************************************
	tg.ShowCovered = function(i){
		var brand, description, purchasedate, modelnumber, serial;
		if(session_vars.Channel == "AM"){
			brand = eval('session_vars.CovProduct'+i+'Brand');
			description = eval('session_vars.CovProduct'+i+'Description');
			purchasedate = eval('session_vars.CovProduct'+i+'PurchaseDateEval');
			modelnumber = eval('session_vars.CovProduct'+i+'ModelNum');
			serial = eval('session_vars.CovProduct'+i+'Serial');
		}else{
			brand = tg.GetHVACPackageResults.CoveredProducts[i-1].Brand;
			description = tg.GetHVACPackageResults.CoveredProducts[i-1].Description;
			purchasedate = tg.GetHVACPackageResults.CoveredProducts[i-1].PurchaseDate;
			modelnumber = tg.GetHVACPackageResults.CoveredProducts[i-1].ModelNumber;
			serial = tg.GetHVACPackageResults.CoveredProducts[i-1].Serial;
		}
		
		$("#productSummaryNum"+i).attr("data-covPosition", i);
		$("#productSummaryNum"+i+' .CovTitle > span.item').attr('id','CovTitle'+i).text(i);
		$("#productSummaryNum"+i+' .CovBrand > span.item').attr('id','CovBrand'+i).text(brand);
		$("#productSummaryNum"+i+' .CovDescrip > span.item').attr('id','CovDescrip'+i).text(description);
		$("#productSummaryNum"+i+' .CovDate > span.item').attr('id','CovDate'+i).text(purchasedate);
		$("#productSummaryNum"+i+' .CovModel > span.item').attr('id','CovModel'+i).text(modelnumber);
		$("#productSummaryNum"+i+' .CovSerial > span.item').attr('id','CovSerial'+i).text(serial);
		
		if(i <= tg.GetHVACPackageResults.CoveredProducts.length){
			$('#productSummaryNum'+i+' .editBtnWrap, #productSummaryNum'+i+' .removeBtnWrap').remove();//remove remove/edit buttons for pass-through covered product
		}
		return false;
	};
	//********************************************************
	tg.ShowManuallyAdded = function(){
		for(i=tg.GetHVACPackageResults.CoveredProducts.length+1;i<=5;i++){//setup first few covProducts for display
			var tempBrand = eval('session_vars.CovProduct'+i+'Brand'), tempDescription = eval('session_vars.CovProduct'+i+'Description'), tempPurchaseDate = eval('session_vars.CovProduct'+i+'PurchaseDate'), tempModelNum = eval('session_vars.CovProduct'+i+'ModelNum'), tempSerial = eval('session_vars.CovProduct'+i+'Serial');
			
			//|| tempPurchaseDate !== undefined
			if(tempBrand !== undefined || tempDescription !== undefined || tempModelNum !== undefined || tempSerial !== undefined){
				//tempPurchaseDate == undefined ||
				if(tempBrand == undefined || tempDescription == undefined || tempModelNum == undefined){//Serial # not a required field
				console.log('tempBrand = '+ tempBrand + ' | tempDescription = '+ tempDescription + ' | tempPurchaseDate = ' + tempPurchaseDate + ' | tempSerial = '+tempSerial + ' | tempModelNum = '+tempModelNum);
					tg.AddOptional(i);//one of the items is not populated and so it needs to be editable
				}else {
					$("#productSummaryNum").clone().attr('id','productSummaryNum'+i).removeClass("tgHide").appendTo("#ShowOptional");
					
					$("#productSummaryNum"+i).attr("data-covPosition", i);
					$("#productSummaryNum"+i+' .CovTitle > span.item').text(i);

					if(tempBrand !== undefined){
						$("#productSummaryNum"+i+' .CovBrand > span.item').text(tempBrand);
					}
					if(tempDescription !== undefined){
						$("#productSummaryNum"+i+' .CovDescrip > span.item').text(tempDescription);
					}
					if(tempPurchaseDate !== undefined){
						$("#productSummaryNum"+i+' .CovDate > span.item').text(tempPurchaseDate);
					}
					if(tempModelNum !== undefined){
						$("#productSummaryNum"+i+' .CovModel > span.item').text(tempModelNum);
					}
					if(tempSerial !== undefined){
						$("#productSummaryNum"+i+' .CovSerial > span.item').text(tempSerial);
					}
				}
			}
			
			if(i == 5 && $('#productSummaryNum'+i).is(":visible")){//at max position so hide add optional button
				$('#addOptionalWrap').slideUp();
			}
			$('#ShowOptional div[id^="productSummaryNum"]').sort(function (a, b) {//sort order of products
				var re = /[^\d]/g;
				return ~~a.id.replace(re, '') > ~~b.id.replace(re, '');
			}).appendTo("#ShowOptional");
		}
		return false;
	};
	//********************************************************
	tg.EditOptional = function(i){
		console.log('item to be edited: i = '+i);
		$("#productSummaryNum"+i).addClass("editView").attr("data-covPosition", i);
		$("#productSummaryNum"+i+' .CovTitle > span.item').text(i);
		
		//wipe standard display values
		$('#productSummaryNum'+i+' .CovBrand > span.item, #productSummaryNum'+i+' .CovDescrip > span.item, #productSummaryNum'+i+' .CovDate > span.item, #productSummaryNum'+i+' .CovModel > span.item, #productSummaryNum'+i+' .CovSerial > span.item').text("");
		
		$('<input type="text" id="CovProduct'+i+'Brand" name="CovProduct'+i+'Brand" class="known valid" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'Yes\')" /><span id="spanCovProduct'+i+'BrandWarning" class="warning">Brand is required</span>').insertAfter('#productSummaryNum'+i+' .CovBrand');
		$('<select id="CovProduct'+i+'Description" name="CovProduct'+i+'Description" class="known valid" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'Yes\')"><option class="dropdownPlaceholder">-- Please Select --</option><option value="Thermostat">Thermostat</option><option value="Indoor Coil">Indoor Coil</option></select><span id="spanCovProduct'+i+'DescriptionWarning" class="warning">Product description is required</span>').insertAfter('#productSummaryNum'+i+' .CovDescrip');
		$('<div id="CovProduct'+i+'PurchaseDateALT" class="bkgLightGrey border1" style="padding:10px;"></div><input type="text" id="CovProduct'+i+'PurchaseDateEval" name="CovProduct'+i+'PurchaseDateEval" class="disabled known valid tgHide" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'No\')" /><input type="text" id="CovProduct'+i+'PurchaseDate" name="CovProduct'+i+'PurchaseDate" class="disabled known valid tgHide" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'No\')" />').insertAfter('#productSummaryNum'+i+' .CovDate');
		$('<input type="text" id="CovProduct'+i+'ModelNum" name="CovProduct'+i+'ModelNum" class="known valid" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'Yes\')" /><br/><span id="spanCovProduct'+i+'ModelNumWarning" class="warning">Model number is required</span>').insertAfter('#productSummaryNum'+i+' .CovModel');
		$('<input type="text" id="CovProduct'+i+'Serial" name="CovProduct'+i+'Serial" class="known valid" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'No\')" />').insertAfter('#productSummaryNum'+i+' .CovSerial');
		$('<input type="text" id="CovProduct'+i+'ID" name="CovProduct'+i+'ID" class="known valid" onchange="updatevisibilityrules(this);ajaxSend(this,0,false);" onblur="flagblank(this,\'Yes\')" /><br/><span id="spanCovProduct'+i+'IDWarning" class="warning">ID number is required</span>').insertAfter('#productSummaryNum'+i+' .CovID');
		//pre-populate w data from session
		if(eval('session_vars.CovProduct'+i+'Brand') !== undefined){
			$('#CovProduct'+i+'Brand').val(eval('session_vars.CovProduct'+i+'Brand'));
		}
		if(eval('session_vars.CovProduct'+i+'Description') !== undefined){
			$('#CovProduct'+i+'Description').val(eval('session_vars.CovProduct'+i+'Description'));
		}
		$('#CovProduct'+i+'PurchaseDate').val(session_vars.CovProduct1PurchaseDate).change();//hardcode to 1st covered product date, can't disable otherwise breaks
		$('#CovProduct'+i+'PurchaseDateEval').val(session_vars.CovProduct1PurchaseDateEval).change();//hardcode to 1st covered product date, can't disable otherwise breaks
		$('#CovProduct'+i+'PurchaseDateALT').html(session_vars.CovProduct1PurchaseDate);
		if(eval('session_vars.CovProduct'+i+'ModelNum') !== undefined){
			$('#CovProduct'+i+'ModelNum').val(eval('session_vars.CovProduct'+i+'ModelNum'));
		}
		if(eval('session_vars.CovProduct'+i+'Serial') !== undefined){
			$('#CovProduct'+i+'Serial').val(eval('session_vars.CovProduct'+i+'Serial'));
		}
		$('#productSummaryNum'+i+' .editBtnWrap').remove();//remove edit buttons for already editable inputs
		$('#ShowOptional div[id^="productSummaryNum"]').sort(function (a, b) {//sort order of products
			var re = /[^\d]/g;
			return ~~a.id.replace(re, '') > ~~b.id.replace(re, '');
		}).appendTo("#ShowOptional");
		return false;
	};
	//********************************************************
	tg.RemoveOptional = function(i){
		console.log('item to be removed: i = '+i);
		if(!$("#productSummaryNum"+i+" input").length){//check to see if editable first, if not then make editable for stream to save clear request
			console.log('item needs to be editable first');
			tg.EditOptional(i);
		}
		$("#CovProduct"+i+"Brand, #CovProduct"+i+"Description, #CovProduct"+i+"PurchaseDate, #CovProduct"+i+"PurchaseDateEval, #CovProduct"+i+"ModelNum, #CovProduct"+i+"Serial, #CovProduct"+i+"ID").val("").change();//force clear the item
		$("#CovProduct"+i+"Description option:nth-child(1)").prop('selected', true).change();//force clear the <select>
		eval('session_vars.CovProduct'+i+'Brand=""');
		eval('session_vars.CovProduct'+i+'Description=""');
		eval('session_vars.CovProduct'+i+'PurchaseDate=""');
		eval('session_vars.CovProduct'+i+'PurchaseDateEval=""');
		eval('session_vars.CovProduct'+i+'ModelNum=""');
		eval('session_vars.CovProduct'+i+'Serial=""');
		eval('session_vars.CovProduct'+i+'ID=""');
		
		//wipe standard display values
		$('#productSummaryNum'+i+' .CovBrand > span.item, #productSummaryNum'+i+' .CovDescrip > span.item, #productSummaryNum'+i+' .CovDate > span.item, #productSummaryNum'+i+' .CovModel > span.item, #productSummaryNum'+i+' .CovSerial > span.item').text("");
		
		$("#productSummaryNum"+i).slideUp();//hide optional
		$('#addOptionalWrap').slideDown();//removed item so show addOptional button back
		
		return false;
	};
	
	
	
	//********************************************************
	try{
		for(i=1;i<=tg.GetHVACPackageResults.CoveredProducts.length;i++){//setup first few covProducts for display
			$("#productSummaryNum").clone().attr('id','productSummaryNum'+i).removeClass("tgHide").appendTo("#ShowOptional");
			tg.ShowCovered(i);
		}
	}catch(err){console.log('non POR type: '+err);}
	tg.ShowManuallyAdded();
	//********************************************************
	$("#buttonPlaceHolder").append($('#btnBack').addClass('altCTA_button altCTA_buttonBlue inline marginRight12 mobileOnlyMarginLeft12 marginTop24 minBtnWidth').val('Back')).append($('#btnNext').addClass('nextButton CTA_button inline marginLeft12 mobileOnlyMarginRight12 marginTop24 minBtnWidth').val('Continue'));
    $("#btnBack").attr("onclick", "inFormOrLink = true; location.href = 'index.php?Page=Select-a-Plan';");
	//********************************************************
	convertDate = function(oldDate){
		var date = new Date(oldDate.replace(/-/g, '\/'));
		var year = date.getFullYear();
		if(year < 2000){year=year+100;}
		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
		var day = date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;
		return month + '-' + day + '-' + year;
	}
	//attempt to covert dates FROM yyyy-mm-dd TO mm-dd-yyyy
	for(i=1;i<=5;i++){
		try{
			var temp = $('.substituteCovProduct'+i+'PurchaseDate').html();
			if(temp.indexOf('{') < 0){$('.substituteCovProduct'+i+'PurchaseDate').html(convertDate(temp));}
		}catch(err){console.log('covert dates FROM yyyy-mm-dd TO mm-dd-yyyy: '+err);}
	}
	//******************
	//$('#btnNext').bind('mousedown keydown, ',function(){doPreFlightChecks();});   
	//function doPreFlightChecks(){$('#POBoxFlag').val('').change();}
	
});
//Closing  document.Ready
//******************


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

var inFormOrLink;
$('a').on('click', function() { inFormOrLink = true; });
$('form').bind('submit', function() { inFormOrLink = true; });

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


//************************************
//  SHOW FORM WHEN INPUT IS EMPTY
//************************************
function showEditYourInformation() {
	$('.editYourInformation').fadeIn('fast');
	$('.displayYourInformation, .displayYourInformationMarginBottom, .editYourInformationBtn').fadeOut('fast');

	s.setupFormAnalysis();//update available form items for SC to track?
	console.log('update available form items for SC to track?');
	return false;
}
// Input Form Empty
$(document).ready(function() {
	if($('#CustPhone').val() == "" && $('#CustPhoneFix').val() != ""){$('#CustPhone').val($('#CustPhoneFix').val()).change();}
	if($('#CustState').val() == "-- Please Select --" || $('#CustCity').val() =="" || $('#CustZip').val() =="" || $('#CustPhone').val() ==""){showEditYourInformation();}
}); 
