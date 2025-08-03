<?php

require_once __DIR__ . '/../models/ListaTelefonicaModel.php';

class ListaTelefonicaController
{
    public function index()
    {
        require_once __DIR__ . '/../views/listatelefonica/index.php';
    }

    public function buscar()
    {
        $termo = $_GET['termo'] ?? '';
        $model = new ListaTelefonicaModel();
        $dados = $termo !== '' 
            ? $model->telefoneBuscarPorTermo($termo) 
            : $model->telefoneListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    public function todos()
    {
        $model = new ListaTelefonicaModel();
        $dados = $model->telefoneListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }
}
