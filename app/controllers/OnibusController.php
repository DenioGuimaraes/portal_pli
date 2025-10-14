<?php
require_once __DIR__ . '/../models/OnibusModel.php';

class OnibusController {
    private $model;

    public function __construct() {
        // Instancia o model ao criar o controller
        $this->model = new OnibusModel();
    }

    public function index() {
        // Carrega a view principal do painel de ônibus
        require_once __DIR__ . '/../views/onibus/index.php';
    }

    public function buscar() {
        // Parâmetros enviados pelo JS
        $termo = isset($_GET['termo']) ? trim($_GET['termo']) : '';
        $tipo = isset($_GET['tipo']) ? trim($_GET['tipo']) : '';

        $dados = $this->model->buscar();

        // Se um tipo foi especificado, retorna apenas essa parte
        if ($tipo && isset($dados[$tipo])) {
            $dados = [$tipo => $dados[$tipo]];
        }

        // Se houver termo, filtra linhas e locais
        if ($termo !== '') {
            $termoLower = mb_strtolower($termo, 'UTF-8');

            foreach ($dados as $grupo => &$linhas) {
                $linhas = array_filter($linhas, function ($linha) use ($termoLower) {
                    $linhaMatch = mb_strpos(mb_strtolower($linha['linha'], 'UTF-8'), $termoLower) !== false;
                    $localMatch = false;

                    foreach ($linha['grupos'] as $locais) {
                        foreach ($locais as $local) {
                            if (mb_strpos(mb_strtolower($local, 'UTF-8'), $termoLower) !== false) {
                                $localMatch = true;
                                break 2;
                            }
                        }
                    }
                    return $linhaMatch || $localMatch;
                });
                $linhas = array_values($linhas); // Reindexa para evitar buracos
            }
            unset($linhas);
        }

        header('Content-Type: application/json');
        echo json_encode($dados);
    }
}
