<?php
header('Content-Type: application/json');

// Lê os dados brutos do corpo da requisição
$input = file_get_contents("php://input");
$dados = json_decode($input, true);

// Verifica se os dados estão presentes
if (!$dados || !isset($dados['nome'])) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Dados inválidos ou incompletos.'
    ]);
    exit;
}

// Aqui você pode conectar ao banco e atualizar ou inserir, por enquanto simulamos sucesso:
echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Registro salvo com sucesso!'
]);
