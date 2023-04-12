var modal = document.getElementById("popup-form");

// Get the popup_close element that closes the modal
var popup_close = document.getElementsByClassName("popup-close-button")[0];

const myTimeout = setTimeout(showPopup, 5000);

function showPopup() {
  modal.style.display = "block";
}

// When the user clicks on popup_close (x), close the modal
popup_close.onclick = function() {
  jQuery.cookie('popup-newsletter', 'Yes');
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    jQuery.cookie('popup-newsletter', 'Yes');
    modal.style.display = "none";
  }
}



function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

$(document).ready(function() {

  var check_cookie = getCookie('popup-newsletter');
  console.log(check_cookie);
  
  var time_expired = 60;
  var date = new Date();
  date.setTime(date.getTime() + (time_expired * 60 * 24 * 1000));


  if(check_cookie == ''){
    setCookie('popup-newsletter','expire_1_day',1);
    setTimeout(function(){ showPopup(); }, 3000);
  }

});
