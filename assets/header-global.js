var headerHeight = $('#shopify-section-header').outerHeight();
console.log('headerHeight='+headerHeight);
$(".template-index #MainContent").css('position','relative').css('top','-'+headerHeight+'px');