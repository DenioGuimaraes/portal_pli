<?php
require_once __DIR__ . '/../../core/Model.php';

class U1640ValvModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // garante a conexão do Model pai
    }

    // 🔹 Retorna todos os valvumentos
    public function u1640valvGetAll() {
        $sql = "SELECT id, u1640valv_grupo, u1640valv_tag, u1640valv_descricao 
                FROM u1640valv 
                ORDER BY u1640valv_grupo, u1640valv_tag";
        $result = $this->db->query($sql);

        $u1640valv = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $u1640valv[] = $row;
            }
        }
        return $u1640valv;
    }

    // 🔹 Retorna uma Válvula por ID
    public function u1640valvGetById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, u1640valv_grupo, u1640valv_tag, u1640valv_descricao
             FROM u1640valv 
             WHERE id = ?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // 🔹 Insere novo valvumento
    public function u1640valvCreate($grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "INSERT INTO u1640valv (u1640valv_grupo, u1640valv_tag, u1640valv_descricao) 
             VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $grupo, $tag, $descricao);
        return $stmt->execute();
    }

    // 🔹 Atualiza valvumento existente
    public function u1640valvUpdate($id, $grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "UPDATE u1640valv 
             SET u1640valv_grupo = ?, u1640valv_tag = ?, u1640valv_descricao = ?
             WHERE id = ?"
        );
        $stmt->bind_param("sssi", $grupo, $tag, $descricao, $id);
        return $stmt->execute();
    }

    // 🔹 Exclui valvumento
    public function u1640valvDelete($id) {
        $stmt = $this->db->prepare("DELETE FROM u1640valv WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
