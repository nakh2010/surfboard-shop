
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
document.addEventListener('shopify:section:select', function(event) {
  var slideshowSection = event.target.classList.contains('lsn-slideshow');

  console.log('hero slideshow');
  var parentSlideshowComponent = event.target.closest('slideshow-index');
  slideshowSection.slick({
    slidesToShow: 1,
    fade: true,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
    dots: true,
    autoplaySpeed: 3000,
  });

});

document.addEventListener('shopify:section:deselect', function(event) {
  var slideshowSection = event.target.classList.contains('lsn-slideshow');

  var parentSlideshowComponent = event.target.closest('slideshow-index');
  slideshowSection.slick('unslick');
  
});



$(document).on('shopify:section:unload', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).find('.slideshow-section');

  slideshowSection.find('.lsn-slideshow').slick('unslick');
  
});

$(document).on('shopify:section:load', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).find('.slideshow-section');

  var slideshow = slideshowSection.find('.lsn-slideshow');
  slideshowSection.find('.lsn-slideshow').slick({
    slidesToShow: 1,
    fade: true,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
    dots: true,
    autoplaySpeed: 3000,
  });

});
