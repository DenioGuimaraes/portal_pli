<?php
require_once __DIR__ . '/../models/EmergenciaModel.php';

class EmeracessarController
{
    public function index()
    {
        $emergenciaId = isset($_GET['emergencia_id']) ? (int)$_GET['emergencia_id'] : 0;

        $dados  = null;   // dados gerais da emergência
        $passos = [];     // lista de passos

        try {
            $model = new EmergenciaModel();

            if ($emergenciaId > 0) {
                // busca a emergência
                $dados = $model->obterEmergencia($emergenciaId);

                // busca os passos vinculados
                $passos = $model->listarPassos($emergenciaId);
            }
        } catch (Throwable $e) {
            // opcional: logar erro ou exibir mensagem de falha
        }

        // também deixo id separado, se precisar
        $emergencia_id = $emergenciaId;

        // variáveis disponíveis na view:
        // $dados  -> array com campos da tabela emergencias
        // $passos -> array de passos (cada um com id, ordem, rotulo, detalhe)

        require __DIR__ . '/../views/emeracessar/index.php';
    }
}
