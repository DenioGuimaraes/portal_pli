<?php
// app/controllers/EmergenciaController.php

class EmergenciaController
{
    private $model;

    public function __construct()
    {
        require_once __DIR__ . '/../models/EmergenciaModel.php';
        $this->model = new EmergenciaModel();
    }

    // Renderiza o painel (já está mapeado para abrir o /views/emergencia/index.php)
    public function index()
    {
        require __DIR__ . '/../views/emergencia/index.php';
    }

    // GET ?url=EmergenciaController/listarTudo&q=termo
    // Retorna { ok:true, grupos:{ "1":[...], "2":[...], "3":[...] }, query:"..." }
    public function listarTudo()
    {
        $q = isset($_GET['q']) ? trim((string)$_GET['q']) : '';

        try {
            $grupos = [1, 2, 3];
            $resp = [];
            foreach ($grupos as $gid) {
                $resp[(string)$gid] = $this->model->listarPorGrupo($gid, $q);
            }
            return $this->json([
                'ok'     => true,
                'grupos' => $resp,
                'query'  => $q
            ]);
        } catch (Throwable $e) {
            return $this->json(['ok' => false, 'erro' => 'Falha ao listar emergências.'], 500);
        }
    }

    // GET ?url=EmergenciaController/listarPorGrupo&grupo_id=1&q=termo
    // Retorna { ok:true, grupo_id:1, itens:[...] }
    public function listarPorGrupo()
    {
        $grupoId = isset($_GET['grupo_id']) ? (int)$_GET['grupo_id'] : 0;
        $q       = isset($_GET['q']) ? trim((string)$_GET['q']) : '';

        if ($grupoId < 1) {
            return $this->json(['ok' => false, 'erro' => 'grupo_id inválido.'], 400);
        }

        try {
            $itens = $this->model->listarPorGrupo($grupoId, $q);
            return $this->json([
                'ok'       => true,
                'grupo_id' => $grupoId,
                'itens'    => $itens,
                'query'    => $q
            ]);
        } catch (Throwable $e) {
            return $this->json(['ok' => false, 'erro' => 'Falha ao listar por grupo.'], 500);
        }
    }

    // Utilitário para responder JSON
    private function json(array $data, int $status = 200)
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return null;
    }

    public function novaEmergencia() {
        header('Content-Type: application/json; charset=utf-8');

        try {
            $raw = file_get_contents("php://input");
            $data = json_decode($raw, true);

            if (!$data) {
                echo json_encode(['ok' => false, 'msg' => 'Payload inválido']);
                return;
            }

            $titulo = trim($data['titulo'] ?? '');
            $grupoId = intval($data['grupo_id'] ?? 0);

            if ($titulo === '' || $grupoId <= 0) {
                echo json_encode(['ok' => false, 'msg' => 'Campos obrigatórios ausentes']);
                return;
            }

            $emergenciaModel = new EmergenciaModel();
            $novoId = $emergenciaModel->criarEmergencia([
                'titulo'         => $titulo,
                'grupo_id'       => $grupoId,
                'identificadores'=> $data['identificadores'] ?? '',
                'causas'         => $data['causas'] ?? '',
                'impacto'        => $data['impacto'] ?? '',
                'contatos'       => $data['contatos'] ?? '',
                'passos'         => $data['passos'] ?? []
            ]);

            if ($novoId) {
                echo json_encode(['ok' => true, 'id' => $novoId]);
            } else {
                echo json_encode(['ok' => false, 'msg' => 'Falha ao inserir emergência']);
            }

        } catch (Exception $e) {
            echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
        }
    }
}
