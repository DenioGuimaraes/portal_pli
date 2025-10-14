<?php
require_once __DIR__ . '/../models/EmergerencModel.php';

class EmergerencController
{
    public function index()
    {
        require_once __DIR__ . '/../views/emergerenc/index.php';
    }

    public function detalhes()
    {
        header('Content-Type: application/json; charset=utf-8');

        $id = isset($_GET['emergencia_id']) ? (int)$_GET['emergencia_id'] : 0;
        if ($id <= 0) {
            echo json_encode(['ok' => false, 'erro' => 'ID ausente ou inválido']);
            return;
        }

        try {
            $model = new EmergerencModel();

            $emergencia = $model->getEmergencia($id);
            $passos     = $model->getPassos($id);

            if (!$emergencia) {
                echo json_encode(['ok' => false, 'erro' => 'Emergência não encontrada']);
                return;
            }

            echo json_encode([
                'ok'         => true,
                'emergencia' => $emergencia,
                'passos'     => $passos
            ]);
        } catch (\Throwable $e) {
            echo json_encode(['ok' => false, 'erro' => $e->getMessage()]);
        }
    }

    public function emergerencSalvar()
    {
        header('Content-Type: application/json; charset=utf-8');

        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true);

        $emergenciaId = $data['emergencia_id'] ?? null;
        $emergencia   = $data['emergencia']    ?? null;
        $passos       = $data['passos']        ?? null;

        if (!$emergenciaId) {
            echo json_encode(['ok' => false, 'msg' => 'ID da emergência ausente']);
            return;
        }

        try {
            $model = new EmergerencModel();

            // Atualiza dados gerais da emergência
            if (is_array($emergencia)) {
                $model->salvarEmergencia((int)$emergenciaId, $emergencia);
            }

            // Atualiza lista de passos
            if (is_array($passos)) {
                $model->salvarPassos((int)$emergenciaId, $passos);
            }

            echo json_encode(['ok' => true]);
        } catch (\Throwable $e) {
            echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
        }
    }
}
