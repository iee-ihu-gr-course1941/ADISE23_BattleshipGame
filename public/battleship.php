<?php
    require_once "lib/dbconnect.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
    // $request = explode('/', trim($_SERVER['SCRIPT_NAME'],'/'));
    // Σε περίπτωση που τρέχουμε php –S 
    $input = json_decode(file_get_contents('php://input'),true);

?>