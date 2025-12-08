<?php
require_once __DIR__ . '/../../core/Model.php';

class U1620InstrModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // garante a conexão do Model pai
    }

    // 🔹 Retorna todos os instrumentos
    public function u1620instrGetAll() {
        $sql = "SELECT id, u1620instr_grupo, u1620instr_tag, u1620instr_descricao 
                FROM u1620instr 
                ORDER BY u1620instr_grupo, u1620instr_tag";
        $result = $this->db->query($sql);

        $u1620instr = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $u1620instr[] = $row;
            }
        }
        return $u1620instr;
    }

    // 🔹 Retorna um instrumento por ID
    public function u1620instrGetById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, u1620instr_grupo, u1620instr_tag, u1620instr_descricao
             FROM u1620instr 
             WHERE id = ?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // 🔹 Insere novo instrumento
    public function u1620instrCreate($grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "INSERT INTO u1620instr (u1620instr_grupo, u1620instr_tag, u1620instr_descricao) 
             VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $grupo, $tag, $descricao);
        return $stmt->execute();
    }

    // 🔹 Atualiza instrumento existente
    public function u1620instrUpdate($id, $grupo, $tag, $descricao) {
        $stmt = $this->db->prepare(
            "UPDATE u1620instr 
             SET u1620instr_grupo = ?, u1620instr_tag = ?, u1620instr_descricao = ?
             WHERE id = ?"
        );
        $stmt->bind_param("sssi", $grupo, $tag, $descricao, $id);
        return $stmt->execute();
    }

    // 🔹 Exclui instrumento
    public function u1620instrDelete($id) {
        $stmt = $this->db->prepare("DELETE FROM u1620instr WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
