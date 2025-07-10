<?php
$secao = $_GET['secao'] ?? ($_GET['pagina'] ?? null);


if ($secao) {
    $controllerName = ucfirst($secao) . 'Controller';
    $controllerPath = __DIR__ . "/../../app/controllers/{$controllerName}.php";

    if (file_exists($controllerPath)) {
        require_once $controllerPath;

        if (class_exists($controllerName)) {
            $controller = new $controllerName();
            $controller->index();
        } else {
            echo "<p>Classe '{$controllerName}' não encontrada.</p>";
        }
    } else {
        echo "<p>Arquivo do controller '{$controllerName}' não encontrado.</p>";
    }
} else {
    echo "<p>Seção não informada.</p>";
}
