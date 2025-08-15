<?php
require_once __DIR__ . '/../../core/Model.php';

class H6201Model extends Model
{
    public function getTodos(): array
    {
        $dados = [];
        $sql = "SELECT id, piloto, queimador FROM h6201_elementos ORDER BY id";
        $res = $this->db->query($sql);

        if (!$res) {
            // Segue o padrão de erro simples (sem PDO/exceptions)
            die('Erro na consulta: ' . $this->db->error);
        }

        while ($row = $res->fetch_assoc()) {
            $dados[] = [
                'id'        => (int)$row['id'],
                'piloto'    => $row['piloto'],     // 'apagado' | 'aceso' | 'manutencao'
                'queimador' => $row['queimador'],  // 'apagado' | 'aceso' | 'manutencao'
            ];
        }
        $res->free();

        return $dados;
    }

    public function atualizar($id, $piloto, $queimador): bool
    {
        // validações simples
        $id = (int)$id;
        if ($id < 1 || $id > 40) return false;

        $validos = ["apagado","aceso","manutencao"];
        if (!in_array($piloto, $validos, true)) return false;
        if (!in_array($queimador, $validos, true)) return false;

        $stmt = $this->db->prepare("UPDATE h6201_elementos SET piloto = ?, queimador = ? WHERE id = ?");
        if (!$stmt) return false;
        $stmt->bind_param("ssi", $piloto, $queimador, $id);
        $ok = $stmt->execute();
        $stmt->close();
        return $ok;
    }

}
