<?php

require_once __DIR__ . '/../models/AdministrativoModel.php';

class AdministrativoController
{
    public function index()
    {
        // $model = new AdministrativoModel();
        // Se quiser usar $model->algumaCoisa() no futuro, está pronto

        require_once __DIR__ . '/../views/administrativo/index.php';
    }
}
