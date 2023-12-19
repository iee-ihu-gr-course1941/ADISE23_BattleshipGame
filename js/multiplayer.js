// Using JQuery to handle Multiplayer Battleship Game:
var me={ nickname: null, token: null, player_number: null };
var players;
//var player_number;
var score={ me: 0, opponent: 0}
var game_status={};
var timer=null;
var last_update=new Date().getTime();
var surrendered=false;

$(function() {
  
  $('#start').click(login_to_game); // Login.
  $('.game').hide();
  $('#reset_game').hide();
  $('.div-game-inf').hide();

  // Ready Button.
  $('#ready-btn').click(function() {
    // Retrieving values from input fields.
    
    $.ajax({url: "battleship.php/board/set_ships/", 
    method: 'POST',
    dataType: "json",
    headers: { "X-Token": me.token },
    contentType: 'application/json',
    data: JSON.stringify({
      destroyer_coord1: $('#destroyer-coord1').val(), 
      destroyer_coord2: $('#destroyer-coord2').val(), 
      submarine_coord1: $('#submarine-coord1').val(), 
      submarine_coord2: $('#submarine-coord2').val(), 
      submarine_coord3: $('#submarine-coord3').val(), 
      cruiser_coord1: $('#cruiser-coord1').val(), 
      cruiser_coord2: $('#cruiser-coord2').val(), 
      cruiser_coord3: $('#cruiser-coord3').val(), 
      battleship_coord1: $('#battleship-coord1').val(), 
      battleship_coord2: $('#battleship-coord2').val(),
      battleship_coord3: $('#battleship-coord3').val(), 
      battleship_coord4: $('#battleship-coord4').val(), 
      carrier_coord1: $('#carrier-coord1').val(), 
      carrier_coord2: $('#carrier-coord2').val(), 
      carrier_coord3: $('#carrier-coord3').val(), 
      carrier_coord4: $('#carrier-coord4').val(), 
      carrier_coord5: $('#carrier-coord5').val()
    }),
    success: game_status_update,
    error: show_error});

   //set_ships(destroyer_coord1, destroyer_coord2, submarine_coord1, submarine_coord2, submarine_coord3, cruiser_coord1, cruiser_coord2, cruiser_coord3, battleship_coord1, battleship_coord2, battleship_coord3, battleship_coord4, carrier_coord1, carrier_coord2, carrier_coord3, carrier_coord4, carrier_coord5);
  });

  // Reset Button.
  $('#reset_game').click(function() {
    surrendered=true;
    reset_boards(); 
  });
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
    $('#customAlert').removeClass('custom-alert error show');

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
  
  } else {
    // Displaying the Alert Message.
    $('#customAlert').addClass('custom-alert error show');
    $('#customAlert').find('p').text("You must select player & your name must contain at least 3 to 10 alphabetic characters!");
    return;
  }

  $.ajax({
    url: "battleship.php/players/",
    method: 'POST',
    dataType: 'json',
    headers: { "X-Token": me.token },
    contentType: 'application/json',
    data: JSON.stringify({
      username: $('#nameOfUser').val(),
      player_number: $('#player_select').val()
    }),
    success: login_result,
    error: show_error});
}

// Ajax Request for the player to set the ships.
// function set_ships(destroyer_coord1, destroyer_coord2, submarine_coord1, submarine_coord2, submarine_coord3, cruiser_coord1, cruiser_coord2, cruiser_coord3, battleship_coord1, battleship_coord2, battleship_coord3, battleship_coord4, carrier_coord1, carrier_coord2, carrier_coord3, carrier_coord4, carrier_coord5) {
// 	VARlayer_number = me.player_number;

// 	$.ajax({url: "battleship.php/board/set_ships/", 
//       method: 'POST',
// 			dataType: "json",
// 			headers: { "X-Token": me.token },
// 			contentType: 'application/json',
// 			data: JSON.stringify( {destroyer_coord1, destroyer_coord2, submarine_coord1, submarine_coord2, submarine_coord3, cruiser_coord1, cruiser_coord2, cruiser_coord3, battleship_coord1, battleship_coord2, battleship_coord3, battleship_coord4, carrier_coord1, carrier_coord2, carrier_coord3, carrier_coord4, carrier_coord5, player_number}),
// 			success: game_status_update,
//       error: show_error});
// }

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
		$.ajax({url: "battleship.php/board/",
		headers: {"X-Token": me.token},
		method: 'POST'});
	}

	me = { nickname: null, token: null, color_picked: null };
 
  $('.home').show(150);
  $('.game').hide(150);
  $('#reset_game').hide(150);
  $('.div-game-inf').hide(150);

  game_status_update();
}

// Importing player details and updating games_status.
function login_result(data) {
  me = data[0];

  // Starting the Battle.
  $('.home').hide();
  $('.game').show();
  $('#reset_game').show();
  $('.div-game-inf').show();

	// Listener that resets the game when the user refresh or close the page.
	window.addEventListener("beforeunload", function(e) {
		reset_boards();
  }, false);

	update_info();
	game_status_update();
}

function show_error(data) {
  // Displaying an Alert/Error Message.
  var x = data.responseJSON;
	alert(x.errormesg);
}

// Ajax Request for game_status.
function game_status_update() {
  
	clearTimeout(timer);

	$.ajax({url: "battleship.php/status/", 
	success: update_status, 
	headers: {"X-Token": me.token}});
}

