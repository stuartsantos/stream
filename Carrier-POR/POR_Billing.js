//BILLING
//var r = new RegExp(/^(?![\d#]\ \w+)?^((?!^ *((^(?![\d#]).*p[ \.]*\ ?(o|0)[-. \/\\]*[\ \.\-]+[-]?((box|bin)|b|(#|num)?\d+))|(p(ost)? *(o(ff(ice)?)?)? +((box|bin)|b)? *\d+)|(p *-?\/?(o)? *-?box)|post office box)|(\bPOB\b)).)*$/igm);

$(document).ready(function() {
	//correct the history so back button works
	history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page=Billing&mode=cancelled');// needs cancel variable to stop auto redirect?

	//*************************************************
	if(session_vars.Channel == "POR" && $('#ValidationType').val()==""){$('#ValidationType').val('3');}
	//*************************************************
    $('.btnCareington').bind('mousedown keydown, ',function(){
		doPreFlightChecks();		
	});   

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
	if(session_vars.IsDealerEval== "Y"){
		$('#ReceiveContract').val("Mail").change();
	}else if($('#ReceiveContract').val() == "-- Please Select --"){
		$('#ReceiveContract').val("Email").change();
	}
	
	$("#buttonPlaceHolder").append($('#btnBack').addClass('altCTA_button altCTA_buttonBlue inline marginRight12 mobileOnlyMarginLeft12 marginTop24 minBtnWidth').val('Back')).append($('.btnCareington').addClass('nextButton CTA_button inline marginLeft12 mobileOnlyMarginRight12 marginTop24 minBtnWidth'));
	$("#btnBack").attr("onclick", "inFormOrLink = true; location.href = 'index.php?Page=Confirm';");
	
	//incase billingState isn't set or was set w 2char instead of full string
	if ($('#BillingState').val() == "" || $('#BillingState').val() == "-- Please Select --"){
		if(session_vars.IsDealerEval== "Y"){
			$('#BillingState').val(convert_state($('#DealerState').val(),'name')).trigger('change');
		}else{
			$('#BillingState').val($('#CustState').val()).trigger('change');
		}
	}
	//incase billing Addy isn't complete
	if ($('#BillingAddress1').val() == "" || $('#BillingCity').val() == "" || $('#BillingZip').val() == ""){
		$('#BillingAddressDifferent').val('Yes').change();//force user to update or change
		$('#trConsumerBillingSame').slideUp();
		$('#DealerConfirmBillingAddress').slideUp();
	}else{//hide by default
		showHideDifferentBillingAddress($("#BillingAddressDifferent").val());//init on load/reload
	}
});
	//*************************************************
function doPreFlightChecks(e){

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

	//setup billingState Abbrev for SalesFile
	var temp = $('#BillingState').val();
	if(temp.length == 2){
		$('#AbbrvBillingState').val(temp);//salesFileIntegration requires 2 char
	}else{
		$('#AbbrvBillingState').val(convert_state(temp,'abbrev'));//salesFileIntegration requires 2 char
	}
	$('#SendCustPhone').val($('#CustPhone').val().replace(/\D/g,'')).trigger('change');//strip special chars for SalesFile

}//doPreFlightChecks
	//*************************************************
	$("#ReceiveContract").change(function () {
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
		UpdateDisplayBillingAddress();//update display billing
		return false;
	});
	function UpdateDisplayBillingAddress() {
		$(".DisplayBillingAddress1").text($('#BillingAddress1').val());
		$(".DisplayBillingAddress2").text($('#BillingAddress2').val());
		$(".DisplayBillingCity").text($('#BillingCity').val());
		$(".DisplayBillingState").text($('#BillingState').val());
		$(".DisplayBillingZip").text($('#BillingZip').val());
	}
	function showHideDifferentBillingAddress(thisVal) {		
		if (thisVal.toLowerCase() == "yes"){
			$(".trBillingAddressDifferent").slideDown();
			if(tg.savedBillValues){//repopulate incase on hide wasn't repopulated
				$(".trBillingAddressDifferent input, .trBillingAddressDifferent select").each(function(i) {
					$(this).val(tg.savedBillValues[i]).change();
				});
			}
		}else{
			if(session_vars.IsDealerEval== "Y"){
				$('#BillingAddress1').val($('#DealerAddress1').val()).change();
				$('#BillingAddress2').val($('#DealerAddress2').val()).change();
				$('#BillingCity').val($('#DealerCity').val()).change();
				var temp = $('#DealerState').val();
				if(temp.length <= 2){
					$('#BillingState').val(convert_state(temp,'name')).trigger('change');//translate to full name
				}else{$('#BillingState').val($('#DealerState').val()).trigger('change');}//use full name
				$('#BillingZip').val($('#DealerZip').val()).change();
			}else{
				$('#BillingAddress1').val($('#CustAddress1').val()).change();
				$('#BillingAddress2').val($('#CustAddress2').val()).change();
				$('#BillingCity').val($('#CustCity').val()).change();
				$('#BillingState').val($('#CustState').val()).trigger('change');//full name
				$('#BillingZip').val($('#CustZip').val()).change();
			}
			tg.savedBillValues = new Object();//create array to hold current values b/4 stream wipes them on hide
			tg.savedBillValues = {};//clear
			$(".trBillingAddressDifferent input, .trBillingAddressDifferent select").each(function(i) {
				tg.savedBillValues[i] = $(this).val();
			});
			$(".trBillingAddressDifferent").slideUp(400, function() {//animate/hide
				if(tg.savedBillValues){
					$(".trBillingAddressDifferent input, .trBillingAddressDifferent select").each(function(i) {
						$(this).val(tg.savedBillValues[i]).change();
					});
				}
			});// /slideUp
		}
		return false;
	}
	//*************************************************
