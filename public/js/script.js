//Responsive Navigation Menu:
let menu = document.querySelector('#menu-icon');
let navList = document.querySelector('.navList');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navList.classList.toggle('open');
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
sr.reveal('.responsive-nav', { delay: 500, origin: 'top' });
sr.reveal('.home-text', { delay: 1500, origin: 'top' });
sr.reveal('.game-image', { delay: 2500, origin: 'top' });
sr.reveal('.scroll-down', { delay: 3500, origin: 'right' });