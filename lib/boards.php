<?php
    // Potentially for next time: make_move(), do_move(), check_winner(), play_again().

    // SQL Request for reseting/cleaning the boards.
    function reset_boards() {
        global $mysqli;
        $sql = 'call clean_boards()';
        $mysqli->query($sql);
    }

    // SQL Request to return player1's board.
    function read_board1() {
        global $mysqli;
        $sql = 'select * from player1_board';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        return($res->fetch_all(MYSQLI_ASSOC));
    }

    // SQL Request to return player2's board.
    function read_board2() {
        global $mysqli;
        $sql = 'select * from player2_board';
        $st = $mysqli->prepare($sql);
        $st->execute();
        $res = $st->get_result();
        return($res->fetch_all(MYSQLI_ASSOC));
    }
?>