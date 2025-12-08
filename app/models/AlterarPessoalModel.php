<?php
require_once __DIR__ . '/../../core/Model.php';

class AlterarPessoalModel extends Model
{
    public function buscarTodosOrdenado()
    {
        $sql = "SELECT * FROM dadospessoal ORDER BY nome ASC";
        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            die('Erro ao preparar SQL: ' . $this->db->error);
        }

        $stmt->execute();
        $resultado = $stmt->get_result();
        return $resultado->fetch_all(MYSQLI_ASSOC);
    }
}
