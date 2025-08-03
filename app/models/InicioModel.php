<?php
require_once __DIR__ . '/../../core/Model.php';

class InicioModel extends Model
{
    public function __construct()
    {
        // Chama o construtor da classe Model (que cria a conexão com o banco)
        parent::__construct();
    }

    // === 1. Método para buscar o registro do resumo operacional
    public function buscarResumoPorId($id)
    {
        // Prepara a query com um parâmetro (o id)
        $stmt = $this->db->prepare("SELECT * FROM resumo_operacional WHERE id = ?");
        $stmt->bind_param("i", $id); // "i" = integer

        // Executa a consulta
        $stmt->execute();

        // Pega o resultado e transforma em array associativo
        $resultado = $stmt->get_result();
        return $resultado->fetch_assoc(); // retorna array com os dados
    }

    public function salvarResumoNoBanco($dados)
    {
        $conn = $this->db; // ← $this->db já é o objeto mysqli
        $query = "UPDATE resumo_operacional SET 
                    carga_gn = ?,
                    producao_h2 = ?,
                    producao_co2 = ?,
                    bfw = ?,
                    tb = ?,
                    mea = ?,
                    u1620para = ?,
                    carga1640 = ?,
                    tq_carga = ?,
                    tq_produto = ?,
                    producao = ?,
                    ti69 = ?,
                    delta_p = ?,
                    datacarga = ?,
                    horacarga = ?,
                    dataproduto = ?,
                    horaproduto = ?
                WHERE id = 1";

        $stmt = $conn->prepare($query);

        if (!$stmt) {
            error_log("Erro na preparação: " . $conn->error);
            return false;
        }

        $stmt->bind_param(
            "ddddiissiiiddssss",  // ← tipos dos parâmetros (double, int, string)
            $dados['carga_gn'],
            $dados['producao_h2'],
            $dados['producao_co2'],
            $dados['bfw'],
            $dados['tb'],
            $dados['mea'],
            $dados['u1620para'],
            $dados['carga1640'],
            $dados['tq_carga'],
            $dados['tq_produto'],
            $dados['producao'],
            $dados['ti69'],
            $dados['delta_p'],
            $dados['datacarga'],
            $dados['horacarga'],
            $dados['dataproduto'],
            $dados['horaproduto']
        );

        $sucesso = $stmt->execute();
        $stmt->close();
        if (!$sucesso) {
            error_log("Erro ao executar UPDATE: " . $stmt->error);
        }
        return $sucesso;
    }

    public function buscarPorCargo($cargo) {
        $stmt = $this->db->prepare("SELECT nome, grupo FROM dadospessoal WHERE cargo = ?");
        $stmt->bind_param("s", $cargo);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function buscarAnotacao()
    {
        $sql = "SELECT texto FROM anotacoes WHERE id = 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        $resultado = $stmt->get_result();
        if ($resultado->num_rows > 0) {
            return $resultado->fetch_assoc()['texto'];
        } else {
            return ""; // Nenhuma anotação encontrada
        }
    }

    public function salvarAnotacao($texto)
    {
        $sql = "UPDATE anotacoes SET texto = ? WHERE id = 1";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("s", $texto);
        return $stmt->execute();
    }
}

