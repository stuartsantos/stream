//ENROLLMENT PROCESSING
//***************************************************
$(document).ready(function() {
	//***********************
		$('#APIGetPaymentResultsRIC').change(function(e) {
			console.log('APIGetPaymentResultsRIC detected');
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1=$(this).val();
			if(errVal1 == "1000"){//successful login
				$('#ProcessEnrollmentErrorMSGBox').slideUp();
				triggerMSDYN_API_APIInclusionEnrollment();//local validation passed, do API call
				tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("ProcessEnrollment", "APIInclusionEnrollment");}, tg.APItimeOutLength);//check in case APItimedOut
			}else{//triggerMSDYN_API_APIGetPaymentResults failed
				tg.ErrorMessaging(errVal1, "ProcessEnrollment", "APIGetPaymentResults");//reusable logic call
			}
		});// /#APIGetPaymentResultsRIC.change
	//***********************
		$('#APIInclusionEnrollmentRIC').change(function(e) {
			console.log('APIInclusionEnrollmentRIC detected');
			clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
			tg.APItimeOutWatch = null;
			var errVal1=$(this).val();
			if(errVal1 == "1000"){//successful login
				$('#ProcessEnrollmentErrorMSGBox').slideUp();
				$('#btnNext').trigger("click");//works to submit form
			}else{//triggerMSDYN_API_APIGetPaymentResults failed
				tg.ErrorMessaging(errVal1, "ProcessEnrollment", "APIInclusionEnrollment");//reusable logic call
			}
		});// /#APIInclusionEnrollment.change

    //***************************************************
	console.log('Now processing enrollment...');
	if(session_vars.DealerCOD.toLowerCase() == "invoice"){//is invoice, bypass careington APIGetPaymentResults
		console.log('running invoice logic...');
		triggerMSDYN_API_APIInclusionEnrollment();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("ProcessEnrollment", "APIInclusionEnrollment");}, tg.APItimeOutLength);//check in case APItimedOut
	}else{
		console.log('running billing logic...');
		triggerMSDYN_API_APIGetPaymentResults();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut("ProcessEnrollment", "APIGetPaymentResults");}, tg.APItimeOutLength);//check in case APItimedOut
	}
	
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