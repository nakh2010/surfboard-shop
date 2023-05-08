  $(document).ready(function () {
    var droppyDownAnimSpeed = 500;
    $(".quickbuy-toggle").click(function (e) {
            console.log('aaaaa');
      var pageWidth = $(window).width(),
      productUrl = $(this).attr('href');
      if (pageWidth > 767) {
          var $block = $(this).closest('.product-block'),
          $detailCont = null,
          $quickbuyCont = null,
          $slider = $(this).closest('.collection-slider'),
          $sliderRow = null;
  
          // do different things if it's inside a slideshow
          if ($slider.length > 0) {
            $sliderRow = $slider.closest('.collection-slider-row');
            // slider without detail
            if ($sliderRow.find('.quickbuy-container').length === 0) {
              return;
            }
            $quickbuyCont = $sliderRow.find('.quickbuy-container');
          } else {
            $quickbuyCont = $block.find('.quickbuy-container');
          }
          $detailCont = $quickbuyCont.find('.inner');

           // toggle active class on block
          if ($block.toggleClass('expanded').hasClass('expanded')) {
            console.log('aaaasaswewqsadada');
            // expanding
            /*
            if ($slider.length > 0) {
              // if another block is expanded, remove its expanded class
              var noneExpanded = $slider.find('.product-block.expanded').not($block).removeClass('expanded').length === 0;
  
              // if expanding from empty, set initial detail container height to 0
              if (noneExpanded) {
                $quickbuyCont.height(0);
              } else {
                // unload existing quickbuy
                $('.product-form', $quickbuyCont).trigger('unload-product-form');
                $('.gallery', $quickbuyCont).off(this.namespace);
                $('.slideshow', $quickbuyCont).slick('unslick');
                // unload components
                unloadComponents($quickbuyCont);
              }
  
              // what to adjust when details change size
              $quickbuyCont.off('changedsize').on('changedsize', function () {
                $quickbuyCont.stop().animate({
                  height: $detailCont.outerHeight() },
                droppyDownAnimSpeed);
              });
            } else {
              // close expanded siblings
              var $expandedSiblings = $block.siblings('.expanded');
  
              $expandedSiblings.each(function () {
                contractDetail($(this), 0);
  
                // unload existing quickbuy
                $('.product-form', this).trigger('unload-product-form');
                Shopify.destroyProductGallery(this);
                // unload components
                unloadComponents(this);
              });
  
              // what do adjust when details change size
              $quickbuyCont.off('changedsize').on('changedsize', function () {
                // check expanded class in case it's mid close transition
                if ($block.hasClass('expanded')) {
                  var targetHeight = $detailCont.outerHeight();
                  // slide down instantly if a neighbour is expanded
                  var speed = $expandedSiblings.length > 0 ? 0 : droppyDownAnimSpeed;
                  $block.stop().animate({
                    paddingBottom: targetHeight + 20 },
                  speed); // extra for gap underneath
                  $quickbuyCont.stop().animate({ height: targetHeight }, speed);
                }
              });
          
            }
            */
           
  
            // add spinner
            $detailCont.html('<div class="loading-spinner"></div>');
            $quickbuyCont.trigger('changedsize');
  
            // load in content
            var urlPro = $(this).attr('href');
            $.ajax({
              type: "GET",
              url: urlPro,
              success: function (result) {
                var $newDetail = $('<div>' + response + '</div>').find('.quickbuy-content');
  
                // convert to quickbuy content
                $newDetail.find('.more').attr('href', productUrl);
                $newDetail.find('.detail .title').wrapInner($('<a>').attr('href', productUrl));
                $newDetail.find('.show-gallery').removeClass('show-gallery').attr('href', productUrl);
                $newDetail.find('.not-in-quickbuy').remove();
                $newDetail.find('.only-in-quickbuy').removeClass('only-in-quickbuy');
                $newDetail.find('.sticky-content-container').removeClass('sticky-content-container');
                $newDetail.find('.store-availability-container').remove();
                $newDetail.find('[data-enable-history-state="true"]').attr('data-enable-history-state', 'false');
                $newDetail.find('.gallery .thumbnails').removeClass('mobile-only');
                ['gallery--layout-carousel-beside', 'gallery--layout-columns-1', 'gallery--layout-columns-2', 'gallery--layout-collage-1', 'gallery--layout-collage-2'].forEach(cl => {
                  $newDetail.find('.' + cl).removeClass(cl).addClass('gallery--layout-carousel-under');
                });
    
                // resize after images load, if present
                $newDetail.find('.rte img').on('load', function () {
                  $quickbuyCont.trigger('changedsize');
                  $(this).off('load');
                });
    
                $detailCont.html($newDetail);
              },
            });

  
            // enable close button
            $quickbuyCont.find('.close-detail').removeAttr('tabindex');
  
            // scroll to appropriate position
            // qb: top of quick buy
            // bl: top of product block
            var scrollMode = 'qb';
            var scrollOffset = -120;
  
            if ($('.section-header').css('position') == 'sticky') {
              scrollOffset -= $('.section-header').height();
            }
  
            if (scrollMode == 'qb') {
              $('html:not(:animated),body:not(:animated)').animate({ scrollTop: $quickbuyCont.offset().top + scrollOffset }, 500);
            } else {
              if ($slider.length > 0) {
                // simple for slider
                $('html:not(:animated),body:not(:animated)').animate({ scrollTop: $block.offset().top }, 500);
              } else {
                // need to use top of block when no quickbuys are visible
                saveCollectionPageData();
                var offsetTop = typeof $block.data('offsetTop') != 'undefined' ? $block.data('offsetTop') : $block.offset().top;
                $('html:not(:animated),body:not(:animated)').animate({ scrollTop: offsetTop + scrollOffset }, 500);
              }
            }
          } else {
            // close
            unloadComponents($quickbuyCont);
            if ($slider.length > 0) {
              // collapse detail container
              $quickbuyCont.stop().animate({ height: 0 }, droppyDownAnimSpeed, function () {
                // remove details
                $detailCont.empty();
              });
            } else {
              contractDetail($block, droppyDownAnimSpeed);
            }
  
            // scroll to top of closing block
            var scrollUpOffset = -140;
            $('html:not(:animated),body:not(:animated)').animate({ scrollTop: $block.offset().top + scrollUpOffset }, 500);
  
            // disable close button
            $quickbuyCont.find('.close-detail').attr('tabindex', '-1');
          }
  
          return false;
      }

      e.preventDefault();         	 
      	return false;   

    });

  });

