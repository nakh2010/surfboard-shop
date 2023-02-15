$(function () {
    $(".open .lsn-js-faq-body:not(:first-of-type)").css("display", "none");
    $(".lsn-faq-question:first-of-type").css("display", "block");
   
    $(".lsn-faq-question").click(function () {
      $(".open").not(this).removeClass("open").next().slideUp(300);
      $(this).toggleClass("open").next().slideToggle(300);
    });
  });