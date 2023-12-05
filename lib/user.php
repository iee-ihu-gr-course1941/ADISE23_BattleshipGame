<?php
    //SQL request to return players table
    function show_users() {
        global $mysqli;
        $sql = 'select username from players';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        header('Content-type: application/json');
        print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
    }

    //Handling loginuser method 
    function set_user($b, $input) {
        if(!isset($input['username']) || $input['username']=='') {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"No username given."]);
            exit;
        }

        $username=$input['username'];
        //$player_number=$input['player_number']; 
        
        global $mysqli;
        //Checking if players are already playing.
        // $sql = 'select count(*) as c from players where username is not null';
        // $st = $mysqli->prepare($sql);
        // $st->execute();
        // $res = $st->get_result();
        // $r = $res->fetch_all(MYSQLI_ASSOC);
        // if ($r[0]['c']==2){
        //     header("HTTP/1.1 400 Bad Request");
        //     print json_encode(['errormesg'=>"Other players have started the game already."]);
        //     exit;
        // }

        // //Checking if player with the player_number exits.
        // $player_number1 = substr($player_number, -1);
        // global $mysqli;
        $sql = 'select count(*) as c from players where player_number=? and username is not null';
        $st = $mysqli->prepare($sql);
        $st->bind_param('s', $b);
        $st->execute();
        $res = $st->get_result();
        $r = $res->fetch_all(MYSQLI_ASSOC);
        if($r[0]['c']>0) {
            header("HTTP/1.1 400 Bad Request");
            print json_encode(['errormesg'=>"Player $b is already set. Please select another player number."]);
            exit;
        }

        $sql = 'update players set username=?, token=md5(CONCAT( ?, NOW()))  where player_number=?';
        $st2 = $mysqli->prepare($sql);
        $st2->bind_param('sss',$username,$username, $b);
        $st2->execute();
        
        update_game_status();
        $sql = 'select * from players where player_number=?';
        $st = $mysqli->prepare($sql);
        $st->bind_param('s',$b);
        $st->execute();
        $res = $st->get_result();
        header('Content-type: application/json');
        print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
    }

    //Checking if method is for GET/POST
    function handle_user($method, $b, $input) {
        if($method=='GET') {
            header("HTTP/1.1 400 Bad Request");
        } else if($method=='PUT') {
            set_user($b, $input);
        }
    }

    // Checking user's token. Returning player with that token.
    function current_player($token) {
        global $mysqli;

        if($token==null) {
            return(null);
        }

        $sql = 'select * from players where token=?';
        $st = $mysqli->prepare($sql);
        $st->bind_param('s', $token);
        $st->execute();
        $res = $st->get_result();
        
        if($row=$res->fetch_assoc()) {
            return($row['player_number']);
        }
        return(null);
    }

    // SQL request to initialize the players
    function remove_user() {
        global $mysqli;

        $sql = 'update players set username=null, token="", last_action=null where token!="" ';
        $st = $mysqli->prepare($sql);
        $st->execute();
    }
?>