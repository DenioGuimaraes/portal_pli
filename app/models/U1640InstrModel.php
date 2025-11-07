<?php
require_once __DIR__ . '/../../core/Model.php';

class U1640InstrModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // garante a conexão do Model pai
    }

    // 🔹 Retorna todos os instrumentos
    public function u1640instrGetAll() {
        $sql = "SELECT id, u1640instr_grupo, u1640instr_tag, u1640instr_descricao 
                FROM u1640instr 
                ORDER BY u1640instr_grupo, u1640instr_tag";
        $result = $this->db->query($sql);

        $u1640instr = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $u1640instr[] = $row;
            }
        }
        return $u1640instr;
    }

    // 🔹 Retorna um instrumento por ID
    public function u1640instrGetById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, u1640instr_grupo, u1640instr_tag, u1640instr_descricao
             FROM u1640instr 
             WHERE id = ?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // 🔹 Insere novo instrumento
    public function u1640instrCreate($grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "INSERT INTO u1640instr (u1640instr_grupo, u1640instr_tag, u1640instr_descricao) 
             VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $grupo, $tag, $descricao);
        return $stmt->execute();
    }

    // 🔹 Atualiza instrumento existente
    public function u1640instrUpdate($id, $grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "UPDATE u1640instr 
             SET u1640instr_grupo = ?, u1640instr_tag = ?, u1640instr_descricao = ?
             WHERE id = ?"
        );
        $stmt->bind_param("sssi", $grupo, $tag, $descricao, $id);
        return $stmt->execute();
    }

    // 🔹 Exclui instrumento
    public function u1640instrDelete($id) {
        $stmt = $this->db->prepare("DELETE FROM u1640instr WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
