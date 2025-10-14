<?php

require_once __DIR__ . '/../models/AlterarPessoalModel.php';

class AlterarPessoalController
{
    public function index()
    {
        $model = new AlterarPessoalModel();
        $dados = $model->buscarTodosOrdenado(); // agora sim carrega os dados

        require_once __DIR__ . '/../views/alterarpessoal/index.php';
    }
}
