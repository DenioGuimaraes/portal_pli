<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Define que a resposta será em JSON
header('Content-Type: application/json');

// Lê os dados brutos da requisição
$input = file_get_contents("php://input");
$dados = json_decode($input, true);

// Verifica se os dados essenciais foram recebidos
if (!$dados || !isset($dados['nome'])) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Dados inválidos ou incompletos.'
    ]);
    exit;
}

// Conecta ao banco de dados
$conn = new mysqli('localhost', 'root', '', 'Portal_PLI');
if ($conn->connect_error) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao conectar ao banco: ' . $conn->connect_error
    ]);
    exit;
}

// Decide se será INSERT ou UPDATE
$id = $dados['id'] ?? null;
$id = trim($id) === '' ? null : $id;

$existe = false;
if ($id) {
    $check = $conn->prepare("SELECT id FROM dadospessoal WHERE id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $check->store_result();
    $existe = $check->num_rows > 0;
    $check->close();
}

$nometodo = $dados['nometodo'] ?? '';

if ($existe) {
    // Atualizar
    $stmt = $conn->prepare("UPDATE dadospessoal SET nome=?, nometodo=?, chave=?, matricula=?, telefone=?, transporte=?, sangue=?, grupo=?, cargo=? WHERE id=?");
    $stmt->bind_param(
        "sssssssssi",
        $dados['nome'],
        $dados['nometodo'],
        $dados['chave'],
        $dados['matricula'],
        $dados['telefone'],
        $dados['transporte'],
        $dados['sangue'],
        $dados['grupo'],
        $dados['cargo'],
        $id
    );
} else {
    // Inserir
    $stmt = $conn->prepare("INSERT INTO dadospessoal (nome, nometodo, chave, matricula, telefone, transporte, sangue, grupo, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssssssss",
        $dados['nome'],
        $dados['nometodo'],
        $dados['chave'],
        $dados['matricula'],
        $dados['telefone'],
        $dados['transporte'],
        $dados['sangue'],
        $dados['grupo'],
        $dados['cargo']
    );
}

// Executa e envia a resposta
if ($stmt->execute()) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Registro salvo com sucesso!'
    ]);
} else {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao salvar: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