// Updating Info of players.
function update_info() {

  var player;
  var player_turn;
  var opponent;

	if (me.player_number =='p1') {
		player='Player 1';
	} else {
    player='Player 2';
  }
	
	if (game_status.player_turn=='p1') {
    player_turn='Player 1';
	} else { 
    player_turn='Player 2';
  }

	if (players==null) {
		opponent="Opponent";
	} else {
		if (me.player_number=='p1') {
			opponent=players[1].username;
		} else if (me.player_number=='p2') {
			opponent=players[0].username;
		} 
	}

	if(game_status.status=='started' && me.token!=null) {
		if (players==null) {
			$('#game_info').html("<h4><b> Score:</h4></b>" + me.username + ": " + score.me + "</br>Enemy: " + score.opponent + '<br/> <br/> <h4>Game Status:</h4>Game state: '
			+ game_status.status + '<b>');
		} else {
			$('#game_info').html("<h4><b> Score:</h4></b>" + me.username + ": " + score.me + "</br>"+ opponent + ": " + score.opponent + '<br/> <br/> <h4>Game Status:</h4>Game state: '
			+ game_status.status + '<b>');
		}

		if (game_status.player_turn==me.player_number) {
			$('#player_turn').html("<h6> It's </b> your turn to play now.</h6>");
		} else {  
			$('#player_turn').html("<h6> It's " + opponent +"'s</b> turn to play now.</h6>");
		}
	} else {
    $('#game_info').html("<h4><b> Score:</h4></b>"  + me.username + ": " + score.me + "</br>Enemy: " + score.opponent + '<br/> <br/> <h4>Game Status:</h4>Game state: '+ game_status.status);
    $('#player_turn').html("<h6>Playing as " + player + "</h6>");
    }
}

function update_status(data) {
	if (data==null) {
		return;
	}

	last_update=new Date().getTime();
	var game_status_old = game_status;
	game_status=data[0];
	var winner = game_status.result;
	update_info();
	clearTimeout(timer);
	
	if (me.token!=null) {
		$('#reset_game').show();
	} else {
		$('#reset_game').hide();
	}

  // No player Found during the deadline of 60". (initialized -> not active).
	if (game_status_old.status=='initialized' && game_status.status=='not active' && me.token!=null) {
		alert("No player Found. Reset the game.");
		reset_boards();
	}

	// Getting Enemy's Username.
	if (game_status_old.status==null && game_status.status=='started' && me.token!=null) { 
		$.ajax({url: "battleship.php/players/", 
			success: function (data) {
        players = data;
			}, 
			headers: {"X-Token": me.token}});
	} else if (game_status_old.status=='initialized' && game_status.status=='started') {
		$.ajax({url: "battleship.php/players/", 
			success: function (data) {
				players = data;
			}, 
			headers: {"X-Token": me.token}});
	}

  // Enemy left the game (ended -> not active).
	if (game_status_old.status=='ended' && game_status.status=='not active') {
		if (surrendered==false) { 
      alert("Enemy left the game."); 
    }
		score.me=0; 
    score.opponent=0;
		reset_boards();
	}
	
  // Enemy surrender (started -> not active)
	if(game_status_old.status=='started' && game_status.status=='not active') {
		if (!surrendered) { 
      alert("Enemy surrendered. Game restarted"); 
    } else { 
      surrendered=false; 
    };
		score.me=0; 
    score.opponent=0;
		reset_boards();
		document.querySelector('#reset_game').setAttribute('value','Reset');
		update_info();
	}
		
	if (game_status.status=='started' && me.token!=null) {
		document.querySelector('#reset_game').setAttribute('value','Surrender');
	}
	
	if (game_status.status == 'aborded' && game_status_old.status != 'aborded') {
		update_info();
		opponent_aborded(game_status);
		update_info();
    reset_boards();
		return;
	}
	
	if (game_status.status == 'ended' && game_status_old.status != 'started') {
    alert_winner();
		update_status();
		update_info();
		return;
  } else { 
    timer= setTimeout(function() { game_status_update(); }, 500); 
	}

  // Udating players for aborded.
  function opponent_aborded(data) {
    var who_left = data.result;
    if (me.token!=null) {
      if (who_left==me.player_number) {
        alert("You aborded the game.");
      } else {
        alert("Enemy aborded the game.");
      }
    }
  }

  // Updating the Player info (Win or Loss) and Score.
  // function alert_winner() {
  //   winner = game_status.result;
  //   if (me.token!=null) {
  //     if (winner==me.player_number) {
  //       score.me++;
  //       play_again('You win!');
  //     } else {
  //       score.opponent++;
  //       play_again('Enemy wins...');
  //     }
  //   }
  // }
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
sr.reveal('.back-button', { delay: 500, origin: 'top' });
sr.reveal('.music-button', { delay: 500, origin: 'top' });
sr.reveal('#game-title', { delay: 500, origin: 'top' });
sr.reveal('#game-mode', { delay: 500, origin: 'top' });
sr.reveal('#game-img', { delay: 1500, origin: 'right' });
sr.reveal('#nameOfUser ', { delay: 2500, origin: 'left' });
sr.reveal('#player_select', { delay: 3500, origin: 'right' });
sr.reveal('#start', { delay: 4500, origin: 'bottom' });