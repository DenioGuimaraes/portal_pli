<?php
require_once __DIR__ . '/../models/TelefonesModel.php';

class TelefonesController
{
    private $model;

    public function __construct()
    {
        $this->model = new TelefonesModel();
    }

    // === 1. Abre a view principal ===
    public function index()
    {
        $telefones = $this->model->telGetAll();
        require_once __DIR__ . '/../views/telefones/index.php';
    }

    // === 2. Retorna JSON com todos os telefones ===
    public function telListarJson()
    {
        $telefones = $this->model->telGetAll();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($telefones, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 3. Retorna JSON de um telefone específico ===
    public function telGetById($id)
    {
        $telefone = $this->model->telGetById($id);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($telefone, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // === 4. Cria novo telefone (POST) ===
    public function telCreate()
    {
        // pega o corpo cru e decodifica
        $raw   = file_get_contents("php://input");
        $input = json_decode($raw, true);

        // debug opcional: salva no log do Apache/XAMPP
        error_log("TELCREATE RAW: " . $raw);
        error_log("TELCREATE ARRAY: " . print_r($input, true));

        // validação mais segura
        if (
            !$input ||
            !isset($input["grupo"]) || trim($input["grupo"]) === "" ||
            !isset($input["descricao"]) || trim($input["descricao"]) === "" ||
            !isset($input["ramal"]) || trim($input["ramal"]) === ""
        ) {
            echo json_encode([
                "success" => false,
                "message" => "Campos obrigatórios não preenchidos.",
                "debug"   => $input // 👈 ajuda a ver no console do navegador também
            ]);
            exit;
        }

        // compatibiliza nomes
        $tel_grupo     = trim($input["grupo"]);
        $tel_descricao = trim($input["descricao"]);
        $tel_ramal     = trim($input["ramal"]);

        $ok = $this->model->telCreate($tel_grupo, $tel_descricao, $tel_ramal);

        echo json_encode([
            "success" => $ok,
            "dados"   => [
                "grupo"     => $tel_grupo,
                "descricao" => $tel_descricao,
                "ramal"     => $tel_ramal
            ]
        ]);
        exit;
    }


    // === 5. Atualiza telefone existente (POST) ===
    public function telUpdate()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["id"]) || empty($input["descricao"]) || empty($input["ramal"])) {
            echo json_encode(["success" => false, "message" => "Campos obrigatórios não preenchidos."]);
            exit;
        }

        $id            = (int) $input["id"];
        $tel_grupo     = $input["grupo"];
        $tel_descricao = $input["descricao"];
        $tel_ramal     = $input["ramal"];

        $ok = $this->model->telUpdate($id, $tel_grupo, $tel_descricao, $tel_ramal);
        echo json_encode(["success" => $ok]);
        exit;
    }

    // === 6. Exclui telefone (POST) ===
    public function telDelete()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input["id"])) {
            echo json_encode(["success" => false, "message" => "ID não informado."]);
            exit;
        }

        $id = (int) $input["id"];
        $ok = $this->model->telDelete($id);
        echo json_encode(["success" => $ok]);
        exit;
    }
}
