<?php
class Model {
    protected $db;

    public function __construct() {
        $this->db = new mysqli('localhost', 'root', '', 'painel_reduc');
        
        if ($this->db->connect_error) {
            die('Erro de conexão: ' . $this->db->connect_error);
        }
    }
}
?>
