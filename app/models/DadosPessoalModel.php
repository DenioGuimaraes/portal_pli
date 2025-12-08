<?php

require_once __DIR__ . '/../../core/Model.php';

class DadosPessoalModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // Herda a conexão do Model.php
    }

    public function buscarTodos()
    {
        $sql = "SELECT * FROM dadospessoal ORDER BY nome";
        $result = $this->db->query($sql);

        $dados = [];
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }

        return $dados;
    }

    public function buscarPorCargo($cargo)
    {
        $stmt = $this->db->prepare("SELECT * FROM dadospessoal WHERE cargo LIKE ? ORDER BY nome");
        $param = "%$cargo%";
        $stmt->bind_param("s", $param);
        $stmt->execute();

        $result = $stmt->get_result();
        $dados = [];
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }

        return $dados;
    }

    public function buscarPorNome($nome)
    {
        $stmt = $this->db->prepare("SELECT * FROM dadospessoal WHERE nome LIKE ? ORDER BY nome");
        $param = "%$nome%";
        $stmt->bind_param("s", $param);
        $stmt->execute();

        $result = $stmt->get_result();
        $dados = [];
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }

        return $dados;
    }
}
