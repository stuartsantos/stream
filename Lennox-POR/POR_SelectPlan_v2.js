//SELECT-A-PLAN
$('.TierSelectionModal').attr('id','TierSelectionModal').attr('tabindex','-1').attr('aria-labelledby','myModalLabel');//run b/4 bootstrap js ready

//IE IsInterger fix
Number.isInteger = Number.isInteger || function(value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; };
//Run this b/4 AIGDM_Shared_wBootstrap.js document.ready runs...
//******************************************************************************************************
//******************************************************************************************************
if(session_vars.Channel == "POR"){//Is POR
	//update consider savings icosn
	try{
		if(session_vars.Brand == "Lennox"){
			for(i=1;i <= $('#ConsiderTheSavings img').length; i++){
				$('#ConsiderTheSavings img').eq(i-1).attr('src','/uploads/00001941/Lennox-icon-total-protection'+i+'.png');
			}
			$('#TotalProductProtection').removeClass('colorDarkBlue').addClass('colorMaroon');
		}		
	}catch(err){}
	//******************************************************************************************************
	//create object of offers and organize into tiers
	try{tg.GetHVACPackageResults = JSON.parse($('#APIGetHVACPackageResults').val());}catch(err){console.log('JSON.parse(APIGetHVACPackageResults error = '+err);}
	var offers = tg.GetHVACPackageResults.Offers.reduce(function (r, a) {
		r[a.Tier] = r[a.Tier] || [];
		r[a.Tier].push(a);
		return r;
	}, Object.create(null));

	//******************************************************************************************************
	//sort offers by Term
	function srt(desc,key) {
		return function(a,b){
			return desc ? ~~(key ? parseFloat(a[key]) < parseFloat(b[key]) : parseFloat(a) < parseFloat(b)) : ~~(key ? parseFloat(a[key]) > parseFloat(b[key]) : parseFloat(a) > parseFloat(b));
		};
	}
	//******************************************************************************************************
	tg.setupSortOffers = function(){
		for(i=0;i<=Object.keys(offers).length;i++){
			try{
				var temp = offers[i];
				if(temp !== undefined){
					temp.sort(srt(null,'Term'));
					offers[i] = temp;
				}
			}catch(err){console.log('err='+err);}
		}
		//**************************************
		tg.sortedOffers = Object.keys(offers).map(function(key) {//cannot access Object by position so convert reference to array
			return [Number(key), offers[key]];
		});
		if(tg.sortedOffers.length == 1){
			var sorted = tg.sortedOffers[0][1].sort(
			  function(a, b) {
				// compare Term
				if (a.Term < b.Term)
				  return -1;
				else if (a.Term > b.Term)
				  return 1;
				// Term were equal, try Price
				if (parseFloat(a.Price) < parseFloat(b.Price)){
				  return -1;
				}else if (parseFloat(a.Price) > parseFloat(b.Price)){
				  return 1;
				}else{
					return 0;
				}
			  }
			);
		}//object sorted doesn't seem to work properly for just one set of Tier offers so manually resort.
		//tg.sortedOffers[Term#][Term Name (always use '1')][Offer #].Price | or: tg.sortedOffers[i][1][e].Price | or: tg.sortedOffers[1][1][0].Price
		//tg.sortedOffers.length
	
	}
	//******************************************************************************************************
	tg.createOfferTemplates = function(e){
		$("#selectPlanRadios").slideUp(400, function() {//animate/hide
			$("#selectPlanRadios > .row").html("");//clear current offers
			for(i=0;i <= tg.sortedOffers[e-1][1].length-1; i++){
				try{
					$("#offer").clone().attr('id','offer'+i).addClass('col-sm-'+(Math.floor(12/tg.sortedOffers[e-1][1].length))).appendTo("#selectPlanRadios > .row");//round down incase of 5/7 products
					$("#offer"+i+' .selectPlanTitle').text(tg.sortedOffers[e-1][1][i].Term + " - ");
					$("#offer"+i+' input').val(i).attr("id","radio"+tg.sortedOffers[e-1][1][i].Term.replace(/ +/g, "")+tg.sortedOffers[e-1][1][i].PaymentOption.replace(/ +/g, ""));
					$("#offer"+i+' .planFrequency').text(tg.sortedOffers[e-1][1][i].PaymentOption);
					switch (tg.sortedOffers[e-1][1][i].PaymentOption){
						case "Monthly":
							$("<sup>3</sup>").insertAfter("#offer"+i+' .planFrequency');
							break;
						case "3 Payments":
							$("<sup>4</sup>").insertAfter("#offer"+i+' .planFrequency');
							break;
						default: break;
					}
					$("#offer"+i+' .planPrice').text(tg.sortedOffers[e-1][1][i].Price);
					$("#offer"+i+' label.form-control').attr("for","radio"+tg.sortedOffers[e-1][1][i].Term.replace(/ +/g, "")+tg.sortedOffers[e-1][1][i].PaymentOption.replace(/ +/g, "")).attr("id", "planPrice"+tg.sortedOffers[e-1][1][i].Term.replace(/ +/g, "")+tg.sortedOffers[e-1][1][i].PaymentOption.replace(/ +/g, ""));
					if(session_vars.IsDealerEval != "Y"){$("#offer"+i+' .sectionContent').addClass("padBottom0 padTop0");}
				}catch(err){}
			}
			if(tg.sortedOffers[e-1][1].length-1 == 0){//only one item so remove block style
				$("#offer0 .sectionWrap").removeClass('block').addClass('inline-block');
			}

			for(i=tg.sortedOffers[e-1][1].length-1;i >= 0 ; i--){
				try{
					if(session_vars.OEMWarrantyLabor == "3" && i == 0 && session_vars.IsDealerEval != "Y"){//set first consumer product to best value
						$("#offer0 .selectPlanDuration").removeClass("hidden-xs").html("Best Value");
						$("#offer0 .selectPlanDuration2").html("Save Up to 30%");
						tg.bestPosition = i;//use for auto select
						//$("#offer0 .sectionContent").removeClass("pad24").addClass("padLeft24 padRight24 padBottom0 padTop0");
						break;
					}else if(tg.sortedOffers[e-1][1][i].Term.charAt(0) == 3){
						$("#offer"+i+" .selectPlanDuration").removeClass("hidden-xs").html("Best Value");
						$("#offer"+i+" .selectPlanDuration2").html("Save Up to 30%");
						tg.bestPosition = i;//use for auto select
						//$("#offer"+i+" .sectionContent").removeClass("pad24").addClass("padLeft24 padRight24 padBottom0 padTop0");
						break;
					}

				}catch(err){console.log('best value text error: '+err);}
			}
			
			$("#selectPlanRadios").delay(500).slideDown(400, function() {//animate/show
				if(tg.sortedOffers.length > 1){$('#PlanLevelsWrap').show();}//wait till now to show to prevent css reshuffle
				equalheight("#selectPlanRadios .cardTH");//run on init
				equalheight("#selectPlanRadios .selectPlanDuration");//run on init
				equalheight("#selectPlanRadios .selectPlanDuration2");
				$(window).resize(function() {
					equalheight("#selectPlanRadios .cardTH");
					equalheight("#selectPlanRadios .selectPlanDuration");
					equalheight("#selectPlanRadios .selectPlanDuration2");
				});
			});// /slideDown
			
			//** Reconfigure new radio buttons
$("#selectPlanRadios input[type=radio]").off( "change", "**" );//destroy any previous change events?
			$("#selectPlanRadios input[type=radio]").change(function(){
				$(this).closest('.tg-flipswitch-wrap').find(".form-group").removeClass('active');
				$(this).closest('.form-group').addClass('active');
				var thisVal = $(this).val();
				var PlanLevelsVal = $('#PlanLevels input[name=radio-selectTier]:checked').val();
				//PlanLevelsVal = (PlanLevelsVal == undefined) ? 1 : PlanLevelsVal;//andoid issue, reads as undefined sometimes
				$('#SelectedPackageName').val(tg.sortedOffers[PlanLevelsVal-1][1][$(this).val()].ProductIndicator);
				$('#SelectedPackagePrice').val(tg.sortedOffers[PlanLevelsVal-1][1][$(this).val()].Price);
				$('#SelectedPackageCoverage').val(tg.sortedOffers[PlanLevelsVal-1][1][$(this).val()].Term);
				$('#SelectedPackageFrequency').val(tg.sortedOffers[PlanLevelsVal-1][1][$(this).val()].PaymentOption);
				$('#SelectedPackageTier').val(tg.sortedOffers[PlanLevelsVal-1][1][$(this).val()].Tier);
				switch (tg.sortedOffers[PlanLevelsVal-1][1][$(this).val()].PaymentOption){
					case "Monthly":
						$('#SelectedPackageAbrev').val("/mo");
						break;
					case "Full Pay":
						$('#SelectedPackageAbrev').val("/one time payment");
						break;
					case "3 Payments":
						$('#SelectedPackageAbrev').val(" x3 payments");
						break;
					default :
						$('#SelectedPackageAbrev').val("");
					break;
				}
			});// /change()
			//set or reselect default
			if(session_vars.SelectedPackageName){
				tg.foundPackage = false;
				loop1:
				for(i=0; i<=$('#selectPlanRadios input[type=radio]').length-1;i++){
					loop2:
					try{
						loop3:
						if(session_vars.SelectedPackageName == tg.sortedOffers[$('#PlanLevels input[name=radio-selectTier]:checked').val()-1][1][i].ProductIndicator && !tg.foundPackage){
							$("#planPrice"+$("#selectPlanRadios input[type=radio]").eq(i).attr('id').split('radio')[1]).trigger("click");
							tg.foundPackage = true;
							break loop1;
						}
					}catch(err){break loop2;}
				}
				if(!tg.foundPackage && Number.isInteger(tg.bestPosition)){
					$("#selectPlanRadios > .row > div:nth-child("+(tg.bestPosition+1)+") label:last-child").trigger("click");
					tg.bestPosition = null;
				}
			} else if(Number.isInteger(tg.bestPosition)){
				$("#selectPlanRadios > .row > div:nth-child("+(tg.bestPosition+1)+") label:last-child").trigger("click");
				tg.bestPosition = null;
			}
			//$("#selectPlanRadios input[type=radio]:checked").prop("checked",true).trigger("change");//manual trigger in case of browser history

		});// /slideUp
	};//tg.createOfferTemplates
	$(document).ready(function() {
		//******************************************************************************************************
		tg.setupSortOffers();//init
		//******************************************************************************************************
		for(i=1;i <= tg.sortedOffers.length; i++){//setup the Tier radio button offers
			try{
				var temp;
				if(session_vars.Brand == "Lennox" && i == 1){temp = "Basic";}
				else if(session_vars.Brand == "Lennox"){temp = "Tier "+ (i-1);}
				else{temp = "Plan "+ i-1;}
				$("#PlanLevels").append('<div class="inline-block nowrap TierChoice"></div>');
				$("#TierRadios > input").clone().attr('id','radio-selectTier'+i).val(i).appendTo("#PlanLevels > div:nth-child("+i+")");
				$("#TierRadios > label").clone().attr('for','radio-selectTier'+i).appendTo("#PlanLevels > div:nth-child("+i+")");
				$("#PlanLevels > div:nth-child("+i+") > label:nth-child(3)").text(temp);
			}catch(err){console.log('error = '+err);}
		}
		//Setup plan level radio onchange ********************************************************
		$("#PlanLevels input[type=radio]").change(function(){
			tg.createOfferTemplates($(this).val());
			$('#SelectedPackageName, #SelectedPackagePrice, #SelectedPackageCoverage, #SelectedPackageFrequency, #SelectedPackageTier, #SelectedPackageTermPos, #SelectedPackageAbrev').val("");//clear selected values on tier change
		});
		//setup default display onload
		if(session_vars.SelectedPackageTier && session_vars.SelectedPackageTier <= $('#PlanLevels input[name=radio-selectTier]').length){
			$('#PlanLevels > .TierChoice:nth-child('+session_vars.SelectedPackageTier+') > label').trigger("click");//try to reselect previous choice if possible
		}else{
			$('#PlanLevels > .TierChoice:last-child > label').trigger("click");//init to max on load and show items
		}
	});// /$(document).ready
	//******************************************************************************************************
}//Is POR

