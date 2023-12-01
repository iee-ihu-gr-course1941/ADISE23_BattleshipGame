<?php
    // Potentially for next time: show_users(), set_user(), handle_user().

    // Checking user's token. Returning player with that toke.
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