/*	// check POBoxFlag to see if it was emptied
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
	$('#BillingAddress1, #BillingAddress2').attr('onchange', "");
	if(/yes/.test($('#BillingAddress1').attr('onblur').toLowerCase())){$('#BillingAddress1').attr('data-isRequired','yes');}//check to see if item is required
	if(/yes/.test($('#BillingAddress2').attr('onblur').toLowerCase())){$('#BillingAddress2').attr('data-isRequired','yes');}//check to see if item is required
	$('#BillingAddress1, #BillingAddress2').attr('onblur', "");//remove blur function so that custom regex can run on it
	$('#BillingAddress1, #BillingAddress2').change(function(){checkMatch($(this).attr('id'),$(this).val(), r);});

	checkMatch('BillingAddress1',$('#BillingAddress1').val(), r);//run onload incase of browser history?
	checkMatch('BillingAddress2',$('#BillingAddress2').val(), r);//run onload incase of browser history?
*/
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
//*******************************************************
function convert_state(name, to) {
    var name = name.toUpperCase();
    var states = new Array(                         {'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},
        {'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
        {'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'}, 
		{'name':'District of Columbia', 'abbrev':'DC'},
        {'name':'Florida', 'abbrev':'FL'},          {'name':'Georgia', 'abbrev':'GA'},          {'name':'Hawaii', 'abbrev':'HI'},
        {'name':'Idaho', 'abbrev':'ID'},            {'name':'Illinois', 'abbrev':'IL'},         {'name':'Indiana', 'abbrev':'IN'},
        {'name':'Iowa', 'abbrev':'IA'},             {'name':'Kansas', 'abbrev':'KS'},           {'name':'Kentucky', 'abbrev':'KY'},
        {'name':'Louisiana', 'abbrev':'LA'},        {'name':'Maine', 'abbrev':'ME'},            {'name':'Maryland', 'abbrev':'MD'},
        {'name':'Massachusetts', 'abbrev':'MA'},    {'name':'Michigan', 'abbrev':'MI'},         {'name':'Minnesota', 'abbrev':'MN'},
        {'name':'Mississippi', 'abbrev':'MS'},      {'name':'Missouri', 'abbrev':'MO'},         {'name':'Montana', 'abbrev':'MT'},
        {'name':'Nebraska', 'abbrev':'NE'},         {'name':'Nevada', 'abbrev':'NV'},           {'name':'New Hampshire', 'abbrev':'NH'},
        {'name':'New Jersey', 'abbrev':'NJ'},       {'name':'New Mexico', 'abbrev':'NM'},       {'name':'New York', 'abbrev':'NY'},
        {'name':'North Carolina', 'abbrev':'NC'},   {'name':'North Dakota', 'abbrev':'ND'},     {'name':'Ohio', 'abbrev':'OH'},
        {'name':'Oklahoma', 'abbrev':'OK'},         {'name':'Oregon', 'abbrev':'OR'},           {'name':'Pennsylvania', 'abbrev':'PA'},
        {'name':'Rhode Island', 'abbrev':'RI'},     {'name':'South Carolina', 'abbrev':'SC'},   {'name':'South Dakota', 'abbrev':'SD'},
        {'name':'Tennessee', 'abbrev':'TN'},        {'name':'Texas', 'abbrev':'TX'},            {'name':'Utah', 'abbrev':'UT'},
        {'name':'Vermont', 'abbrev':'VT'},          {'name':'Virginia', 'abbrev':'VA'},         {'name':'Washington', 'abbrev':'WA'},
        {'name':'West Virginia', 'abbrev':'WV'},    {'name':'Wisconsin', 'abbrev':'WI'},        {'name':'Wyoming', 'abbrev':'WY'}
        );
    var returnthis = false;
    $.each(states, function(index, value){
        if (to == 'name') {
            if (value.abbrev == name){
                returnthis = value.name;
                return false;
            }
        } else if (to == 'abbrev') {
            if (value.name.toUpperCase() == name){
                returnthis = value.abbrev;
                return false;
            }
        }
    });
    return returnthis;
}
var temp = $('#CustState').val();
if(temp.length == 2){
	$('#AbbrvState').val(temp);//salesFileIntegration requires 2 char
}else{
	$('#AbbrvState').val(convert_state(temp,'abbrev'));//salesFileIntegration requires 2 char
}
UpdateDisplayBillingAddress();//update display billing on page load