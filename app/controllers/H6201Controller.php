<?php
require_once __DIR__ . '/../models/H6201Model.php';

class H6201Controller extends Controller {

    private $model;

    public function __construct() {
        $this->model = new H6201Model();  // <<< AGORA existe
    }

    public function index()
    {
        $model = new H6201Model();
        $dados = $model->getTodos();

        require_once __DIR__ . '/../views/h6201/index.php';
    }

    // GET: index.php?url=H6201Controller/carregar
    public function carregar()
    {
        $model = new H6201Model();
        $itens = $model->getTodos();

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['ok' => true, 'itens' => $itens],
            JSON_UNESCAPED_UNICODE
        );
    }

    // POST (JSON): index.php?url=H6201Controller/salvar
    // Espera JSON: { id, piloto, queimador, manutencao_data } 
    // onde manutencao_data = 'YYYY-MM-DD' | '' | null
    public function salvar()
    {
        header('Content-Type: application/json; charset=utf-8');

        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true);

        $id               = $data['id']               ?? null;
        $piloto           = $data['piloto']           ?? null;
        $queimador        = $data['queimador']        ?? null;
        $manutencao_data  = $data['manutencao_data']  ?? null; // NOVO

        $model = new H6201Model();
        // Model já valida e normaliza a data
        $ok = $model->atualizar($id, $piloto, $queimador, $manutencao_data);

        echo json_encode(['ok' => (bool)$ok], JSON_UNESCAPED_UNICODE);
    }

    // --- NOVO: GAS COMBUSTÍVEL (GC) ---

    // GET: index.php?url=H6201Controller/carregargc
    // Retorna:
    // { ok: true, pressoes: { 1:{oeste: 0.00, leste: 0.00}, ... 4:{...} } }
    public function carregargc()
    {
        header('Content-Type: application/json; charset=utf-8');

        $model = new H6201Model();
        $rows  = $model->gcListar(); // espera: [ ['plataforma'=>1,'lado'=>'O','valor'=>12.34], ... ]

        // matriz base (1..4) com chaves 'oeste'/'leste'
        $out = [
            1 => ['oeste' => null, 'leste' => null],
            2 => ['oeste' => null, 'leste' => null],
            3 => ['oeste' => null, 'leste' => null],
            4 => ['oeste' => null, 'leste' => null],
        ];

        foreach ($rows as $r) {
            $p    = (int)$r['plataforma'];
            if ($p < 1 || $p > 4) continue;

            $lado = ($r['lado'] === 'O') ? 'oeste' : 'leste';
            $out[$p][$lado] = isset($r['valor']) ? (float)$r['valor'] : null;
        }

        echo json_encode(['ok' => true, 'pressoes' => $out], JSON_UNESCAPED_UNICODE);
    }

    // POST: index.php?url=H6201Controller/salvar_gc
    // Body JSON esperado: { plataforma: 1..4, lado: "oeste"|"leste"| "O"|"L", valor: "12,34"|"12.34"|"" }
    public function salvar_gc()
    {
        header('Content-Type: application/json; charset=utf-8');

        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true);

        $plataforma = isset($data['plataforma']) ? (int)$data['plataforma'] : null;
        $ladoIn     = strtolower(trim($data['lado'] ?? ''));
        $valorIn    = trim($data['valor'] ?? '');

        // valida plataforma
        if (!in_array($plataforma, [1,2,3,4], true)) {
            echo json_encode(['ok' => false, 'erro' => 'plataforma inválida'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // normaliza lado
        if ($ladoIn === 'oeste' || $ladoIn === 'o') {
            $lado = 'O';
        } elseif ($ladoIn === 'leste' || $ladoIn === 'l') {
            $lado = 'L';
        } elseif ($ladoIn === 'o' || $ladoIn === 'l') { // redundância defensiva
            $lado = strtoupper($ladoIn);
        } else {
            echo json_encode(['ok' => false, 'erro' => 'lado inválido'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // normaliza número (aceita vírgula)
        if ($valorIn === '') {
            $valor = null; // permitir limpar o campo
        } else {
            $normalizado = str_replace(',', '.', $valorIn);
            if (!is_numeric($normalizado)) {
                echo json_encode(['ok' => false, 'erro' => 'valor não numérico'], JSON_UNESCAPED_UNICODE);
                return;
            }
            $valor = round((float)$normalizado, 2);
        }

        $model = new H6201Model();
        $ok    = $model->gcSalvar($plataforma, $lado, $valor);

        echo json_encode(['ok' => (bool)$ok, 'valor' => $valor], JSON_UNESCAPED_UNICODE);
    }

    public function salvar_massa()
    {
        header('Content-Type: application/json; charset=utf-8');

        $raw  = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: [];

        $alvo  = $data['alvo']  ?? '';
        $valor = $data['valor'] ?? '';

        $okAlvo  = in_array($alvo,  ['queimador','piloto'], true);
        $okValor = in_array($valor, ['aceso','apagado','manutencao'], true);

        if (!$okAlvo || !$okValor) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'erro' => 'parametros_invalidos']);
            exit;
        }

        $ok = $this->model->atualizarTodos($alvo, $valor);

        if ($ok) {
            echo json_encode(['ok' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['ok' => false, 'erro' => 'falha_update']);
        }
        exit; // impede qualquer HTML extra
    }
}
