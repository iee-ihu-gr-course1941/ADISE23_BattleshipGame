<?php
    // Potentially for next time: check_winner().

    // SQL Request for reseting/cleaning the boards.
    function reset_board() {
        global $mysqli;
        $sql = 'call clean_board()';
        $mysqli->query($sql);
    }

    // SQL Request for the player to make a move.
    function make_move($choice, $player_number, $token) {
	
        if($token==null || $token=='') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Token is not set."]);
            exit;
        }
        
        $player = current_player($token);
        if($player==null ) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"You are not a player of this game."]);
            exit;
        }
        
        $status = read_status();
        if($status['status']!='started') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Game is not in action."]);
            exit;
        }
        
        if($status['player_turn']!=$player) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"It is not your turn."]);
            exit;
        }
        
        do_move($choice, $player_number);
    }

    function do_move($choice, $player_number) {
        global $mysqli;

        if ($player_number=='p1') {
            $sql = "UPDATE `board` SET state=? WHERE player='p1'";
            $opponent = 'p2';
        } else {
            $sql = "UPDATE `board` SET state=? WHERE player='p2'";
            $opponent = 'p1';
        }
        $st = $mysqli->prepare($sql);
        $st->bind_param('i', $choice);
        $st->execute();


        $sql = 'UPDATE `game_status` set player_turn=?;';
        $st = $mysqli->prepare($sql);
        $st->bind_param('s', $opponent);
        $st->execute();

        //check_winner();
    }

    // SQL Request for the player to set the ships.
    function set_ships($destroyer_coord1, $destroyer_coord2, $submarine_coord1, $submarine_coord2, $submarine_coord3, $cruiser_coord1, $cruiser_coord2, $cruiser_coord3, $battleship_coord1, $battleship_coord2, $battleship_coord3, $battleship_coord4, $carrier_coord1, $carrier_coord2, $carrier_coord3, $carrier_coord4, $carrier_coord5, $player_number, $token) {
        
        if($token==null || $token=='') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Token is not set."]);
            exit;
        }
        
        $player = current_player($token);
        if($player==null ) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"You are not a player of this game."]);
            exit;
        }
        
        $status = read_status();
        if($status['status']!='started') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Game is not in action."]);
            exit;
        }
        
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
            $st->bind_param('i', $destroyer_coord1);
            $st->execute();       

            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $destroyer_coord2);
            $st->execute();    

            // Setting Submarine into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $submarine_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $submarine_coord2);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $submarine_coord3);
            $st->execute();    

            // Setting Cruiser into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $cruiser_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $cruiser_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $cruiser_coord3);
            $st->execute();   

            // Setting Battleship into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord1);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord3);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord4);
            $st->execute();   

            // Setting Carrier into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord1);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord2);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord3);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord4);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p1' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord5);
            $st->execute();  
        } else {
            // Setting Destroyer into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $destroyer_coord1);
            $st->execute();       

            $sql = "UPDATE `board` SET state='ship', ship='Destroyer' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $destroyer_coord2);
            $st->execute();    

            // Setting Submarine into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $submarine_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $submarine_coord2);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Submarine' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $submarine_coord3);
            $st->execute();    

            // Setting Cruiser into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $cruiser_coord1);
            $st->execute();    

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $cruiser_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Cruiser' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $cruiser_coord3);
            $st->execute();   

            // Setting Battleship into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord1);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord2);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord3);
            $st->execute();   

            $sql = "UPDATE `board` SET state='ship', ship='Battleship' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $battleship_coord4);
            $st->execute();   

            // Setting Carrier into DB.
            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord1);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord2);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord3);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord4);
            $st->execute();  

            $sql = "UPDATE `board` SET state='ship', ship='Carrier' WHERE player='p2' AND coordinate=?";
            $st = $mysqli->prepare($sql);
            $st->bind_param('i', $carrier_coord5);
            $st->execute();  
        }
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