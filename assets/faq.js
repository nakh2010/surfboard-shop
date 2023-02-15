$(function () {
    $(".lsn-faq_body:not(:first-of-type)").css("display", "none");
    $(".lsn-faq_question:first-of-type").addClass("open");
   
    $(".lsn-faq-question").click(function () {
      $(".open").not(this).removeClass("open").next().slideUp(300);
      $(this).toggleClass("open").next().slideToggle(300);
    });
  });