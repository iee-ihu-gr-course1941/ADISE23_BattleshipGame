<?php
    // potentially for next time: reset_board(), make_move(), do_move(), check_winner(), play_again()

    // Request to return player1's board
    function read_board1() {
        global $mysqli;
        $sql = 'select * from player1_board';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        return($res->fetch_all(MYSQLI_ASSOC));
    }

    // Request to return player2's board
    function read_board2() {
        global $mysqli;
        $sql = 'select * from player2_board';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        return($res->fetch_all(MYSQLI_ASSOC));
    }
?>