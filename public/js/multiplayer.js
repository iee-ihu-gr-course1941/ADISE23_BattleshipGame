// Using JQuery to handle Multiplayer Battleship Game:
var me={ nickname: null, token: null, player_number: null };
var players;
var score={ me: 0, opponent: 0}
var game_status={};
var timer=null;
var last_update=new Date().getTime();
var surrendered=false;
// var sounds=true;

$(function() {
  
  $('#start').click(login_to_game); // Login.

});

// Ajax Request for login.
function login_to_game() {

  // User's Name taken through form's input:
  var name = $('#nameOfUser').val().trim();

  // User's Selected player taken through form:
  var selectedValue = $('#player_select').val();

  // Performing additional validation.
  if (/^[A-Za-z]{3,10}$/.test(name) && (selectedValue == 'p1' || selectedValue == 'p2')) {
    // Hide Alert Message
    $('#customAlert').removeClass('custom-alert');

    // Starting Battle.
    $('.home').addClass('ocultar');
    $('.home').removeClass('home');
    $('.game').removeClass('ocultar');

    var outputName = $('#addNameOfUser');
    var outputName2 = $('#addNameOfUser2');

    // Adding User's name to board's text.
    if (selectedValue == 'p1') {
      outputName.text(name);
      outputName2.text('Enemy');
      $('.ship-area .player-ships .ship .clr').addClass('one')
    } else if (selectedValue == 'p2') {
      outputName.text('Enemy');
      outputName2.text(name);
      $('.ship-area .player-ships .ship .clr').addClass('two')
    }

    // $.ajax({
    //   url: "battleship.php/players/",
    //   method: 'POST',
    //   dataType: 'json',
    //   headers: { "X-Token": me.token },
    //   contentType: 'application/json',
    //   data: JSON.stringify({
    //     username: $('#nameOfUser').val(),
    //     player_number: $('#player_select').val()
    //   }),
    //   success: login_result,
    //   error: show_error
    // });
    
  } else {
    // Displaying the Alert Message.
    $('#customAlert').addClass('custom-alert error show');
    $('#customAlert').find('p').text("You must select player & your name must contain at least 3 to 10 alphabetic characters!");
  }
}

// Ajax Request for the player to set the ships.
function set_ships(destroyer_coord1, destroyer_coord2, submarine_coord1, submarine_coord2, submarine_coord3, cruiser_coord1, cruiser_coord2, cruiser_coord3, battleship_coord1, battleship_coord2, battleship_coord3, battleship_coord4, carrier_coord1, carrier_coord2, carrier_coord3, carrier_coord4, carrier_coord5) {
	player_number = me.player_number;

	$.ajax({url: "battleship.php/board/set_ships/", 
      method: 'POST',
			dataType: "json",
			headers: { "X-Token": me.token },
			contentType: 'application/json',
			data: JSON.stringify( {destroyer_coord1, destroyer_coord2, submarine_coord1, submarine_coord2, submarine_coord3, cruiser_coord1, cruiser_coord2, cruiser_coord3, battleship_coord1, battleship_coord2, battleship_coord3, battleship_coord4, carrier_coord1, carrier_coord2, carrier_coord3, carrier_coord4, carrier_coord5, player_number}),
			success: game_status_update});
}

// Ajax Request for the player's move.
function do_move(choice) {
	player_number = me.player_number;

	$.ajax({url: "battleship.php/board/make_move/", 
			method: 'POST',
			dataType: "json",
			headers: { "X-Token": me.token },
			contentType: 'application/json',
			data: JSON.stringify( {choice, player_number}),
			success: game_status_update});
}

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

  location.reload();
}


// Importing player details and updating games_status.
function login_result(data) {

  // Starting Battle.
  //$('.home').addClass('ocultar');
  //$('.home').removeClass('home');
  //$('.game').removeClass('ocultar');

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
  var customAlert = $('#customAlert');
  var x = data.responseJSON;
  
  customAlert.addClass('custom-alert error show');
  customAlert.find('p').text("Oh no. An error occurred: " + x.errormesg);
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
// sr.reveal('#game-title', { delay: 500, origin: 'top' });
// sr.reveal('#game-mode', { delay: 500, origin: 'top' });
// sr.reveal('#game-img', { delay: 1500, origin: 'right' });
// sr.reveal('#nameOfUser ', { delay: 2500, origin: 'left' });
// sr.reveal('#player_select', { delay: 3500, origin: 'right' });
// sr.reveal('#start', { delay: 4500, origin: 'bottom' });
sr.reveal('.back-button', { delay: 100, origin: 'left' });
sr.reveal('.music-button', { delay: 100, origin: 'right' });