<?php
include_once './config/database.php';
require "../vendor/autoload.php";
use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$arr = explode(" ", $authHeader);

$jwt = $arr[0];

	 echo json_encode(array(
          'status' => 0,
          'message' => 'logout'
        ));
?>