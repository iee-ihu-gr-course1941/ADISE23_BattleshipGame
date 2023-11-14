<?php
    // checking status if it's aborted and returning SQL request of table game_status.
    function show_status() {
        global $mysqli;
        //initialized();
        //check_aborted();

        $sql = 'select * from game_status';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();

        header('Content-type: application/json');
        print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
    }

    /*function check_aborted() {
        global $mysqli;

        $sql = "update game_status set game_status='aborded', result=if(player_turn='p1','p2','p1'), player_turn=null where player_turn is not null and last_change<(now()-INTERVAL 90 SECOND) and status='started'";
        $st = $mysqli->prepare($sql);
        $r = $st->execute();
    }*/
?>