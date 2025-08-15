<?php

require_once __DIR__ . '/../models/U1620InstrModel.php';

class U1620InstrController
{
    public function index()
    {
        require_once __DIR__ . '/../views/u1620instr/index.php';
    }

    public function buscar()
    {
        $termo = $_GET['termo'] ?? '';
        $model = new U1620InstrModel();
        $dados = $termo !== '' 
            ? $model->u1620InstrBuscarPorTermo($termo) 
            : $model->u1620InstrListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    public function todos()
    {
        $model = new U1620InstrModel();
        $dados = $model->u1620InstrListarTodos();

        header('Content-Type: application/json');
        echo json_encode($dados);
    }
}
