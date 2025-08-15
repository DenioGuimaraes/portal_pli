<?php

class U1620ValvModel
{
    private $arquivo;
    public function __construct()
    {
        $this->arquivo = dirname(__DIR__) . '/views/u1620valv/u1620valv.json';

    }

    public function u1620ValvBuscarPorTermo($termo)
    {
        $dados = $this->lerJSON();
        $resultado = [];

        foreach ($dados as $grupo) {
            $itensFiltrados = [];

            foreach ($grupo['itens'] as $item) {
                if (stripos($item['tag'], $termo) !== false || stripos($item['descricao'], $termo) !== false) {
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

    public function u1620ValvListarTodos()
    {
        return $this->lerJSON();
    }

    private function lerJSON()
    {
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true);
    }
}
