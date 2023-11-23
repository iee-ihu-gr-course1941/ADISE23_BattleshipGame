// Responsive Navigation Menu:
let menu = document.querySelector('#menu-icon');
let navList = document.querySelector('.navList');

menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navList.classList.toggle('open');
}

/* When the user clicks on the button, toggle 
between hiding and showing the dropdown content */
function DropDownOnClick() {
  document.getElementById("myDropdown").classList.toggle("show");
}
// Close the dropdown if the user clicks outside of it.
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Color Mode Changer (betweem Light Mode <-> Dark Mode):
function toggleDarkMode() {
  // Dark Color Characteristics:
  var gameBoard = document.getElementById("game-board");
  var infoPlr = document.querySelector(".game .info-gamers #plr");
  var infoCpu = document.querySelector(".game .info-gamers #cpu");
  var rotateBtn = document.querySelector(".game .hidden-info button");
  gameBoard.classList.toggle("dark-mode");
  infoPlr.classList.toggle("dark-mode");
  infoCpu.classList.toggle("dark-mode");
  rotateBtn.classList.toggle("dark-mode");
}

// If I select my option player, then it will change color to black:
function selectedOpt() {
  var select = document.getElementById('player_select');
  var selectedValue = select.options[select.selectedIndex].value;

  if (selectedValue == 'p1' || selectedValue == 'p2') {
    select.style.color = 'black';
  }
}

// Using 'ScrollReveal' by https://github.com/jlmakes/scrollreveal):
// Creating ScrollReveal:
const sr = ScrollReveal({
  distance: '65px',
  duration: 2600,
  delay: 450,
  reset: true
});
// Calling Reveal Methods:
sr.reveal('.responsive-nav', { delay: 500, origin: 'top' });
sr.reveal('.home-text', { delay: 1500, origin: 'top' });
sr.reveal('.rules-text', { delay: 1500, origin: 'top' });
sr.reveal('.about-text', { delay: 1500, origin: 'top' });
sr.reveal('.game-image', { delay: 2500, origin: 'top' });
sr.reveal('.goto-github', { delay: 3500, origin: 'right' });
sr.reveal('.ft', { delay: 4500, origin: 'left' });