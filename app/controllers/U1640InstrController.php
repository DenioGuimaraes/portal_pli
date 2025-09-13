<?php
require_once __DIR__ . '/../models/U1640InstrModel.php';

class U1640InstrController
{
    private $model;

    public function __construct()
    {
        $this->model = new U1640InstrModel();
    }

    // === 1. Abre a view principal ===
    public function index()
    {
        $u1640instr = $this->model->u1640instrGetAll();
        require_once __DIR__ . '/../views/u1640instr/index.php';
    }

    // === 2. Retorna JSON com todos os instrumentos ===
    public function u1640instrListarJson()
    {
        $u1640instr = $this->model->u1640instrGetAll();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($u1640instr, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 3. Retorna JSON de um instrumento específico ===
    public function u1640instrGetById($id)
    {
        $u1640instr = $this->model->u1640instrGetById($id);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($u1640instr, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 4. Cria novo instrumento (POST) ===
    public function u1640instrCreate()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["descricao"]) || empty($input["tag"])) {
            echo json_encode(["success" => false, "message" => "Campos obrigatórios não preenchidos."]);
            exit;
        }

        $grupo = $input["grupo"];
        $tag = $input["tag"];
        $descricao = $input["descricao"];

        $ok = $this->model->u1640instrCreate($grupo, $tag, $descricao);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 5. Atualiza instrumento existente (POST) ===
    public function u1640instrUpdate()
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

        $ok = $this->model->u1640instrUpdate($id, $grupo, $tag, $descricao);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 6. Exclui instrumento (POST) ===
    public function u1640instrDelete()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["id"])) {
            echo json_encode(["success" => false, "message" => "ID não informado."]);
            exit;
        }

        $id = (int) $input["id"];
        $ok = $this->model->u1640instrDelete($id);
        echo json_encode(["success" => $ok]);
        exit;
    }
}
