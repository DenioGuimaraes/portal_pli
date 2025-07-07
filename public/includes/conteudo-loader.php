<?php
require_once __DIR__ . '/../../app/controllers/DadosPessoalController.php';
$controller = new DadosPessoalController();
$controller->index(); // isso irá carregar a view com $dados preenchido

$pagina = $_GET['pagina'] ?? '';

$mapa = [
    'dadospessoal' => __DIR__ . '/../../app/views/dadospessoal/index.php',
    // você pode adicionar mais rotas aqui conforme for criando:
    // 'listatelefonica' => __DIR__ . '/../../app/views/telefonica/index.php',
    // 'amostragens' => __DIR__ . '/../../app/views/amostragens/index.php',
];

if (array_key_exists($pagina, $mapa) && file_exists($mapa[$pagina])) {
    require_once $mapa[$pagina];
} else {
    echo "<p>Página não encontrada.</p>";
}
