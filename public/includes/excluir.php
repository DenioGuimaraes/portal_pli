<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

$input = file_get_contents("php://input");
$dados = json_decode($input, true);

if (!isset($dados['id']) || !is_numeric($dados['id'])) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'ID inválido.'
    ]);
    exit;
}

$conn = new mysqli('localhost', 'root', '', 'Portal_PLI');
if ($conn->connect_error) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro de conexão: ' . $conn->connect_error
    ]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM dadospessoal WHERE id = ?");
$stmt->bind_param("i", $dados['id']);

if ($stmt->execute()) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Registro excluído com sucesso.'
    ]);
} else {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao excluir: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