//******************************************************************************************************
//******************************************************************************************************
$(document).ready(function() {
	//correct the history so back button works
	history.replaceState(null, null, location.protocol+'//'+session_vars.CurrentHost+'/index.php?Page=Select-a-Plan');
	$('.modal').on('show.bs.modal', function (e) {$(window).scrollTop(0);});// set scroll position to 0 when opening scroll
//***************************************************************************
	$('#selectPlan_Button').click(function(e) {
		if($('#selectPlanRadios input[type=radio]').is(':checked') && $('#SelectedPackageName').val() != ""){
			$('#selectPlanError').slideUp();
			$('#btnNext').trigger("click");//works to submit form
		}else{
			$('#selectPlanError').slideDown();
			window.location.href="#selectPlanError";
		}
		return false;
	});
	$('#navigatorCircle1').addClass('current');
if(session_vars.Channel == "AM"){
	//Setup radios ********************************************************
		//copy product sku into radio buttons
		$("#radio-1c").val('Package1');
		$("#radio-2c").val('Package2');
		$("#radio-3c").val('Package3');
		$("#radio-4c").val('Package4');

	//Setup package object ********************************************************
	var PackageObject = { 
		Package1: {SelectedPackageName: $('#PackageSKU1').val(), SelectedPackagePrice: $('#Price1YearFull').val(),SelectedPackageCoverage: 1, SelectedPackageFrequency: "Full", SelectedPackageAbrev: "/one time payment"}, 
		Package2: {SelectedPackageName: $('#PackageSKU2').val(), SelectedPackagePrice: $('#Price1YearInstallment').val(), SelectedPackageCoverage: 1, SelectedPackageFrequency: "Monthly", SelectedPackageAbrev: "/mo"},
		Package3: {SelectedPackageName: $('#PackageSKU3').val(), SelectedPackagePrice: $('#Price3YearFull').val(), SelectedPackageCoverage: 3, SelectedPackageFrequency: "Full", SelectedPackageAbrev: "/one time payment"}, 
		Package4: {SelectedPackageName: $('#PackageSKU4').val(), SelectedPackagePrice: $('#Price3YearInstallment').val(), SelectedPackageCoverage: 3, SelectedPackageFrequency: "3 Payments", SelectedPackageAbrev: " x3 payments"} 
	}
	//note: to customize hardcoded package values, we can write if statement to update values:
	//PackageObject['Package2']['SelectedPackageCoverage'] = "4";//update object value

	//Setup radio onclick ********************************************************
		$("#selectPlanRadios input[type=radio]").change(function(){
			$('#SelectedPackageName').val(PackageObject[$(this).val()]['SelectedPackageName']);
			$('#SelectedPackagePrice').val(PackageObject[$(this).val()]['SelectedPackagePrice']);
			$('#SelectedPackageCoverage').val(PackageObject[$(this).val()]['SelectedPackageCoverage']);
			$('#SelectedPackageFrequency').val(PackageObject[$(this).val()]['SelectedPackageFrequency']);
			$('#SelectedPackageAbrev').val(PackageObject[$(this).val()]['SelectedPackageAbrev']);
			//$('#SelectedPackageSKU').val(PackageObject[$(this).val()]['SelectedPackageSKU']);
		});
	//assign values to SelectAPlan ********************************************************
	//note: to rearrange plan order just write if statement to pivot off of session_vars.Brand
	$('#plan1Frequency').html(PackageObject['Package1']['SelectedPackageFrequency']+' Pay');
	$('#plan1Price').html(PackageObject['Package1']['SelectedPackagePrice']);
	$('#plan2Frequency').html(PackageObject['Package2']['SelectedPackageFrequency']+' Pay');
	$('#plan2Price').html(PackageObject['Package2']['SelectedPackagePrice']);
	$('#plan3Frequency').html(PackageObject['Package3']['SelectedPackageFrequency']+' Pay');
	$('#plan3Price').html(PackageObject['Package3']['SelectedPackagePrice']);
	$('#plan4Frequency').html(PackageObject['Package4']['SelectedPackageFrequency']+'<sup class="smallest">4</sup>');
	$('#plan4Price').html(PackageObject['Package4']['SelectedPackagePrice']);
	
	//Setup radio default status********************************************************
	if($('#SelectedPackageName').val() != ""){//trigger click in case user refreshes page
		for(i=1;i<5;i++){
			if($('#SelectedPackageName').val() == PackageObject['Package'+i]['SelectedPackageName']){
				$('input[name=radio-selectPlan]:input[type=radio]:eq('+(i-1)+')').trigger("click");
				break;
			}
		}
	} else {//set default selected to 3rd option
		$('input[name=radio-selectPlan]:input[type=radio]:eq(2)').trigger("click");
	}
	//Setup product display********************************************************
	if(session_vars.IsDealerEval == "Y"){
		$("#offer1").css("display","none");//hide on dealer
		$("#offer2, #offer3").removeClass("col-sm-4").addClass("col-sm-6");//change to two col design on dealer
		$("#offer3 .sectionWrap, #offer2 .sectionWrap").removeClass("desktopMinWidth200").addClass('desktopMinWidth300 mobileOnlyMaxWidth300');		
		$("#offer3 .form-group:nth-child(2), #offer3 .row .selectPlanPayFrequency:nth-child(2)").remove();//hide monthly payment option
		$("#offer3 .row .selectPlanPayFrequency").removeClass("col-xs-6");//hide monthly payment description
	}
	equalheight("#selectPlanRadios .cardTH");//run on init
	equalheight("#selectPlanRadios .cardBH");//run on init
    $(window).resize(function() {
		equalheight("#selectPlanRadios .cardTH");
		equalheight("#selectPlanRadios .cardBH");
    });
}//Is AM


//***************************************************************************
	if($('#CovProduct1Brand').val() !==""){$('#coveredProductsWrap').append("<span>"+$('#CovProduct1Brand').val()+" - "+$('#CovProduct1Description').val()+"</span>");}
	if($('#CovProduct2Brand').val() !==""){$('#coveredProductsWrap').append("<span>, "+$('#CovProduct2Brand').val()+" - "+$('#CovProduct2Description').val()+"</span>");}
	if($('#CovProduct3Brand').val() !==""){$('#coveredProductsWrap').append("<span>, "+$('#CovProduct3Brand').val()+" - "+$('#CovProduct3Description').val()+"</span>");}
	if($('#CovProduct4Brand').val() !==""){$('#coveredProductsWrap').append("<span>, "+$('#CovProduct4Brand').val()+" - "+$('#CovProduct4Description').val()+"</span>");}
	if($('#CovProduct5Brand').val() !==""){$('#coveredProductsWrap').append("<span>, "+$('#CovProduct5Brand').val()+" - "+$('#CovProduct5Description').val()+"</span>");}

//***************************************************************************
	convertDate = function(oldDate){
		var date = new Date(oldDate.replace(/-/g, '\/'));
		var year = date.getFullYear();
		if(year < 2000){year=year+100;}
		var month = (1 + date.getMonth()).toString();
		month = month.length > 1 ? month : '0' + month;
		var day = date.getDate().toString();
		day = day.length > 1 ? day : '0' + day;
		
		if(isNaN(year) || isNaN(month) || isNaN(day)){return " ";}
		else{return year+month+day;}
	}
	//attempt to covert dates FROM yyyy-mm-dd TO mm-dd-yyyy
	for(i=1;i<=5;i++){
		eval('var temp=session_vars.CovProduct'+i+'PurchaseDate;');
		if (typeof temp != 'undefined'){
			$('#CovProduct'+i+'PurchaseDateEval').val(convertDate(temp));
		}else{
			$('#CovProduct'+i+'PurchaseDateEval').val(' ');
		}
	}
//***************************************************************************

});// /$(document).ready
//***************************************************************************
$(window).load(function() {

//***************************************************************************
//Custom Slider code:
	tg.customSliderItemCount = $('#customSlider .customSliderCell').length;
	tg.customSliderViewCount=parseInt($('#customSlider').attr('data-customSliderViewCount'));//reset for mobile views
	tg.customSliderViewPosition=0;
	$('#customSlider').addClass('atMinPos');
	$('#customSlider .customSliderLeftBtn').click(function(e) {
		if(tg.customSliderViewPosition<=0){console.log('view at min');$('#customSlider').addClass('atMinPos');}else{//check current pos
			tg.customSliderViewPosition--;
			tg.customSliderPosSet();
			$('#customSlider').removeClass('atMaxPos');
			if(tg.customSliderViewPosition<=0){$('#customSlider').addClass('atMinPos');}
		}//check current pos
		
		return false;
	});
	$('#customSlider .customSliderRightBtn').click(function(e) {
		if(tg.customSliderViewPosition+tg.customSliderViewCount >= tg.customSliderItemCount){console.log('view at max');$('#customSlider').addClass('atMaxPos');}else{//check current pos
			tg.customSliderViewPosition++;
			tg.customSliderPosSet();
			$('#customSlider').removeClass('atMinPos');
			if(tg.customSliderViewPosition+tg.customSliderViewCount >= tg.customSliderItemCount){$('#customSlider').addClass('atMaxPos');}
		}
		return false;
	});
	tg.customSliderPosSet = function(){
		if($('#bodyID').hasClass('isDesktop')){
			tg.customSliderViewCount=parseInt($('#customSlider').attr('data-customSliderViewCount'));//reset for mobile views
			if(tg.customSliderViewPosition+tg.customSliderViewCount >= tg.customSliderItemCount){$('#customSlider').addClass("atMaxPos");}//make sure right button shows when appropriate
		}
		if($('#bodyID').hasClass('isMobile')){
			tg.customSliderViewCount=1;//reset for mobile views
			if(tg.customSliderViewPosition < tg.customSliderItemCount){$('#customSlider').removeClass("atMaxPos");}//make sure right button shows when appropriate
		}
		tg.customSliderViewWidth = 100 / tg.customSliderViewCount;//reset the widths if mobile or desktop resize
		//$('#customSlider .divTable').css("width",(tg.customSliderViewWidth*tg.customSliderItemCount)+"%");//set the table width according to customSliderViewWidth
		if(tg.customSliderViewPosition+tg.customSliderViewCount >= tg.customSliderItemCount){tg.customSliderViewPosition = tg.customSliderItemCount - tg.customSliderViewCount;}//make sure shift from mobile to desktop isn't too far first
		$('#customSlider .customSliderWrap .customSliderCell').css("width",tg.customSliderViewWidth+"%");//reset the widths
		//$('#customSlider .customSliderWrap').css("margin-left","-"+(tg.customSliderViewWidth*tg.customSliderViewPosition)+"%");//set the offset
		$('#customSlider .customSliderWrap .customSliderCell:first-of-type').animate({marginLeft: "-"+(tg.customSliderViewWidth*tg.customSliderViewPosition)+"%"}, 500);
		return false;
	}

	$(window).resize(function() {tg.waitForFinalEvent(function(){tg.customSliderPosSet();}, 500, 'customSliderPosSet');});//resize for desktop/mobile
	tg.customSliderPosSet();//init on page load
	
});// /$(window).load

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
//***************************************************************************
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