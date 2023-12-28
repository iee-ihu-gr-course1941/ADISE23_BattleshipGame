<?php
    // SQL Request for reseting/cleaning the boards.
    function reset_board() {
        
        global $mysqli;
        $sql = 'call clean_board()';
        $mysqli->query($sql);
    }

    // SQL Request for the player to make a move.
    function make_move($choice, $player_number, $token) {
        // Checking if the token is null or empty.
        if($token==null || $token=='') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Token is not set."]);
            exit;
        }

        // Getting the current player.
        $player = current_player($token);
        if($player==null) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"You are not a player of this game."]);
            exit;
        }

        // Reading the status of the current game.
        $status = read_status();
        if($status['status']!='started') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Game is not in action."]);
            exit;
        }

        // Checking if player turn is not equal to the current player.
        if($status['player_turn']!=$player) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"It is not your turn."]);
            exit;
        }

        do_move($choice, $player_number);
    }

    // Makes the player move.
    function do_move($choice, $player_number) {
        global $mysqli;

        if ($player_number=='p1') {
            /* If at player's 2 board there is a ship then change the state from ship to 'hit',
            Otherwise change state to 'miss'. */
            $sql = "UPDATE `board` SET state=IF(ship IS NOT NULL, 'hit', 'miss') WHERE player='p2' AND coordinate=?";
            $opponent = 'p2'; // Changing opponent to p2.
        } else {
            /* If at player's 1 board there is a ship then change the state from ship to 'hit', 
            Otherwise change state to 'miss'. */
            $sql = "UPDATE `board` SET state=IF(ship IS NOT NULL, 'hit', 'miss') WHERE player='p1' AND coordinate=?";
            $opponent = 'p1'; // Changing opponent to p1.
        }
        $st = $mysqli->prepare($sql);
        $st->bind_param('s', $choice);
        $st->execute();

        // Changing player turn.
        $sql = 'UPDATE `game_status` set player_turn=?;';
        $st = $mysqli->prepare($sql);
        $st->bind_param('s', $opponent);
        $st->execute();

        check_winner(); // Checking if there is a winner.
    }

    function check_winner() {
        global $mysqli;

        // Checking if both players have made shots.
        $st2=$mysqli->prepare('select count(*) as p1_shots FROM board WHERE player="p1" AND state IN ("hit", "miss")');
        $st2->execute();
        $res2 = $st2->get_result();
        $p1_shots = $res2->fetch_assoc()['p1_shots'];

        $st3=$mysqli->prepare('select count(*) as p2_shots FROM board WHERE player="p2" AND state IN ("hit", "miss")');
        $st3->execute();
        $res3 = $st3->get_result();
        $p2_shots = $res3->fetch_assoc()['p2_shots'];

        if($p1_shots>0 && $p2_shots>0) {
            $winner=null; 
        
            /* Check if player1 has hit all the enemy ships.
            If there are total 17 hits, which means that every ship is sunk, then p1 wins. */
            $sql = 'select count(*) as p1_hits FROM board WHERE player="p2" AND state="hit"';
            $st = $mysqli->prepare($sql);
            $st->execute();
            $res = $st->get_result();
            $p1_hits = $res->fetch_assoc()['p1_hits'];

            if ($p1_hits == 17) {
                $winner = 'p1';

                $sql = "UPDATE game_status SET result=?, status='ended'";
                $st = $mysqli->prepare($sql);
                $st->bind_param('s', $winner);
                $st->execute();
            } 

            /* Check if player2 has hit all the enemy ships.
            If there are total 17 hits, which means that every ship is sunk, then p2 wins. */
            $sql1 = 'select count(*) as p2_hits FROM board WHERE player="p1" AND state="hit"';
            $st1 = $mysqli->prepare($sql1);
            $st1->execute();
            $res1 = $st1->get_result();
            $p2_hits = $res1->fetch_assoc()['p2_hits'];

            if ($p2_hits == 17) {
                $winner = 'p2';

                $sql = "UPDATE game_status SET result=?, status='ended'";
                $st = $mysqli->prepare($sql);
                $st->bind_param('s', $winner);
                $st->execute();
            }
        }
    }

    // SQL Request for the player to set the ships.
    function set_ships($destroyer_coord1, $destroyer_coord2, $submarine_coord1, $submarine_coord2, $submarine_coord3, $cruiser_coord1, $cruiser_coord2, $cruiser_coord3, $battleship_coord1, $battleship_coord2, $battleship_coord3, $battleship_coord4, $carrier_coord1, $carrier_coord2, $carrier_coord3, $carrier_coord4, $carrier_coord5, $player_number, $token) {
        
        // Checking if the token is null or empty.
        if($token==null || $token=='') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Token is not set."]);
            exit;
        }

        // Getting the current player.
        $player = current_player($token);
        if($player==null) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"You are not a player of this game."]);
            exit;
        }

        // Reading the status of the current game.
        $status = read_status();
        if($status['status']!='started') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Game is not in action."]);
            exit;
        }

        // Checking if player turn is not equal to the current player.
        if($status['player_turn']!=$player) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"It is not your turn."]);
            exit;
        }

        set_all_ships($destroyer_coord1, $destroyer_coord2, $submarine_coord1, $submarine_coord2, $submarine_coord3, $cruiser_coord1, $cruiser_coord2, $cruiser_coord3, $battleship_coord1, $battleship_coord2, $battleship_coord3, $battleship_coord4, $carrier_coord1, $carrier_coord2, $carrier_coord3, $carrier_coord4, $carrier_coord5, $player_number);
    }


    function set_all_ships($destroyer_coord1, $destroyer_coord2, $submarine_coord1, $submarine_coord2, $submarine_coord3, $cruiser_coord1, $cruiser_coord2, $cruiser_coord3, $battleship_coord1, $battleship_coord2, $battleship_coord3, $battleship_coord4, $carrier_coord1, $carrier_coord2, $carrier_coord3, $carrier_coord4, $carrier_coord5, $player_number) {
        global $mysqli;

        if ($player_number=='p1') {
            // Setting Destroyer into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $destroyer_coord1);
            $st->execute();       

            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $destroyer_coord2);
            $st->execute();    

            // Setting Submarine into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $submarine_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $submarine_coord2);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $submarine_coord3);
            $st->execute();    

            // Setting Cruiser into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $cruiser_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $cruiser_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $cruiser_coord3);
            $st->execute();   

            // Setting Battleship into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord1);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord3);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord4);
            $st->execute();   

            // Setting Carrier into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord1);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord2);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord3);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord4);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord5);
            $st->execute();

            $opponent = 'p2';  // Changing opponent to p2.
        } else {
            // Setting Destroyer into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $destroyer_coord1);
            $st->execute();       

            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $destroyer_coord2);
            $st->execute();    

            // Setting Submarine into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $submarine_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $submarine_coord2);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $submarine_coord3);
            $st->execute();    

            // Setting Cruiser into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $cruiser_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $cruiser_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $cruiser_coord3);
            $st->execute();   

            // Setting Battleship into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord1);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord3);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $battleship_coord4);
            $st->execute();   

            // Setting Carrier into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord1);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord2);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord3);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord4);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('s', $carrier_coord5);
            $st->execute();  

            $opponent = 'p1';  // Changing opponent to p1.
        }

        // Changing player turn.
        $sql = 'UPDATE `game_status` set player_turn=?;';
        $st = $mysqli->prepare($sql);
        $st->bind_param('s', $opponent);
        $st->execute();
    }

    // SQL Request to get the state of the shoted coordinate.
    function check_shot() {
        global $mysqli;
        //global $player_number;
        //global $choice;

        // if ($player_number=='p1') {
        $sql = "SELECT state FROM board WHERE coordinate = 'A1' AND player = 'p1'";
        // } else {
        //     $sql = "SELECT state FROM board WHERE coordinate = ? AND player = 'p2'";
        // }

        $st = $mysqli->prepare($sql);
        //$st->bind_param('s', $choice);
        $st->execute();
        $res = $st->get_result();
        header('Content-type: application/json');
        print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
    }

    // SQL Request to set a new game with the same players.
    function play_again() {
        global $mysqli;
        $sql = 'call `play_again`();';
        $st = $mysqli->prepare($sql);
        $st->execute();
    }

    // SQL Request to return players board.
    function read_board() {
        global $mysqli;
        $sql = 'select * from board';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        return($res->fetch_all(MYSQLI_ASSOC));
    }
?>