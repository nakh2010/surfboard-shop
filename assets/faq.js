$(function () {
    $(".lsn-faq-item:not(:first-of-type) .lsn-js-faq-body").css("display", "none");
    $(".lsn-faq-item:first-of-type .lsn-faq-question").addClass("open");
   
    $(".lsn-faq-question").click(function () {
      $(".open").not(this).removeClass("open").next().slideUp(300);
      $(this).toggleClass("open").next().slideToggle(300);
    });
  });