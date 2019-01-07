/*@preserve - equalheight - 
*/
/* equalheight - http://css-tricks.com/equal-height-blocks-in-rows/ * uses .actual('height') jquery plugin instead to account for hidden items */
(function(){
	equalheight=function(container){var currentTallest=0,currentRowStart=0,rowDivs=new Array(),$el,topPosition=0;$(container).each(function(){$el=$(this);$($el).height('auto');topPostion=$el.position().top;if(currentRowStart!=topPostion){for(currentDiv=0;currentDiv<rowDivs.length;currentDiv++){rowDivs[currentDiv].height(currentTallest);}rowDivs.length=0;currentRowStart=topPostion;currentTallest=$el.actual('height');rowDivs.push($el);}else{rowDivs.push($el);currentTallest=(currentTallest<$el.actual('height'))?($el.actual('height')):(currentTallest);}for(currentDiv=0;currentDiv<rowDivs.length;currentDiv++){rowDivs[currentDiv].height(currentTallest);}});}
	return false;
})()