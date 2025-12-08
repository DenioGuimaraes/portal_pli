<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

function json_fail($msg, $http = 400) {
  http_response_code($http);
  echo json_encode(['sucesso' => false, 'mensagem' => $msg]);
  exit;
}

// Agora os dados vêm via POST (FormData)
$dados = $_POST;
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
$email      = trim($dados['email'] ?? '');
$transporte = trim($dados['transporte'] ?? '');
$sangue     = trim($dados['sangue'] ?? '');
$grupo      = trim($dados['grupo'] ?? '');
$cargo      = trim($dados['cargo'] ?? '');

// Avatar (upload de arquivo)
$avatar = null;
if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
  $uploadDir = __DIR__ . '/../images/pessoal/';
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
  }
  $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
  $nomeArquivo = uniqid('avatar_') . '.' . strtolower($ext);
  $destino = $uploadDir . $nomeArquivo;

  if (move_uploaded_file($_FILES['avatar']['tmp_name'], $destino)) {
    $avatar = $nomeArquivo;
  }
}

// Se for UPDATE, verifica existência
$existe = false;
if ($id) {
  $check = $conn->prepare("SELECT id, avatar FROM dadospessoal WHERE id = ?");
  if (!$check) json_fail('Erro no prepare (check): ' . $conn->error, 500);
  $check->bind_param("i", $id);
  $check->execute();
  $check->store_result();
  $existe = $check->num_rows > 0;
  $check->bind_result($idExistente, $avatarExistente);
  $check->fetch();
  $check->close();

  // Se não enviar novo avatar, mantém o anterior
  if (!$avatar) {
    $avatar = $avatarExistente;
  }
}

if ($existe) {
  // UPDATE (inclui email e avatar)
  $sql = "UPDATE dadospessoal
            SET nome=?, nometodo=?, chave=?, matricula=?, telefone=?, email=?, transporte=?, sangue=?, grupo=?, cargo=?, avatar=?
          WHERE id=?";
  $stmt = $conn->prepare($sql);
  if (!$stmt) json_fail('Erro no prepare (UPDATE): ' . $conn->error, 500);

  $ok = $stmt->bind_param(
    "sssssssssssi",
    $nome, $nometodo, $chave, $matricula, $telefone, $email,
    $transporte, $sangue, $grupo, $cargo, $avatar, $id
  );
  if (!$ok) json_fail('Erro no bind_param (UPDATE): ' . $stmt->error, 500);

} else {
  // INSERT (inclui email e avatar)
  $sql = "INSERT INTO dadospessoal
            (nome, nometodo, chave, matricula, telefone, email, transporte, sangue, grupo, cargo, avatar)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  if (!$stmt) json_fail('Erro no prepare (INSERT): ' . $conn->error, 500);

  $ok = $stmt->bind_param(
    "sssssssssss",
    $nome, $nometodo, $chave, $matricula, $telefone, $email,
    $transporte, $sangue, $grupo, $cargo, $avatar
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
