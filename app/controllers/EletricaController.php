<?php

require_once __DIR__ . '/../models/EletricaModel.php';

class EletricaController
{
    public function index()
    {
        // Futuramente: $model = new EletricaModel();
        // $dados = $model->buscarTodos();

        require_once __DIR__ . '/../views/eletrica/index.php';
    }
}
