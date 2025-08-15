<?php

class U1620InstrModel
{
    private $arquivo;
    public function __construct()
    {
        $this->arquivo = dirname(__DIR__) . '/views/u1620instr/u1620instr.json';

    }

    public function u1620InstrBuscarPorTermo($termo)
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

    public function u1620InstrListarTodos()
    {
        return $this->lerJSON();
    }

    private function lerJSON()
    {
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true);
    }
}
