<?php
    // potentially for next time: show_user(), set_user(), handle_user(), current_player()

    // SQL request to initialize the players
    function remove_user() {
        global $mysqli;

        $sql = 'update players set username=null, token="", last_action=null where token!="" ';
        $st = $mysqli->prepare($sql);
        $st->execute();
    }
?>