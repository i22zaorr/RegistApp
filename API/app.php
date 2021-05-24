<?php
require_once 'headers.php';
require_once 'connection.php';

$dbtableUsers = "usuarios";
$dbtableSlots = "slots";

session_start(); 

// Create connection
$conn = mysqli_connect($server, $user, $pass, $bd);

if ($_SERVER['REQUEST_METHOD'] === 'GET'){
	
	if (isset($_GET['date'])) {
		$datePOST = $_GET['date'];
		$data = array();
		$createDate = new DateTime($datePOST);
		$date_truncate = $createDate->format('Y-m-d');
		$sql_consult = "SELECT * FROM $dbtableSlots, $dbtableUsers WHERE $dbtableSlots.date LIKE '$date_truncate%' AND $dbtableSlots.id = $dbtableUsers.id ";
		$sql = $conn->query($sql_consult);
		if($sql){
			while ($d = $sql->fetch_assoc()){$data[] = $d;}			
			http_response_code(201);
			exit(json_encode($data));
		} else {
			http_response_code(501);
			exit(json_encode(array('status' => 'Error: SQL $sql_consult', 'SQL' => $sql_consult)));
		}
	} else {
			http_response_code(501);
			exit(json_encode(array('status' => 'Error: fecha NO enviada')));
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
	$data = json_decode(file_get_contents("php://input"));
	$typeSQL = $data->typeSQL;
	if($typeSQL === 'INSERT')
	{
		$datePOST = $data->date;
		$createDate = new DateTime($datePOST);
		$date_truncate = $createDate->format('Y-m-d');
		$sql_consult = "INSERT INTO $dbtableSlots (id, date, slot) VALUES ('".$data->id."', '$date_truncate', '".$data->slot."')";
		$sql = $conn->query($sql_consult);
		if($sql) {
			http_response_code(201);
			exit(json_encode(array('status' => 'SLOT insertado', 'SQL' => $sql_consult)));
		} else {
			http_response_code(500);
			exit(json_encode(array('status' => 'error insertando SLOT', 'SQL' => $sql_consult)));
		}
	} elseif ($typeSQL === 'DELETE')
	{
		$sql_consult = "DELETE FROM $dbtableSlots WHERE id = '$data->id' AND date LIKE '$data->date%' ";
		$sql = $conn->query($sql_consult);

		if($sql) {
			http_response_code(201);
			exit(json_encode(array('status' => 'SLOT borrado', 'SQL' => $sql_consult)));
		} else {
			http_response_code(500);
			exit(json_encode(array('status' => 'error eliminando SLOT', 'SQL' => $sql_consult)));
		}
	} elseif ($typeSQL === 'UPDATE')
	{
		$sql_consult = "UPDATE $dbtableSlots SET slot = '$data->slot' WHERE id = '$data->id' AND date LIKE '$data->date%' ";
		$sql = $conn->query($sql_consult);

		if($sql) {
			http_response_code(201);
			exit(json_encode(array('status' => 'SLOT updated', 'SQL' => $sql_consult)));
		} else {
			http_response_code(500);
			exit(json_encode(array('status' => 'error actualizando SLOT', 'SQL' => $sql_consult)));
		}
	} else {
		
	}
}

$close = mysqli_close($conn) 
or die("error");
?>