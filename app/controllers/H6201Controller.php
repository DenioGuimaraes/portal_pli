<?php
require_once __DIR__ . '/../models/H6201Model.php';

class H6201Controller
{
    public function index()
    {
        $model = new H6201Model();
        $dados = $model->getTodos();

        require_once __DIR__ . '/../views/h6201/index.php';
    }

    // GET: index.php?url=H6201Controller/carregar
    public function carregar()
    {
        $model = new H6201Model();
        $itens = $model->getTodos();

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['ok' => true, 'itens' => $itens],
            JSON_UNESCAPED_UNICODE
        );
    }

    // POST: index.php?url=H6201Controller/salvar
    public function salvar()
    {
        header('Content-Type: application/json; charset=utf-8');

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        $id        = $data['id']        ?? null;
        $piloto    = $data['piloto']    ?? null;
        $queimador = $data['queimador'] ?? null;

        $model = new H6201Model();
        $ok = $model->atualizar($id, $piloto, $queimador);

        echo json_encode(['ok' => (bool)$ok], JSON_UNESCAPED_UNICODE);
    }

}
