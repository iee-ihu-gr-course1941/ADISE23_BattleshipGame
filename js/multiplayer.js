// Using JQuery to handle Multiplayer Battleship Game:
var me={ nickname: null, token: null, player_number: null };
var players;
var player;
var player_turn;
var opponent;
var player_number
var game_status={};
var timer = null;
var last_update = new Date().getTime();
var surrendered = false;
var selectedValue;

$(function() {
  
  // Start Button (onclick).
  $('#start').click(login_to_game); // Login.
  $('.game').hide();
  $('#reset_game').hide();
  $('.div-game-inf').hide();
  $('#ready-btn').hide();
  $('.ship-area').hide();
  $('.gameController').hide();
  $('.me').hide();

  // Ready Button (onclick).
  $('#ready-btn').click(set_ships); // Set Ships.

  player1_hits(); // Possible hits of player 1.
  player2_hits(); // Possible hits of player 2.

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
  selectedValue = $('#player_select').val();

  // Performing additional validation.
  if (/^[A-Za-z]{3,10}$/.test(name) && (selectedValue == 'p1' || selectedValue == 'p2')) {
    // Hide Alert Message
    $('#customAlert').removeClass('custom-alert error show');
    $('#customAlert').find('p').text("");

    var outputName = $('#addNameOfUser');
    var outputName2 = $('#addNameOfUser2');

    // Adding User's name to board's text.
    if (selectedValue == 'p1') {
      outputName.text(name);
      outputName2.text('Enemy');
      $('.ship-area .player-ships .ship .clr').addClass('one');
    } else if (selectedValue == 'p2') {
      outputName.text('Enemy');
      outputName2.text(name);
      $('.ship-area .player-ships .ship .clr').addClass('two');
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
function set_ships() {

  // Destroyer coordinates.
  var dc1 = $('#destroyer-coord1').val();
  var dc2 = $('#destroyer-coord2').val();
  // Submarine coordinates.
  var sc1 = $('#submarine-coord1').val();
  var sc2 = $('#submarine-coord2').val();
  var sc3 = $('#submarine-coord3').val();
  // Cruiser coordinates.
  var crc1 = $('#cruiser-coord1').val();
  var crc2 = $('#cruiser-coord2').val();
  var crc3 = $('#cruiser-coord3').val();
  // Battleship coordinates.
  var bc1 = $('#battleship-coord1').val();
  var bc2 = $('#battleship-coord2').val();
  var bc3 = $('#battleship-coord3').val();
  var bc4 = $('#battleship-coord4').val();
  // Carrier coordinates.
  var cc1 = $('#carrier-coord1').val();
  var cc2 = $('#carrier-coord2').val();
  var cc3 = $('#carrier-coord3').val();
  var cc4 = $('#carrier-coord4').val();
  var cc5 = $('#carrier-coord5').val();

  if(players != null)  {
    if(game_status.player_turn==me.player_number) {
      // Hiding ships inputs.
      $('#ready-btn').hide();
      $('.ship-area').hide();
      $('.gameController').hide();
      $('.me').hide();

      // Coloring board's coordinates according to your placed ships.
      if(selectedValue == 'p1') {
        $("#player1_board ." + dc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + dc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + sc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + sc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + sc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + crc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + crc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + crc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + bc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + bc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + bc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + bc4).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + cc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + cc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + cc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + cc4).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player1_board ." + cc5).css("background-color", "rgba(0, 128, 0, 0.494)");
      } else if (selectedValue == 'p2') {
        $("#player2_board ." + dc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + dc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + sc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + sc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + sc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + crc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + crc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + crc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + bc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + bc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + bc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + bc4).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + cc1).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + cc2).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + cc3).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + cc4).css("background-color", "rgba(0, 128, 0, 0.494)");
        $("#player2_board ." + cc5).css("background-color", "rgba(0, 128, 0, 0.494)");
      }
    }
  }

  player_number = me.player_number;

  $.ajax({
    url: "battleship.php/board/set_ships/", 
    method: 'POST',
    dataType: "json",
    headers: { "X-Token": me.token },
    contentType: 'application/json',
    data: JSON.stringify({destroyer_coord1: dc1, destroyer_coord2: dc2, 
      submarine_coord1: sc1, submarine_coord2: sc2, submarine_coord3: sc3, 
      cruiser_coord1: crc1, cruiser_coord2: crc2, cruiser_coord3: crc3, 
      battleship_coord1: bc1, battleship_coord2: bc2, battleship_coord3: bc3, battleship_coord4: bc4,
      carrier_coord1: cc1, carrier_coord2: cc2, carrier_coord3: cc3, carrier_coord4: cc4, carrier_coord5: cc5,
      player_number
  }),
  success: game_status_update,
  error: show_error});
}

