<?php

require_once __DIR__ . '/../models/DadosPessoalModel.php';

class DadosPessoalController
{
    public function index()
    {
        $model = new DadosPessoalModel();
        $dados = $model->buscarTodos();

        require_once __DIR__ . '/../views/dadospessoal/index.php';
    }

    public function buscar(){
        if (isset($_GET['termo'])) {
            $termo = $_GET['termo'];

            $model = new DadosPessoalModel();
            $dados = $model->buscarPorNome($termo);

            header('Content-Type: application/json');
            echo json_encode($dados);
        }
    }
}
