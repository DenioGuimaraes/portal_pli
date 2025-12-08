<?php
require_once __DIR__ . '/../../core/Model.php';

class TelefonesModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // garante a conexão do Model pai
    }

    // 🔹 Retorna todos os telefones
    public function telGetAll() {
        $sql = "SELECT id, tel_grupo, tel_descricao, tel_ramal 
                FROM telefones 
                ORDER BY tel_grupo, tel_descricao";
        $result = $this->db->query($sql);

        $telefones = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $telefones[] = $row;
            }
        }
        return $telefones;
    }

    // 🔹 Retorna um telefone por ID
    public function telGetById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, tel_grupo, tel_descricao, tel_ramal 
             FROM telefones 
             WHERE id = ?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // 🔹 Insere novo telefone
    public function telCreate($grupo, $descricao, $ramal) {
        $stmt = $this->db->prepare(
            "INSERT INTO telefones (tel_grupo, tel_descricao, tel_ramal) 
             VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $grupo, $descricao, $ramal);
        return $stmt->execute();
    }

    // 🔹 Atualiza telefone existente
    public function telUpdate($id, $grupo, $descricao, $ramal) {
        $stmt = $this->db->prepare(
            "UPDATE telefones 
             SET tel_grupo = ?, tel_descricao = ?, tel_ramal = ? 
             WHERE id = ?"
        );
        $stmt->bind_param("sssi", $grupo, $descricao, $ramal, $id);
        return $stmt->execute();
    }

    // 🔹 Exclui telefone
    public function telDelete($id) {
        $stmt = $this->db->prepare("DELETE FROM telefones WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
