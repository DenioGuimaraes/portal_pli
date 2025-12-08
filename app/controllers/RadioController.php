<?php

require_once __DIR__ . '/../models/RadioModel.php';

class RadioController
{
    public function index()
    {
        require_once __DIR__ . '/../views/radio/index.php';
    }

    public function buscar()
    {
        $termo = $_GET['termo'] ?? '';
        $model = new RadioModel();
        $dados = $termo !== '' 
            ? $model->radioBuscarPorTermo($termo) 
            : $model->radioListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    public function todos()
    {
        $model = new RadioModel();
        $dados = $model->radioListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }
}
