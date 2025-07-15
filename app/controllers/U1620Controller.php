<?php

require_once __DIR__ . '/../models/U1620Model.php';

class U1620Controller
{
    public function index()
    {
        //$model = new U1620Model();
        // $dados = $model->metodoFuturo();

        require_once __DIR__ . '/../views/u1620/index.php';
    }
}
