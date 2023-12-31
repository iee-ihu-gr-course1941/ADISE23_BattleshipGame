// Using JQuery to handle Multiplayer Battleship Game:
var me={ nickname: null, token: null, player_number: null };
var players;
var player;
var player_turn;
var opponent;
var player_number;
var game_status={};
var timer = null;
var last_update = new Date().getTime();
var surrendered = false;
var selectedValue;
var p1_ships_ready = false;
var p2_ships_ready = false;
var hits_p1 = [];
var hits_p2 = [];
var misses_p1 = [];
var misses_p2 = [];
var p1_selectorHits;
var p2_selectorHits;
var p1_selectorMisses;
var p2_selectorMisses;

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

  // Reset Button (onclick).
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

    // Disabling onclick of both boards/tables.
    $('#player1_board td').addClass('disabled-cell');
    $('#player2_board td').addClass('disabled-cell');

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

var uniqueStrings = [];

// The isUnique() function checks if a coordinate appears more than once.
function isUnique(str) {
  return uniqueStrings.filter(item => item === str).length <= 1;
}

var dc1, dc2, sc1, sc2, sc3, crc1, crc2, crc3, bc1, bc2, bc3, bc4, cc1, cc2, cc3, cc4, cc5;
// Ajax Request for the player to set the ships.
function set_ships() {

  uniqueStrings = []; // Cleaning the array.
  
  // Destroyer coordinates.
  dc1 = $('#destroyer-coord1').val().trim().toUpperCase();
  dc2 = $('#destroyer-coord2').val().trim().toUpperCase();
  // Submarine coordinates.
  sc1 = $('#submarine-coord1').val().trim().toUpperCase();
  sc2 = $('#submarine-coord2').val().trim().toUpperCase();
  sc3 = $('#submarine-coord3').val().trim().toUpperCase();
  // Cruiser coordinates.
  crc1 = $('#cruiser-coord1').val().trim().toUpperCase();
  crc2 = $('#cruiser-coord2').val().trim().toUpperCase();
  crc3 = $('#cruiser-coord3').val().trim().toUpperCase();
  // Battleship coordinates.
  bc1 = $('#battleship-coord1').val().trim().toUpperCase();
  bc2 = $('#battleship-coord2').val().trim().toUpperCase();
  bc3 = $('#battleship-coord3').val().trim().toUpperCase();
  bc4 = $('#battleship-coord4').val().trim().toUpperCase();
  // Carrier coordinates.
  cc1 = $('#carrier-coord1').val().trim().toUpperCase();
  cc2 = $('#carrier-coord2').val().trim().toUpperCase();
  cc3 = $('#carrier-coord3').val().trim().toUpperCase();
  cc4 = $('#carrier-coord4').val().trim().toUpperCase();
  cc5 = $('#carrier-coord5').val().trim().toUpperCase();

  uniqueStrings.push(dc1, dc2, sc1, sc2, sc3, crc1, crc2, crc3, bc1, bc2, bc3, bc4, cc1, cc2, cc3, cc4, cc5);
  // console.log("You added the following coordinates: ", uniqueStrings);
  
  if(players != null)  {
    if(game_status.player_turn==me.player_number) {
      
      // Performing additional validation.
      if (/^[A-Ja-j]([1-9]|10)$/.test(dc1) && isUnique(dc1) && /^[A-Ja-j]([1-9]|10)$/.test(dc2) && isUnique(dc2) &&
         /^[A-Ja-j]([1-9]|10)$/.test(sc1) && isUnique(sc1) && /^[A-Ja-j]([1-9]|10)$/.test(sc2) && isUnique(sc2) && /^[A-Ja-j]([1-9]|10)$/.test(sc3) && isUnique(sc3) &&
        /^[A-Ja-j]([1-9]|10)$/.test(crc1) && isUnique(crc1) && /^[A-Ja-j]([1-9]|10)$/.test(crc2) && isUnique(crc2) && /^[A-Ja-j]([1-9]|10)$/.test(crc3) && isUnique(crc3) && 
       /^[A-Ja-j]([1-9]|10)$/.test(bc1) && isUnique(bc1) && /^[A-Ja-j]([1-9]|10)$/.test(bc2) && isUnique(bc2) && /^[A-Ja-j]([1-9]|10)$/.test(bc3) && isUnique(bc3) && /^[A-Ja-j]([1-9]|10)$/.test(bc4) && isUnique(bc4) &&
      /^[A-Ja-j]([1-9]|10)$/.test(cc1) && isUnique(cc1) && /^[A-Ja-j]([1-9]|10)$/.test(cc2) && isUnique(cc2) && /^[A-Ja-j]([1-9]|10)$/.test(cc3) && isUnique(cc3) && /^[A-Ja-j]([1-9]|10)$/.test(cc4) && isUnique(cc4) && /^[A-Ja-j]([1-9]|10)$/.test(cc5) && isUnique(cc5)) {
        
        uniqueStrings = []; // Cleaning the array.

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
          p1_ships_ready = true;
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
          p2_ships_ready = true;
        }
      } else {
        uniqueStrings = []; // Cleaning the array.
        alert("Invalid input. You can only add board's coordinates. Each coordinate must be unique!");
        return;
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
  hits_p2 = [];
  misses_p1 = [];
  hits_p1 = [];
  p1_selectorHits = "";
  p2_selectorHits = "";
  p1_selectorMisses = "";
  p2_selectorMisses = "";

  $('.home').show(150);
  $('.game').hide(150);
  $('#reset_game').hide(150);
  $('.div-game-inf').hide(150);
  $('#ready-btn').hide(150);
  $('.ship-area').hide(150);
  $('#ready-btn').hide(150);
  $('.gameController').hide(150);
  $('.me').hide(150);
  clean_colors();

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

    // Handling player turn.
    if (game_status.player_turn==me.player_number) {
      $('#player_turn').html("<h6>It's your turn to play.</h6>");
      // if both players have placed the ships into the board, the boards will be enabled accordingly.
      if (selectedValue == 'p1') { 
        if (p1_ships_ready == true) { 
          $('#player2_board td').removeClass('disabled-cell'); // Enabling onclick of the p2 board/table.
        }
      } else if (selectedValue == 'p2') {
        if (p2_ships_ready == true) { 
          $('#player1_board td').removeClass('disabled-cell'); // Enabling onclick of the p1 board/table.
        }
      }
    } else {  
      $('#player_turn').html("<h6>It's " + opponent +"'s turn to play.</h6>");
      // if both players have placed the ships into the board, the boards will be disabled accordingly.
      if (selectedValue == 'p1') {
        if (p1_ships_ready == true) {
          $('#player2_board td').addClass('disabled-cell'); // Disabling onclick of the p2 board/table.
        }
      } else if (selectedValue == 'p2') {
        if (p2_ships_ready == true) {
          $('#player1_board td').addClass('disabled-cell'); // Disabling onclick of the p1 board/table.
        }
      }
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

  // Handling all Hits.
  handling_hits_p1(); // Calling handling_hits_p1 function, to handle the hits from p1.
  handling_hits_p2(); // Calling handling_hits_p2 function, to handle the hits from p2.

  // Handling all Misses.
  handling_miss_p1(); // Calling handling_miss_p1 function, to handle the misses from p1.
  handling_miss_p2(); // Calling handling_miss_p2 function, to handle the misses from p2.

  // Alerting the winner.
  function alert_winner() {
    winner = game_status.result;
    if (me.token!=null) {
      if (winner==me.player_number) {
        alert('You win!');
        reset_boards();
        location.reload();
      } else {
        alert('Enemy wins...');
        reset_boards();
        location.reload();
      }
    }
  }
}

// AJAX Request to GET player1 coordinates with status equals to a 'hit'.
function handling_hits_p1() {
  $.ajax({
    url: 'battleship.php/board/handle_hits_p1/',
    method: 'GET',
    dataType: "json",
    headers: {"X-Token": me.token},
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        hits_p1.push(data[i].coordinate);
      }
      coloringHits_board1(hits_p1);
    }, 
    error: show_error
  });
}

// Coloring red the shoted coordinates of player1_board that equals to a 'hit'.
function coloringHits_board1(coords) {
  for (var i = 0; i < coords.length; i++) {
      p1_selectorHits = '#player1_board .' + coords[i];
      $(p1_selectorHits).css("background-color", "rgba(255, 0, 0, 0.651)");
    }
}

// AJAX Request to GET player2 coordinates with status equals to a 'hit'.
function handling_hits_p2() {
  $.ajax({
    url: 'battleship.php/board/handle_hits_p2/',
    method: 'GET',
    dataType: "json",
    headers: {"X-Token": me.token},
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        hits_p2.push(data[i].coordinate);
      }
      coloringHits_board2(hits_p2);
    }, 
    error: show_error
  });
}

