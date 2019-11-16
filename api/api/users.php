<?php
include_once './config/database.php';
require "../vendor/autoload.php";
use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$secret_key = "abc";
$jwt = null;
$databaseService = new DatabaseService();
$conn = $databaseService->getConnection();

$data = json_decode(file_get_contents("php://input"));
$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$arr = explode(" ", $authHeader);

$jwt = $arr[0];

if($jwt){

    try {

        $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
        // Access is granted. Add code of the operation here 
		if(isset($_GET['page'])){
			$perpage=$_GET['page'];
			}else{
			$perpage=1;
			}
		
		$ResultSet = array();
		$dataSet = array();
        $data_per_page = 5;
        $offset = 0;
	 if (isset($perpage) && $perpage > 1)
    {
        $offset = ($perpage - 1) * $data_per_page;
    }
	$table_name = 'tbl_students';
	$query = "SELECT id, fname, lname, email FROM " . $table_name . " LIMIT $offset,$data_per_page";
	$stmt = $conn->prepare( $query );
	$stmt->execute();
	$num = $stmt->rowCount();
	$data = $stmt->fetchAll();
	
	$Q = "Select * from tbl_students";
    $totQ = $conn->prepare($Q);
	$totQ->execute();
    $PageCount = round($totQ->rowCount() / $data_per_page);
// and somewhere later:
if($num >0){
		foreach ($data as $row) {
				    $dataSet['id'] = $row['id'];
					$dataSet['firstname'] = $row['fname'];
					$dataSet['lastname'] = $row['lname'];
					$dataSet['email'] = $row['email'];
					
					array_push($ResultSet, $dataSet);
		}
                    
}else{
	$dataSet['error'] = 'No record found';
	array_push($ResultSet, $dataSet);
	}
   
        echo json_encode(array(
            "message" => "Access granted:",
            "Pagecount" => $PageCount,
            "startpage" => $perpage,
            "status" => 0,
            
			"Response" => $ResultSet,
        ));

    }catch (Exception $e){

    http_response_code(401);

    echo json_encode(array(
        "message" => "Access denied."/*,
        "error" => $e->getMessage()*/
    ));
}

}
?>