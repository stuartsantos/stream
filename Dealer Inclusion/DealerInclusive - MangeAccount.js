//** MANAGE MY ACCOUNT
$('.PreviousProgramsModal').attr('id','PreviousProgramsModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.AutoPayPendingModal').attr('id','AutoPayPendingModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready

$(document).ready(function() {
	//***************************************************
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
	//***************************************************
	$('#APIInclusionOfferResults, #APIInclusionOfferPPResults').val('').attr("disabled",true);//clear cache on page load
	$('#EmailErrorMSG').val('');//clear cache on page load
    //***************************************************
	var temp = $('#SuccessFlag').val();
	if(temp != ''){
		console.log('SuccessFlag = '+temp);
		if(temp.indexOf("IsAutopay") !== -1 && session_vars.PendingContractsCount > 0){
			console.log('#SuccessFlag contains "IsAutopay"');
			$("#AutoPayPendingModal").modal("show");//show modal w new data
		}
		$('#DealerContractsSuccessMSGBox').slideDown();
		$('#SuccessFlag').val('').change();//clear value
	}
//***************************************************
	tg.TierName = function(tier){
		if((session_vars.Brand.toLowerCase() == "carrier" || session_vars.Brand.toLowerCase() == "ruud" || session_vars.Brand.toLowerCase() == "rheem" || session_vars.Brand.toLowerCase() == "nortek") && tier !=""){
			return "Plan "+tier;
		}else if(session_vars.Brand.toLowerCase() == "lennox" && tier =="1"){
			return "Basic";
		}else if(session_vars.Brand.toLowerCase() == "lennox"){
			return "Tier "+(tier-1);
		}else{
			return"";
		}
	};
//***************************************************
	tg.APIInclusionOffer = function(){
		console.log('tg.APIInclusionOffer');

		triggerMSDYN_API_APIInclusionOffer();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('#InclusionOffer', "APIInclusionOffer");}, tg.APItimeOutLength);//check in case APItimedOut
		console.log('triggerMSDYN_API_APIInclusionOffer');

		return false;
	};
	//***************************************************
	$('#APIInclusionOfferResults').change(function(e) {
		console.log('APIInclusionOfferResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;

		$('#ProgramDetailsLoadingMSGBox').slideUp();
		$('#APIInclusionOfferResults').val($('#APIInclusionOfferResults').val().replace(new RegExp('"Status": "Active"', 'g'), '"Status": "Processed"'));
		try{
			tg.APIInclusionOfferResults = JSON.parse($('#APIInclusionOfferResults').val());
		
			var ReturnInfoCode = tg.APIInclusionOfferResults.ReturnInfo.ReturnInfoCode;
			if(ReturnInfoCode == "1000"){//successful APIGetDealer
				$('#DealerBillingUpdateErrorMSGBox').slideUp();
				//success

				$('#OfferTerm').text(tg.APIInclusionOfferResults.InclusionOffers[0].OfferTerm);
				$('#OfferTier').text(tg.TierName(tg.APIInclusionOfferResults.InclusionOffers[0].OfferTier));

				$('#OfferCoverage').text(tg.APIInclusionOfferResults.InclusionOffers[0].OfferCoverage);
				$('#OfferBeginDate').text(tg.APIInclusionOfferResults.InclusionOffers[0].OfferBeginDate);
				
				if(tg.APIInclusionOfferResults.InclusionOffers[0].OfferEndDate ==""){
					$('#OfferEndDate').text("Until Further Notice");
				}else{
					$('#OfferEndDate').text(tg.APIInclusionOfferResults.InclusionOffers[0].OfferEndDate);
				}

			}else if(ReturnInfoCode == "1028"){//successful APIGetDealer
				if(session_vars.NoOfferFlag.toLowerCase() != "true"){//is empty in careington but user has recently created new so don't show link
					$('.createNewProgramLink').slideUp();//don't show create new link
				}
				$('#ProgramDetailsWarningMSGBox').slideDown();//show warn
				$('#ProgramDetailsList').slideUp();//hide content
				//don't window.location
			}else{
				tg.ErrorMessaging(ReturnInfoCode, "InclusionOffer", "APIInclusionOfferResults");//reusable logic call
			}
			
		}catch(err){
			console.log('JSON.parse(APIInclusionOfferResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "InclusionOffer", "APIInclusionOfferResults");//reusable logic call
		}
	});// /#APIInclusionOfferResults.change
//***************************************************
	tg.APIInclusionOfferPP = function(){
		console.log('tg.APIInclusionOfferPP');

		triggerMSDYN_API_APIInclusionOfferPP();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('#InclusionOffer', "APIInclusionOfferPP");}, tg.APItimeOutLength);//check in case APItimedOut
		console.log('triggerMSDYN_API_APIInclusionOfferPP');

		return false;
	};
	//***************************************************
	$('#APIInclusionOfferPPResults').change(function(e) {
		console.log('APIInclusionOfferPPResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;

		$('#ProgramDetailsWarning2MSGBox').slideUp();
		$('#DealerContractsSuccessMSGBox').slideUp();
		try{
			tg.APIInclusionOfferPPResults = JSON.parse($('#APIInclusionOfferPPResults').val());
		
			var ReturnInfoCode = tg.APIInclusionOfferPPResults.ReturnInfo.ReturnInfoCode;
			if(ReturnInfoCode == "1000"){//successful APIGetDealer
				$('#DealerBillingUpdateErrorMSGBox').slideUp();
				//success
				tg.StyleDataTable(tg.APIInclusionOfferPPResults.InclusionOffers, '#table_PP', "OfferStatus|Expired|==", '');
				$("#PreviousProgramsModal").modal("show");//show modal w new data
			}else if(ReturnInfoCode == "1028"){//successful APIGetDealer
				$('#ProgramDetailsWarning2MSGBox').slideDown();//show warn
				window.location.href="#ProgramDetailsWarning2MSGAnchor";
			}else{
				tg.ErrorMessaging(ReturnInfoCode, "InclusionOffer", "APIInclusionOfferPPResults");//reusable logic call
			}
			
		}catch(err){
			console.log('JSON.parse(APIInclusionOfferPPResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "InclusionOffer", "APIInclusionOfferPPResults");//reusable logic call
		}
	});// /#APIInclusionOfferPPResults.change
	//***************************************************
	tg.PopulateDataTable = function(obj, i, theTable){

		var html = '<tr class="smaller" data-link-id="'+obj[i].ID+'">'
		+ '<td class="spacer"></td>'
		+ '<td class="lname">'+obj[i].OfferBeginDate +'</td>'
		+ '<td>'+obj[i].OfferEndDate +'</td>'
		+ '<td>'+obj[i].OfferStatus +'</td>'
		+ '<td>'+obj[i].OfferTerm +' Year(s)</td>'
		+ '<td>'+tg.TierName(obj[i].OfferTier) +'</td>'
		+ '<td>'+obj[i].OfferCoverage +'</td>'
		+ '</tr>';
		
		$(theTable).append(html);
		
		return false;
	};
	tg.StyleDataTable = function(obj, theTable, theFilter, hideColumn){	
		var objLength = obj.length;
		//setup the thead tags
		$(theTable+' thead', theTable+' tbody').empty();//clear table before using it
		var html = '<tr><th class="spacer"></th><th class="lname">Offer Begin Date</th><th>Offer End Date</th><th>Offer Status</th><th>Offer Term</th><th>Offer Tier</th><th>Offer Coverage</th></tr>';
		$(theTable+' thead').append(html);
		
		if(theFilter){
			var fields = theFilter.split('|');
			var operator = {
				'+': function(a, b) { return a + b },
				'<': function(a, b) { return a < b },
				'<=': function(a, b) { return a <= b },
				'>': function(a, b) { return a > b },
				'>': function(a, b) { return a >= b },
				'==': function(a, b) { return a == b },
				'!=': function(a, b) { return a != b }
				 // ...
			};
			for(i=0;i <= objLength-1; i++){
				if(operator[fields[2]](obj[i][fields[0]], fields[1])){
					tg.PopulateDataTable(obj, i, theTable);
				}
			}
			
		}else{
			for(i=0;i <= objLength-1; i++){
				tg.PopulateDataTable(obj, i, theTable);
			}
		}
		
		$(theTable).DataTable({
			"bAutoWidth": false,
			"language": {
				"search": ""
			},
			columns: [
				{name: 'Spacer', "orderable": false,responsivePriority: 2},
				{name: 'OfferBeginDate',responsivePriority: 1},
				{name: 'OfferEndDate',responsivePriority: 3},
				{name: 'OfferStatus',responsivePriority: 4},
				{name: 'OfferTerm'},
				{name: 'OfferTier'},
				{name: 'OfferCoverage'}
			],
			order: [[2, 'asc']]//set default sorted order to name
		});
		if(hideColumn){
			var hideColumnItems = hideColumn.split('|');
			for(i=0; i<= hideColumnItems.length; i++){//hide column by name if not needed
				$(theTable).DataTable().column(hideColumnItems[i]+':name').visible(false);
			}
		}
		//if(!useRadios){$(theTable).DataTable().column('Checkbox:name').visible(false);}//hide radio column if not needed
		if($(theTable).DataTable().rows().count() <=10){
			$(theTable+"_length, "+theTable+"_paginate").hide();
		}else{
			$(theTable+"_length, "+theTable+"_paginate").show();
		}
		$(theTable+"_filter input").wrap('<div class="input-group tg-noCorner-all"></div>').attr("placeholder", "Filter Records");
		$('<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>').insertBefore(theTable+"_filter input");
	
		return false;
	};
//***************************************************
	tg.APIInclusionOffer();//init onload
});// /document.ready
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