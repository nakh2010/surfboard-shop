$(function () {
    $(".lsn-faq-question").click(function () {
      $(".open").not(this).removeClass("open").next().slideUp(300);
      $(this).toggleClass("open").next().slideToggle(300);
    });
  });