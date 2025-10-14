<?php
require_once __DIR__ . '/../../core/Model.php';

class H6201Model extends Model
{
    public function __construct()
    {
            parent::__construct(); // $this->db é mysqli
    }

    public function getTodos(): array
    {
        $dados = [];
         $sql = "SELECT id, piloto, queimador, manutencao_data
                FROM h6201_elementos
                ORDER BY id";
        $res = $this->db->query($sql);

        if (!$res) {
            // Segue o padrão de erro simples (sem PDO/exceptions)
            die('Erro na consulta: ' . $this->db->error);
        }

        while ($row = $res->fetch_assoc()) {
            $dados[] = [
                'id'               => (int)$row['id'],
                'piloto'           => $row['piloto'],           // 'apagado' | 'aceso' | 'manutencao'
                'queimador'        => $row['queimador'],        // 'apagado' | 'aceso' | 'manutencao'
                'manutencao_data'  => $row['manutencao_data'] !== null ? $row['manutencao_data'] : null,
            ];
        }
        $res->free();

        return $dados;
    }


    public function atualizar($id, $piloto, $queimador, $manutencao_data = null): bool
    {
        // validações simples
        $id = (int)$id;
        if ($id < 1 || $id > 40) return false;

        $validos = ["apagado","aceso","manutencao"];
        if (!in_array($piloto, $validos, true)) return false;
        if (!in_array($queimador, $validos, true)) return false;

        // NOVO: normaliza a data: '' => null; valida formato YYYY-MM-DD quando vier preenchida
        $data = $manutencao_data;

        if (is_string($data)) {
            $data = trim($data);
            if ($data === '') {
                $data = null;
            } else {
                // Valida padrão YYYY-MM-DD
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data)) {
                    return false;
                }
                // Valida calendário
                [$yyyy, $mm, $dd] = array_map('intval', explode('-', $data));
                if (!checkdate($mm, $dd, $yyyy)) {
                    return false;
                }
            }
        } elseif ($data !== null) {
            // Se não é string nem null, rejeita
            return false;
        }

        // NOVO: inclui manutencao_data no UPDATE
        $stmt = $this->db->prepare(
            "UPDATE h6201_elementos
             SET piloto = ?, queimador = ?, manutencao_data = ?
             WHERE id = ?"
        );
        if (!$stmt) return false;

        // bind: s (piloto), s (queimador), s (data ou null), i (id)
        $stmt->bind_param("sssi", $piloto, $queimador, $data, $id);

        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }

    /** Lê as pressões da tabela "wide" h6201_gc e devolve no formato usado pelo Controller */
    public function gcListar(): array
    {
        $sql = "SELECT id,
                       p1_oeste, p1_leste,
                       p2_oeste, p2_leste,
                       p3_oeste, p3_leste,
                       p4_oeste, p4_leste
                  FROM h6201_gc
              ORDER BY id DESC
                 LIMIT 1";
        $res = $this->db->query($sql);
        if (!$res) return [];

        $row = $res->fetch_assoc();
        if (!$row) return [];

        // Converte a linha "wide" em lista de {plataforma, lado, valor}
        $map = [
            [1, 'O', 'p1_oeste'], [1, 'L', 'p1_leste'],
            [2, 'O', 'p2_oeste'], [2, 'L', 'p2_leste'],
            [3, 'O', 'p3_oeste'], [3, 'L', 'p3_leste'],
            [4, 'O', 'p4_oeste'], [4, 'L', 'p4_leste'],
        ];

        $out = [];
        foreach ($map as [$p, $lado, $col]) {
            $out[] = [
                'plataforma' => $p,
                'lado'       => $lado,
                'valor'      => isset($row[$col]) ? (float)$row[$col] : null,
            ];
        }
        return $out;
    }

    /**
     * Salva/atualiza uma pressão na tabela "wide"
     * $plataforma: 1..4
     * $lado: 'O'|'L'
     * $valor: float|null (null para limpar)
     */
    public function gcSalvar(int $plataforma, string $lado, ?float $valor): bool
    {
        $lado = strtoupper($lado) === 'O' ? 'oeste' : 'leste';
        $col  = "p{$plataforma}_{$lado}";

        // Garante que a coluna é válida
        $validCols = [
            'p1_oeste','p1_leste','p2_oeste','p2_leste',
            'p3_oeste','p3_leste','p4_oeste','p4_leste'
        ];
        if (!in_array($col, $validCols, true)) return false;

        // Descobre a última linha (ou inexistência)
        $res = $this->db->query("SELECT id FROM h6201_gc ORDER BY id DESC LIMIT 1");
        $row = $res ? $res->fetch_assoc() : null;

        if ($row) {
            $id = (int)$row['id'];

            if ($valor === null) {
                // Seta NULL explicitamente
                $stmt = $this->db->prepare("UPDATE h6201_gc SET $col = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                if (!$stmt) return false;
                $stmt->bind_param('i', $id);
            } else {
                $stmt = $this->db->prepare("UPDATE h6201_gc SET $col = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                if (!$stmt) return false;
                $stmt->bind_param('di', $valor, $id);
            }

            $ok = $stmt->execute();
            $stmt->close();
            return (bool)$ok;

        } else {
            // Tabela vazia -> cria a 1ª linha já com a coluna desejada
            if ($valor === null) {
                $sql = "INSERT INTO h6201_gc ($col) VALUES (NULL)";
                return (bool)$this->db->query($sql);
            } else {
                $stmt = $this->db->prepare("INSERT INTO h6201_gc ($col) VALUES (?)");
                if (!$stmt) return false;
                $stmt->bind_param('d', $valor);
                $ok = $stmt->execute();
                $stmt->close();
                return (bool)$ok;
            }
        }
    }

    public function atualizarTodos($campo, $valor)
    {
        // whitelisting do nome da coluna:
        $coluna = ($campo === 'piloto') ? 'piloto' : 'queimador';

        $sql = "UPDATE h6201_elementos SET $coluna = ?";
        $stmt = $this->db->prepare($sql); // troque para $this->conn se for esse o nome
        if (!$stmt) return false;

        $stmt->bind_param('s', $valor);
        $ok = $stmt->execute();
        $stmt->close();

        return $ok;
    }


}

