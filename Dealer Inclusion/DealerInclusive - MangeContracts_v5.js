//** MANAGE MY CONTRACTS
$('.PaymentSettingsSavedModal').attr('id','PaymentSettingsSavedModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.DealerContractsCancelModal').attr('id','DealerContractsCancelModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.DealerContractsPayModal').attr('id','DealerContractsPayModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready
$('.MostRecentSoldModal').attr('id','MostRecentSoldModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready

$(document).ready(function() {
	//***************************************************
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
	//***************************************************
	// #APIDealerContractsPayRequest,
	$('#APIDealerContractsPPResults, #APIDealerContractsMRSCResults, #APIDealerContractsSearchResults, #APIDealerContractsPayResults').val('').attr("disabled",true);//clear cache on page load
	$('#EmailErrorMSG').val('');//clear cache on page load
    //***************************************************
	$("#LookupBeginDate_MRSC, #LookupEndDate_MRSC").attr("placeholder","mm/dd/yyyy").addClass("form-control").wrap("<div class='form-group full-width'></div>").wrap("<div class='input-group tg-noCorner-all'></div>");
	$("<div id='LookupBeginDate_MRSCCalendar' class='input-group-addon input-group-addon-calendar pointer' title='Choose Date'></div>").insertBefore("#LookupBeginDate_MRSC");
	$("<div id='LookupEndDate_MRSCCalendar' class='input-group-addon input-group-addon-calendar pointer' title='Choose Date'></div>").insertBefore("#LookupEndDate_MRSC");
	$("<div id='LookupBeginDate_MRSCRemove' class='input-group-addon cursorPointer removeValue' data-linked-item='#LookupBeginDate_MRSC' title='Clear Date'><span class='glyphicon glyphicon-remove-sign'></span></div>").insertAfter("#LookupBeginDate_MRSC");
	$("<div id='LookupEndDate_MRSCRemove' class='input-group-addon cursorPointer removeValue' data-linked-item='#LookupEndDate_MRSC' title='Clear Date'><span class='glyphicon glyphicon-remove-sign'></span></div>").insertAfter("#LookupEndDate_MRSC");
	
	if($('#PaySuccess').val() == 'true'){
		$('#DealerContractsPaySuccessMSGBox').slideDown();
		$('#PaySuccess').val('').trigger('change');
	}
	if($('#CancelSuccess').val() == 'true'){
		$('#DealerContractsCancelSuccessMSGBox').slideDown();
		$('#CancelSuccess').val('').trigger('change');
	}
	
	$(".removeValue").click(function(){
		$($(this).attr('data-linked-item')).val('').change();//clear associated calendar value
	});

	$("#LookupBeginDate_MRSC").datepicker({maxDate: 0,
    	onSelect: function(dates) {
			$("#LookupBeginDate_MRSC").trigger('change');//iOS doesn't understand onSelect, no one else understands onChange
		}
    });

	$("#LookupBeginDate_MRSC").change(function() {//use onChange instead of onSelect for iOS bug
		var dates = $(this).val();
		if(dates != ''){
			$('#LookupEndDate_MRSC').datepicker('option', 'minDate', dates);//date chosen so set #LookupEndDate_MRSC minDate to this date
			$('#LookupEndDate_MRSC').trigger('change');//try to update session var in case of page reload
		}
	});	
	
	$("#LookupEndDate_MRSC").datepicker({maxDate: 0,
    	onSelect: function(dates) {
			$("#LookupEndDate_MRSC").trigger('change');//iOS doesn't understand onSelect, no one else understands onChange
    	}
    });
	$("#LookupEndDate_MRSC").change(function() {//use onChange instead of onSelect for iOS bug
		var dates = $(this).val();
		if(dates != ''){
			$('#LookupBeginDate_MRSC').datepicker('option', 'maxDate', dates);//date chosen so set #LookupEndDate_MRSC maxDate to this date
		}
	});
	$('#LookupBeginDate_MRSC, #LookupEndDate_MRSC').prop('readonly', 'readonly');//prevent user from manually typing date
    $("#LookupBeginDate_MRSCCalendar").click(function(){$("#LookupBeginDate_MRSC").datepicker("show");});
	$("#LookupEndDate_MRSCCalendar").click(function(){$("#LookupEndDate_MRSC").datepicker("show");});
	
	//***************************************************
	tg.APIDealerContracts = function(){
		triggerMSDYN_API_APIDealerContractsPP();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('DealerContracts', "APIDealerContractsPP");}, tg.APItimeOutLength);//check in case APItimedOut

		return false;
	};
	//***************************************************
	tg.callAPIDealerContractsMRSC = function(){
		triggerMSDYN_API_APIDealerContractsMRSC();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('DealerContracts', "APIDealerContractsMRSC");}, tg.APItimeOutLength);//check in case APItimedOut
	};
	//***************************************************
	$('#APIDealerContractsPPResults').change(function(e) {
		console.log('APIDealerContractsPPResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;

		$('#APIDealerContractsPPResults').val($('#APIDealerContractsPPResults').val().replace(new RegExp('"Status":"Active"', 'g'), '"Status":"Processed"'));
		try{
			tg.APIDealerContractsPPResults = JSON.parse($('#APIDealerContractsPPResults').val());
		
			var ReturnInfoCode = tg.APIDealerContractsPPResults.ReturnInfo.ReturnInfoCode;
			$('#DealerContractsPPLoadingMSGBox').slideUp();
			if(ReturnInfoCode == "1000"){//successful APIGetDealer
				$('#DealerContractsErrorMSGBox').slideUp();

				tg.StyleDataTable(tg.APIDealerContractsPPResults.DealerContracts, '#table_PP', "Status|Pending|==", 'PaidDate|Status|Download|ExpiresDate|ContractNumber|ID|Cancellation');
				var temp = $('#table_PP').DataTable({retrieve: true}).rows().count();
				if( temp < 1){
					$('#DealerContractsPayBtn').hide();//hide "pay selected" button if no pending contracts
				}
				$('#table_PP_Wrap').slideDown();
				tg.callAPIDealerContractsMRSC();
			} else{
				console.log('ReturnInfoCode = '+ReturnInfoCode);
				tg.ErrorMessaging(ReturnInfoCode, "DealerContracts", "APIDealerContractsPPResults", "DealerContractsPP");//reusable logic call
				if(ReturnInfoCode == "1028"){//warnings for no data, not error
					$('#DealerContractsPayBtn, #DealerContractsCancelBtn').addClass('disabled').attr("disabled",true);
					if($.fn.DataTable.isDataTable('#table_PP')){//check if table is already a DataTable object
						$('#table_PP').DataTable().rows().remove().draw();//clear all
					}
					$('#table_PP_Wrap').slideUp();
					window.location.href="#bodyID";//warning message will jump, reset position onload
					tg.callAPIDealerContractsMRSC();
				}
			}
			
		}catch(err){
			console.log('JSON.parse(APIDealerContractsPPResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "DealerContracts", "APIDealerContractsPPResults");//reusable logic call
		}
	});// /#APIDealerContractsPPResults.change
	
	//***************************************************
	$('#APIDealerContractsMRSCResults').change(function(e) {
		console.log('APIDealerContractsMRSCResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		$('#APIDealerContractsMRSCResults').val($('#APIDealerContractsMRSCResults').val().replace(new RegExp('"Status":"Active"', 'g'), '"Status":"Processed"'));
		try{
			tg.APIDealerContractsMRSCResults = JSON.parse($('#APIDealerContractsMRSCResults').val());
			var ReturnInfoCode = tg.APIDealerContractsMRSCResults.ReturnInfo.ReturnInfoCode;
			$('#DealerContractsMRSCLoadingMSGBox').slideUp();
			var date = new Date();
			$('#searchDateRange').text('Showing data from ' + $('#MRSCStartDateQueryString').val() + ' through '+ ("0" + (date.getMonth()+1)).slice(-2)+'/'+("0" + date.getDate()).slice(-2)+'/'+date.getFullYear());				
			
			if(ReturnInfoCode == "1000"){//successful APIGetDealer
				$('#DealerContractsErrorMSGBox').slideUp();
				tg.StyleDataTable(tg.APIDealerContractsMRSCResults.DealerContracts, '#table_MRSC', "Status|Pending|!=", 'Checkbox|ID|Cancellation');

				$('#table_MRSC_Wrap').slideDown();
			}else{
				tg.ErrorMessaging(ReturnInfoCode, "DealerContracts", "APIDealerContractsMRSCResults", "DealerContractsMRSC");//reusable logic call
				if(ReturnInfoCode == "1028"){//warnings for no data, not error
					window.location.href="#bodyID";//warning message will jump, reset position onload
					$('#table_MRSC_Wrap').slideUp();
				}
			}
		}catch(err){
			console.log('JSON.parse(APIDealerContractsMRSCResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "DealerContracts", "APIDealerContractsMRSCResults");//reusable logic call
		}
	});// /#APIDealerContractsMRSCResults.change
//*********************************************************************************************************************************************************
	tg.PopulateDataTable = function(obj, i, theTable, hideColumnItems, hideColumn){
		var dataItem = {};
			if($.inArray("Spacer", hideColumnItems) === -1){dataItem.spacer = "";}
			if($.inArray("Checkbox", hideColumnItems) === -1){dataItem.checkboxT = '<input id="'+obj[i].ID+'_cb" name="'+obj[i].ID+'_cb" data-refID="'+obj[i].ID+'" type="checkbox" class="PaymentPendingCB hasCustomCheckboxSprite" /><label for="'+obj[i].ID+'_cb" class="customCheckboxSprite left"></label>';}
			if($.inArray("CustLastName", hideColumnItems) === -1){dataItem.LastName = obj[i].CustLastName;}
			if($.inArray("ID", hideColumnItems) === -1){dataItem.ID = obj[i].ID;}
			if($.inArray("ContractNumber", hideColumnItems) === -1){dataItem.ContractNumber = obj[i].SNPolicyNumber;}
			if($.inArray("CustPhone", hideColumnItems) === -1){dataItem.CustPhone = obj[i].CustPhone;}
			if($.inArray("CustZip", hideColumnItems) === -1){dataItem.CustZip = obj[i].CustZip;}
			if($.inArray("Status", hideColumnItems) === -1){dataItem.Status = obj[i].Status;}
			if($.inArray("Amount", hideColumnItems) === -1){dataItem.Amount = "$"+obj[i].Amount;}
			if($.inArray("InstallDate", hideColumnItems) === -1){dataItem.InstallDate = obj[i].InstallDate;}
			if($.inArray("ExpiresDate", hideColumnItems) === -1){dataItem.ExpiresDate = obj[i].EndDate;}
			if($.inArray("PaidDate", hideColumnItems) === -1){dataItem.PaidDate = obj[i].PaidDate;}
			if($.inArray("Download", hideColumnItems) === -1){
				if(obj[i].ContractDownloadURL != ''){
					dataItem.Download = '<a href="'+obj[i].ContractDownloadURL+'" class="acrobatIcon" target="_blank">Download</a>';
				}else{dataItem.Download = '';}//link is empty so don't render link
			}
			if($.inArray("Cancellation", hideColumnItems) === -1){
				dataItem.Cancellation = '<select id="CancelReasonDrop'+i+'" class="CancelReasonDrop" onchange="if($(this).val() == \'RC102\'){$(\'#CancelReason'+i+'\').val(\'\').change().slideDown();}else{$(\'#CancelReason'+i+'\').slideUp().val(\'\');}"><option>Please Select...</option><option value="RC100">Customer declined coverage</option><option value="RC101">Equipment Application outside ADV Selections</option><option value="RC103">Customer chose Upgrade</option><option value="RC102">Other</option></select><input type="text" id="CancelReason'+i+'" maxlength="100" data-refID="'+obj[i].ID+'" class="tgHide marginTop12 cancelReasonItem" placeholder="Reason for cancellation..." onkeypress="tg.restrictInputChars(event)"/>';
			}
		return dataItem;
	};
	tg.restrictInputChars = function(e){
		 e = e || window.event;
		var regex = new RegExp("^[a-zA-Z0-9\-\b,'$#!. ]+$");//limit to alphanumeric and spaces
		var charCode =(typeof e.which == "number") ? e.which : e.keyCode
		var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (!regex.test(key) && charCode !== 8 && charCode !== 0) {// 0 = left arrow, 8 = right arrow
		   e.preventDefault();
		   return false;
		}
	};
	//[a-zA-Z0-9]{4,25}
//*********************************************************************************************************************************************************
	tg.StyleDataTable = function(obj, theTable, theFilter, hideColumn){
		var objLength = obj.length;
		if(!hideColumn){var hideColumn;}
		var hideColumnItems = hideColumn.split('|');

//'#table_PP', "Status|Pending|==", 'PaidDate|Status|Download|ExpiresDate|ContractNumber|ID'
//'#table_MRSC', "Status|Pending|!=", 'Checkbox|ID'	
//tg.StyleDataTable(tg.APIDealerContractsMRSCResults.DealerContracts, '#table_MRSC', "Status|Pending,Cancel|!=", 'Checkbox|ID|Cancellation');

		//setup columns
		var postalName;
		try{if(session_vars.Region.toLowerCase() == "ca"){postalName="Postal";}else{postalName="Zip";}}catch(err){postalName="Zip";}
		var arrayColumns = [];
			if($.inArray("Spacer", hideColumnItems) === -1){arrayColumns.push({data: 'spacer', title:'', className: "spacer", 'orderable': false, responsivePriority: 2});}
			if($.inArray("Checkbox", hideColumnItems) === -1){arrayColumns.push({data: 'checkboxT', title:'', className: "CheckboxWrap nowrap", 'orderable': false, responsivePriority: 1});}
			if($.inArray("CustLastName", hideColumnItems) === -1){arrayColumns.push({data: 'LastName', title:'Last Name', className: "lname", responsivePriority: 3});}
			if($.inArray("ID", hideColumnItems) === -1){arrayColumns.push({data: 'ID', title:'ID'});}
			if($.inArray("ContractNumber", hideColumnItems) === -1){arrayColumns.push({data: 'ContractNumber', title:'Contract #', responsivePriority: 6});}
			if($.inArray("CustPhone", hideColumnItems) === -1){arrayColumns.push({data: 'CustPhone', title:'Phone #'});}
			if($.inArray("CustZip", hideColumnItems) === -1){arrayColumns.push({data: 'CustZip', title:postalName+' Code'});}
			if($.inArray("Status", hideColumnItems) === -1){arrayColumns.push({data: 'Status', title:'Status'});}
			if($.inArray("Amount", hideColumnItems) === -1){arrayColumns.push({data: 'Amount', title:'Amount'});}
			if($.inArray("InstallDate", hideColumnItems) === -1){arrayColumns.push({data: 'InstallDate', title:'Install Date'});}
			if($.inArray("ExpiresDate", hideColumnItems) === -1){arrayColumns.push({data: 'ExpiresDate', title:'Expires Date'});}
			if($.inArray("PaidDate", hideColumnItems) === -1){arrayColumns.push({data: 'PaidDate', title:'Paid Date'});}
			if($.inArray("Download", hideColumnItems) === -1){arrayColumns.push({data: 'Download', title:'Download Contract', 'orderable': false, responsivePriority: 5});}
			if($.inArray("Cancellation", hideColumnItems) === -1){arrayColumns.push({data: 'Cancellation', title:'Cancellation Reason', 'orderable': false, responsivePriority: 4});}

		//setup data
		var dataSet = [];
			//do i filter OUT/IN any objects or restrictions?
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
				if(fields[1].indexOf(',') > -1){fields[1] = fields[1].split(',');}
				if(Array.isArray(fields[1])){//use array to check for particular value instead of column data point
					for(i=0;i <= objLength-1; i++){
						//if(fields[1].indexOf(obj[i][fields[0]]) > -1){//.includes was too new for IE
						var count = 0;
						for(e=0;e <= fields[1].length-1; e++){
							if(fields[2] == '!=' && fields[1][e].indexOf(obj[i][fields[0]]) < 0){//in array, comparison ISNT in array
								count++;
							}else if(fields[2] == '==' && fields[1][e].indexOf(obj[i][fields[0]]) > -1){//in array, comparison IS in array
								dataSet.push(tg.PopulateDataTable(obj, i, theTable, hideColumnItems, hideColumn))
							}
						}
						if (count == fields[1].length){//NOW push != value since it passed ALL items in array
							dataSet.push(tg.PopulateDataTable(obj, i, theTable, hideColumnItems, hideColumn));
						}
					}
				}else{
					for(i=0;i <= objLength-1; i++){
						if(operator[fields[2]](obj[i][fields[0]], fields[1])){
							dataSet.push(tg.PopulateDataTable(obj, i, theTable, hideColumnItems, hideColumn));
						}
					}
				}
			}else{
				for(i=0;i <= objLength-1; i++){
					dataSet.push(tg.PopulateDataTable(obj, i, theTable, hideColumnItems, hideColumn));
				}
			}
		$(theTable+'_Wrap').slideDown();//show table area b/4 rendering it
		//init DataTable
		if($.fn.DataTable.isDataTable(theTable)){//check if table is already a DataTable object
			//clear table b/4 use
console.log('repopulate table: '+theTable);
			$(theTable).DataTable().rows().remove().draw();//clear all
			$(theTable).DataTable().rows.add(dataSet).draw();
		}else{//does NOT already exist so define it
console.log('new table: '+theTable);
			if($.inArray("Checkbox", hideColumnItems) === -1){var sortPos = 2;}
			else{var sortPos = 1;}
			var table = $(theTable).DataTable({
				"bAutoWidth": false,
				"language": {
					"search": ""
				},
				responsive: true,
				data: dataSet,
				columns: arrayColumns,
				order: [[sortPos, 'asc']]//set default sorted order to name
			});
			//don't run twice
			$(theTable+"_filter input").wrap('<div class="input-group tg-noCorner-all"></div>').attr("placeholder", "Filter Records");
			$('<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>').insertBefore(theTable+"_filter input");
		}

		if($(theTable).DataTable({retrieve: true}).rows().count() <=10){
			$(theTable+"_length, "+theTable+"_paginate").hide();
		}else{
			$(theTable+"_length, "+theTable+"_paginate").show();
		}

		return false;
	};
//*********************************************************************************************************************************************************
tg.DealerContractsPay = function(){
	$('#DealerContractsPaySuccessMSGBox').slideUp();//hide success message box incase of 2nd attempt
	$('#DealerContractsPayBtn').attr("disabled",true).addClass('disabled').text(function(){return $(this).attr('data-waitmsg')});
	$('#DealerContractsErrorMSGBox').slideUp();
	var checkedItems = new Array;
	$('#table_PP .PaymentPendingCB:checked').each(function(e) {//DataTables filtering already excludes hidden checked items
		checkedItems.push($(this).attr('data-refID'));
	});
	
	var temp="";
	if(checkedItems.length > 0){
		temp += '[';
		for(i=0;i <= checkedItems.length-1; i++){
			temp += '{"ID": "'+checkedItems[i]+'"}';
			if(i != checkedItems.length-1){temp+=',';}
		}
		temp += ']';
		$('#APIDealerContractsPayRequest').val(temp).change();
		tg.PaidItemsCount = checkedItems.length;//set count for later possible reset
		
		$("#DealerContractsPayModal").modal("show");//save for lennox?
		$('#DealerContractsPayModal').on('shown.bs.modal', function (e) {
			$('#table_Pay').DataTable().columns.adjust().draw();//force table redraw once modal is shown for responsiveness
		});
		tg.StyleDataTable(tg.APIDealerContractsPPResults.DealerContracts, '#table_Pay', "ID|"+checkedItems+"|==", 'Checkbox|PaidDate|Status|Download|ExpiresDate|ContractNumber|ID|Cancellation');
		$('#DealerContractsPayBtn').attr("disabled",false).removeClass('disabled').text(function(){return $(this).attr('data-txtmsg')});//re-enable button for modal close
	} else {
		$('#DealerContractsErrorMSG').html("<h3>No checkboxes are selected.</h3> Please make sure to select at least one checkbox that you would like to pay.");
		$('#DealerContractsErrorMSGBox').slideDown();
		$('#APIDealerContractsPayRequest').val("");
		$('#DealerContractsPayBtn').attr("disabled",false).removeClass('disabled').text(function(){return $(this).attr('data-txtmsg')});
		tg.PaidItemsCount = 0;//reset value
		window.location.href="#DealerContractsErrorMSGAnchor";
	}
	
	return false;
};
//***************************************************

tg.DealerContractsPaySubmit = function(){
	triggerMSDYN_API_APIDealerContractsPay();//local validation passed, do API call
	tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('DealerContracts','APIDealerContractsPay');}, tg.APItimeOutLength);//check in case APItimedOut
	$('#DealerContractsPayBtn').attr("disabled",false).removeClass('disabled').text(function(){return $(this).attr('data-txtmsg')});
	$("#DealerContractsPayModal").modal("hide");//hide modal and let normal error show if necessary
	
	return false;
};

	//***************************************************
	$('#APIDealerContractsPayResults').change(function(e) {
		console.log('APIDealerContractsPayResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		try{
			tg.DealerContractsPayResults = JSON.parse($('#APIDealerContractsPayResults').val());
			
			var ReturnInfoCode = tg.DealerContractsPayResults.ReturnInfo.ReturnInfoCode;
			if(ReturnInfoCode == "1000"){//successful APIDealerContractsPay
				//success
				
				var temp = $('#table_PP').DataTable({retrieve: true}).rows().count();
				temp = (temp >= 0) ? temp : 0;
				tg.PaidItemsCount = (tg.PaidItemsCount >= 0) ? tg.PaidItemsCount : 0; 
					//need to manual update pending count
					$('#PendingContractsCount').val(temp - tg.PaidItemsCount).change();
					$('#BypassUnpaidNotification').val('true').change();//uncertain if any contracts were past due so i cant properly update PendingContractsPastDueCount
					$('#PaySuccess').val('true').change();
					$('#SaveAndSubmit').click();//use this to ensure new values are saved
			}else if(ReturnInfoCode == "1043"){//no payment vehicle
				$("#PaymentSettingsSavedModal").modal("show");//save for lennox?
			}else{
				tg.ErrorMessaging(ReturnInfoCode, "DealerContracts", "APIDealerContractsPayResults");//reusable logic call
			}
		}catch(err){
			console.log('JSON.parse(APIDealerContractsPayResults error = '+err);
			//triggerMSDYN_API_APIDealer failed
			tg.ErrorMessaging("0000-JSON.parse", "DealerContracts", "APIDealerContractsPayResults");//reusable logic call
		}
	});
//*********************************************************************************************************************************************************
tg.DealerContractsCancel = function(){
	$('#DealerContractsCancelSuccessMSGBox').slideUp();//hide success message box incase of 2nd attempt
	$('#DealerContractsCancelBtn').attr("disabled",true).addClass('disabled').text(function(){return $(this).attr('data-waitmsg')});
	$('#DealerContractsErrorMSGBox').slideUp();
	var checkedItems = new Array;
	$('#table_PP .PaymentPendingCB:checked').each(function(e) {//DataTables filtering already excludes hidden checked items
		checkedItems.push($(this).attr('data-refID'));
	});
	
	var temp="";
	if(checkedItems.length > 0){
		$("#DealerContractsCancelModal").modal("show");//save for lennox?
		$('#DealerContractsCancelModal').on('shown.bs.modal', function (e) {
			$('#table_Cancel').DataTable().columns.adjust().draw();//force table redraw once modal is shown for responsiveness
		});
		tg.StyleDataTable(tg.APIDealerContractsPPResults.DealerContracts, '#table_Cancel', "ID|"+checkedItems+"|==", 'Checkbox|PaidDate|Status|Download|ExpiresDate|ContractNumber|ID|CustPhone');
		$('#DealerContractsCancelBtn').attr("disabled",false).removeClass('disabled').text(function(){return $(this).attr('data-txtmsg')});//re-enable button for modal close
	} else {
		$('#DealerContractsErrorMSG').html("<h3>No checkboxes are selected.</h3> Please make sure to select at least one checkbox that you would like to cancel.");
		$('#DealerContractsErrorMSGBox').slideDown();
		$('#APIDealerContractsCancelRequest').val("");
		$('#DealerContractsCancelBtn').attr("disabled",false).removeClass('disabled').text(function(){return $(this).attr('data-txtmsg')});
		tg.CancelItemsCount = 0;//reset value
		window.location.href="#DealerContractsErrorMSGAnchor";
	}
	
	return false;
};
//***************************************************
tg.DealerContractsCancelSubmit = function(){

	console.log('#DealerContractsCancelSubmitBtn click...');
	var err = 0;
	$('#DealerContractsCancelErrorGenericMSGBox').slideUp();
	$('#DealerContractsCancelSubmitBtn').attr("disabled",true).addClass('disabled').val(function(){return $(this).attr('data-waitmsg')});
		
	var count = $('#table_Cancel .CancelReasonDrop').length;
	
	$("#table_Cancel .CancelReasonDrop").each(function(){
		if($(this).val() == "Please Select..."){err++;tg.flagError("#"+$(this).attr('id'));}
		else if($(this).val() == "RC102" && $(this).next(".cancelReasonItem").val() == ""){err++;tg.flagError("#"+$(this).next(".cancelReasonItem").attr('id'));}
	});
	
	if(err===0){
		console.log('#DealerContractsCancelSubmitBtn no errors found');
		$('#DealerContractsCancelErrorMSGBox').slideUp()
		var temp = '[';
		$("#table_Cancel .CancelReasonDrop").each(function(i){
			temp += '{"ID": "'+$(this).next('.cancelReasonItem').attr('data-refID')+'", "Reason": "'+$(this).val()+'", "OtherDesc": "'+$(this).next('.cancelReasonItem').val()+'"}';
			if((i+1) < count){temp+=',';}
		});
		temp += ']';
		$('#APIDealerContractsCancelRequest').val(temp).change();
		triggerMSDYN_API_APIDealerContractsCancelPending();//local validation passed, do API call
		tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('DealerContracts','APIDealerContractsCancel');}, tg.APItimeOutLength);//check in case APItimedOut
		$('#DealerContractsCancelSubmitBtn').attr("disabled",false).removeClass('disabled').text(function(){return $(this).attr('data-txtmsg')});//re-enable 1st cancel modal button incase of modal open
		tg.CancelItemsCount = count;//set count for later possible reset

	}else{
		console.log('#DealerContractsCancelSubmitBtn errors found...');
		$('#DealerContractsCancelErrorMSGBox').slideDown();
		//$("#DealerContractsCancelModal").modal("hide");//hide to show error
		window.location.href="#DealerContractsCancelErrorAnchor";
		$('#DealerContractsCancelSubmitBtn').attr("disabled",false).removeClass('disabled').val(function(){return $(this).attr('data-txtmsg')});
		
	}// if err===0
	
	return false;
};

	//***************************************************
	$('#APIDealerContractsCancelResults').change(function(e) {
		console.log('APIDealerContractsCancelResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		try{
			tg.DealerContractsCancelResults = JSON.parse($('#APIDealerContractsCancelResults').val());
			
			var ReturnInfoCode = tg.DealerContractsCancelResults.ReturnInfo.ReturnInfoCode;
			if(ReturnInfoCode == "1000"){//successful APIGetDealer
				//success
				
				var temp = $('#table_PP').DataTable({retrieve: true}).rows().count();
				temp = (temp >= 0) ? temp : 0;
				tg.CancelItemsCount = (tg.CancelItemsCount >= 0) ? tg.CancelItemsCount : 0; 
					//need to manual update pending count
					$('#PendingContractsCount').val(temp - tg.CancelItemsCount);
					$('#BypassUnpaidNotification').val('true');//uncertain if any contracts were past due so i cant properly update PendingContractsPastDueCount
					$('#CancelSuccess').val('true');
					$('#SaveAndSubmit').click();//use this to ensure new values are saved
			}else{
				$("#DealerContractsCancelModal").modal("hide");//hide to show error
				tg.ErrorMessaging(ReturnInfoCode, "DealerContracts", "APIDealerContractsCancelResults");//reusable logic call
			}
		}catch(err){
			$("#DealerContractsCancelModal").modal("hide");//hide to show error
			console.log('JSON.parse(APIDealerContractsCancelResults error = '+err);
			//triggerMSDYN_API_APIDealer failed
			tg.ErrorMessaging("0000-JSON.parse", "DealerContracts", "APIDealerContractsCancelResults");//reusable logic call
		}
	});
	//***************************************************
	$('#DealerContractsPayBtn').click(function(e) {
		tg.DealerContractsPay();
		return false;
	});
	//***************************************************
	$('#DealerContractsPaySubmitBtn').click(function(e) {
		tg.DealerContractsPaySubmit();
		return false;
	});
	//***************************************************
	$('#DealerContractsCancelBtn').click(function(e) {
		tg.DealerContractsCancel();
		return false;
	});
	//***************************************************
	$('#DealerContractsCancelSubmitBtn').click(function(e) {
		tg.DealerContractsCancelSubmit();
		return false;
	});
