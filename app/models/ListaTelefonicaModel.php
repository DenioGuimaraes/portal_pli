<?php

require_once __DIR__ . '/../../core/Model.php';

class ListaTelefonicaModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // Herda a conexão
    }

    public function buscarTodos()
    {
        $sql = "SELECT * FROM listatelefonica ORDER BY grupo, descricao";
        $result = $this->db->query($sql);

        $dados = [];
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }

        return $dados;
    }

    public function buscarPorTermo($termo)
    {
        $termo = $this->db->real_escape_string($termo);
        $sql = "SELECT * FROM listatelefonica WHERE descricao LIKE '%$termo%' OR grupo LIKE '%$termo%' OR ramal LIKE '%$termo%'";
        $resultado = $this->db->query($sql);

        return $resultado->fetch_all(MYSQLI_ASSOC);
    }
}
