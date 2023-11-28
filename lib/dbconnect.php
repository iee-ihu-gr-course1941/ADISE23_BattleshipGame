<?php
    $host = 'localhost';
    $db = 'battleshipgamedb';
    require_once "db_upass.php";

    $user = $DB_USER;
    $pass = $DB_PASS;

    $con = mysqli_connect($host, $user, '', $db);

    if(!$con) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }    

    // if (gethostname()=='users.iee.ihu.gr') {
    //     $mysqli = new mysqli($host, $user, $pass, $db, null, '/home/student/iee/2019/iee2019119/mysql/run/mysql.sock');
    // } else {
    //         $mysqli = new mysqli($host, $user, null, $db);
    // }

    // if ($mysqli->connect_errno) {
    //     echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    // }
?>