// Ajax Request for the player's move.
function do_move(choice) {

	player_number = me.player_number;

	$.ajax({
    url: "battleship.php/board/make_move/", 
		method: 'POST',
		dataType: "json",
		headers: { "X-Token": me.token },
		contentType: 'application/json',
		data: JSON.stringify( {choice, player_number}),
    success: game_status_update,
    error: show_error});
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
  $('#ready-btn').hide(150);
  $('.ship-area').hide(150);
  $('#ready-btn').hide(150);
  $('.gameController').hide(150);
  $('.me').hide(150);

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
  $('#ready-btn').show();
  $('.ship-area').show();
  $('.gameController').show();
  $('.me').show();

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
			$('#game_info').html('Game Status: ' + game_status.status);
		} else {
			$('#game_info').html('Game Status: ' + game_status.status);
		}

    if (game_status.player_turn==me.player_number) {
      $('#player_turn').html("<h6>It's your turn to play.</h6>");
    } else {  
      $('#player_turn').html("<h6>It's " + opponent +"'s turn to play.</h6>");
    }
  } else {
    $('#game_info').html('Game Status: '+ game_status.status);
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
		reset_boards();
	}
	
  // Enemy surrender (started -> not active)
	if(game_status_old.status=='started' && game_status.status=='not active') {
		if (!surrendered) { 
      alert("Enemy surrendered. Game restarted"); 
    } else { 
      surrendered=false; 
    };
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

  // Alerting the winner.
  function alert_winner() {
    winner = game_status.result;
    if (me.token!=null) {
      if (winner==me.player_number) {
        alert('You win!');
        location.reload();
      } else {
        alert('Enemy wins...');
        location.reload();
      }
    }
  }
}

