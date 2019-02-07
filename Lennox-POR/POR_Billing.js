//BILLING	
	//*************************************************
	function doPreFlightChecks(){
		$('#BillingZip').val($('#BillingZip').val().replace(/[^a-zA-Z0-9]/g, "")).change();//careington  doesn't accept spec chars
		$('#CustZip').val($('#CustZip').val().replace(/[^a-zA-Z0-9]/g, "")).change();//careington  doesn't accept spec chars
		$('#DealerZip').val($('#DealerZip').val().replace(/[^a-zA-Z0-9]/g, "")).change();//careington  doesn't accept spec chars

		if(session_vars.IsDealerEval != "Y" && ($('#BillingAddressDifferent').val().toLowerCase() == 'no' || $('#BillingAddressDifferent').val() == '-- Please Select --')){
			//setup mailing address for Sales Tax purposes:
			$('#MailingAddress1').val('').change();
			$('#MailingAddress2').val('').change();
			$('#MailingCity').val('').change();
			$('#MailingState').val('').change();//full name
			$('#MailingZip').val('').change();
		}else{
			$('#MailingAddress1').val($('#CustAddress1').val()).change();
			$('#MailingAddress2').val($('#CustAddress2').val()).change();
			$('#MailingCity').val($('#CustCity').val()).change();
			$('#MailingState').val($('#CustState').val()).trigger('change');//full name
			$('#MailingZip').val($('#CustZip').val()).change();
		}
		$('#BillingState').val($('#BillingStateDisplay').val()).change();//push display state into user chosen state	
		UpdateAbbrvState('#BillingState','#AbbrvBillingState','abbrev');
	}//doPreFlightChecks
	//*************************************************
	function UpdateAbbrvState(source, target,convertTo) {
		try{
			//setup billingState Abbrev for SalesFile
			var temp = $(source).val();
			if(temp && temp.length == 2){
				$(target).val(temp);//salesFileIntegration requires 2 char
			}else{
				$(target).val(convert_state(temp,convertTo));//salesFileIntegration requires 2 char
			}
		}catch(err){}
	}
	//*************************************************
	function UpdateDisplayBillingAddress() {
		$(".DisplayBillingAddress1").text($('#BillingAddress1').val());
		$(".DisplayBillingAddress2").text($('#BillingAddress2').val());
		$(".DisplayBillingCity").text($('#BillingCity').val());
		$(".DisplayBillingState").text($('#BillingState').val());
		$(".DisplayBillingZip").text($('#BillingZip').val());
	}
	//*************************************************
	function StoreBillingAddress() {
		if(!tg.savedBillValues){
			tg.savedBillValues = new Array();//create array to hold current values b/4 stream wipes them on hide
			tg.savedBillValues = [];//clear
		}
		$(".trBillingAddressDifferent input, .trBillingAddressDifferent select").each(function(i) {
			if(!$(this).val() && tg.savedBillValues[i]){
				//do nothing
			}else if($(this).val()){
				tg.savedBillValues[i] = $(this).val();
			}
		});
	}
	//*************************************************
	function RePopulateBillingAddress() {
		if(tg.savedBillValues){//repopulate incase on hide wasn't repopulated
			$(".trBillingAddressDifferent input, .trBillingAddressDifferent select").each(function(i) {
				$(this).val(tg.savedBillValues[i]).change();
			});
		}
	}
	//*************************************************
	function showHideDifferentBillingAddress(thisVal) {
		if (thisVal.toLowerCase() == "yes"){
			StoreBillingAddress();
			$(".trBillingAddressDifferent").slideDown(400, function() {//animate/hide
				RePopulateBillingAddress();
				UpdateAbbrvState('#BillingStateDisplay','#AbbrvBillingState','abbrev');
				UpdateDisplayBillingAddress();
			});// /slideDown
		}else{
			if(session_vars.IsDealerEval == "Y"){
				var temp = $('#DealerState').val();
				if(temp.length <= 2){temp = convert_state(temp,'name')}
				tg.savedBillValues = [$('#DealerAddress1').val(),$('#DealerAddress2').val(),$('#DealerCity').val(),temp,$('#DealerZip').val()];
				$('#BillingAddress1').val($('#DealerAddress1').val()).change();
				$('#BillingAddress2').val($('#DealerAddress2').val()).change();
				$('#BillingCity').val($('#DealerCity').val()).change();
				$('#BillingStateDisplay').val(temp).trigger('change');
				$('#BillingState').val(temp).trigger('change');//update for history purposes
				$('#BillingZip').val($('#DealerZip').val()).change();
			}else{
				var temp = $('#CustState').val();
				if(temp.length <= 2){temp = convert_state(temp,'name')}
				tg.savedBillValues = [$('#CustAddress1').val(),$('#CustAddress2').val(),$('#CustCity').val(),temp,$('#CustZip').val()];
				$('#BillingAddress1').val($('#CustAddress1').val()).change();
				$('#BillingAddress2').val($('#CustAddress2').val()).change();
				$('#BillingCity').val($('#CustCity').val()).change();
				$('#BillingStateDisplay').val(temp).trigger('change');//full name
				$('#BillingState').val(temp).trigger('change');//update for history purposes
				$('#BillingZip').val($('#CustZip').val()).change();
			}
			$(".trBillingAddressDifferent").slideUp(400, function() {//animate/hide
				RePopulateBillingAddress();
				UpdateAbbrvState('#BillingStateDisplay','#AbbrvBillingState','abbrev');
				UpdateDisplayBillingAddress();
			});// /slideUp
		}
		return false;
	}

	//*************************************************
