<?php

require_once __DIR__ . '/../models/ListaTelefonicaModel.php';

class ListaTelefonicaController
{
    public function index()
    {
        $model = new ListaTelefonicaModel();
        $dados = $model->buscarTodos(); // você pode adaptar isso depois

        require_once __DIR__ . '/../views/listatelefonica/index.php';
    }

    public function buscar() {
        if (isset($_GET['termo'])) {
            $termo = $_GET['termo'];

            $model = new ListaTelefonicaModel();
            $dados = $model->buscarPorTermo($termo); // você define esse método

            header('Content-Type: application/json');
            echo json_encode($dados);
        }
    }

}
