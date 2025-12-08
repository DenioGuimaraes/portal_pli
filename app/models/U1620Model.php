<?php
require_once __DIR__ . '/../../core/Model.php';

class U1620Model extends Model
{
    public function __construct()
    {
        // cria $this->db (mysqli) como no InicioModel
        parent::__construct();
    }

    /**
     * Garante que exista a linha única (id=1) na tabela u1620rvc.
     */
    private function ensureRow()
    {
        $sql = "SELECT 1 FROM u1620rvc WHERE id = 1";
        if (!$res = $this->db->query($sql)) {
            throw new Exception('Erro ao verificar u1620rvc: ' . $this->db->error);
        }
        if ($res->num_rows === 0) {
            $stmt = $this->db->prepare("INSERT INTO u1620rvc (id, rvc, carga) VALUES (1, 5.0, 9205.0)");
            if (!$stmt) throw new Exception('Erro ao preparar INSERT: ' . $this->db->error);
            if (!$stmt->execute()) {
                $stmt->close();
                throw new Exception('Erro ao executar INSERT: ' . $this->db->error);
            }
            $stmt->close();
        }
        $res->free();
    }

    /**
     * Lê o estado atual (rvc, carga) – retorna array associativo.
     * Ex.: ['rvc' => 5.0, 'carga' => 9205.0]
     */
    public function obterAtual()
    {
        $this->ensureRow();

        $stmt = $this->db->prepare("SELECT rvc, carga FROM u1620rvc WHERE id = 1 LIMIT 1");
        if (!$stmt) throw new Exception('Erro ao preparar SELECT: ' . $this->db->error);

        if (!$stmt->execute()) {
            $stmt->close();
            throw new Exception('Erro ao executar SELECT: ' . $this->db->error);
        }

        $resultado = $stmt->get_result();
        $row = $resultado->fetch_assoc();
        $resultado->free();
        $stmt->close();

        return $row ?: ['rvc' => 5.0, 'carga' => 9205.0];
    }

    /**
     * Salva rvc e carga (ambos com 1 casa no BD). Usa double/double no bind.
     */
    public function salvar($rvc, $carga)
    {
        $this->ensureRow();

        $stmt = $this->db->prepare("UPDATE u1620rvc SET rvc = ?, carga = ? WHERE id = 1");
        if (!$stmt) throw new Exception('Erro ao preparar UPDATE: ' . $this->db->error);

        $rvc   = round((float)$rvc, 1);
        $carga = round((float)$carga, 1);

        $stmt->bind_param('dd', $rvc, $carga); // double, double
        $ok = $stmt->execute();
        $stmt->close();

        return $ok;
    }
}