// Coloring red the shoted coordinates of player2_board that equals to a 'hit'.
function coloringHits_board2(coords) {
  for (var i = 0; i < coords.length; i++) {
      p2_selectorHits = '#player2_board .' + coords[i];
      $(p2_selectorHits).css("background-color", "rgba(255, 0, 0, 0.651)");
    }
}

// AJAX Request to GET player2 coordinates with status equals to a 'miss'.
function handling_miss_p1() {
  $.ajax({
    url: 'battleship.php/board/handle_miss_p1/',
    method: 'GET',
    dataType: "json",
    headers: {"X-Token": me.token},
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        misses_p1.push(data[i].coordinate);
      }
      coloringMiss_board1(misses_p1);
    }, 
    error: show_error
  });
}

// Coloring white the shoted coordinates of player1_board that equals to a 'miss'.
function coloringMiss_board1(coords) {
  for (var i = 0; i < coords.length; i++) {
      p1_selectorMisses = '#player1_board .' + coords[i];
      $(p1_selectorMisses).css("background-color", "rgba(173, 216, 230, 0.519)");
    }
}

// AJAX Request to GET player2 coordinates with status equals to a 'miss'.
function handling_miss_p2() {
  $.ajax({
    url: 'battleship.php/board/handle_miss_p2/',
    method: 'GET',
    dataType: "json",
    headers: {"X-Token": me.token},
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        misses_p2.push(data[i].coordinate);
      }
      coloringMiss_board2(misses_p2);
    }, 
    error: show_error
  });
}

