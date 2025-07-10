<?php

require_once __DIR__ . '/../models/OnibusModel.php';

class OnibusController
{
    public function index()
    {
        // Futuramente: $model = new OnibusModel();
        // $dados = $model->buscarTodos();

        require_once __DIR__ . '/../views/onibus/index.php';
    }
}
