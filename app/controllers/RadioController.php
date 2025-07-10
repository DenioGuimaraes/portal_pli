<?php

require_once __DIR__ . '/../models/RadioModel.php';

class RadioController
{
    public function index()
    {
        // Futuramente: $model = new RadioModel();
        // $dados = $model->buscarTodos();

        require_once __DIR__ . '/../views/radio/index.php';
    }
}
