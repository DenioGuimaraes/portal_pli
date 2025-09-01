<?php
require_once __DIR__ . '/../../core/Model.php';

class EmergenciaModel extends Model
{
    public function __construct()
    {
        // cria $this->db (mysqli) via Model base
        parent::__construct();
    }

    /**
     * Lista emergências por grupo (1=Geral/LB, 2=U-1620, 3=U-1640)
     * com busca opcional por título.
     * Retorna: [ ['id'=>..., 'titulo'=>...], ... ]
     */
    public function listarPorGrupo(int $grupoId, string $q = ''): array
    {
        $q = trim($q);

        // --- schema novo: tabela "emergencias", sem "ativo" e sem "ordem"
        $sql = 'SELECT id, titulo
                FROM emergencias
                WHERE grupo_id = ?';

        $hasSearch = ($q !== '');
        if ($hasSearch) {
            $sql .= ' AND titulo LIKE ?';
        }
        $sql .= ' ORDER BY titulo';  // sem "ordem"

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Erro ao preparar SELECT: ' . $this->db->error);
        }

        if ($hasSearch) {
            $like = "%{$q}%";
            $stmt->bind_param('is', $grupoId, $like);
        } else {
            $stmt->bind_param('i', $grupoId);
        }

        if (!$stmt->execute()) {
            $err = $this->db->error;
            $stmt->close();
            throw new Exception('Erro ao executar SELECT: ' . $err);
        }

        $res = $stmt->get_result();
        $out = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) {
                $out[] = [
                    'id'     => (int)$row['id'],
                    'titulo' => $row['titulo'],
                ];
            }
            $res->free();
        }
        $stmt->close();

        return $out;
    }


    public function obterTitulo(int $id): ?string {
        $stmt = $this->db->prepare('SELECT titulo FROM emergencia WHERE id=? LIMIT 1');
        if (!$stmt) throw new Exception('Erro ao preparar SELECT: ' . $this->db->error);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res ? $res->fetch_assoc() : null;
        if ($res) $res->free();
        $stmt->close();
        return $row['titulo'] ?? null;
    }

    public function obterEmergencia(int $id): ?array
    {
        $sql = "SELECT id, grupo_id, titulo, identificadores, causas, impacto, contatos
                FROM emergencias
                WHERE id = ?";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Erro ao preparar SELECT: ' . $this->db->error);
        }

        $stmt->bind_param('i', $id);

        if (!$stmt->execute()) {
            $err = $this->db->error;
            $stmt->close();
            throw new Exception('Erro ao executar SELECT: ' . $err);
        }

        $res = $stmt->get_result();
        $row = $res ? $res->fetch_assoc() : null;

        if ($res) $res->free();
        $stmt->close();

        return $row ?: null; // retorna null se não encontrar
    }

    public function listarPassos(int $emergenciaId): array
    {
        $sql = "SELECT id, ordem, rotulo, detalhe
                FROM emergencia_passo
                WHERE emergencia_id = ?
            ORDER BY ordem ASC";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new Exception('Erro ao preparar SELECT: ' . $this->db->error);
        }

        $stmt->bind_param('i', $emergenciaId);

        if (!$stmt->execute()) {
            $err = $this->db->error;
            $stmt->close();
            throw new Exception('Erro ao executar SELECT: ' . $err);
        }

        $res = $stmt->get_result();
        $out = [];
        while ($row = $res->fetch_assoc()) {
            $out[] = [
                'id'     => (int)$row['id'],
                'ordem'  => (int)$row['ordem'],
                'rotulo' => $row['rotulo'],
                'detalhe'=> $row['detalhe'],
            ];
        }

        if ($res) $res->free();
        $stmt->close();

        return $out;
    }


}
