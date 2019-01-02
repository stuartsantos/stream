<script language='JavaScript' type='text/javascript'>
//API time out length in ms
tg.APItimeOutLength = 30000;

//error counters
tg.ErrCount_GetDealer=0;
tg.ErrCount_DealerSignIn=0;
tg.ErrCount_DealerSendPasswordReset=0;
//*******************************************************
	//mobile log display
	var DM = new Object();
	try{
	if(session_vars.URLParameterShowVars == "true"){

		console.log('logging now...');
		DM.log = false;
		var logStore = [];
		['log','warn','error'].forEach(function (verb) {
			console[verb] = (function (method, verb, log) {
				return function (text) {
					method(text);
					// handle distinguishing between methods any way you'd like
					var msg = document.createElement('code');
					msg.classList.add(verb);
					msg.style.cssText = 'display:block;';
					msg.textContent = '* '+verb + ': ' + text;
					if(DM.log){
						if(logStore){
							$(DM.log).append('<code>**************************************************************</code>');
							for (i = 0; i < logStore.length; i++){
								$(DM.log).append('<code>'+logStore[i].innerHTML+'</code>');    
							}
							$(DM.log).append('<code>**************************************************************</code>');
							logStore = false;
						}
						DM.log.appendChild(msg);
					}
					else{logStore.push(msg);}
				};
			})(console[verb].bind(console), verb, DM.log);
		});
		//capture error console for mobile devices
		window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
			$('.ConsoleLogs').append('<code>Error: ' + errorMsg + ' <br/>* Script: ' + url + ' <br/>* Line: ' + lineNumber  + ' <br/>* Column: ' + column + ' <br/>* StackTrace: ' +  errorObj+'</code>');
		};
	}
	}catch(err){}
	//********************************************************
