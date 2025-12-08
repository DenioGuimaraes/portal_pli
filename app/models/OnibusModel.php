<?php
class OnibusModel {
    private $arquivo;

    public function __construct() {
        // Caminho para o onibus.json na pasta views/onibus
        $this->arquivo = __DIR__ . '/../views/onibus/onibus.json';
    }

    public function buscar() {
        $caminho = $this->arquivo;
        if (!file_exists($caminho)) {
            die("Arquivo não encontrado: " . realpath($caminho));
        }
        $json = file_get_contents($caminho);
        if ($json === false) {
            die("Erro ao ler o arquivo JSON");
        }
        return json_decode($json, true);
    }

}
