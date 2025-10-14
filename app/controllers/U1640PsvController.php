<?php
require_once __DIR__ . '/../models/U1640PsvModel.php';

class U1640PsvController
{
    private $model;

    public function __construct()
    {
        $this->model = new U1640PsvModel();
    }

    public function index()
    {
        // Carrega a view padrão do painel PSV da U-1640
        require_once __DIR__ . '/../views/u1640psv/index.php';
    }

    // 🔹 Lista todas as PSV (JSON)
    public function listar()
    {
        $dados = $this->model->u1640psvGetAll();

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($dados);
        exit;
    }

    // 🔹 Retorna uma PSV pelo ID (JSON)
    public function obter()
    {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $registro = $this->model->u1640psvGetById($id);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($registro);
        exit;
    }

    // 🔹 Cria uma nova PSV (JSON)
    public function criar()
    {
        $ok = $this->model->u1640psvCreate($_POST);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => $ok ? 'success' : 'error']);
        exit;
    }

    // 🔹 Atualiza uma PSV (JSON)
    public function atualizar()
    {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $ok = $this->model->u1640psvUpdate($id, $_POST);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => $ok ? 'success' : 'error']);
        exit;
    }

    // 🔹 Deleta uma PSV (JSON)
    public function deletar()
    {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $ok = $this->model->u1640psvDelete($id);

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => $ok ? 'success' : 'error']);
        exit;
    }
}
