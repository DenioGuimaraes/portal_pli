<?php
require_once __DIR__ . '/../../core/Model.php';

class U1640PsvModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // garante a conexão do Model pai
    }

    // 🔹 Retorna todas as PSV
    public function u1640psvGetAll() {
        $sql = "SELECT id, tag, localizacao, fluido, alivio, diam_entrada, diam_saida, pressao_operacao, calibre, andaime
                FROM u1640_psv
                ORDER BY tag ASC";
        $result = $this->db->query($sql);

        $dados = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $dados[] = $row;
            }
        }
        return $dados;
    }

    // 🔹 Retorna uma PSV pelo ID
    public function u1640psvGetById($id) {
        $sql = "SELECT * FROM u1640_psv WHERE id = " . intval($id);
        $result = $this->db->query($sql);
        return $result ? $result->fetch_assoc() : null;
    }

    // 🔹 Cria uma nova PSV
    public function u1640psvCreate($data) {
        $tag = $this->db->real_escape_string($data['tag']);
        $localizacao = $this->db->real_escape_string($data['localizacao']);
        $fluido = $this->db->real_escape_string($data['fluido']);
        $alivio = $this->db->real_escape_string($data['alivio']);
        $diam_entrada = $this->db->real_escape_string($data['diam_entrada']);
        $diam_saida = $this->db->real_escape_string($data['diam_saida']);
        $pressao_operacao = !empty($data['pressao_operacao']) ? floatval($data['pressao_operacao']) : "NULL";
        $calibre = !empty($data['calibre']) ? floatval($data['calibre']) : "NULL";
        $andaime = $this->db->real_escape_string($data['andaime']);

        $sql = "INSERT INTO u1640_psv 
                (tag, localizacao, fluido, alivio, diam_entrada, diam_saida, pressao_operacao, calibre, andaime) 
                VALUES 
                ('$tag', '$localizacao', '$fluido', '$alivio', '$diam_entrada', '$diam_saida', $pressao_operacao, $calibre, '$andaime')";
        
        return $this->db->query($sql);
    }

    // 🔹 Atualiza uma PSV
    public function u1640psvUpdate($id, $data) {
        $tag = $this->db->real_escape_string($data['tag']);
        $localizacao = $this->db->real_escape_string($data['localizacao']);
        $fluido = $this->db->real_escape_string($data['fluido']);
        $alivio = $this->db->real_escape_string($data['alivio']);
        $diam_entrada = $this->db->real_escape_string($data['diam_entrada']);
        $diam_saida = $this->db->real_escape_string($data['diam_saida']);
        $pressao_operacao = !empty($data['pressao_operacao']) ? floatval($data['pressao_operacao']) : "NULL";
        $calibre = !empty($data['calibre']) ? floatval($data['calibre']) : "NULL";
        $andaime = $this->db->real_escape_string($data['andaime']);

        $sql = "UPDATE u1640_psv 
                SET tag='$tag', localizacao='$localizacao', fluido='$fluido', alivio='$alivio',
                    diam_entrada='$diam_entrada', diam_saida='$diam_saida', 
                    pressao_operacao=$pressao_operacao, calibre=$calibre, andaime='$andaime'
                WHERE id = " . intval($id);

        return $this->db->query($sql);
    }

    // 🔹 Deleta uma PSV
    public function u1640psvDelete($id) {
        $sql = "DELETE FROM u1640_psv WHERE id = " . intval($id);
        return $this->db->query($sql);
    }
}
