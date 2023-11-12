// Color Mode Changer (betweem Light Mode <-> Dark Mode):
function toggleDarkMode() {
    // Game Board Color.
    var gameBoard = document.getElementById("game-board");
    gameBoard.classList.toggle("dark-mode");
}

//Using 'ScrollReveal' by https://github.com/jlmakes/scrollreveal):
//Creating ScrollReveal:
const sr = ScrollReveal({
    distance: '65px',
    duration: 2600,
    delay: 450,
    reset: true
});
//Calling Reveal Methods:
sr.reveal('.color-mode', { delay: 500, origin: 'top' });
sr.reveal('.game-title', { delay: 500, origin: 'top' });
sr.reveal('.game-mode', { delay: 500, origin: 'top' });
sr.reveal('.game-img', { delay: 500, origin: 'top' });