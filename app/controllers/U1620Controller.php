<?php
require_once __DIR__ . '/../models/U1620Model.php';

class U1620Controller extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new U1620Model();
    }

    public function index()
    {
        // DEBUG temporário — mostra erros de PHP na tela
        ini_set('display_errors', '1');
        error_reporting(E_ALL);

        header('Content-Type: text/html; charset=utf-8');

        echo "<!-- U1620Controller.index START -->\n";

        $view = __DIR__ . '/../views/u1620/index.php';
        echo "<!-- view path: " . htmlspecialchars($view) . " -->\n";

        if (!file_exists($view)) {
            echo "<pre style='color:red'>View NÃO encontrada:\n$view</pre>";
            echo "<!-- U1620Controller.index END (missing view) -->";
            return;
        }

        // Troque require_once por include para não matar o processo se der erro
        include $view;

        echo "<!-- U1620Controller.index END -->\n";
    }

    // GET  index.php?url=U1620Controller/estado
    public function estado()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $e = $this->model->obterAtual();
            echo json_encode([
                'ok'    => true,
                'rvc'   => (float)$e['rvc'],
                'carga' => (float)$e['carga'],
            ]);
        } catch (Throwable $ex) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'msg' => 'Erro ao consultar', 'err' => $ex->getMessage()]);
        }
    }

    // POST index.php?url=U1620Controller/salvar
    // Body JSON: { "rvc": 5.5, "carga": 12000.0 }
    public function salvar()
    {
        header('Content-Type: application/json; charset=utf-8');

        $dados = json_decode(file_get_contents('php://input'), true);
        if (!is_array($dados)) $dados = $_POST;

        if (!isset($dados['rvc'], $dados['carga']) || !is_numeric($dados['rvc']) || !is_numeric($dados['carga'])) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'msg' => 'Parâmetros inválidos']);
            return;
        }

        // normalização básica (RVC 0..10, 1 casa decimal; carga 1 casa)
        $rvc   = max(0.0, min(10.0, round((float)$dados['rvc'],   1)));
        $carga = round((float)$dados['carga'], 1);

        try {
            $ok = $this->model->salvar($rvc, $carga);
            if (!$ok) {
                http_response_code(500);
                echo json_encode(['ok' => false, 'msg' => 'Falha ao salvar']);
                return;
            }
            echo json_encode(['ok' => true, 'rvc' => $rvc, 'carga' => $carga]);
        } catch (Throwable $ex) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'msg' => 'Erro ao salvar', 'err' => $ex->getMessage()]);
        }
    }
}
