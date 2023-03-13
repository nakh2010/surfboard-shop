var headerHeight = $('#shopify-section-header').outerHeight();
//$(".template-index #MainContent").css('position','relative').css('top','-'+headerHeight+'px');

$("#close-menu").click(function(){
  $(this).closest('#Details-menu-drawer-container').find('#open-menu').trigger("click");
});

