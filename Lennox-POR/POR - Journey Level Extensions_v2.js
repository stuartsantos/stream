//use this to display console errors to <div> for mobile
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


/* Language setup ***************************** */
LanguageGetSet = function(toLang){
	if(toLang){tg.LocalStorageSave("Language", toLang.toUpperCase(), "value");}//save passed in value
	else if(tg.LocalStorageGetSet("Language", null, "value")){toLang=tg.LocalStorageGetSet("Language", null, "value");}//not passed in, use cache?
	else{toLang = "en";tg.LocalStorageSave("Language", "en", "value");}//set to ENG default language

    if(toLang.toLowerCase() == "fr"){$("html").addClass("isFR_lang").removeClass("isENG_lang");}
    else{$("html").addClass("isENG_lang").removeClass("isFR_lang");}

	if(session_vars.Region.toLowerCase() == "ca"){$("html").addClass("isCA_reg").removeClass("isUS_reg");}
    else{$("html").addClass("isUS_reg").removeClass("isCA_reg");}
	
	//careington language flag
	if(session_vars.Region.toLowerCase() == "ca" && toLang.toLowerCase() == "fr"){$("#LanguageFlag").val('fr-CA');}
	else if(session_vars.Region.toLowerCase() == "ca" && toLang.toLowerCase() == "en"){$("#LanguageFlag").val('en-CA');}
	else if(toLang.toLowerCase() == "fr"){$("#LanguageFlag").val('fr-US');}
	else {$("#LanguageFlag").val('en-US');}
	
	return false;
};

//*******************************************************
function convert_state(name, to) {
    var name = name.toUpperCase();
	var temp;
	if (session_vars.ContractorDealerCountry == null) {
		temp = "";
	}else{
		temp = session_vars.ContractorDealerCountry;
	}
	
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

//*******************************************************
$(document).ready(function() {
    try{DM.log = document.querySelector('.ConsoleLogs');}catch(err){}//mobile logging
	$('body').attr("id","bodyID");
	try{$('#bodyID').addClass('is'+session_vars.Channel+" "+session_vars.Brand);}catch(err){}
	try{
	    if(session_vars.IsDealerEval== "Y"){
	        $('#bodyID').addClass('IsDealer-'+session_vars.IsDealerEval);
	        $('.substituteDealerName').html(session_vars.DealerNameEval);//update w latest
	        $('.substituteDealerID').html(session_vars.DealerIDDisplay);//update w latest
	    }
	}catch(err){}
	
	//force website to reload so that session isn't lost
    window.setTimeout(function(){
        location.reload();
    },2400000);
    
    //default language setup
    LanguageGetSet();
    
	//update partner logo
	try{
		if(session_vars.Brand == "Lennox"){
			$('#logoLink img').attr('src','/uploads/00002004/LennoxLogo.png').attr('alt','Lennox').addClass('LennoxLogo');
		}
		if(session_vars.IsDealerEval.toLowerCase() == "y"){
			$('#LoginWrap .substituteDealerName').text(session_vars.DealerNameEval);//update header code
			$('#LoginWrap .substituteDealerID').text(session_vars.DealerIDDisplay);//update header code
		}
	}catch(err){}
});

//Adobe DTM
console.log('Loading DM DTM JS tag');
var temp = session_vars.IsLiveEnvironment.toLowerCase() == 'true' ? '//assets.adobedtm.com/962196b0527148dcc7759117b07639e3d5c6fb98/satelliteLib-3e12e51b39339ca0f2b7bbb9d5ca05bcea68f3ca.js' : '//assets.adobedtm.com/962196b0527148dcc7759117b07639e3d5c6fb98/satelliteLib-3e12e51b39339ca0f2b7bbb9d5ca05bcea68f3ca-staging.js';
document.write('<s' + 'cript language="javascript" type="text/javascript" src="' + temp + '"><\/s' + 'cript>');
$(document).ready(function() {try{_satellite.pageBottom();console.log('DM DTM satellite.pageBottom has now run...');}catch(err){console.log('DM DTM did not run properly...');}});