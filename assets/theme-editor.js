document.addEventListener('shopify:block:select', function(event) {
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockSelectedIsSlide) return;

  const parentSlideshowComponent = event.target.closest('slideshow-component');
  parentSlideshowComponent.pause();

  setTimeout(function() {
    parentSlideshowComponent.slider.scrollTo({
      left: event.target.offsetLeft
    });
  }, 200);
});

document.addEventListener('shopify:block:deselect', function(event) {
  const blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockDeselectedIsSlide) return;
  const parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play();
});

//custom slideshow index
$(document).on('shopify:section:unload', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).find('.slideshow-section');

  slideshowSection.find('.lsn-slideshow').slick('unslick');
  
});

$(document).on('shopify:section:load', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).find('.slideshow-section');

  var slideshow = slideshowSection.find('.lsn-slideshow');

});

$(document).on('shopify:block:select', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).closest('.slideshow-section');

  var slideshow = slideshowSection.find('.lsn-slideshow');

  slideshow.slick('goTo', $(event.target).attr('data-slide-index'));

  if (slideshow.attr('data-autoplay') === 'true') {
    slideshow.slick('pause');
  }
  
});

$(document).on('shopify:block:deselect', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).closest('.slideshow-section');

  var slideshow = slideshowSection.find('.lsn-slideshow');

  if (slideshow.attr('data-autoplay') === 'true') {
    slideshow.slick('play');
  }
  
});