// Battleship Game - Multiplayer:

const startButton = document.getElementById('start');

// Connection Variables:
var me={ nickname: null, token: null, player_number: null };
var players;
var score={ me: 0, opponent: 0}
var game_status={};
var timer=null;
var last_update=new Date().getTime();
var surrendered=false;
var sounds=true;

// Starting Battle:
startButton.addEventListener('click', () => {
  // User's Name taken through form's input:
  var nameInput = document.getElementById('nameOfUser');
  var name = nameInput.value.trim();
  // User's Selected player taken through form:
  var select = document.getElementById('player_select');
  var selectedValue = select.options[select.selectedIndex].value;
  // Alert Message:
  var customAlert = document.getElementById('customAlert');

  // Performing additional validation.
  if (/^[A-Za-z]{3,10}$/.test(name) && (selectedValue == 'p1' || selectedValue == 'p2')) {
    // Hide Alert Message.
    customAlert.className = 'custom-alert';

    // Starting Battle.
    document.querySelector('.home').classList.add('ocultar');
    document.querySelector('.home').classList.remove('home');
    document.querySelector('.game').classList.remove('ocultar');

    // Adding User's name to board's text.
    var outputName = document.getElementById('addNameOfUser');
    outputName.innerHTML = name;
    
    login_to_game(); // <<< Login to game.

  } else {
    // Displaying the Alert Message.
    customAlert.className = 'custom-alert error show';
    customAlert.querySelector('p').textContent = "You must select player & your name must contain at least 3 to 10 alphabetic characters!";
  }
});

// Ajax Request for reseting/cleaning the boards.
function reset_boards() {

	clearTimeout(timer);
	if (game_status.status!='not active') {
		$.ajax({url: "battleship.php/boards/",
		headers: {"X-Token": me.token},
		method: 'POST'});
	}
	me = { nickname: null, token: null, color_picked: null };
 
  game_status_update();

  location.reload(); // Reloads the page.
}


// Ajax Request for login.
function login_to_game() {

	$.ajax({url: "battleship.php/players/", 
			method: 'POST',
			dataType: 'json',
			headers: {"X-Token": me.token},
			contentType: 'application/json',
			data: JSON.stringify( {
				username: $('#nameOfUser').val(), 
				player_number: $('#player_select').val()
			}),
			success: login_result,
			error: show_error});
}


// Importing player details and updating games_status.
function login_result(data) {

  me = data[0];

	// Listener that resets the game when the user refresh or close the page.
	window.addEventListener("beforeunload", function(e) {
		reset_boards();
  }, false);

	//update_info();
	game_status_update();
}


function show_error(data) {

  // Displaying an Alert/Error Message.
  var customAlert = document.getElementById('customAlert');
	var x = data.responseJSON;

  customAlert.className = 'custom-alert error show';
  customAlert.querySelector('p').textContent = "Oh no. An error accured: " + x.errormesg;
}


// Ajax Request for game_status.
function game_status_update() {
  
	clearTimeout(timer);

	$.ajax({url: "battleship.php/status/", 
	success: update_status, 
	headers: {"X-Token": me.token}});
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
sr.reveal('#game-title', { delay: 500, origin: 'top' });
sr.reveal('#game-mode', { delay: 500, origin: 'top' });
sr.reveal('#game-img', { delay: 1500, origin: 'right' });
sr.reveal('#nameOfUser ', { delay: 2500, origin: 'left' });
sr.reveal('#player_select', { delay: 3500, origin: 'right' });
sr.reveal('#start', { delay: 4500, origin: 'bottom' });