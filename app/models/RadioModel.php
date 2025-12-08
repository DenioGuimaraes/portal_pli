<?php

class RadioModel
{
    private $arquivo;

    public function __construct()
    {
        $this->arquivo = dirname(__DIR__) . '/views/radio/radio.json';

    }

    public function radioBuscarPorTermo($termo)
    {
        $dados = $this->lerJSON();
        $resultado = [];

        foreach ($dados as $grupo) {
            $itensFiltrados = [];

            foreach ($grupo['itens'] as $item) {
                if (stripos($item['faixa'], $termo) !== false || stripos($item['descricao'], $termo) !== false) {
                    $itensFiltrados[] = $item;
                }
            }

            if (!empty($itensFiltrados)) {
                $resultado[] = [
                    "grupo" => $grupo['grupo'],
                    "itens" => $itensFiltrados
                ];
            }
        }

        return $resultado;
    }

    public function radioListarTodos()
    {
        return $this->lerJSON();
    }

    private function lerJSON()
    {
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true);
    }
}
