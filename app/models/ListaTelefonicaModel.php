<?php

class ListaTelefonicaModel extends Model
{
    private $arquivo;

    public function __construct()
    {
        $this->arquivo = dirname(__DIR__) . '/views/listatelefonica/telefones.json';

    }

    public function telefoneBuscarPorTermo($termo)
    {
        $dados = $this->lerJSON();
        $resultado = [];

        foreach ($dados as $grupo) {
            $itensFiltrados = [];

            foreach ($grupo['itens'] as $item) {
                if (stripos($item['descricao'], $termo) !== false || stripos($item['ramal'], $termo) !== false) {
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

    public function telefoneListarTodos()
    {
        return $this->lerJSON();
    }

    private function lerJSON()
    {
        $conteudo = file_get_contents($this->arquivo);
        return json_decode($conteudo, true);
    }
}