$(document).ready(function() {
	//correct the history so back button works
	history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page=Billing&mode=cancelled');// needs cancel variable to stop auto redirect?
	//*************************************************
	$("#ReceiveContract").change(function () {
		var temp = $(this).val();
		if(temp.toLowerCase() == "email" && session_vars.IsDealerEval.toUpperCase() != "Y"){
			$('.ReceiveContractEmailContent').slideDown();
			$('.ReceiveContractMailContent, .DealerContractBilling').slideUp();
		} else if(temp.toLowerCase() == "mail" && session_vars.IsDealerEval.toUpperCase() != "Y"){
			$('.ReceiveContractMailContent').slideDown();
			$('.ReceiveContractEmailContent, .DealerContractBilling').slideUp();
		} else if (session_vars.IsDealerEval.toUpperCase() == "Y"){
			$('.DealerContractBilling').slideDown();
			$('.ReceiveContractMailContent, .ReceiveContractEmailContent').slideUp();
		} else {
			$('.DealerContractBilling, .ReceiveContractMailContent, .ReceiveContractEmailContent').slideUp();
		}

		//force stream to update billing addy to bypass hidden item bug
		if($('#BillingAddressDifferent').val() == "Yes"){
			showHideDifferentBillingAddress("Yes");
		}else{
			showHideDifferentBillingAddress("No");
		}
	});
	//*************************************************
	$("#BillingAddressDifferent").change(function () {
		showHideDifferentBillingAddress(this.value);
		return false;
	});
	//*************************************************
	if(session_vars.Channel == "POR" && $('#ValidationType').val()==""){$('#ValidationType').val('3');}
	//*************************************************
    $('.btnCareington').bind('mousedown keydown, ',function(){doPreFlightChecks();});   

    $('body').bind('keydown', function(e) {
        if (e.which == 13) {
           if (window.logging){
             console.log(window.logging + "intercepted enter submission"); 
			}
           e.preventDefault();
        }
    });
	//*************************************************
	$(".navigatorItem1").addClass('cursorPointer').click(function() {window.location = "?Page=Select-a-Plan";});
	$(".navigatorItem2").addClass('cursorPointer').click(function() {window.location = "?Page=Confirm";});
	$('#navigatorCircle3').addClass('current');
	//*************************************************
	try{//set billing name display that appears on Careington
		if(session_vars.IsDealerEval== "Y"){
			$('#BillingFirstName').val("Dealer:");
			$('#BillingLastName').val($('#DealerName').val());
			//$('#BillingLastNameEval').val($('#DealerName').val().replace('& ', 'AND ').replace(/[^a-zA-Z0-9\s'//._,-]+/g,''));
			$('#BillingLastNameEval').val($('#DealerName').val().replace('& ', 'AND ').replace(/[^a-zA-Z\s//._,-’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]+/g,''));
		} else{//is consumer so use consumer name
			$('#BillingFirstName').val($('#CustFirstName').val());
			$('#BillingLastName').val($('#CustLastName').val());
			$('#BillingLastNameEval').val($('#CustLastName').val());
		}
	}catch(err){}
	//*************************************************
    if (window.logging){console.log(window.logging + "Changing Receive Contract value to Email, and invoking change");}
	if(session_vars.IsDealerEval == "Y" || session_vars.Brand.toLowerCase() == "lennox"){
		$('#ReceiveContract').val("Mail").change();
	}else if($('#ReceiveContract').val() == "-- Please Select --"){
		$('#ReceiveContract').val("Email").change();
	}
	if(session_vars.Brand.toLowerCase() == "lennox"){$('.trReceiveContract').slideUp();}
	//*************************************************
	$("#buttonPlaceHolder").append($('#btnBack').addClass('altCTA_button altCTA_buttonMaroon inline marginRight12 mobileOnlyMarginLeft12 marginTop24 minBtnWidth').val('Back')).append($('.btnCareington').addClass('nextButton CTA_button inline marginLeft12 mobileOnlyMarginRight12 marginTop24 minBtnWidth'));
	$("#btnBack").attr("onclick", "inFormOrLink = true; location.href = 'index.php?Page=Confirm';");
	if(session_vars.ContractorDealerInvoiceEval == "true"){$('.btnCareington').val('Purchase');}//change text for invoice purchases that skip careington
	
	//*************************************************
	try{
		if(session_vars.ContractorDealerCountry.toLowerCase() == "ca"){//setup state selector for CA
			$('#BillingStateDisplay').html('');
			$('#BillingStateDisplay').append('<option class="dropdownPlaceholder" value="-- Please Select --">-- Please Select --</option>');
			$('#BillingStateDisplay').append(
				$('<option>', {value: 'Alberta',  text: 'Alberta'}),
				$('<option>', {value: 'British Columbia',  text: 'British Columbia'}),
				$('<option>', {value: 'Manitoba',  text: 'Manitoba'}),
				$('<option>', {value: 'New Brunswick',  text: 'New Brunswick'}),
				$('<option>', {value: 'Newfoundland and Labrador',  text: 'Newfoundland and Labrador'}),
				$('<option>', {value: 'Northwest Territories',  text: 'Northwest Territories'}),
				$('<option>', {value: 'Nova Scotia',  text: 'Nova Scotia'}),
				$('<option>', {value: 'Nunavut',  text: 'Nunavut'}),
				$('<option>', {value: 'Ontario',  text: 'Ontario'}),
				$('<option>', {value: 'Prince Edward Island',  text: 'Prince Edward Island'}),
				$('<option>', {value: 'Quebec',  text: 'Quebec'}),
				$('<option>', {value: 'Saskatchewan',  text: 'Saskatchewan'}),
				$('<option>', {value: 'Yukon',  text: 'Yukon'})
			);
			
			$('#BillingStateDisplay').val($('#BillingState').val()).change();//update w CA providence
		}
	}catch(err){}
	//BillingState
	//incase billingState isn't set or was set w 2char instead of full string
	if ($('#BillingStateDisplay').val() == null || $('#BillingStateDisplay').val() == "-- Please Select --"){
		if(session_vars.IsDealerEval== "Y"){
			$('#BillingStateDisplay').val(convert_state($('#DealerState').val(),'name')).trigger('change');
		}else{
			$('#BillingStateDisplay').val($('#CustState').val()).trigger('change');
		}
	}
	//incase billing Addy isn't complete
	if ($('#BillingAddress1').val() == "" || $('#BillingCity').val() == "" || $('#BillingZip').val() == "" || $('#BillingStateDisplay').val() == null){
		$('#BillingAddressDifferent').val('Yes').change();//force user to update or change
		$('#DealerConfirmBillingAddress').slideUp();
	}else{//hide by default
		showHideDifferentBillingAddress($("#BillingAddressDifferent").val());//init on load/reload
	}
	UpdateAbbrvState('#CustState','#AbbrvState','abbrev');
});// /document.ready
//*************************************************
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
//*************************************************
var inFormOrLink;
$('a, .backButton').on('click', function() { inFormOrLink = true; });
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