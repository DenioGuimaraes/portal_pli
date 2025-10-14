<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Recebe dados JSON
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
$conn->set_charset('utf8mb4');

// Primeiro, buscar avatar associado ao registro
$avatar = null;
$stmtSel = $conn->prepare("SELECT avatar FROM dadospessoal WHERE id = ?");
$stmtSel->bind_param("i", $dados['id']);
$stmtSel->execute();
$stmtSel->bind_result($avatar);
$stmtSel->fetch();
$stmtSel->close();

// Agora excluir o registro
$stmt = $conn->prepare("DELETE FROM dadospessoal WHERE id = ?");
$stmt->bind_param("i", $dados['id']);

if ($stmt->execute()) {
    // Se havia avatar salvo, remover o arquivo
    if ($avatar) {
        $caminho = __DIR__ . '/../public/images/pessoal/' . $avatar;
        if (file_exists($caminho)) {
            unlink($caminho);
        }
    }

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
