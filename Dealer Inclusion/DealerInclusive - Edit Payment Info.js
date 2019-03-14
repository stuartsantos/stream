//** EDIT PAYMENT INFO
//***************************************************
$(document).ready(function() {
    $('#APIUpdatePaymentRIC').val('').attr("disabled",true);//clear cache on page load
    //***************************************************
	tg.APIUpdatePayment = function(){
		console.log('now call APIUpdatePayment...');
		triggerMSDYN_API_APIUpdatePayment2();//local validation passed, do API call
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
			$('#btnNext').trigger("click");//works to submit form
		}else{//triggerMSDYN_API_APIUpdatePayment failed
			tg.ErrorMessaging(ReturnInfoCode, "UpdatePayment", "APIUpdatePayment");//reusable logic call
		}
	});// /#APICreatePaymentRIC.change
    //***************************************************
	tg.APIUpdatePayment();//init onload
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