// Coloring white the shoted coordinates of player1_board that equals to a 'miss'.
function coloringMiss_board2(coords) {
  for (var i = 0; i < coords.length; i++) {
      p2_selectorMisses = '#player2_board .' + coords[i];
      $(p2_selectorMisses).css("background-color", "rgba(173, 216, 230, 0.519)");
    }
}

// Function about the possible hits of player 1.
function player1_hits() {

  for (let letter of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) {
    for (let number = 1; number <= 10; number++) {
      const selector = `#player1_board .${letter}${number}`;
      $(selector).on({
        mouseover: function () {
          if (!$(this).hasClass("selected")) {
            $(this).css("background-color", "rgba(173, 216, 230, 0.519)");
          }
        },
        mouseleave: function () {
          if (!$(this).hasClass("selected")) {
            $(this).css("background-color", "");
          }
        },
        click: function () {
          const cellId = $(this).attr("class");

          do_move(cellId); // Calling do_move function.
    
          // Remove the selected class from any previously selected cell.
          $(".selector.selected").removeClass("selected");

          $(this).addClass("selected");

          $(this).off("click"); // Disabling click for this cell.
        }
      });
    }
  }
}

// Function about the possible hits of player 2.
function player2_hits() {

  for (let letter of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) {
    for (let number = 1; number <= 10; number++) {
      const selector = `#player2_board .${letter}${number}`;
      $(selector).on({
        mouseover: function () {
          if (!$(this).hasClass("selected")) {
            $(this).css("background-color", "rgba(173, 216, 230, 0.519)");
          }
        },
        mouseleave: function () {
          if (!$(this).hasClass("selected")) {
            $(this).css("background-color", "");
          }
        },
        click: function () {
          const cellId = $(this).attr("class");

          do_move(cellId); // Calling do_move function.

          // Remove the selected class from any previously selected cell.
          $(".selector.selected").removeClass("selected");
            
          $(this).addClass("selected");    

          $(this).off("click"); // Disabling click for this cell.
        }
      });
    }
  }
}

// A function that cleans the colors of players' placed ships and hits/misses, after reseting the game.
function clean_colors() {

  // Cleaning colors from board of player 1.
  $("#player1_board ." + dc1).css("background-color", "");
  $("#player1_board ." + dc2).css("background-color", "");
  $("#player1_board ." + sc1).css("background-color", "");
  $("#player1_board ." + sc2).css("background-color", "");
  $("#player1_board ." + sc3).css("background-color", "");
  $("#player1_board ." + crc1).css("background-color", "");
  $("#player1_board ." + crc2).css("background-color", "");
  $("#player1_board ." + crc3).css("background-color", "");
  $("#player1_board ." + bc1).css("background-color", "");
  $("#player1_board ." + bc2).css("background-color", "");
  $("#player1_board ." + bc3).css("background-color", "");
  $("#player1_board ." + bc4).css("background-color", "");
  $("#player1_board ." + cc1).css("background-color", "");
  $("#player1_board ." + cc2).css("background-color", "");
  $("#player1_board ." + cc3).css("background-color", "");
  $("#player1_board ." + cc4).css("background-color", "");
  $("#player1_board ." + cc5).css("background-color", "");

  // Cleaning colors from board of player 2.
  $("#player2_board ." + dc1).css("background-color", "");
  $("#player2_board ." + dc2).css("background-color", "");
  $("#player2_board ." + sc1).css("background-color", "");
  $("#player2_board ." + sc2).css("background-color", "");
  $("#player2_board ." + sc3).css("background-color", "");
  $("#player2_board ." + crc1).css("background-color", "");
  $("#player2_board ." + crc2).css("background-color", "");
  $("#player2_board ." + crc3).css("background-color", "");
  $("#player2_board ." + bc1).css("background-color", "");
  $("#player2_board ." + bc2).css("background-color", "");
  $("#player2_board ." + bc3).css("background-color", "");
  $("#player2_board ." + bc4).css("background-color", "");
  $("#player2_board ." + cc1).css("background-color", "");
  $("#player2_board ." + cc2).css("background-color", "");
  $("#player2_board ." + cc3).css("background-color", "");
  $("#player2_board ." + cc4).css("background-color", "");
  $("#player2_board ." + cc5).css("background-color", "");

  // Cleaning colors of hits and misses from both boards.
  $(p1_selectorHits).css("background-color", "");
  $(p2_selectorHits).css("background-color", "");
  $(p1_selectorMisses).css("background-color", "");
  $(p2_selectorMisses).css("background-color", "");
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