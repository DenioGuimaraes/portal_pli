<?php
require_once __DIR__ . '/../models/InicioModel.php';

class InicioController extends Controller
{
    public function index()
    {
        //funções futuras aqui
        // $model = new InicioModel();
        // $dados = $model->obterResumo();

        require_once __DIR__ . '/../views/inicio/index.php';
    }
}
