<?php
require_once __DIR__ . '/../models/InicioModel.php';
require_once __DIR__ . '/../models/DadosPessoalModel.php';


class InicioController extends Controller
{
    private $model;

    public function __construct()
    {
        // Instancia o model específico desse controller
        $this->model = new InicioModel();
    }

    public function index()
    {
        // Página principal do painel Início
        require_once __DIR__ . '/../views/inicio/index.php';
    }

    // === 1. Nova função: retorna os dados do resumo operacional (em JSON)
    public function buscarResumoOperacional()
    {
        // Chama o Model e busca o registro com id = 1
        $resumo = $this->model->buscarResumoPorId(1);

        // Define o cabeçalho como JSON e envia os dados para o frontend
        header('Content-Type: application/json');
        echo json_encode($resumo);
    }

    public function salvarResumo()
    {
        $dados = json_decode(file_get_contents('php://input'), true);
        $this->model('InicioModel');
        $resultado = $this->model->salvarResumoNoBanco($dados);

        echo json_encode(['sucesso' => $resultado]);
    }

    public function buscarOperadores() {
        $model = new DadosPessoalModel();
        $dados = $model->buscarPorCargo('Operador');
        header('Content-Type: application/json');
        echo json_encode($dados);
    }



}
