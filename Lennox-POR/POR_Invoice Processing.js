//INVOICE PROCESSING
var pageValidation = false;

$(document).ready(function() {
//******************************************************************************************************
	//correct the history so back button works
	history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page=Invoice-Processing');
	//***************************************************
	tg.APItimeOutWatch = 30000;
	//***************************************************
	tg.APIDealerEmail = function(){
			triggerMSDYN_API_APIDealerEmail();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('#POR-API-DealerEmail');}, tg.APItimeOutLength);//check in case APItimedOut
			console.log('triggerMSDYN_API_APIDealerEmail');

		return false;
	};
	//***************************************************
	$('#APIDealerEmailResults').change(function(e) {
		console.log('APIDealerEmailResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		try{
			tg.DealerEmailResults = JSON.parse($('#APIDealerEmailResults').val());
			
			if(tg.DealerEmailResults.ReturnInfo.ReturnInfoCode == "1000"){//successful APIDealerEmail
				console.log(new Date().toLocaleString(),$("#GetPaymentResultsStatus").val() + ": Payment processed successfully.");
				$("#PaymentType").val('I').change();//set to invoice so other values run
				$("#BillingID").val(tg.DealerEmailResults.Dealer.BillingID).change();
				$("#GetPaymentResultsSuccess").val("true").change();

			}else{
				console.log('APIDealerEmail error: ReturnInfoCode or IsActive');

				$('#APIResultsErrorCode').val(tg.DealerEmailResults.ReturnInfo.ReturnInfoCode).change();//store error code for email
				$('#APIResultsErrorType').val("InvoiceProcessing").change();//store error code for email
				$('#APIResultsReturnInfoDesc').val(tg.DealerEmailResults.ReturnInfo.ReturnInfoDesc).change();//store error desc for email
				
				console.warn("Sorry, your payment was unsuccessful: " + tg.DealerEmailResults.ReturnInfo.ReturnInfoCode);
				$("#GetPaymentResultsSuccess").val("fail").change();
				$('#LoadingMessageBox').slideUp();
				$('#ErrorMessageBox').slideDown();
				$('#ErrorMessage').append('<p>Sorry, your payment was unsuccessful</p>');

				//send email error
				console.log('need to send APIDealerEmail error email...');
				tg.SendPOREmailError();
			}
		}catch(err){
			console.log('JSON.parse(APIDealerEmailResults error = '+err);
			
			//send email error
			console.log('need to send JSON.parse error email...');
			$('#APIResultsErrorCode').val("0000").change();//store error code for email
			$('#APIResultsErrorType').val("InvoiceProcessing").change();//store error code for email
			$('#APIResultsReturnInfoDesc').val("JSON.parse | APIDealerEmailResults error = "+err).change();//store error code for email
			tg.SendPOREmailError();
		}

	});// /#APIDealerEmailResults.change
	//***************************************************
	
	
	//***************************************************
	tg.APItimedOut = function(item){
		console.log('tg.APItimedOut | item='+item);
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		console.log('APItimedOut...');

		//send email error
		console.log('need to send APItimedOut error email...');
		$('#APIResultsErrorCode').val("0000");//store error code for email
		$('#APIResultsReturnInfoDesc').val("APItimedOut, API = "+item);//store error code for email
		tg.SendPOREmailError();
		return false;
	};
	//***************************************************
	tg.SendPOREmailError = function(errorType, errorCode){
		$('#PORerrorSubmit').click();//submit page to save variables and then redirect user to POR-error page
		return false;
	};
	//***************************************************
	
	if($('#BillingID').val() == ""){//API email has not yet been sent
		tg.APIDealerEmail();//init page
	}else {
		console.log('email has already been sent');
		$('#InvoiceProcessingSubmit').click();//bypass API email and submit page to save variables and then redirect user to thank-you page
	}
});// /#document.ready
//******************************************************************************************************
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