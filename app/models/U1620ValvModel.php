<?php
require_once __DIR__ . '/../../core/Model.php';

class U1620ValvModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // garante a conexão do Model pai
    }

    // 🔹 Retorna todos os valvumentos
    public function u1620valvGetAll() {
        $sql = "SELECT id, u1620valv_grupo, u1620valv_tag, u1620valv_descricao 
                FROM u1620valv 
                ORDER BY u1620valv_grupo, u1620valv_tag";
        $result = $this->db->query($sql);

        $u1620valv = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $u1620valv[] = $row;
            }
        }
        return $u1620valv;
    }

    // 🔹 Retorna uma Válvula por ID
    public function u1620valvGetById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, u1620valv_grupo, u1620valv_tag, u1620valv_descricao
             FROM u1620valv 
             WHERE id = ?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // 🔹 Insere novo valvumento
    public function u1620valvCreate($grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "INSERT INTO u1620valv (u1620valv_grupo, u1620valv_tag, u1620valv_descricao) 
             VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $grupo, $tag, $descricao);
        return $stmt->execute();
    }

    // 🔹 Atualiza valvumento existente
    public function u1620valvUpdate($id, $grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "UPDATE u1620valv 
             SET u1620valv_grupo = ?, u1620valv_tag = ?, u1620valv_descricao = ?
             WHERE id = ?"
        );
        $stmt->bind_param("sssi", $grupo, $tag, $descricao, $id);
        return $stmt->execute();
    }

    // 🔹 Exclui valvumento
    public function u1620valvDelete($id) {
        $stmt = $this->db->prepare("DELETE FROM u1620valv WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
