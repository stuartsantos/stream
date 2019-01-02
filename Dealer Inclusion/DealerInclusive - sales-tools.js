var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
session_vars.URLWarn = getUrlParameter('warn');//run b/4 doc.ready to init
$(document).ready(function() {
    if(session_vars.URLWarn == "NotEnrolled"){//auto show warning about not being enrolled
    	$('#WarningMSGBox').slideDown();
    }
});// /document.ready
//***************************************************
	$('.btnCareington.readyCareington').addClass('tgHide');//hide Stream button so custom can run
//***************************************************