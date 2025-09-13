<?php
require_once __DIR__ . '/../models/U1640ValvModel.php';

class U1640ValvController
{
    private $model;

    public function __construct()
    {
        $this->model = new U1640ValvModel();
    }

    // === 1. Abre a view principal ===
    public function index()
    {
        $u1640valv = $this->model->u1640valvGetAll();
        require_once __DIR__ . '/../views/u1640valv/index.php';
    }

    // === 2. Retorna JSON com todos os valvumentos ===
    public function u1640valvListarJson()
    {
        $u1640valv = $this->model->u1640valvGetAll();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($u1640valv, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 3. Retorna JSON de um valvumento específico ===
    public function u1640valvGetById($id)
    {
        $u1640valv = $this->model->u1640valvGetById($id);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($u1640valv, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 4. Cria novo valvumento (POST) ===
    public function u1640valvCreate()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["descricao"]) || empty($input["tag"])) {
            echo json_encode(["success" => false, "message" => "Campos obrigatórios não preenchidos."]);
            exit;
        }

        $grupo = $input["grupo"];
        $tag = $input["tag"];
        $descricao = $input["descricao"];

        $ok = $this->model->u1640valvCreate($grupo, $tag, $descricao);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 5. Atualiza valvumento existente (POST) ===
    public function u1640valvUpdate()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["id"]) || empty($input["descricao"]) || empty($input["tag"])) {
            echo json_encode(["success" => false, "message" => "Campos obrigatórios não preenchidos."]);
            exit;
        }

        $id = (int) $input["id"];
        $grupo = $input["grupo"];
        $tag = $input["tag"];
        $descricao = $input["descricao"];

        $ok = $this->model->u1640valvUpdate($id, $grupo, $tag, $descricao);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 6. Exclui valvumento (POST) ===
    public function u1640valvDelete()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["id"])) {
            echo json_encode(["success" => false, "message" => "ID não informado."]);
            exit;
        }

        $id = (int) $input["id"];
        $ok = $this->model->u1640valvDelete($id);
        echo json_encode(["success" => $ok]);
        exit;
    }
}
