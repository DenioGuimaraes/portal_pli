<?php
require_once __DIR__ . '/../models/U1620InstrModel.php';

class U1620InstrController
{
    private $model;

    public function __construct()
    {
        $this->model = new U1620InstrModel();
    }

    // === 1. Abre a view principal ===
    public function index()
    {
        $u1620instr = $this->model->u1620instrGetAll();
        require_once __DIR__ . '/../views/u1620instr/index.php';
    }

    // === 2. Retorna JSON com todos os instrumentos ===
    public function u1620instrListarJson()
    {
        $u1620instr = $this->model->u1620instrGetAll();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($u1620instr, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 3. Retorna JSON de um instrumento específico ===
    public function u1620instrGetById($id)
    {
        $u1620instr = $this->model->u1620instrGetById($id);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($u1620instr, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 4. Cria novo instrumento (POST) ===
    public function u1620instrCreate()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["descricao"]) || empty($input["tag"])) {
            echo json_encode(["success" => false, "message" => "Campos obrigatórios não preenchidos."]);
            exit;
        }

        $grupo = $input["grupo"];
        $tag = $input["tag"];
        $descricao = $input["descricao"];

        $ok = $this->model->u1620instrCreate($grupo, $tag, $descricao);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 5. Atualiza instrumento existente (POST) ===
    public function u1620instrUpdate()
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

        $ok = $this->model->u1620instrUpdate($id, $grupo, $tag, $descricao);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 6. Exclui instrumento (POST) ===
    public function u1620instrDelete()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["id"])) {
            echo json_encode(["success" => false, "message" => "ID não informado."]);
            exit;
        }

        $id = (int) $input["id"];
        $ok = $this->model->u1620instrDelete($id);
        echo json_encode(["success" => $ok]);
        exit;
    }
}