$(document).ready(function() {
    try{DM.log = document.querySelector('.ConsoleLogs');}catch(err){}//mobile logging
	//correct the history so back button works
    history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page='+session_vars.CurrentPageName);
//********************************************************
	tg.zipFieldStrictInput = function(event, allowcomma, allownegative) {
		var e = event || window.event;  // get event object
		var key = e.keyCode || e.which; // get key cross-browser
		var iChars = "!@#$%^&*()+=-[]\\\';,/{}|\":<>?";//allow 48-57 but NOT the special char of those

		if(key==20 || key==110 || key==8 || key==46 || key == 9 || key==17 || key==91 || key==18 || key==116 || key==89 || key==67 || key==88 || key==35 || key==36) //capslock, back, delete tab, ctrl, win, alt, f5, paste, copy, cut, home, end
			return true;

		if(key == 109 && allownegative)
			return true;

		if(key>=37 && key<=40) //arrows
			return true;
			
		if(key>=65 && key<=90) //letters
		return true;

		if(key>=48 && key<=57 && iChars.indexOf(e.key) < 0) // top # keys
			return true;
		
		if(key>=96 && key<=105) //num key
			return true;

		if (e.preventDefault) e.preventDefault(); //normal browsers
			e.returnValue = false; //IE
	}
	//*************************************************
	tg.SwapStateLength = function(source, target, convertTo) {
		try{
			//setup billingState Abbrev for SalesFile
			var temp = $(source).val();
			if(temp && (temp.length == 2 && convertTo.toLowerCase() == 'abbrev') || (temp.length > 2 && convertTo.toLowerCase() == 'name')){
				$(target).val(temp).trigger('change');//already @ desired length so leave and just update
			}else if(temp){
				$(target).val(tg.convert_state(temp, convertTo)).trigger('change');//salesFileIntegration requires 2 char
			}
		}catch(err){console.log('tg.SwapStateLength failed w: '+err);}
		
		return false;
	}
	//***************************************************
	tg.UpdateDropdownsCA = function(source, target){
		try{
			var temp;
			if (session_vars.Region == null) {temp = "";}
			else{temp = session_vars.Region;}
			
			if(temp.toLowerCase() == "ca"){//setup state selector for CA
				$(target).html('');
				$(target).append('<option class="dropdownPlaceholder" value="-- Please Select --">-- Please Select --</option>');
				$(target).append(
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
				
				if(source){
					tg.SwapStateLength(source, target, 'name');				
				}
			}
		}catch(err){}
	}
	//*******************************************************
	tg.convert_state = function(name, to) {
		var name = name.toUpperCase();
		var temp;
		if (session_vars.Region == null) {temp = "";}
		else{temp = session_vars.Region;}
		
		if(temp.toLowerCase() == "ca"){
			var states = new Array(                         	{'name':'Alberta', 'abbrev':'AB'},          {'name':'British Columbia', 'abbrev':'BC'},
				{'name':'Manitoba', 'abbrev':'MB'},         	{'name':'New Brunswick', 'abbrev':'NB'},    {'name':'Newfoundland and Labrador', 'abbrev':'NL'},
				{'name':'Northwest Territories', 'abbrev':'NT'},{'name':'Nova Scotia', 'abbrev':'NS'},      {'name':'Nunavut', 'abbrev':'NU'},
				{'name':'Ontario', 'abbrev':'ON'},          	{'name':'Prince Edward Island', 'abbrev':'PE'}, {'name':'Quebec', 'abbrev':'QC'},
				{'name':'Saskatchewan', 'abbrev':'SK'},         {'name':'Yukon', 'abbrev':'YT'}
			);
		}else{
			var states = new Array(                         {'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},
				{'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
				{'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'}, {'name':'District of Columbia', 'abbrev':'DC'},
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
		}
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
//***************************************************
	tg.flagError = function(element){
		$(element).addClass('hasError');
		$('.hasError').focus(function() {$(this).removeClass('hasError');});//clear error on focus, run code here to make sure init properly
		$('.hasError').click(function() {$(this).removeClass('hasError');});
	};
//***************************************************
	tg.APItimedOut = function(errLogic, errAPI){
		tg.ErrorMessaging("APItimedOut", errLogic, errAPI);
		return false;
	};
//***************************************************
	tg.ErrorMessaging = function(errorCode, errLogic, errAPI, target){//IE11 doesn't understand target = errLogic
		if (target == "") {//typeof target !== 'undefined' || 
			var target = errLogic;
			console.log('updated target = '+target);
		}

		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		var sendEmail = false, errMsg = "", errMsgEmail = "", isWarning = false;
		
		if(errorCode == "APItimedOut"){
			console.log("errorCode = APItimedOut, errLogic="+errLogic);
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3> Please wait and try again.";
			errMsgEmail = "APItimedOut";
			sendEmail = true;
		}
	//Dealer (Lennox API)
		else if(errorCode == "LennoxWarning"){
			console.log("errorCode = LennoxWarning");
			errMsg="<h3>There appears to be an issue with your account.</h3> Please contact our dealer support Team for assistance at: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Lennox empty <Status> error";
			sendEmail = true;
		}
	//GetDealer (Warranty API)
		else if(errorCode == "WarrantyClientDealerID"){
			console.log("errorCode = WarrantyClientDealerID");
			errMsg="<h3>There appears to be an issue with your account.</h3> Please contact our dealer support Team for assistance at: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Warranty empty <ClientDealerID> error";
			sendEmail = true;
		}
		else if(errorCode == "1001"){//1001 default
			tg.ErrCount_GetDealer++;
			if(tg.ErrCount_GetDealer >= 4){
				errMsg="<h3>We are unable to log you in with the information provided.</h3>Please contact our dealer support team for assistance at: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
				$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);//too many times, now disable
			}else{
				errMsg="<h3>We are unable to validate your dealer login.</h3> Please review and try again.";
			}
		}else if(errorCode == "1002"){//1002 default
			console.log("errorCode = 1002");
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3> Please wait and try again.";
			errMsgEmail = "Authentication Failure";
			sendEmail = true;
		}else if(errorCode == "1003"){//1003 default
			console.log("errorCode = 1003");
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3> Please wait and try again.";
			errMsgEmail = "Internal Error";
			sendEmail = true;
		}else if(errorCode == "1004"){//1004 default
			errMsg="<h3>More than 1 match found for you Dealer ID and Zip/Postal code.</h3> Make sure you enter your full Dealer ID and try again.  If problem persists, please contact our dealer support team for assistance at: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}
	//DealerCreateAccount
		else if(errorCode == "1011" || errorCode == "1020"){//1011&1020 default
			errMsg="<h3>An account with this Dealer ID already exists.</h3> Please check your login info and try again or click here to <a href='#' onclick=\"SwapModals(\'#DealerForgotPasswordModal\');return false;\">Reset Password.</a>";
		}else if(String($('#IsActive').val()).toLowerCase() != "true"  && (errAPI == "APIDealerCreateAccount" || (errLogic == "DealerCreateAccount" && errAPI == "APIGetDealer"))){
			errMsg="<h3>There appears to be an issue with your account.</h3> Please contact our customer service team for assistance at: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}
	//DealerSignIn
		else if(errorCode == "1012"){//1012 default
			tg.ErrCount_DealerSignIn++;
			if(tg.ErrCount_DealerSignIn >= 5){
				errMsg="<h3>Looks like you're having trouble logging in.</h3> <a href='#' onclick='SwapModals(\"#DealerForgotPasswordModal\");return false;'>Click here</a> to reset your password.";
				$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
			}else{
				errMsg="<h3>Invalid login information.</h3> Please try again.";
			}
		}else if(errorCode == "1013" && errLogic == "DealerSignIn"){
			tg.ErrCount_DealerSignIn++;
			if(tg.ErrCount_DealerSignIn >= 5){
				errMsg="<h3>Looks like you're having trouble logging in.</h3> <a href='#' onclick='SwapModals(\"#DealerForgotPasswordModal\");return false;'>Click here</a> to reset your password.";
				$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
			}else{
				errMsg="<h3>Invalid login information.</h3> Please try again.";
			}
		}
	//DealerSendPasswordReset
		else if(errorCode == "1013" && (errLogic == "DealerSendPasswordReset" || errAPI == "APIDealerSendPasswordReset" || errAPI == "APIDealerSendPasswordResetCA")){
			tg.ErrCount_DealerSendPasswordReset++;
			if(tg.ErrCount_DealerSendPasswordReset >= 6){
				errMsg="<h3>Looks like you're having trouble resetting your password.</h3> Please <a href='/index.php?Page=contact-us'>click here</a> to contact our Dealer Support team.";
				$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
			}else{
				errMsg="<h3>We are unable to verify your login information.</h3> Please check the Dealer ID and Zip/Postal code and try again.";
			}
		}else if(errorCode == "1014"){//1014 default
			errMsg="<h3>An error has occurred.</h3> Please check the Dealer ID & Zip/Postal and try again.";
		}else if(errorCode == "1018"){//1018 default
			tg.ErrCount_DealerSendPasswordReset++;
			if(tg.ErrCount_DealerSendPasswordReset >= 5){
				errMsg="<h3>Looks like you're having trouble resetting your password.</h3> Please click here to contact our <a href='/index.php?Page=contact-us'>Dealer Support team</a>.";
				$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
			}else{
				errMsg="<h3>We are unable to verify your login information.</h3> Please check the Dealer ID and Zip/Postal code and try again.";
			}
		}
	//DealerResetPassword
		else if(errorCode == "1015"){//1015 default
			errMsg="<h3>We are unable to update your password at this time.</h3> Please wait and try again.";
			errMsgEmail = "Error occurred while updating the password";
			sendEmail = true;
		}else if(errorCode == "1016"){//1016 default
			errMsg="<h3>We're sorry; this link is no longer valid.</h3> Please <a href='/index.php?Page=home&modal=reset'>click here</a> to request a new link.";
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}
	//DealerInclusionEnrollment
		else if(errorCode == "1013" && errLogic == "DealerInclusionEnrollment"){
			errMsg="<h3>We were unable to verify your information.</h3>  Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Dealer doesn't exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1017"){//1017 default
			errMsg="<h3>There was a problem updating your account.</h3> Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Error occurred while updating the Enrollment details";
			sendEmail = true;
		}else if(errorCode == "1024" && errLogic == "DealerInclusionEnrollment"){
			errMsg="<h3>There was a problem updating your account.</h3> Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Offer Coverage does not exist";
			sendEmail = true;
		}else if(errorCode == "1025" && errLogic == "DealerInclusionEnrollment"){
			errMsg="<h3>There was a problem updating your account.</h3> Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Future offer cannot be created as the current active offer is open ended";
			sendEmail = true;
		}else if(errorCode == "1021" && errLogic == "DealerInclusionEnrollment"){
			errMsg="<h3>'Installations Ending On' date must be 30 days or more from program start date to participate in this program.</h3> Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "End Date must be 30 days from Offer Begin Date";
			sendEmail = true;
		}else if(errorCode == "1022" && errLogic == "DealerInclusionEnrollment"){
			errMsg="<h3>New program begin date must be after your current program end date.</h3> Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Begin date of the future offer cannot be prior to the end date of the active offer";
			sendEmail = true;
		}else if(errorCode == "1019" && errLogic == "DealerInclusionEnrollment"){
			errMsg="<h3>There was a problem updating your account.</h3> Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "BillingID doesnt match";
			sendEmail = true;
		}
	//**************************************************************************
	//APIDealerContractsPayRequest
		else if(errorCode == "1013" && errAPI == "APIDealerContractsPayRequest"){
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "DealerID does not exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1028" && errAPI == "APIDealerContractsPayRequest"){
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "No record found";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1032"){//1032 default
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Please provide only pending status";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1031"){//1031 default
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Contracts Mismatch for Dealer";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}
		
	//InclusionOfferUpdate
		else if(errorCode == "1013" && (errAPI == "InclusionOfferUpdate" || errAPI == "InclusionOfferUpdate")){
			errMsg="<h3>There was a problem updating your account.</h3>  Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "DealerID does not exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1021" && (errAPI == "InclusionOfferUpdate" || errAPI == "InclusionOfferUpdate")){
			errMsg="<h3>'Installations Beginning On' date must be in a date in the future.</h3>  Please review and try again.  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1023" && errAPI == "InclusionOfferUpdate"){
			errMsg="<h3>'Installations Ending On' date must be 30 days or more from program start date, to participate in this program.</h3>  Please review and try again. For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1027"){//1027 default
			errMsg="<h3>There was a problem updating your account.</h3>  Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "OfferID Mismatch";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1033"){//1033 default
			errMsg="<h3>Current program Begin Date cannot be modified.</h3>  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1037"){//1037 default (future)
			errMsg="<h3>Your new ADVANTAGE program campaign must start after your current ADVANTAGE program campaign date ends.</h3>  Click here to <a href='/index.php?Page=edit-program-details&EditFlag=Active'>edit current program end date.</a><br/><br/>For assistance, please contact our Dealer Support team by dialing: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1038" && errAPI == "InclusionOfferUpdate"){//1038 (active)
			errMsg="<h3>Your current ADVANTAGE program campaign must end before your new ADVANTAGE program campaign begins.</h3>  Click here to <a href='/index.php?Page=edit-program-details&EditFlag=Future'>modify new program start date.</a><br/><br/>For assistance, please contact our Dealer Support team by dialing: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1034"){//1034 default (active)
			errMsg="<h3>Current Program Coverage cannot be changed.</h3>  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1035"){//1035 default (active)
			errMsg="<h3>Current Program Term cannot be updated.</h3>  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1036"){//1036 default (active)
			errMsg="<h3>Current Program Tier cannot be updated.</h3>  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1024" && errAPI == "InclusionOfferUpdate"){
			errMsg="<h3>There was a problem updating your account.</h3>  Please review and try again. If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1022" && errAPI == "InclusionOfferUpdate"){
			errMsg="<h3>'Installations Beginning On' date must be in a date in the future.</h3>  Please review and try again. If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}
		
	//DealerContracts
		else if(errorCode == "1013" && (errAPI == "APIDealerContractsMRSCResults" || errAPI == "APIDealerContractsPPResults" || errAPI == "APIDealerContractsPayRequest")){
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3> Please wait and try again.  If the problem persists, please call on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "DealerID does not exist ";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if((errorCode == "1028") && errLogic == "DealerContracts"){
			isWarning = true;//show as warning not error
			errMsg="<h3>No contracts found.</h3> You do not have any contracts under this section.";
		}
		
	//DealerContractsCancelPending
		else if(errorCode == "1038" && errAPI == "APIDealerContractsCancelResults"){
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Reason doesnt exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1013" && errAPI == "APIDealerContractsCancelResults"){
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Dealer Doesnt Exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1041" && errAPI == "APIDealerContractsCancelResults"){
			errMsg="<h3>A problem occurred while cancelling your contract.</h3>  Please review and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Reason doesnt exist";
			sendEmail = true;
		}else if(errorCode == "1042" && errAPI == "APIDealerContractsCancelResults"){
			errMsg="<h3>Please ensure a cancellation reason is chosen for each contract you wish to cancel.</h3>  If you are experiencing difficulties or have a question, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Description is required if chosen other as option";
			sendEmail = true;
		}
	
	//InclusionOffer
		else if(errorCode == "1013" && errAPI == "InclusionOffer"){
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again. If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "DealerID does not exist ";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1028"){//1028 default
			isWarning = true;//show as warning not error
			if(OfferStatus == "Expired"){
				//OfferStatus = Expired
				errMsg="<h3>No Prior offers - You do not have any prior programs.</h3>";
			}else if(OfferStatus == "Future"){
				//OfferStatus = Future
				errMsg="<h3>No Future Offers - You do not have any future programs scheduled.</h3>";
			} else{
				//OfferStatus = Active or blank
				errMsg="<h3>No Active offer - You do not have an active program.</h3>";
			}
			errMsg+="<a href='/index.php?Page=create-new-program'>Click here</a> to create a new program.";
		}else if(errorCode == "1029"){//1029 default
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3>  Please wait and try again.  If the problem persists, please call: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Status Mismatch";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}
		
	//DealerBillingUpdate
		else if(errorCode == "1013"){//1013 default
			errMsg="<h3>There was a problem updating your account.</h3>  Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "DealerID doesn't exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1019"){//1019 default
			errMsg="<h3>There was a problem updating your account.</h3>  Please review and try again.  If the problem persists, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "BillingID Mismatch";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}
	//InclusionOfferCreate
		else if(errorCode == "1021"){//1021 default
			errMsg="<h3>'Installations Ending On' date must be 30 days or more from program start date to participate in this program.</h3>  Please review and try again.  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1022"){//1022 default
			errMsg="<h3>'Installations Beginning On' date must be a date in the future.</h3>  Please review and try again.  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1023"){//1023 default
			errMsg="<h3>'Installations Ending On' date must be 30 days or more from program start date to participate in this program.</h3>  Please review and try again.  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1024"){//1024 default
			errMsg="<h3>There was a problem updating your account.</h3>  Please review and try again.  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
			errMsgEmail = "Offer Coverage does not exist";
			sendEmail = true;
			$('#'+errLogic+'Btn').addClass('disabled').attr("disabled",true);
		}else if(errorCode == "1025"){//1025 default
			errMsg="<h3>Your current ADVANTAGE program campaign does not have an end date.</h3> You cannot create a new campaign until an end date has been added.  Click here to <a href='/index.php?Page=edit-program-details&EditFlag=Active'>edit current program end date.</a><br/><br/> For assistance, please contact our Dealer Support team by dialing: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}else if(errorCode == "1026"){//1026 default
			errMsg="<h3>New program begin date must be after your current program end date.</h3>  Please review and try again.  For assistance, please call Dealer Support on: <a href='tel:1"+session_vars.TelephoneNumber.replace(/\s+|-|\./g, '')+"' class='hasHrefPhoneNum'><span class='isPhoneNum'>"+session_vars.TelephoneNumber+"</span></a>.";
		}
	//Default
		else{
			errMsg="<h3>We're sorry; our system is currently experiencing difficulties.</h3> Please wait and try again.";
			errMsgEmail = "Misc error has occurred";
			sendEmail = true;
		}
		
		if(isWarning){//is a warning message
			$('#'+target+'Btn').val(function(){return $(this).attr('data-txtmsg')});
			$('#'+target+'WarningMSG').html(errMsg);
			$('#'+target+'WarningMSGBox').slideDown();
			window.location.href="#"+target+"WarningMSGBox";
		}else{//is an error
			if(sendEmail == true){
				//send email error
				$('#EmailErrorMSG').val(
					"<strong>ErrorCode:</strong><br/>" + errorCode +
					"<br/><strong>ErrorMessage-Email:</strong><br/>" + errMsgEmail + 
					"<hr/><br/><strong>ErrorMessage-User:</strong><br/>" + errMsg + 
					"<hr/><br/><strong>errLogic:</strong><br/>" + errLogic + 
					"<br/><strong>errAPI:</strong><br/>" + errAPI
				).change();
				$('#EmailErrorTrigger').val("true").change();
				console.log('error email triggered');
			}
			$('#'+errLogic+'Btn').val(function(){return $(this).attr('data-txtmsg')});
			$('#'+errLogic+'ErrorMSG').html(errMsg);
			$('#'+errLogic+'ErrorMSGBox').slideDown();
			window.location.href="#"+errLogic+"ErrorMSGBox";
		}
	};
//***************************************************
});// /document.ready
 $(window).load(function(){
	//$('.substituteDealerName').html($('.substituteDealerName').html().replace(/&amp;/g, "&1"));//update dealer name incase of &amp;, needs to run onload rather than .ready
});// /window.load
</script>
<!-- ***********************************************
GLOBAL <BODY> TOP TAG:
************************************************ -->
<!-- Begin Site Catalyst Basic Script -->
<script language='JavaScript' type='text/javascript' src='/uploads/00001941/s_config.js'></script>
<script language='JavaScript' type='text/javascript' src='/uploads/00001941/s_code_vH26.1.js'></script> 
 
<script language='JavaScript' type='text/javascript'>
	s.pageName=    session_vars.SiteNameVariable.toLowerCase()+'-'+session_vars.CurrentPageName.toLowerCase();//custom page name function
	s.campaign=    session_vars.URLParameterCampaign;//needs to be equal to the querystring value that is passed in as ‘cmpid’
	s.scYear=      session_vars.CurrentYear;//set with server's year if possible.
	s.prop28=      session_vars.SiteNameVariable.toLowerCase(); //Audience (Site ID)
	try{s.prop32=session_vars.Brand;}catch(err){s.prop32="AIG";}//brandID
	s.prop33=      'english'; //Language
	s.prop41=      session_vars.CurrentHost.toLowerCase();//Custom 1 - Environment
</script> 
<!--END SC CODE-->