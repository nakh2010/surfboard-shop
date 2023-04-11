var modal = document.getElementById("popup-form");

// Get the popup_close element that closes the modal
var popup_close = document.getElementsByClassName("popup-close-button")[0];

const myTimeout = setTimeout(showPopup, 5000);

function showPopup() {
  modal.style.display = "block";
}

// When the user clicks on popup_close (x), close the modal
popup_close.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}