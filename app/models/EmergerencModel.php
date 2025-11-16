<?php
require_once __DIR__ . '/../../core/Model.php';

class EmergerencModel extends Model
{
    public function __construct()
    {
        parent::__construct(); // inicializa $this->db (mysqli)
    }

    public function getEmergencia(int $id): ?array
    {
        $sql = "SELECT 
                e.id, 
                e.grupo_id, 
                e.titulo, 
                e.identificadores, 
                e.causas, 
                e.impacto, 
                e.contatos,
                g.nome AS grupo_nome, 
                g.slug AS grupo_slug, 
                g.cor_hex AS grupo_cor
            FROM emergencias e
            LEFT JOIN emergencia_grupo g 
                   ON g.id = e.grupo_id
            WHERE e.id = ?
            LIMIT 1";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new \Exception('Erro ao preparar getEmergencia: ' . $this->db->error);
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();

        $res  = $stmt->get_result();
        $row  = $res->fetch_assoc();
        $stmt->close();

        if (!$row) return null;

        return [
            'id'              => (int)$row['id'],
            'grupo_id'        => (int)$row['grupo_id'],
            'grupo'           => (int)$row['grupo_id'], // usado pelo <select> no JS
            'grupo_nome'      => $row['grupo_nome'],
            'grupo_slug'      => $row['grupo_slug'],
            'grupo_cor'       => $row['grupo_cor'],
            'titulo'          => $row['titulo'],
            'identificadores' => $row['identificadores'],
            'causas'          => $row['causas'],
            'impacto'         => $row['impacto'],
            'contatos'        => $row['contatos']
        ];
    }


    public function getPassos(int $emergenciaId): array
    {
        $sql = "SELECT id, emergencia_id, ordem, rotulo, detalhe
                  FROM emergencia_passo
                 WHERE emergencia_id = ?
              ORDER BY ordem ASC";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new \Exception('Erro ao preparar getPassos: ' . $this->db->error);
        }
        $stmt->bind_param('i', $emergenciaId);
        $stmt->execute();

        $res = $stmt->get_result();
        $dados = [];
        while ($row = $res->fetch_assoc()) {
            $dados[] = [
                'id'            => (int)$row['id'],
                'emergencia_id' => (int)$row['emergencia_id'],
                'ordem'         => (int)$row['ordem'],
                'rotulo'        => $row['rotulo'],
                'detalhe'       => $row['detalhe']
            ];
        }
        $stmt->close();

        return $dados;
    }

    public function salvarPassos(int $emergenciaId, array $passos): void
    {
        $this->db->begin_transaction();
        try {
            // Apagar passos antigos
            $stmtDel = $this->db->prepare("DELETE FROM emergencia_passo WHERE emergencia_id = ?");
            if (!$stmtDel) {
                throw new \Exception("Erro ao preparar DELETE: " . $this->db->error);
            }
            $stmtDel->bind_param("i", $emergenciaId);
            $stmtDel->execute();
            $stmtDel->close();

            // Inserir novamente
            $stmtIns = $this->db->prepare("
                INSERT INTO emergencia_passo (id, emergencia_id, ordem, rotulo, detalhe)
                VALUES (?, ?, ?, ?, ?)
            ");
            if (!$stmtIns) {
                throw new \Exception("Erro ao preparar INSERT: " . $this->db->error);
            }

            foreach ($passos as $p) {
                $id      = (int)($p['id'] ?? 0);
                $ordem   = (int)($p['ordem'] ?? 0);
                $rotulo  = (string)($p['rotulo'] ?? '');
                $detalhe = (string)($p['detalhe'] ?? '');

                $stmtIns->bind_param("iiiss", $id, $emergenciaId, $ordem, $rotulo, $detalhe);
                $stmtIns->execute();
            }

            $stmtIns->close();
            $this->db->commit();
        } catch (\Throwable $e) {
            $this->db->rollback();
            throw $e;
        }
    }

    public function salvarEmergencia(int $id, array $dados): void
    {
        $sql = "UPDATE emergencias
                   SET grupo_id        = ?, 
                       titulo          = ?, 
                       identificadores = ?, 
                       causas          = ?, 
                       impacto         = ?, 
                       contatos        = ?
                 WHERE id = ?";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            throw new \Exception("Erro ao preparar salvarEmergencia: " . $this->db->error);
        }

        // Captura correta dos campos
        $grupo_id         = $dados['grupo_id']        ?? 0;
        $titulo           = $dados['titulo']          ?? '';
        $identificadores  = $dados['identificadores'] ?? '';
        $causas           = $dados['causas']          ?? '';
        $impacto          = $dados['impacto']         ?? '';
        $contatos         = $dados['contatos']        ?? '';

        // Bind correto
        $stmt->bind_param(
            "isssssi",
            $grupo_id,
            $titulo,
            $identificadores,
            $causas,
            $impacto,
            $contatos,
            $id
        );

        $stmt->execute();
        $stmt->close();
    }
}
