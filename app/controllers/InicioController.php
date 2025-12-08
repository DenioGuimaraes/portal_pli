<?php
require_once __DIR__ . '/../models/InicioModel.php';
require_once __DIR__ . '/../models/DadosPessoalModel.php';

class InicioController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new InicioModel();
    }

    public function index()
    {
        require_once __DIR__ . '/../views/inicio/index.php';
    }

    // === 1. Retorna o registro do resumo operacional
    public function buscarResumoOperacional()
    {
        $resumo = $this->model->buscarResumoPorId(1);

        header('Content-Type: application/json');
        echo json_encode($resumo);
    }

    // === 2. Salva o resumo operacional
    public function salvarResumo()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        $resultado = $this->model->salvarResumoNoBanco($dados);

        echo json_encode(['sucesso' => $resultado]);
    }

    // === 3. Buscar operadores (já existia)
    public function buscarOperadores()
    {
        $dados = $this->model->buscarPorCargo('Operador');
        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    // === 4. Buscar anotação (já existia)
    public function buscarAnotacao()
    {
        $texto = $this->model->buscarAnotacao();
        echo json_encode(['texto' => $texto]);
    }

    // === 5. Salvar anotação (já existia)
    public function salvarAnotacao()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        if (isset($dados['texto'])) {
            $sucesso = $this->model->salvarAnotacao($dados['texto']);
            echo json_encode(['sucesso' => $sucesso]);
        } else {
            echo json_encode(['sucesso' => false, 'erro' => 'Texto não enviado']);
        }
    }


    /* ============================================================
       ===   HISTÓRICO CARGA / PRODUTO – U-1640                ===
       ============================================================ */

    // === 6. Retornar o último registro do histórico
    public function buscarUltimoHistorico()
    {
        $ultimo = $this->model->buscarUltimoHistorico();

        header('Content-Type: application/json');
        echo json_encode($ultimo); // pode ser null se tabela estiver vazia
    }


    // === 7. Inserir um novo registro no histórico
    public function inserirHistorico()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        if (!$dados) {
            echo json_encode(['sucesso' => false, 'erro' => 'JSON inválido ou ausente']);
            return;
        }

        $ok = $this->model->inserirHistorico($dados);

        echo json_encode(['sucesso' => $ok]);
    }

    public function listarHistorico()
    {
        $lista = $this->model->listarHistorico();
        header('Content-Type: application/json');
        echo json_encode($lista);
    }

    public function editarHistorico()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        if (!$dados) {
            echo json_encode(['sucesso' => false, 'erro' => 'JSON inválido']);
            return;
        }

        $ok = $this->model->editarHistorico($dados);

        echo json_encode(['sucesso' => $ok]);
    }

    public function excluirHistorico()
    {
        $dados = json_decode(file_get_contents('php://input'), true);

        if (!isset($dados['id'])) {
            echo json_encode([
                'sucesso' => false,
                'erro' => 'ID não enviado'
            ]);
            return;
        }

        $ok = $this->model->excluirHistorico($dados['id']);

        echo json_encode([
            'sucesso' => $ok
        ]);
    }
}