// utility function for quickbuy (closes all quickbuys in passed blocks, in a collection grid)

function contractDetail($blocks, speed) {
  if ($blocks.length > 0) {
    $blocks.removeClass('expanded');
    $blocks.find('.quickbuy-container').stop().animate({ height: 0 }, speed, function () {
      $(this).find('.inner').empty();
    });
    $blocks.stop().each(function () {
      $(this).animate({ paddingBottom: 0 }, speed);
    });
  }
}
// handle components
function loadComponents(componentContainer) {
  $(componentContainer).closest('[data-components]').each(function () {
    $(this).data('components').split(',').forEach(component => {
      $(document).trigger('cc:component:load', [component, componentContainer]);
    });
  });
  $(componentContainer).find('.cc-accordion').on('transitionend.qbLoadComponents', function () {
    $(this).closest('.quickbuy-container').trigger('changedsize');
  });

  $(document).trigger('cc:component:load', ['custom-select', '.quickbuy-container']);
}

function unloadComponents(componentContainer) {
  $(componentContainer).find('.cc-accordion').off('.qbLoadComponents');
  $(componentContainer).closest('[data-components]').each(function () {
    $(this).data('components').split(',').forEach(component => {
      $(document).trigger('cc:component:unload', [component, componentContainer]);
    });
  });
}

function saveCollectionPageData() {
  $('.collection-listing').each(function () {
    var $blocks = $(this).find('.product-block');
    if ($blocks.length <= 1) return true; // Skip for empty colls
    var row = 0;
    var currTop = 0;
    //Heights are fixed. Check two in case somebody has expanded one...
    var blockHeight = Math.min($blocks.first().outerHeight(), $($blocks[1]).outerHeight());
    var blockPageOffset = $blocks.first().offset().top;
    $blocks.each(function (index) {
      var currOffsetTop = $(this).offset().top;
      if (index == 0) {
        currTop = currOffsetTop;
      } else {
        if (currOffsetTop > currTop) {
          row++;
          currTop = currOffsetTop;
        }
      }
      $(this).data({
        offsetTop: blockPageOffset + row * blockHeight });

    });
  });
}

var loadQuickbuy = function () {
    //Close button event
    $(document).on('click', '.quickbuy-container .close-detail', function () {
      var $slider = $(this).closest('.collection-slider-row');
      if ($slider.length) {
        $slider.find('.product-block.expanded .quickbuy-toggle:first').trigger('click');
      } else {
        $(this).closest('.product-block').find('.quickbuy-toggle:first').trigger('click');
      }
      return false;
    });

    //You also need to know where to scroll to
    
  };

loadQuickbuy();