//*********************************************************************************************************************************************************
	tg.checkAllVisibleCheckboxes = function(theTable, theToggle){
		try{
			if($(theToggle).is(":checked")){
				$(theTable+" .PaymentPendingCB:visible").each(function(){
					$(this).prop('checked', true);
				});
			}else{
				$(theTable+" .PaymentPendingCB:visible").each(function(){
					$(this).prop('checked', false);
				});
			}
		}catch(err){}
		return false;
	};
//***************************************************
	$('#MostRecentSoldBtn').click(function(e) {
		tg.APIDealerContracts_search();
		return false;
	});
	$("#MostRecentSoldForm").submit(function(event) {//use this to capture enter keys so it submits DealerSignIn form rather than stream form
		event.preventDefault();//don't submit, but let onclick take over
		tg.APIDealerContracts_search();
		return;
	});

//***************************************************
	tg.APIDealerContracts_search = function(){
		
		$('#MostRecentSoldBtn').attr("disabled",true).addClass('disabled').val(function(){return $(this).attr('data-waitmsg')});
		$('#MostRecentSoldErrorMSGBox').slideUp();
		$('#MostRecentSoldWarningMSGBox').slideUp();
		$('#LookupQueryString').val('&ContractID='+$('#LookupContractID_MRSC').val()+'&LastName='+$('#LookupLastName_MRSC').val()+'&PhoneNumber='+$('#LookupPhoneNumber_MRSC').val()+'&SerialNumber='+$('#LookupSerialNumber_MRSC').val()+'&BeginDate='+$('#LookupBeginDate_MRSC').val()+'&EndDate='+$('#LookupEndDate_MRSC').val());
				
		if($('#LookupQueryString').val().length <70){
			$('#MostRecentSoldErrorMSG').html("<h3>No search parameters were provided.</h3> Please make sure to enter search criteria for at least one item below.");
			$('#MostRecentSoldErrorMSGBox').slideDown();
			$('#LookupQueryString').val("");//clear the lookup value
			$('#MostRecentSoldBtn').attr("disabled",false).removeClass('disabled').val(function(){return $(this).attr('data-txtmsg')});
			window.location.href="#MostRecentSoldErrorMSGAnchor";		
			
		} else {
			triggerMSDYN_API_APIDealerContractsSearch();//local validation passed, do API call
			tg.APItimeOutWatch = setTimeout(function(){tg.APItimedOut('MostRecentSold','APIDealerContractsSearch');}, tg.APItimeOutLength);//check in case APItimedOut
		}

		return false;
	};
	//***************************************************
	$('#APIDealerContractsSearchResults').change(function(e) {
		console.log('APIDealerContractsSearchResults changed');
		clearTimeout(tg.APItimeOutWatch);//stop APItimedOut
		tg.APItimeOutWatch = null;
		
		$('#APIDealerContractsSearchResults').val($('#APIDealerContractsSearchResults').val().replace(new RegExp('"Status":"Active"', 'g'), '"Status":"Processed"'));
		try{tg.DealerContractsSearchResults = JSON.parse($('#APIDealerContractsSearchResults').val());}
		catch(err){
			console.log('JSON.parse(APIDealerContractsSearchResults error = '+err);
			tg.ErrorMessaging("0000-JSON.parse", "MostRecentSold", "APIDealerContractsSearchResults");//reusable logic call
		}
		
		var ReturnInfoCode = tg.DealerContractsSearchResults.ReturnInfo.ReturnInfoCode;
		$('#MostRecentSoldBtn').removeClass('disabled').attr("disabled",false).val(function(){return $(this).attr('data-txtmsg')});// re-enable button for further searches
		//update dates display
		var MRSCBD = $('#LookupBeginDate_MRSC').val();
		var MRSCED = $('#LookupEndDate_MRSC').val();
		MRSCBD = MRSCBD !="" ? MRSCBD : "first enrollment";
		MRSCED = MRSCED !="" ? MRSCED : "today";
		$('#searchDateRange').text('Showing data from ' + MRSCBD + ' through '+ MRSCED);
		
		if(ReturnInfoCode == "1000"){//successful APIGetDealer;
			//success			
			tg.StyleDataTable(tg.DealerContractsSearchResults.DealerContracts, '#table_MRSC', "Status|Pending|!=", 'Checkbox|ID|Cancellation');
			$("#MostRecentSoldModal").modal("hide");
			$('#DealerContractsMRSCWarningMSGBox').slideUp();//hide warning box
		}else if(ReturnInfoCode == "1028"){//no data found
				$('#MostRecentSoldWarningMSGBox').slideDown();
				window.location.href="#MostRecentSoldWarningMSGAnchor";
				$('#MostRecentSoldErrorMSGBox').slideUp();
		}else{
			tg.ErrorMessaging(ReturnInfoCode, "MostRecentSold", "APIDealerContractsSearchResults");//reusable logic call
		}
		
	});// /#APIDealerContractsSearchResults.change
//***************************************************
	var date = new Date();//today
	var endDate = new Date(date.setDate(date.getDate() - 90));
	$('#MRSCStartDateQueryString').val(("0" + (endDate.getMonth()+1)).slice(-2)+'/01/'+endDate.getFullYear()).change();//limit MRSCResults to 1st of 3months ago 
	tg.APIDealerContracts();//initialize 2 tables on page load
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