<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'Portal_PLI');
if ($conn->connect_error) {
    echo json_encode(['erro' => 'Erro de conexão']);
    exit;
}

$result = $conn->query("SHOW TABLE STATUS LIKE 'dadospessoal'");
$row = $result->fetch_assoc();
$proximo_id = $row['Auto_increment'];

echo json_encode(['proximo_id' => $proximo_id]);

$conn->close();
