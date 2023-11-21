<?php
    require_once "lib/dbconnect.php";

    $method = $_SERVER['REQUEST_METHOD'];
    $request = explode('/',trim($_SERVER['PATH_INFO'],'/'));
    $input = json_decode(file_get_contents('php://input'),true);
    if(isset($_SERVER['HTTP_X_TOKEN'])) {
        $input['token']=$_SERVER['HTTP_X_TOKEN'];
    }
?>