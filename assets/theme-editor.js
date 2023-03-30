
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

$(function () {
    slick_slider();
});

$(document).on("shopify:section:load", function () {
    slick_slider();
});

$(document).on("shopify:section:unload", function () {
  slick_slider();
});

$(document).on("shopify:section:select", function () {
  slick_slider();
});

$(document).on("shopify:section:deselect", function () {
  slick_slider();
});

function slick_slider() {
  $(".lsn-slideshow").not(".slick-initialized").slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow:
      "<div class='slick-prev'><i class='fas fa-angle-left'></i></div>",
    nextArrow:
      "<div class='slick-next'><i class='fas fa-angle-right'></i></div>",
  });
}

document.addEventListener('shopify:block:select', function(event) {

  var indexItem = event.target.getAttribute("data-index");
  console.log('lsn-slideshow indexItem'+indexItem);
  var slideshowSection = $(event.target).find('.slideshow-section');
  slideshowSection.find('.lsn-slideshow').slick('slickGoTo', indexItem, false);
  
});

$(document).on('shopify:section:select', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).find('.slideshow-section');

  setTimeout(function() {
    console.log('lsn-slideshow select');
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
  }, 200);

});

$(document).on('shopify:section:load', '.shopify-section__slideshow', function(event) {
  var slideshowSection = $(event.target).find('.slideshow-section');

  setTimeout(function() {
    console.log('lsn-slideshow load');
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
  }, 500);

});
