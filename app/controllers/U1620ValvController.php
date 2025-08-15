<?php

require_once __DIR__ . '/../models/U1620ValvModel.php';

class U1620ValvController
{
    public function index()
    {
        require_once __DIR__ . '/../views/u1620valv/index.php';
    }

    public function buscar()
    {
        $termo = $_GET['termo'] ?? '';
        $model = new U1620ValvModel();
        $dados = $termo !== '' 
            ? $model->u1620ValvBuscarPorTermo($termo) 
            : $model->u1620ValvListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    public function todos()
    {
        $model = new U1620ValvModel();
        $dados = $model->u1620ValvListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }
}
