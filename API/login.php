<?php
require_once 'headers.php';
require_once 'conexion.php';

$dbtableUsers = "usuarios";
$dbtableSlots = "slots";
$dbtableNearby = "cercanos";

session_start(); 

// Create connection
$conn = mysqli_connect($server, $user, $pass, $bd);

if ($_SERVER['REQUEST_METHOD'] === 'GET'){
	if(isset($_GET['id'])) {
		$id = $conn->real_escape_string($_GET['id']);
		$pass = $conn->real_escape_string($_GET['pass']);
		$sql = $conn->query("SELECT * FROM $dbtableUsers WHERE id = $id AND password = $pass");
		if($sql){
		    $data = $sql->fetch_assoc();
    		if ($data) {
				http_response_code(201);
    			exit(json_encode(array('status' => 'success')));
    		} else {
				http_response_code(500);
    			exit(json_encode(array('status' => 'error user not exist')));
    		}
	    } else {
			http_response_code(500);
		    exit(json_encode(array('status' => 'error SQL query')));
	    }
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
	$data = json_decode(file_get_contents("php://input"));
	$sql_consult = "SELECT * FROM $dbtableUsers WHERE id = $data->id";
	$sql_check_id = $conn->query($sql_consult);
	
	if(!empty($sql_check_id) AND mysqli_num_rows($sql_check_id) > 0){
		http_response_code(500);
		exit(json_encode(array('status' => 'Usuario ya EXISTE')));
	} else {
		$querySQL = "INSERT INTO $dbtableUsers (id, name, surname, password, userCreatedDate, email, status) VALUES ('".$data->id."', '".$data->name."', '".$data->surname."', '".$data->pass."', '".$data->userCreatedDate."', '".$data->email."', '".$data->status."')" ;
		$sql = $conn->query($querySQL);
		if($sql) {
			http_response_code(201);
			exit(json_encode(array('status' => 'Usuario insertado')));
		} else {
			http_response_code(500);
			exit(json_encode(array('status' => "error insertar $querySQL $sql" )));
		}
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT'){
	if (isset($_GET['id'])) {
		$id = $conn->real_escape_string($_GET['id']);
		$data = json_decode(file_get_contents("php://input"));
		$sql = $conn->query("UPDATE $dbtableUsers SET name = '".$data->name."', surname = '".$data->surname."', pass = '".md5($data->pass)."' WHERE id = '$id'");
		if ($sql) {
			exit(json_encode(array('status' => 'success user update')));
		} else {
			exit(json_encode(array('status' => 'error')));
		}
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE'){
	if (isset($_GET['id'])) {
		$id = $conn->real_escape_string($_GET['id']);
		$sql = $conn->query("UPDATE $dbtableUsers SET status = '".$data->status."' WHERE id = '$id'");
		
		if ($sql) {
			exit(json_encode(array('status' => 'success')));
		} else {
			exit(json_encode(array('status' => 'error')));
		}
	}
}

$close = mysqli_close($conn) 
or die("error");

?>