// Function about the possible hits for player 1.
function player1_hits() {

  $("#player1_board .A1").on("click", function () { do_move("A1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A2").on("click", function () { do_move("A2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A3").on("click", function () { do_move("A3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A4").on("click", function () { do_move("A4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A5").on("click", function () { do_move("A5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A6").on("click", function () { do_move("A6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A7").on("click", function () { do_move("A7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A8").on("click", function () { do_move("A8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A9").on("click", function () { do_move("A9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .A10").on("click", function () { do_move("A10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .B1").on("click", function () { do_move("B1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B2").on("click", function () { do_move("B2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B3").on("click", function () { do_move("B3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B4").on("click", function () { do_move("B4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B5").on("click", function () { do_move("B5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B6").on("click", function () { do_move("B6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B7").on("click", function () { do_move("B7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B8").on("click", function () { do_move("B8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B9").on("click", function () { do_move("B9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .B10").on("click", function () { do_move("B10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .C1").on("click", function () { do_move("C1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C2").on("click", function () { do_move("C2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C3").on("click", function () { do_move("C3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C4").on("click", function () { do_move("C4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C5").on("click", function () { do_move("C5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C6").on("click", function () { do_move("C6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C7").on("click", function () { do_move("C7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C8").on("click", function () { do_move("C8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C9").on("click", function () { do_move("C9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .C10").on("click", function () { do_move("C10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .D1").on("click", function () { do_move("D1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D2").on("click", function () { do_move("D2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D3").on("click", function () { do_move("D3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D4").on("click", function () { do_move("D4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D5").on("click", function () { do_move("D5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D6").on("click", function () { do_move("D6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D7").on("click", function () { do_move("D7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D8").on("click", function () { do_move("D8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D9").on("click", function () { do_move("D9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .D10").on("click", function () { do_move("D10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .E1").on("click", function () { do_move("E1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E2").on("click", function () { do_move("E2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E3").on("click", function () { do_move("E3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E4").on("click", function () { do_move("E4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E5").on("click", function () { do_move("E5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E6").on("click", function () { do_move("E6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E7").on("click", function () { do_move("E7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E8").on("click", function () { do_move("E8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E9").on("click", function () { do_move("E9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .E10").on("click", function () { do_move("E10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .F1").on("click", function () { do_move("F1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F2").on("click", function () { do_move("F2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F3").on("click", function () { do_move("F3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F4").on("click", function () { do_move("F4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F5").on("click", function () { do_move("F5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F6").on("click", function () { do_move("F6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F7").on("click", function () { do_move("F7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F8").on("click", function () { do_move("F8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F9").on("click", function () { do_move("F9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .F10").on("click", function () { do_move("F10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .G1").on("click", function () { do_move("G1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G2").on("click", function () { do_move("G2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G3").on("click", function () { do_move("G3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G4").on("click", function () { do_move("G4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G5").on("click", function () { do_move("G5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G6").on("click", function () { do_move("G6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G7").on("click", function () { do_move("G7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G8").on("click", function () { do_move("G8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G9").on("click", function () { do_move("G9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .G10").on("click", function () { do_move("G10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .H1").on("click", function () { do_move("H1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H2").on("click", function () { do_move("H2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H3").on("click", function () { do_move("H3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H4").on("click", function () { do_move("H4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H5").on("click", function () { do_move("H5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H6").on("click", function () { do_move("H6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H7").on("click", function () { do_move("H7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H8").on("click", function () { do_move("H8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H9").on("click", function () { do_move("H9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .H10").on("click", function () { do_move("H10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .I1").on("click", function () { do_move("I1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I2").on("click", function () { do_move("I2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I3").on("click", function () { do_move("I3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I4").on("click", function () { do_move("I4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I5").on("click", function () { do_move("I5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I6").on("click", function () { do_move("I6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I7").on("click", function () { do_move("I7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I8").on("click", function () { do_move("I8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I9").on("click", function () { do_move("I9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .I10").on("click", function () { do_move("I10"); $(this).css("background-color", "lightblue"); });

  $("#player1_board .J1").on("click", function () { do_move("J1"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J2").on("click", function () { do_move("J2"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J3").on("click", function () { do_move("J3"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J4").on("click", function () { do_move("J4"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J5").on("click", function () { do_move("J5"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J6").on("click", function () { do_move("J6"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J7").on("click", function () { do_move("J7"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J8").on("click", function () { do_move("J8"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J9").on("click", function () { do_move("J9"); $(this).css("background-color", "lightblue"); });
  $("#player1_board .J10").on("click", function () { do_move("J10"); $(this).css("background-color", "lightblue"); });
}

// Function about the possible hits of player 2.
function player2_hits() {
  
  $("#player2_board .A1").on("click", function () { do_move("A1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A2").on("click", function () { do_move("A2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A3").on("click", function () { do_move("A3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A4").on("click", function () { do_move("A4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A5").on("click", function () { do_move("A5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A6").on("click", function () { do_move("A6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A7").on("click", function () { do_move("A7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A8").on("click", function () { do_move("A8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A9").on("click", function () { do_move("A9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .A10").on("click", function () { do_move("A10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .B1").on("click", function () { do_move("B1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B2").on("click", function () { do_move("B2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B3").on("click", function () { do_move("B3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B4").on("click", function () { do_move("B4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B5").on("click", function () { do_move("B5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B6").on("click", function () { do_move("B6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B7").on("click", function () { do_move("B7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B8").on("click", function () { do_move("B8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B9").on("click", function () { do_move("B9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .B10").on("click", function () { do_move("B10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .C1").on("click", function () { do_move("C1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C2").on("click", function () { do_move("C2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C3").on("click", function () { do_move("C3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C4").on("click", function () { do_move("C4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C5").on("click", function () { do_move("C5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C6").on("click", function () { do_move("C6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C7").on("click", function () { do_move("C7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C8").on("click", function () { do_move("C8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C9").on("click", function () { do_move("C9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .C10").on("click", function () { do_move("C10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .D1").on("click", function () { do_move("D1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D2").on("click", function () { do_move("D2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D3").on("click", function () { do_move("D3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D4").on("click", function () { do_move("D4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D5").on("click", function () { do_move("D5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D6").on("click", function () { do_move("D6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D7").on("click", function () { do_move("D7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D8").on("click", function () { do_move("D8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D9").on("click", function () { do_move("D9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .D10").on("click", function () { do_move("D10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .E1").on("click", function () { do_move("E1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E2").on("click", function () { do_move("E2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E3").on("click", function () { do_move("E3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E4").on("click", function () { do_move("E4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E5").on("click", function () { do_move("E5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E6").on("click", function () { do_move("E6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E7").on("click", function () { do_move("E7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E8").on("click", function () { do_move("E8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E9").on("click", function () { do_move("E9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .E10").on("click", function () { do_move("E10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .F1").on("click", function () { do_move("F1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F2").on("click", function () { do_move("F2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F3").on("click", function () { do_move("F3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F4").on("click", function () { do_move("F4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F5").on("click", function () { do_move("F5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F6").on("click", function () { do_move("F6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F7").on("click", function () { do_move("F7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F8").on("click", function () { do_move("F8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F9").on("click", function () { do_move("F9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .F10").on("click", function () { do_move("F10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .G1").on("click", function () { do_move("G1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G2").on("click", function () { do_move("G2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G3").on("click", function () { do_move("G3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G4").on("click", function () { do_move("G4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G5").on("click", function () { do_move("G5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G6").on("click", function () { do_move("G6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G7").on("click", function () { do_move("G7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G8").on("click", function () { do_move("G8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G9").on("click", function () { do_move("G9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .G10").on("click", function () { do_move("G10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .H1").on("click", function () { do_move("H1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H2").on("click", function () { do_move("H2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H3").on("click", function () { do_move("H3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H4").on("click", function () { do_move("H4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H5").on("click", function () { do_move("H5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H6").on("click", function () { do_move("H6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H7").on("click", function () { do_move("H7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H8").on("click", function () { do_move("H8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H9").on("click", function () { do_move("H9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .H10").on("click", function () { do_move("H10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .I1").on("click", function () { do_move("I1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I2").on("click", function () { do_move("I2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I3").on("click", function () { do_move("I3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I4").on("click", function () { do_move("I4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I5").on("click", function () { do_move("I5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I6").on("click", function () { do_move("I6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I7").on("click", function () { do_move("I7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I8").on("click", function () { do_move("I8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I9").on("click", function () { do_move("I9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .I10").on("click", function () { do_move("I10"); $(this).css("background-color", "lightblue"); });

  $("#player2_board .J1").on("click", function () { do_move("J1"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J2").on("click", function () { do_move("J2"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J3").on("click", function () { do_move("J3"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J4").on("click", function () { do_move("J4"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J5").on("click", function () { do_move("J5"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J6").on("click", function () { do_move("J6"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J7").on("click", function () { do_move("J7"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J8").on("click", function () { do_move("J8"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J9").on("click", function () { do_move("J9"); $(this).css("background-color", "lightblue"); });
  $("#player2_board .J10").on("click", function () { do_move("J10"); $(this).css("background-color", "lightblue"); });
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