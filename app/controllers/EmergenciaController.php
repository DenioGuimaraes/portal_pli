<?php

require_once __DIR__ . '/../models/EmergenciaModel.php';

class EmergenciaController
{
    public function index()
    {
        $model = new EmergenciaModel();
        // $dados = $model->metodoFuturo();

        require_once __DIR__ . '/../views/emergencia/index.php';
    }
}
