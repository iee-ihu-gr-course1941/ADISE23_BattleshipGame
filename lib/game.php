<?php
    // Checking status if it's aborted and returning SQL request of table game_status.
    function show_status() {
        global $mysqli;
        
        // call check_initialized and check_abort if the status of the game is 'initialized' and if it's 'aborded', respectively
        check_initialized();
        check_abort();

        $sql = 'select * from game_status';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();

        header('Content-type: application/json');
        print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
    }

    // SQL Request to check if an opponent has not been found during the deadline (60").
    function check_initialized() {
        global $mysqli;

        $sql = "select count(*) as npf from game_status WHERE last_change<(now()-INTERVAL 60 SECOND) and status='initialized'";
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        $npf = $res->fetch_assoc()['npf'];
        // if on the deadline a player has not been found, change the status to 'not active'
        if ($npf==1){
            $sql2 ="update game_status set status='not active'";
            $st2 = $mysqli->prepare($sql2);
            $st2->execute();
            $res2 = $st2->get_result();
            remove_user(); // call remove_user, so the user is going to be removed
        }
    }

    // SQL Request to check if the player hasn't played during the deadline (90").
    function check_abort() {
        global $mysqli;

        $sql = "update game_status set status='aborded', result=if(player_turn='p1','p2','p1'), player_turn=null where player_turn is not null and last_change<(now()-INTERVAL 90 SECOND) and status='started'";
        $st = $mysqli->prepare($sql);
        $r = $st->execute();
    }

    // Update the table games_status based on the current status.
    function update_game_status() {
        global $mysqli;

        $status=read_status(); // read the status of the game
        $new_status=null;
        $new_turn=null;

        $st3=$mysqli->prepare('select count(*) as aborted from players WHERE last_action< (NOW() - INTERVAL 2 MINUTE)');
        $st3->execute();
        $res3 = $st3->get_result();
        $aborted = $res3->fetch_assoc()['aborted'];
        // check if the player has aborted the game and then reset the game (like pressing the button 'play again')
        if($aborted>0) {
            if ($status['status']=='started' || $status['status']=='ended'){
                $sql = "UPDATE players SET username=NULL, token=NULL, last_action =NULL";
                $st2 = $mysqli->prepare($sql);
                $st2->execute();
            }
            if($status['status']=='started') {
                $new_status='aborted';
            }
        }

        $sql = 'select count(*) as c from players where username is not null';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        $active_players = $res->fetch_assoc()['c'];

        // based on the number of active players, define the proper status of the game
        switch($active_players) {
            case 0:
                $new_status='not active'; 
                break;
            case 1:
                $new_status='initialized'; 
                break;
            case 2: 
                $new_status='started'; 
                if($status['player_turn']==null) {
                    $random_turn=rand(1,2);
                    if ($random_turn==1) {
                        $new_turn='p1';
                    } else {
                        $new_turn='p2';
                    }
                }
                break;
        }
        
        $sql = 'update game_status set status=?, player_turn=?';
        $st = $mysqli->prepare($sql);
        $st->bind_param('ss',$new_status,$new_turn);
        $st->execute();
    }

    // SQL Request to return the table game_status
    function read_status() {
        global $mysqli;

        $sql = 'select * from game_status';
        $st = $mysqli->prepare($sql);

        $st->execute();
        $res = $st->get_result();
        $status = $res->fetch_assoc();
        return($status);
    }

    // SQL Request to update the result of the game to 'ended'
    function end_game($winner){
        global $mysqli;

        $sql = "update game_status set status='ended', result=?  where player_turn is not null and status='started'";
        $st = $mysqli->prepare($sql);
        $st->bind_param('s',$winner);
        $st->execute();
        show_status();
    }
?>