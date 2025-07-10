<?php

require_once __DIR__ . '/../models/AmostragemModel.php';

class AmostragemController
{
    public function index()
    {
        // Futuramente: $model = new AmostragemModel();
        // $dados = $model->buscarTodos();

        require_once __DIR__ . '/../views/amostragem/index.php';
    }
}
