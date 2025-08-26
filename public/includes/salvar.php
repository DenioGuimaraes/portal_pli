<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

function json_fail($msg, $http = 400) {
  http_response_code($http);
  echo json_encode(['sucesso' => false, 'mensagem' => $msg]);
  exit;
}

// Lê corpo e decodifica
$input = file_get_contents("php://input");
$dados = json_decode($input, true);
if (!$dados || !isset($dados['nome'])) {
  json_fail('Dados inválidos ou incompletos.');
}

// Conexão
$conn = new mysqli('localhost', 'root', '', 'Portal_PLI');
if ($conn->connect_error) json_fail('Erro ao conectar ao banco: ' . $conn->connect_error, 500);
$conn->set_charset('utf8mb4');

// Normaliza campos
$id         = isset($dados['id']) && trim($dados['id']) !== '' ? (int)$dados['id'] : null;
$nome       = trim($dados['nome'] ?? '');
$nometodo   = trim($dados['nometodo'] ?? '');
$chave      = trim($dados['chave'] ?? '');
$matricula  = trim($dados['matricula'] ?? '');
$telefone   = trim($dados['telefone'] ?? '');
$transporte = trim($dados['transporte'] ?? '');
$sangue     = trim($dados['sangue'] ?? '');
$grupo      = trim($dados['grupo'] ?? '');
$cargo      = trim($dados['cargo'] ?? '');

// Se for UPDATE, verifica existência
$existe = false;
if ($id) {
  $check = $conn->prepare("SELECT id FROM dadospessoal WHERE id = ?");
  if (!$check) json_fail('Erro no prepare (check): ' . $conn->error, 500);
  $check->bind_param("i", $id);
  $check->execute();
  $check->store_result();
  $existe = $check->num_rows > 0;
  $check->close();
}

if ($existe) {
  // UPDATE (9 campos + id)
  $sql = "UPDATE dadospessoal
            SET nome=?, nometodo=?, chave=?, matricula=?, telefone=?, transporte=?, sangue=?, grupo=?, cargo=?
          WHERE id=?";
  $stmt = $conn->prepare($sql);
  if (!$stmt) json_fail('Erro no prepare (UPDATE): ' . $conn->error, 500);

  $ok = $stmt->bind_param(
    "sssssssssi",
    $nome, $nometodo, $chave, $matricula, $telefone, $transporte, $sangue, $grupo, $cargo, $id
  );
  if (!$ok) json_fail('Erro no bind_param (UPDATE): ' . $stmt->error, 500);

} else {
  // INSERT (9 colunas -> **9 placeholders**)
  $sql = "INSERT INTO dadospessoal
            (nome, nometodo, chave, matricula, telefone, transporte, sangue, grupo, cargo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  if (!$stmt) json_fail('Erro no prepare (INSERT): ' . $conn->error, 500);

  $ok = $stmt->bind_param(
    "sssssssss",
    $nome, $nometodo, $chave, $matricula, $telefone, $transporte, $sangue, $grupo, $cargo
  );
  if (!$ok) json_fail('Erro no bind_param (INSERT): ' . $stmt->error, 500);
}

// Executa
if (!$stmt->execute()) {
  json_fail('Erro ao salvar: ' . $stmt->error, 500);
}

$resposta = ['sucesso' => true, 'mensagem' => 'Registro salvo com sucesso!'];
if (!$existe) $resposta['id'] = $stmt->insert_id;

$stmt->close();
$conn->close();

echo json_encode($resposta);
